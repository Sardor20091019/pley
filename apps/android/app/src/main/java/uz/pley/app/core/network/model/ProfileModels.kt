package uz.pley.app.core.network.model

import androidx.compose.runtime.Immutable
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Immutable
@Serializable
data class UpdateProfileDto(
    @SerialName("first_name") val firstName: String? = null,
    @SerialName("last_name") val lastName: String? = null,
    @SerialName("age_bracket") val ageBracket: String? = null,
    @SerialName("skill_level") val skillLevel: SkillLevel? = null,
    @SerialName("preferred_sports") val preferredSports: String? = null,
    @SerialName("preferred_neighborhoods") val preferredNeighborhoods: String? = null,
    @SerialName("profile_visibility") val profileVisibility: String? = null
)

@Immutable
@Serializable
data class AchievementDto(
    @SerialName("id") val id: String,
    @SerialName("badge") val badge: String,
    @SerialName("title") val title: String,
    @SerialName("description") val description: String,
    @SerialName("isUnlocked") val isUnlocked: Boolean = false
)
