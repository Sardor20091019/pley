package uz.pley.app.core.database

import androidx.room.Database
import androidx.room.RoomDatabase
import uz.pley.app.core.database.dao.BookingDao
import uz.pley.app.core.database.dao.SessionDao
import uz.pley.app.core.database.dao.UserDao
import uz.pley.app.core.database.entity.BookingEntity
import uz.pley.app.core.database.entity.SessionEntity
import uz.pley.app.core.database.entity.UserEntity

@Database(
    entities = [
        SessionEntity::class,
        BookingEntity::class,
        UserEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun sessionDao(): SessionDao
    abstract fun bookingDao(): BookingDao
    abstract fun userDao(): UserDao
}

