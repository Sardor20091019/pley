package uz.pley.app.data.repository

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import uz.pley.app.core.database.dao.BookingDao
import uz.pley.app.core.database.entity.BookingEntity
import uz.pley.app.core.network.PleyApiService
import uz.pley.app.core.network.model.BookingStatus
import uz.pley.app.core.network.model.UserBookingDto
import javax.inject.Inject
import javax.inject.Singleton

interface BookingsRepository {
    fun observeMyBookings(): Flow<List<UserBookingDto>>
    suspend fun refreshMyBookings(): Result<List<UserBookingDto>>
    suspend fun cancelBooking(bookingId: String): Result<Unit>
}

@Singleton
class BookingsRepositoryImpl @Inject constructor(
    private val apiService: PleyApiService,
    private val bookingDao: BookingDao
) : BookingsRepository {

    override fun observeMyBookings(): Flow<List<UserBookingDto>> {
        return bookingDao.getAllBookings().map { list ->
            list.map { it.toDto() }
        }
    }

    override suspend fun refreshMyBookings(): Result<List<UserBookingDto>> {
        return try {
            val response = apiService.getMyBookings()
            val bookings = response.body().orEmpty()
            bookingDao.clearBookings()
            bookingDao.insertBookings(bookings.map { it.toEntity() })
            Result.success(bookings)
        } catch (e: Exception) {
            val cached = bookingDao.getBookingsList().map { it.toDto() }
            if (cached.isNotEmpty()) {
                Result.success(cached)
            } else {
                Result.failure(e)
            }
        }
    }

    override suspend fun cancelBooking(bookingId: String): Result<Unit> {
        return runCatching {
            val response = apiService.cancelBooking(bookingId)
            if (!response.isSuccessful) {
                throw IllegalStateException("Failed to cancel booking: ${response.code()}")
            }
            bookingDao.deleteBooking(bookingId)
        }
    }

    private fun UserBookingDto.toEntity(): BookingEntity {
        return BookingEntity(
            id = id,
            sessionId = sessionId,
            sessionTitle = sessionTitle,
            sportName = sportName,
            sportIcon = sportIcon,
            venueName = venueName,
            venueDistrict = venueDistrict,
            venueAddress = venueAddress,
            scheduledAt = scheduledAt,
            durationMinutes = durationMinutes,
            status = status.name,
            totalPrice = totalPrice,
            paymentStatus = paymentStatus,
            attendanceStatus = attendanceStatus,
            bookedAt = bookedAt,
            cancelledAt = cancelledAt,
            isEligibleForCancel = isEligibleForCancel
        )
    }

    private fun BookingEntity.toDto(): UserBookingDto {
        return UserBookingDto(
            id = id,
            sessionId = sessionId,
            sessionTitle = sessionTitle,
            sportName = sportName,
            sportIcon = sportIcon,
            venueName = venueName,
            venueDistrict = venueDistrict,
            venueAddress = venueAddress,
            scheduledAt = scheduledAt,
            durationMinutes = durationMinutes,
            status = runCatching { BookingStatus.valueOf(status) }.getOrDefault(BookingStatus.CONFIRMED),
            priceSnapshot = totalPrice,
            serviceFeeSnapshot = 0.0,
            totalPrice = totalPrice,
            paymentStatus = paymentStatus,
            attendanceStatus = attendanceStatus,
            bookedAt = bookedAt,
            cancelledAt = cancelledAt,
            isEligibleForCancel = isEligibleForCancel
        )
    }
}

