package uz.pley.app.core.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query
import uz.pley.app.core.network.model.AchievementDto
import uz.pley.app.core.network.model.AuthSessionResponse
import uz.pley.app.core.network.model.BookingDto
import uz.pley.app.core.network.model.CreateBookingRequest
import uz.pley.app.core.network.model.GoogleCallbackDto
import uz.pley.app.core.network.model.GoogleCredentialDto
import uz.pley.app.core.network.model.SessionDetailDto
import uz.pley.app.core.network.model.SessionItemDto
import uz.pley.app.core.network.model.SportDto
import uz.pley.app.core.network.model.UpdateProfileDto
import uz.pley.app.core.network.model.UserBookingDto
import uz.pley.app.core.network.model.UserDto
import uz.pley.app.core.network.model.VenueDto

interface PleyApiService {

    @GET("auth/google/url")
    suspend fun getGoogleAuthUrl(
        @Query("redirectUri") redirectUri: String
    ): Response<Map<String, String>>

    @POST("auth/google/callback")
    suspend fun loginWithGoogleCode(
        @Body dto: GoogleCallbackDto
    ): Response<AuthSessionResponse>

    @POST("auth/google/credential")
    suspend fun loginWithGoogleCredential(
        @Body dto: GoogleCredentialDto
    ): Response<AuthSessionResponse>

    @GET("auth/me")
    suspend fun getCurrentUser(): Response<Map<String, UserDto>>

    @GET("sessions")
    suspend fun listSessions(
        @Query("sport") sport: String? = null,
        @Query("district") district: String? = null,
        @Query("search") search: String? = null,
        @Query("skillLevel") skillLevel: String? = null,
        @Query("sessionVibe") sessionVibe: String? = null
    ): Response<List<SessionItemDto>>

    @GET("sessions/{id}")
    suspend fun getSessionById(
        @Path("id") id: String
    ): Response<SessionDetailDto>

    @POST("bookings")
    suspend fun reserveSpot(
        @Body request: CreateBookingRequest
    ): Response<BookingDto>

    @GET("bookings/my")
    suspend fun getMyBookings(): Response<List<UserBookingDto>>

    @DELETE("bookings/{id}")
    suspend fun cancelBooking(
        @Path("id") id: String
    ): Response<BookingDto>

    @GET("users/profile")
    suspend fun getMyProfile(): Response<UserDto>

    @PATCH("users/profile")
    suspend fun updateProfile(
        @Body dto: UpdateProfileDto
    ): Response<UserDto>

    @GET("users/achievements")
    suspend fun getAchievements(): Response<List<AchievementDto>>

    @GET("venues")
    suspend fun listVenues(
        @Query("district") district: String? = null,
        @Query("sport") sportSlug: String? = null
    ): Response<List<VenueDto>>

    @GET("sports")
    suspend fun listSports(): Response<List<SportDto>>
}

