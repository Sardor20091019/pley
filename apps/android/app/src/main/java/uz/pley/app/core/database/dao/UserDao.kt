package uz.pley.app.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow
import uz.pley.app.core.database.entity.UserEntity

@Dao
interface UserDao {

    @Query("SELECT * FROM current_user LIMIT 1")
    fun getCurrentUser(): Flow<UserEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity)

    @Query("DELETE FROM current_user")
    suspend fun clearUser()
}

