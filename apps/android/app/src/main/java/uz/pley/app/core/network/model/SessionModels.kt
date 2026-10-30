package uz.pley.app.core.network.model

import androidx.compose.runtime.Immutable
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Immutable
@Serializable
data class VenueNestedDto(
    @SerialName("id") val id: String,
    @SerialName("name") val name: String,
    @SerialName("district") val district: String,
    @SerialName("address") val address: String,
    @SerialName("latitude") val latitude: Double? = null,
    @SerialName("longitude") val longitude: Double? = null
)

@Immutable
@Serializable
data class SportDto(
    @SerialName("id") val id: String,
    @SerialName("name") val name: String,
    @SerialName("slug") val slug: String,
    @SerialName("icon") val icon: String,
    @SerialName("description") val description: String? = null
)

@Immutable
@Serializable
data class ParticipantDto(
    @SerialName("userId") val userId: String,
    @SerialName("firstName") val firstName: String,
    @SerialName("avatarUrl") val avatarUrl: String? = null,
    @SerialName("skillLevel") val skillLevel: String? = null,
    @SerialName("bookedAt") val bookedAt: String? = null
)

@Immutable
@Serializable
data class SessionItemDto(
    @SerialName("id") val id: String,
    @SerialName("title") val title: String,
    @SerialName("scheduledAt") val scheduledAt: String,
    @SerialName("durationMinutes") val durationMinutes: Int,
    @SerialName("maxSlots") val maxSlots: Int,
    @SerialName("bookedSlots") val bookedSlots: Int,
    @SerialName("remainingSlots") val remainingSlots: Int,
    @SerialName("pricePerSlot") val pricePerSlot: Double,
    @SerialName("serviceFee") val serviceFee: Double,
    @SerialName("totalPrice") val totalPrice: Double,
    @SerialName("skillLevel") val skillLevel: SkillLevel,
    @SerialName("sessionVibe") val sessionVibe: SessionVibe,
    @SerialName("status") val status: SessionStatus,
    @SerialName("equipmentProvided") val equipmentProvided: Boolean = false,
    @SerialName("imageUrl") val imageUrl: String? = null,
    @SerialName("venue") val venue: VenueNestedDto,
    @SerialName("sport") val sport: SportDto
) {
    val isFull: Boolean
        get() = remainingSlots <= 0
}

@Immutable
@Serializable
data class SessionDetailDto(
    @SerialName("id") val id: String,
    @SerialName("title") val title: String,
    @SerialName("scheduledAt") val scheduledAt: String,
    @SerialName("durationMinutes") val durationMinutes: Int,
    @SerialName("maxSlots") val maxSlots: Int,
    @SerialName("bookedSlots") val bookedSlots: Int,
    @SerialName("remainingSlots") val remainingSlots: Int,
    @SerialName("pricePerSlot") val pricePerSlot: Double,
    @SerialName("serviceFee") val serviceFee: Double,
    @SerialName("totalPrice") val totalPrice: Double,
    @SerialName("skillLevel") val skillLevel: SkillLevel,
    @SerialName("sessionVibe") val sessionVibe: SessionVibe,
    @SerialName("status") val status: SessionStatus,
    @SerialName("equipmentProvided") val equipmentProvided: Boolean = false,
    @SerialName("imageUrl") val imageUrl: String? = null,
    @SerialName("venue") val venue: VenueNestedDto,
    @SerialName("sport") val sport: SportDto,
    @SerialName("minParticipants") val minParticipants: Int = 2,
    @SerialName("equipmentDetails") val equipmentDetails: String? = null,
    @SerialName("rulesNotes") val rulesNotes: String? = null,
    @SerialName("bookingDeadline") val bookingDeadline: String? = null,
    @SerialName("cancellationDeadlineHours") val cancellationDeadlineHours: Int = 24,
    @SerialName("venueAmenities") val venueAmenities: List<String> = emptyList(),
    @SerialName("participants") val participants: List<ParticipantDto> = emptyList(),
    @SerialName("currentUserBookingStatus") val currentUserBookingStatus: String? = null,
    @SerialName("currentUserBookingId") val currentUserBookingId: String? = null
) {
    val isFull: Boolean
        get() = remainingSlots <= 0
}
