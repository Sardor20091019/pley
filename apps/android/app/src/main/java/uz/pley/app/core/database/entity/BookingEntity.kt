package uz.pley.app.core.database.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "user_bookings")
data class BookingEntity(
    @PrimaryKey
    @ColumnInfo(name = "id") val id: String,
    @ColumnInfo(name = "session_id") val sessionId: String,
    @ColumnInfo(name = "session_title") val sessionTitle: String,
    @ColumnInfo(name = "sport_name") val sportName: String,
    @ColumnInfo(name = "sport_icon") val sportIcon: String,
    @ColumnInfo(name = "venue_name") val venueName: String,
    @ColumnInfo(name = "venue_district") val venueDistrict: String,
    @ColumnInfo(name = "venue_address") val venueAddress: String,
    @ColumnInfo(name = "scheduled_at") val scheduledAt: String,
    @ColumnInfo(name = "duration_minutes") val durationMinutes: Int,
    @ColumnInfo(name = "status") val status: String,
    @ColumnInfo(name = "total_price") val totalPrice: Double,
    @ColumnInfo(name = "payment_status") val paymentStatus: String,
    @ColumnInfo(name = "attendance_status") val attendanceStatus: String,
    @ColumnInfo(name = "booked_at") val bookedAt: String,
    @ColumnInfo(name = "cancelled_at") val cancelledAt: String?,
    @ColumnInfo(name = "is_eligible_for_cancel") val isEligibleForCancel: Boolean
)

