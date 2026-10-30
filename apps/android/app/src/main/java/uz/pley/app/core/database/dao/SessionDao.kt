package uz.pley.app.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow
import uz.pley.app.core.database.entity.SessionEntity

@Dao
interface SessionDao {

    @Query("SELECT * FROM sessions ORDER BY scheduled_at ASC")
    fun getAllSessions(): Flow<List<SessionEntity>>

    @Query("SELECT * FROM sessions ORDER BY scheduled_at ASC")
    suspend fun getSessionsList(): List<SessionEntity>

    @Query("SELECT * FROM sessions WHERE id = :id LIMIT 1")
    fun getSessionById(id: String): Flow<SessionEntity?>

    @Query("SELECT * FROM sessions WHERE id = :id LIMIT 1")
    suspend fun getSessionByIdOnce(id: String): SessionEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSessions(sessions: List<SessionEntity>)

    @Query("DELETE FROM sessions")
    suspend fun clearSessions()
}
