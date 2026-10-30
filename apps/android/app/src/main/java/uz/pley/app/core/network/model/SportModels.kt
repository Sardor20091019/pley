package uz.pley.app.core.network.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class VenueDto(
    @SerialName("id") val id: String,
    @SerialName("name") val name: String,
    @SerialName("district") val district: String,
    @SerialName("address") val address: String,
    @SerialName("description") val description: String,
    @SerialName("supported_sports") val supportedSports: String,
    @SerialName("hourly_rate") val hourlyRate: Double,
    @SerialName("is_partner") val isPartner: Int,
    @SerialName("active") val active: Int,
    @SerialName("contact_phone") val contactPhone: String? = null,
    @SerialName("amenities") val amenities: String
)

