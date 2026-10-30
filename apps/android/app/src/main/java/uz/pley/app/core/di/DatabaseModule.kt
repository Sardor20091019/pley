package uz.pley.app.core.di

import android.content.Context
import androidx.room.Room
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import uz.pley.app.core.database.AppDatabase
import uz.pley.app.core.database.dao.BookingDao
import uz.pley.app.core.database.dao.SessionDao
import uz.pley.app.core.database.dao.UserDao
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideAppDatabase(
        @ApplicationContext context: Context
    ): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "pley_master_db"
        )
            .fallbackToDestructiveMigration()
            .build()
    }

    @Provides
    fun provideSessionDao(database: AppDatabase): SessionDao {
        return database.sessionDao()
    }

    @Provides
    fun provideBookingDao(database: AppDatabase): BookingDao {
        return database.bookingDao()
    }

    @Provides
    fun provideUserDao(database: AppDatabase): UserDao {
        return database.userDao()
    }
}

