package uz.pley.app.core.network.model

import androidx.compose.runtime.Immutable
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Immutable
@Serializable
data class UserDto(
    @SerialName("id") val id: String,
    @SerialName("google_id") val googleId: String? = null,
    @SerialName("email") val email: String,
    @SerialName("first_name") val firstName: String,
    @SerialName("last_name") val lastName: String? = null,
    @SerialName("avatar_url") val avatarUrl: String? = null,
    @SerialName("age_bracket") val ageBracket: String = "25-34",
    @SerialName("skill_level") val skillLevel: SkillLevel = SkillLevel.CASUAL,
    @SerialName("preferred_sports") val preferredSports: String = "football",
    @SerialName("preferred_neighborhoods") val preferredNeighborhoods: String = "Yunusabad",
    @SerialName("profile_visibility") val profileVisibility: String = "PUBLIC",
    @SerialName("role") val role: UserRole = UserRole.USER,
    @SerialName("status") val status: UserStatus = UserStatus.ACTIVE,
    @SerialName("created_at") val createdAt: String? = null,
    @SerialName("updated_at") val updatedAt: String? = null
)

@Immutable
@Serializable
data class AuthSessionResponse(
    @SerialName("token") val token: String,
    @SerialName("user") val user: UserDto
)

@Immutable
@Serializable
data class GoogleCallbackDto(
    @SerialName("code") val code: String,
    @SerialName("redirectUri") val redirectUri: String,
    @SerialName("turnstileToken") val turnstileToken: String? = null
)

@Immutable
@Serializable
data class GoogleCredentialDto(
    @SerialName("credential") val credential: String,
    @SerialName("turnstileToken") val turnstileToken: String? = null
)
