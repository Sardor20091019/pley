package uz.pley.app.data.repository

import uz.pley.app.core.database.dao.UserDao
import uz.pley.app.core.database.entity.UserEntity
import uz.pley.app.core.network.AppError
import uz.pley.app.core.network.ConnectivityObserver
import uz.pley.app.core.network.PleyApiService
import uz.pley.app.core.network.model.AchievementDto
import uz.pley.app.core.network.model.UpdateProfileDto
import uz.pley.app.core.network.model.UserDto
import uz.pley.app.core.network.toAppError
import javax.inject.Inject
import javax.inject.Singleton

interface ProfileRepository {
    suspend fun updateProfile(dto: UpdateProfileDto): Result<UserDto>
    suspend fun getAchievements(): Result<List<AchievementDto>>
}

@Singleton
class ProfileRepositoryImpl @Inject constructor(
    private val apiService: PleyApiService,
    private val userDao: UserDao,
    private val connectivityObserver: ConnectivityObserver
) : ProfileRepository {

    override suspend fun updateProfile(dto: UpdateProfileDto): Result<UserDto> {
        return try {
            if (!connectivityObserver.isConnected.value) {
                return Result.failure(AppError.NoNetwork())
            }

            val response = apiService.updateProfile(dto)
            if (!response.isSuccessful) {
                return Result.failure(response.toAppError())
            }

            val updated = response.body() ?: return Result.failure(AppError.Unknown("Failed to update profile"))
            userDao.insertUser(
                UserEntity(
                    id = updated.id,
                    googleId = updated.googleId,
                    email = updated.email,
                    firstName = updated.firstName,
                    lastName = updated.lastName,
                    avatarUrl = updated.avatarUrl,
                    ageBracket = updated.ageBracket,
                    skillLevel = updated.skillLevel.name,
                    preferredSports = updated.preferredSports,
                    preferredNeighborhoods = updated.preferredNeighborhoods,
                    role = updated.role.name
                )
            )
            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(if (e is AppError) e else AppError.Unknown(e.localizedMessage ?: "Failed to update profile", e))
        }
    }

    override suspend fun getAchievements(): Result<List<AchievementDto>> {
        return try {
            if (!connectivityObserver.isConnected.value) {
                return Result.success(emptyList())
            }

            val response = apiService.getAchievements()
            if (!response.isSuccessful) {
                return Result.failure(response.toAppError())
            }

            Result.success(response.body().orEmpty())
        } catch (e: Exception) {
            Result.failure(if (e is AppError) e else AppError.Unknown(e.localizedMessage ?: "Failed to load achievements", e))
        }
    }
}
