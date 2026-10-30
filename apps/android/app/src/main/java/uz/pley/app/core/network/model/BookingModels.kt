package uz.pley.app.core.network.model

import androidx.compose.runtime.Immutable
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Immutable
@Serializable
data class CreateBookingRequest(
    @SerialName("sessionId") val sessionId: String
)

@Immutable
@Serializable
data class BookingDto(
    @SerialName("id") val id: String,
    @SerialName("user_id") val userId: String,
    @SerialName("session_id") val sessionId: String,
    @SerialName("status") val status: BookingStatus,
    @SerialName("price_snapshot") val priceSnapshot: Double,
    @SerialName("service_fee_snapshot") val serviceFeeSnapshot: Double,
    @SerialName("total_price") val totalPrice: Double,
    @SerialName("payment_status") val paymentStatus: String,
    @SerialName("attendance_status") val attendanceStatus: String,
    @SerialName("created_at") val createdAt: String
)

@Immutable
@Serializable
data class UserBookingDto(
    @SerialName("id") val id: String,
    @SerialName("sessionId") val sessionId: String,
    @SerialName("sessionTitle") val sessionTitle: String,
    @SerialName("sportName") val sportName: String,
    @SerialName("sportIcon") val sportIcon: String,
    @SerialName("venueName") val venueName: String,
    @SerialName("venueDistrict") val venueDistrict: String,
    @SerialName("venueAddress") val venueAddress: String,
    @SerialName("scheduledAt") val scheduledAt: String,
    @SerialName("durationMinutes") val durationMinutes: Int,
    @SerialName("status") val status: BookingStatus,
    @SerialName("priceSnapshot") val priceSnapshot: Double,
    @SerialName("serviceFeeSnapshot") val serviceFeeSnapshot: Double,
    @SerialName("totalPrice") val totalPrice: Double,
    @SerialName("paymentStatus") val paymentStatus: String,
    @SerialName("attendanceStatus") val attendanceStatus: String,
    @SerialName("bookedAt") val bookedAt: String,
    @SerialName("cancelledAt") val cancelledAt: String? = null,
    @SerialName("cancellationDeadlineHours") val cancellationDeadlineHours: Int = 24,
    @SerialName("isEligibleForCancel") val isEligibleForCancel: Boolean = false
)
