package uz.pley.app.data.repository

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import uz.pley.app.core.database.dao.UserDao
import uz.pley.app.core.database.entity.UserEntity
import uz.pley.app.core.network.PleyApiService
import uz.pley.app.core.network.model.GoogleCallbackDto
import uz.pley.app.core.network.model.GoogleCredentialDto
import uz.pley.app.core.network.model.SkillLevel
import uz.pley.app.core.network.model.UserDto
import uz.pley.app.core.storage.TokenManager
import javax.inject.Inject
import javax.inject.Singleton

interface AuthRepository {
    val currentUserFlow: Flow<UserDto?>
    val tokenFlow: Flow<String?>
    suspend fun isAuthenticated(): Boolean
    suspend fun getGoogleAuthUrl(redirectUri: String): Result<String>
    suspend fun loginWithCode(code: String, redirectUri: String): Result<UserDto>
    suspend fun loginWithCredential(credential: String): Result<UserDto>
    suspend fun syncProfile(): Result<UserDto>
    suspend fun logout()
}

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val apiService: PleyApiService,
    private val userDao: UserDao,
    private val tokenManager: TokenManager
) : AuthRepository {

    override val currentUserFlow: Flow<UserDto?> = userDao.getCurrentUser().map { entity ->
        entity?.let {
            UserDto(
                id = it.id,
                googleId = it.googleId,
                email = it.email,
                firstName = it.firstName,
                lastName = it.lastName,
                avatarUrl = it.avatarUrl,
                ageBracket = it.ageBracket,
                skillLevel = runCatching { SkillLevel.valueOf(it.skillLevel) }.getOrDefault(SkillLevel.CASUAL),
                preferredSports = it.preferredSports,
                preferredNeighborhoods = it.preferredNeighborhoods
            )
        }
    }

    override val tokenFlow: Flow<String?> = tokenManager.tokenFlow

    override suspend fun isAuthenticated(): Boolean {
        return !tokenManager.getAccessToken().isNullOrBlank()
    }

    override suspend fun getGoogleAuthUrl(redirectUri: String): Result<String> {
        return runCatching {
            val response = apiService.getGoogleAuthUrl(redirectUri)
            val url = response.body()?.get("url")
            url ?: throw IllegalStateException("Google auth URL was not returned")
        }
    }

    override suspend fun loginWithCode(code: String, redirectUri: String): Result<UserDto> {
        return runCatching {
            val response = apiService.loginWithGoogleCode(GoogleCallbackDto(code = code, redirectUri = redirectUri))
            if (!response.isSuccessful) {
                val errorMsg = response.errorBody()?.string()?.takeIf { it.isNotBlank() }
                    ?: "Server returned HTTP ${response.code()}"
                throw IllegalStateException(errorMsg)
            }
            val body = response.body() ?: throw IllegalStateException("Invalid server response")
            tokenManager.saveSession(body.token, body.user.id)
            userDao.insertUser(body.user.toEntity())
            body.user
        }
    }

    override suspend fun loginWithCredential(credential: String): Result<UserDto> {
        return runCatching {
            val response = apiService.loginWithGoogleCredential(GoogleCredentialDto(credential = credential))
            if (!response.isSuccessful) {
                val errorMsg = response.errorBody()?.string()?.takeIf { it.isNotBlank() }
                    ?: "Server returned HTTP ${response.code()}"
                throw IllegalStateException(errorMsg)
            }
            val body = response.body() ?: throw IllegalStateException("Invalid server response")
            tokenManager.saveSession(body.token, body.user.id)
            userDao.insertUser(body.user.toEntity())
            body.user
        }
    }

    override suspend fun syncProfile(): Result<UserDto> {
        return runCatching {
            val response = apiService.getMyProfile()
            val user = response.body() ?: throw IllegalStateException("Failed to load user profile")
            userDao.insertUser(user.toEntity())
            user
        }
    }

    override suspend fun logout() {
        tokenManager.clearSession()
        userDao.clearUser()
    }

    private fun UserDto.toEntity(): UserEntity {
        return UserEntity(
            id = id,
            googleId = googleId,
            email = email,
            firstName = firstName,
            lastName = lastName,
            avatarUrl = avatarUrl,
            ageBracket = ageBracket,
            skillLevel = skillLevel.name,
            preferredSports = preferredSports,
            preferredNeighborhoods = preferredNeighborhoods,
            role = role.name
        )
    }
}
