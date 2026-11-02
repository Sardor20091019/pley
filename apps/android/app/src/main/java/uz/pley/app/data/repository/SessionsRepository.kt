package uz.pley.app.data.repository

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import uz.pley.app.core.database.dao.SessionDao
import uz.pley.app.core.database.entity.SessionEntity
import uz.pley.app.core.network.AppError
import uz.pley.app.core.network.ConnectivityObserver
import uz.pley.app.core.network.PleyApiService
import uz.pley.app.core.network.model.CreateBookingRequest
import uz.pley.app.core.network.model.SessionDetailDto
import uz.pley.app.core.network.model.SessionItemDto
import uz.pley.app.core.network.model.SessionStatus
import uz.pley.app.core.network.model.SessionVibe
import uz.pley.app.core.network.model.SkillLevel
import uz.pley.app.core.network.model.SportDto
import uz.pley.app.core.network.model.VenueNestedDto
import uz.pley.app.core.network.toAppError
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
    private val sessionDao: SessionDao,
    private val connectivityObserver: ConnectivityObserver
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
        return try {
            if (!connectivityObserver.isConnected.value) {
                val cached = sessionDao.getSessionsList().map { it.toDto() }
                if (cached.isNotEmpty()) {
                    val filtered = filterSessions(cached, sport, district, search)
                    return Result.success(filtered)
                }
                return Result.failure(AppError.NoNetwork())
            }

            val response = apiService.listSessions(
                sport = sport,
                district = district,
                search = search,
                skillLevel = if (skillLevel == "ALL_LEVELS") null else skillLevel,
                sessionVibe = sessionVibe
            )

            if (!response.isSuccessful) {
                val cached = sessionDao.getSessionsList().map { it.toDto() }
                if (cached.isNotEmpty()) {
                    val filtered = filterSessions(cached, sport, district, search)
                    return Result.success(filtered)
                }
                return Result.failure(response.toAppError())
            }

            val items = response.body().orEmpty()
            sessionDao.clearSessions()
            sessionDao.insertSessions(items.map { it.toEntity() })
            Result.success(items)
        } catch (e: Exception) {
            val cached = sessionDao.getSessionsList().map { it.toDto() }
            if (cached.isNotEmpty()) {
                val filtered = filterSessions(cached, sport, district, search)
                Result.success(filtered)
            } else {
                Result.failure(if (e is AppError) e else AppError.Unknown(e.localizedMessage ?: "Failed to load matches", e))
            }
        }
    }

    override suspend fun getSessionDetail(id: String): Result<SessionDetailDto> {
        return try {
            if (!connectivityObserver.isConnected.value) {
                val cached = sessionDao.getSessionByIdOnce(id)
                if (cached != null) {
                    return Result.success(cached.toDto().toDetailDto())
                }
                return Result.failure(AppError.NoNetwork())
            }

            val response = apiService.getSessionById(id)
            if (!response.isSuccessful) {
                val cached = sessionDao.getSessionByIdOnce(id)
                if (cached != null) {
                    return Result.success(cached.toDto().toDetailDto())
                }
                return Result.failure(response.toAppError())
            }

            val body = response.body() ?: return Result.failure(AppError.NotFound("Session not found"))
            Result.success(body)
        } catch (e: Exception) {
            val cached = sessionDao.getSessionByIdOnce(id)
            if (cached != null) {
                Result.success(cached.toDto().toDetailDto())
            } else {
                Result.failure(if (e is AppError) e else AppError.Unknown(e.localizedMessage ?: "Failed to load match detail", e))
            }
        }
    }

    override suspend fun reserveSpot(sessionId: String): Result<Unit> {
        return try {
            if (!connectivityObserver.isConnected.value) {
                return Result.failure(AppError.NoNetwork())
            }

            val response = apiService.reserveSpot(CreateBookingRequest(sessionId = sessionId))
            if (!response.isSuccessful) {
                return Result.failure(response.toAppError())
            }

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(if (e is AppError) e else AppError.Unknown(e.localizedMessage ?: "Failed to reserve spot", e))
        }
    }

    override suspend fun getSports(): Result<List<SportDto>> {
        return try {
            val response = apiService.listSports()
            if (!response.isSuccessful) {
                return Result.failure(response.toAppError())
            }
            Result.success(response.body().orEmpty())
        } catch (e: Exception) {
            Result.failure(if (e is AppError) e else AppError.Unknown(e.localizedMessage ?: "Failed to load sports", e))
        }
    }

    private fun filterSessions(
        list: List<SessionItemDto>,
        sport: String?,
        district: String?,
        search: String?
    ): List<SessionItemDto> {
        return list.filter { item ->
            (sport == null || item.sport.slug.equals(sport, ignoreCase = true) || item.sport.name.equals(sport, ignoreCase = true)) &&
            (district == null || item.venue.district.equals(district, ignoreCase = true)) &&
            (search == null || item.title.contains(search, ignoreCase = true) || item.venue.name.contains(search, ignoreCase = true))
        }
    }

    private fun SessionItemDto.toDetailDto(): SessionDetailDto {
        return SessionDetailDto(
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
            skillLevel = skillLevel,
            sessionVibe = sessionVibe,
            status = status,
            equipmentProvided = equipmentProvided,
            imageUrl = imageUrl,
            venue = venue,
            sport = sport
        )
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
            venueLatitude = venue.latitude,
            venueLongitude = venue.longitude,
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
                address = venueAddress,
                latitude = venueLatitude,
                longitude = venueLongitude
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
