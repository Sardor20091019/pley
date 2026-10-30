package uz.pley.app.core.storage

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TokenManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val securePreferences: SharedPreferences = try {
        createSecurePreferences(context, masterKey)
    } catch (_: Exception) {
        context.deleteSharedPreferences("pley_secure_auth_vault")
        createSecurePreferences(context, masterKey)
    }

    private fun createSecurePreferences(context: Context, masterKey: MasterKey): SharedPreferences {
        return EncryptedSharedPreferences.create(
            context,
            "pley_secure_auth_vault",
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
    }

    private val _tokenStateFlow = MutableStateFlow<String?>(getAccessToken())
    val tokenFlow: Flow<String?> = _tokenStateFlow.asStateFlow()

    private val _sessionExpiredEvent = MutableSharedFlow<Unit>(extraBufferCapacity = 1)
    val sessionExpiredEvent = _sessionExpiredEvent.asSharedFlow()

    fun getToken(): String? {
        return getAccessToken()
    }

    fun getAccessToken(): String? {
        return securePreferences.getString(KEY_ACCESS_TOKEN, null)
    }

    fun getRefreshToken(): String? {
        return securePreferences.getString(KEY_REFRESH_TOKEN, null)
    }

    fun getUserId(): String? {
        return securePreferences.getString(KEY_USER_ID, null)
    }

    @Synchronized
    fun saveSession(accessToken: String, userId: String, refreshToken: String? = null) {
        securePreferences.edit()
            .putString(KEY_ACCESS_TOKEN, accessToken)
            .putString(KEY_USER_ID, userId)
            .apply {
                if (!refreshToken.isNullOrBlank()) {
                    putString(KEY_REFRESH_TOKEN, refreshToken)
                }
            }
            .apply()

        _tokenStateFlow.value = accessToken
    }

    @Synchronized
    fun updateAccessToken(accessToken: String) {
        securePreferences.edit()
            .putString(KEY_ACCESS_TOKEN, accessToken)
            .apply()

        _tokenStateFlow.value = accessToken
    }

    @Synchronized
    fun clearSession() {
        securePreferences.edit()
            .remove(KEY_ACCESS_TOKEN)
            .remove(KEY_REFRESH_TOKEN)
            .remove(KEY_USER_ID)
            .apply()

        _tokenStateFlow.value = null
    }

    fun notifySessionExpired() {
        clearSession()
        _sessionExpiredEvent.tryEmit(Unit)
    }

    private companion object {
        private const val KEY_ACCESS_TOKEN = "enc_jwt_access_token"
        private const val KEY_REFRESH_TOKEN = "enc_jwt_refresh_token"
        private const val KEY_USER_ID = "enc_user_id"
    }
}
