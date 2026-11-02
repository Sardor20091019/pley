package uz.pley.app.data.repository

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import uz.pley.app.core.database.dao.UserDao
import uz.pley.app.core.database.entity.UserEntity
import uz.pley.app.core.network.AppError
import uz.pley.app.core.network.ConnectivityObserver
import uz.pley.app.core.network.PleyApiService
import uz.pley.app.core.network.model.GoogleCallbackDto
import uz.pley.app.core.network.model.GoogleCredentialDto
import uz.pley.app.core.network.model.SkillLevel
import uz.pley.app.core.network.model.UserDto
import uz.pley.app.core.network.toAppError
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
    suspend fun logout(): Unit
}

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val apiService: PleyApiService,
    private val userDao: UserDao,
    private val tokenManager: TokenManager,
    private val connectivityObserver: ConnectivityObserver
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
        return try {
            if (!connectivityObserver.isConnected.value) {
                return Result.failure(AppError.NoNetwork())
            }

            val response = apiService.getGoogleAuthUrl(redirectUri)
            if (!response.isSuccessful) {
                return Result.failure(response.toAppError())
            }

            val url = response.body()?.get("url")
            if (url == null) {
                Result.failure(AppError.Unknown("Google auth URL was not returned"))
            } else {
                Result.success(url)
            }
        } catch (e: Exception) {
            Result.failure(if (e is AppError) e else AppError.Unknown(e.localizedMessage ?: "Failed to get auth URL", e))
        }
    }

    override suspend fun loginWithCode(code: String, redirectUri: String): Result<UserDto> {
        return try {
            if (!connectivityObserver.isConnected.value) {
                return Result.failure(AppError.NoNetwork())
            }

            val response = apiService.loginWithGoogleCode(GoogleCallbackDto(code = code, redirectUri = redirectUri))
            if (!response.isSuccessful) {
                return Result.failure(response.toAppError())
            }

            val body = response.body() ?: return Result.failure(AppError.Unknown("Invalid server response"))
            tokenManager.saveSession(body.token, body.user.id)
            userDao.insertUser(body.user.toEntity())
            Result.success(body.user)
        } catch (e: Exception) {
            Result.failure(if (e is AppError) e else AppError.Unknown(e.localizedMessage ?: "Authentication failed", e))
        }
    }

    override suspend fun loginWithCredential(credential: String): Result<UserDto> {
        return try {
            if (!connectivityObserver.isConnected.value) {
                return Result.failure(AppError.NoNetwork())
            }

            val response = apiService.loginWithGoogleCredential(GoogleCredentialDto(credential = credential))
            if (!response.isSuccessful) {
                return Result.failure(response.toAppError())
            }

            val body = response.body() ?: return Result.failure(AppError.Unknown("Invalid server response"))
            tokenManager.saveSession(body.token, body.user.id)
            userDao.insertUser(body.user.toEntity())
            Result.success(body.user)
        } catch (e: Exception) {
            Result.failure(if (e is AppError) e else AppError.Unknown(e.localizedMessage ?: "Authentication failed", e))
        }
    }

    override suspend fun syncProfile(): Result<UserDto> {
        return try {
            if (!connectivityObserver.isConnected.value) {
                val cached = userDao.getCurrentUserOnce()
                if (cached != null) {
                    return Result.success(cached.toDto())
                }
                return Result.failure(AppError.NoNetwork())
            }

            val response = apiService.getMyProfile()
            if (!response.isSuccessful) {
                val cached = userDao.getCurrentUserOnce()
                if (cached != null) {
                    return Result.success(cached.toDto())
                }
                return Result.failure(response.toAppError())
            }

            val user = response.body() ?: return Result.failure(AppError.NotFound("User profile not found"))
            userDao.insertUser(user.toEntity())
            Result.success(user)
        } catch (e: Exception) {
            val cached = userDao.getCurrentUserOnce()
            if (cached != null) {
                Result.success(cached.toDto())
            } else {
                Result.failure(if (e is AppError) e else AppError.Unknown(e.localizedMessage ?: "Failed to sync profile", e))
            }
        }
    }

    override suspend fun logout(): Unit {
        tokenManager.clearSession()
        userDao.clearUser()
    }

    private fun UserEntity.toDto(): UserDto {
        return UserDto(
            id = id,
            googleId = googleId,
            email = email,
            firstName = firstName,
            lastName = lastName,
            avatarUrl = avatarUrl,
            ageBracket = ageBracket,
            skillLevel = runCatching { SkillLevel.valueOf(skillLevel) }.getOrDefault(SkillLevel.CASUAL),
            preferredSports = preferredSports,
            preferredNeighborhoods = preferredNeighborhoods
        )
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
