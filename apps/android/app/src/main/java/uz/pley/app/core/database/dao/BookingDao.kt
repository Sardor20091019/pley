package uz.pley.app.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow
import uz.pley.app.core.database.entity.BookingEntity

@Dao
interface BookingDao {

    @Query("SELECT * FROM user_bookings ORDER BY scheduled_at DESC")
    fun getAllBookings(): Flow<List<BookingEntity>>

    @Query("SELECT * FROM user_bookings ORDER BY scheduled_at DESC")
    suspend fun getBookingsList(): List<BookingEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBookings(bookings: List<BookingEntity>)

    @Query("DELETE FROM user_bookings WHERE id = :bookingId")
    suspend fun deleteBooking(bookingId: String)

    @Query("DELETE FROM user_bookings")
    suspend fun clearBookings()
}

