package uz.pley.app.core.database.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "sessions")
data class SessionEntity(
    @PrimaryKey
    @ColumnInfo(name = "id") val id: String,
    @ColumnInfo(name = "title") val title: String,
    @ColumnInfo(name = "scheduled_at") val scheduledAt: String,
    @ColumnInfo(name = "duration_minutes") val durationMinutes: Int,
    @ColumnInfo(name = "max_slots") val maxSlots: Int,
    @ColumnInfo(name = "booked_slots") val bookedSlots: Int,
    @ColumnInfo(name = "remaining_slots") val remainingSlots: Int,
    @ColumnInfo(name = "price_per_slot") val pricePerSlot: Double,
    @ColumnInfo(name = "service_fee") val serviceFee: Double,
    @ColumnInfo(name = "total_price") val totalPrice: Double,
    @ColumnInfo(name = "skill_level") val skillLevel: String,
    @ColumnInfo(name = "session_vibe") val sessionVibe: String,
    @ColumnInfo(name = "status") val status: String,
    @ColumnInfo(name = "equipment_provided") val equipmentProvided: Boolean,
    @ColumnInfo(name = "image_url") val imageUrl: String?,
    @ColumnInfo(name = "venue_id") val venueId: String,
    @ColumnInfo(name = "venue_name") val venueName: String,
    @ColumnInfo(name = "venue_district") val venueDistrict: String,
    @ColumnInfo(name = "venue_address") val venueAddress: String,
    @ColumnInfo(name = "venue_latitude") val venueLatitude: Double? = null,
    @ColumnInfo(name = "venue_longitude") val venueLongitude: Double? = null,
    @ColumnInfo(name = "sport_id") val sportId: String,
    @ColumnInfo(name = "sport_name") val sportName: String,
    @ColumnInfo(name = "sport_slug") val sportSlug: String,
    @ColumnInfo(name = "sport_icon") val sportIcon: String
)
