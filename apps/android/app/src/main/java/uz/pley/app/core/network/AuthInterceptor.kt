package uz.pley.app.core.network

import okhttp3.Interceptor
import okhttp3.Response
import uz.pley.app.core.storage.TokenManager
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthInterceptor @Inject constructor(
    private val tokenManager: TokenManager
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val original = chain.request()
        val token = tokenManager.getAccessToken()

        val builder = original.newBuilder()
        if (!token.isNullOrBlank()) {
            builder.header("Authorization", "Bearer $token")
        }
        builder.header("Accept", "application/json")
        return chain.proceed(builder.build())
    }
}
