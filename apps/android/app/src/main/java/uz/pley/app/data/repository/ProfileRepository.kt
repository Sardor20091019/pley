package uz.pley.app.data.repository

import uz.pley.app.core.database.dao.UserDao
import uz.pley.app.core.database.entity.UserEntity
import uz.pley.app.core.network.PleyApiService
import uz.pley.app.core.network.model.AchievementDto
import uz.pley.app.core.network.model.UpdateProfileDto
import uz.pley.app.core.network.model.UserDto
import javax.inject.Inject
import javax.inject.Singleton

interface ProfileRepository {
    suspend fun updateProfile(dto: UpdateProfileDto): Result<UserDto>
    suspend fun getAchievements(): Result<List<AchievementDto>>
}

@Singleton
class ProfileRepositoryImpl @Inject constructor(
    private val apiService: PleyApiService,
    private val userDao: UserDao
) : ProfileRepository {

    override suspend fun updateProfile(dto: UpdateProfileDto): Result<UserDto> {
        return runCatching {
            val response = apiService.updateProfile(dto)
            val updated = response.body() ?: throw IllegalStateException("Failed to update profile")
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
            updated
        }
    }

    override suspend fun getAchievements(): Result<List<AchievementDto>> {
        return runCatching {
            val response = apiService.getAchievements()
            response.body().orEmpty()
        }
    }
}

