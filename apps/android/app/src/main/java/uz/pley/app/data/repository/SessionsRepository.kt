package uz.pley.app.data.repository

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import uz.pley.app.core.database.dao.SessionDao
import uz.pley.app.core.database.entity.SessionEntity
import uz.pley.app.core.network.PleyApiService
import uz.pley.app.core.network.model.CreateBookingRequest
import uz.pley.app.core.network.model.SessionDetailDto
import uz.pley.app.core.network.model.SessionItemDto
import uz.pley.app.core.network.model.SessionStatus
import uz.pley.app.core.network.model.SessionVibe
import uz.pley.app.core.network.model.SkillLevel
import uz.pley.app.core.network.model.SportDto
import uz.pley.app.core.network.model.VenueNestedDto
import javax.inject.Inject
import javax.inject.Singleton

interface SessionsRepository {
    fun observeSessions(): Flow<List<SessionItemDto>>
    suspend fun refreshSessions(
        sport: String? = null,
        district: String? = null,
        search: String? = null,
        skillLevel: String? = null,
        sessionVibe: String? = null
    ): Result<List<SessionItemDto>>
    suspend fun getSessionDetail(id: String): Result<SessionDetailDto>
    suspend fun reserveSpot(sessionId: String): Result<Unit>
    suspend fun getSports(): Result<List<SportDto>>
}

@Singleton
class SessionsRepositoryImpl @Inject constructor(
    private val apiService: PleyApiService,
    private val sessionDao: SessionDao
) : SessionsRepository {

    override fun observeSessions(): Flow<List<SessionItemDto>> {
        return sessionDao.getAllSessions().map { entities ->
            entities.map { it.toDto() }
        }
    }

    override suspend fun refreshSessions(
        sport: String?,
        district: String?,
        search: String?,
        skillLevel: String?,
        sessionVibe: String?
    ): Result<List<SessionItemDto>> {
        return runCatching {
            val response = apiService.listSessions(
                sport = sport,
                district = district,
                search = search,
                skillLevel = if (skillLevel == "ALL_LEVELS") null else skillLevel,
                sessionVibe = sessionVibe
            )
            val items = response.body().orEmpty()
            sessionDao.clearSessions()
            sessionDao.insertSessions(items.map { it.toEntity() })
            items
        }
    }

    override suspend fun getSessionDetail(id: String): Result<SessionDetailDto> {
        return runCatching {
            val response = apiService.getSessionById(id)
            response.body() ?: throw IllegalStateException("Session not found")
        }
    }

    override suspend fun reserveSpot(sessionId: String): Result<Unit> {
        return runCatching {
            val response = apiService.reserveSpot(CreateBookingRequest(sessionId = sessionId))
            if (!response.isSuccessful) {
                throw IllegalStateException("Failed to reserve spot: ${response.code()}")
            }
        }
    }

    override suspend fun getSports(): Result<List<SportDto>> {
        return runCatching {
            val response = apiService.listSports()
            response.body().orEmpty()
        }
    }

    private fun SessionItemDto.toEntity(): SessionEntity {
        return SessionEntity(
            id = id,
            title = title,
            scheduledAt = scheduledAt,
            durationMinutes = durationMinutes,
            maxSlots = maxSlots,
            bookedSlots = bookedSlots,
            remainingSlots = remainingSlots,
            pricePerSlot = pricePerSlot,
            serviceFee = serviceFee,
            totalPrice = totalPrice,
            skillLevel = skillLevel.name,
            sessionVibe = sessionVibe.name,
            status = status.name,
            equipmentProvided = equipmentProvided,
            imageUrl = imageUrl,
            venueId = venue.id,
            venueName = venue.name,
            venueDistrict = venue.district,
            venueAddress = venue.address,
            sportId = sport.id,
            sportName = sport.name,
            sportSlug = sport.slug,
            sportIcon = sport.icon
        )
    }

    private fun SessionEntity.toDto(): SessionItemDto {
        return SessionItemDto(
            id = id,
            title = title,
            scheduledAt = scheduledAt,
            durationMinutes = durationMinutes,
            maxSlots = maxSlots,
            bookedSlots = bookedSlots,
            remainingSlots = remainingSlots,
            pricePerSlot = pricePerSlot,
            serviceFee = serviceFee,
            totalPrice = totalPrice,
            skillLevel = runCatching { SkillLevel.valueOf(skillLevel) }.getOrDefault(SkillLevel.ALL_LEVELS),
            sessionVibe = runCatching { SessionVibe.valueOf(sessionVibe) }.getOrDefault(SessionVibe.SOCIAL),
            status = runCatching { SessionStatus.valueOf(status) }.getOrDefault(SessionStatus.PUBLISHED),
            equipmentProvided = equipmentProvided,
            imageUrl = imageUrl,
            venue = VenueNestedDto(
                id = venueId,
                name = venueName,
                district = venueDistrict,
                address = venueAddress
            ),
            sport = SportDto(
                id = sportId,
                name = sportName,
                slug = sportSlug,
                icon = sportIcon
            )
        )
    }
}

