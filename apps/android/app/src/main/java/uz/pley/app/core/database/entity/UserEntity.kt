package uz.pley.app.core.database.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "current_user")
data class UserEntity(
    @PrimaryKey
    @ColumnInfo(name = "id") val id: String,
    @ColumnInfo(name = "google_id") val googleId: String?,
    @ColumnInfo(name = "email") val email: String,
    @ColumnInfo(name = "first_name") val firstName: String,
    @ColumnInfo(name = "last_name") val lastName: String?,
    @ColumnInfo(name = "avatar_url") val avatarUrl: String?,
    @ColumnInfo(name = "age_bracket") val ageBracket: String,
    @ColumnInfo(name = "skill_level") val skillLevel: String,
    @ColumnInfo(name = "preferred_sports") val preferredSports: String,
    @ColumnInfo(name = "preferred_neighborhoods") val preferredNeighborhoods: String,
    @ColumnInfo(name = "role") val role: String
)

