package uz.pley.app.core.network

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import okhttp3.Authenticator
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import okhttp3.Route
import uz.pley.app.BuildConfig
import uz.pley.app.core.storage.TokenManager
import javax.inject.Inject
import javax.inject.Named
import javax.inject.Provider
import javax.inject.Singleton

@Serializable
private data class RefreshTokenRequest(
    val refreshToken: String
)

@Serializable
private data class RefreshTokenResponse(
    val token: String,
    val refreshToken: String? = null
)

@Singleton
class TokenAuthenticator @Inject constructor(
    private val tokenManager: TokenManager,
    private val json: Json,
    @Named("unauthenticated") private val unauthenticatedClientProvider: Provider<OkHttpClient>
) : Authenticator {

    private val lock = Any()

    override fun authenticate(route: Route?, response: Response): Request? {
        if (responseCount(response) >= 3) {
            tokenManager.notifySessionExpired()
            return null
        }

        val originalHeader = response.request.header("Authorization")
        val failedToken = originalHeader?.removePrefix("Bearer ")?.trim()

        synchronized(lock) {
            val currentToken = tokenManager.getAccessToken()

            if (!currentToken.isNullOrBlank() && currentToken != failedToken) {
                return response.request.newBuilder()
                    .header("Authorization", "Bearer $currentToken")
                    .build()
            }

            val refreshToken = tokenManager.getRefreshToken() ?: failedToken
            if (refreshToken.isNullOrBlank()) {
                tokenManager.notifySessionExpired()
                return null
            }

            val refreshedToken = performTokenRefresh(refreshToken)
            return if (!refreshedToken.isNullOrBlank()) {
                tokenManager.updateAccessToken(refreshedToken)
                response.request.newBuilder()
                    .header("Authorization", "Bearer $refreshedToken")
                    .build()
            } else {
                tokenManager.notifySessionExpired()
                null
            }
        }
    }

    private fun performTokenRefresh(refreshToken: String): String? {
        return try {
            val refreshUrl = "${BuildConfig.BASE_URL}auth/refresh"
            val payload = json.encodeToString(RefreshTokenRequest.serializer(), RefreshTokenRequest(refreshToken))
            val requestBody = payload.toRequestBody("application/json".toMediaType())

            val refreshRequest = Request.Builder()
                .url(refreshUrl)
                .post(requestBody)
                .header("Authorization", "Bearer $refreshToken")
                .header("Accept", "application/json")
                .build()

            val client = unauthenticatedClientProvider.get()
            val refreshResponse = client.newCall(refreshRequest).execute()

            if (refreshResponse.isSuccessful) {
                val responseBody = refreshResponse.body?.string() ?: return null
                val data = json.decodeFromString(RefreshTokenResponse.serializer(), responseBody)
                data.token
            } else {
                null
            }
        } catch (_: Exception) {
            null
        }
    }

    private fun responseCount(response: Response): Int {
        var count = 1
        var priorResponse = response.priorResponse
        while (priorResponse != null) {
            count++
            priorResponse = priorResponse.priorResponse
        }
        return count
    }
}
