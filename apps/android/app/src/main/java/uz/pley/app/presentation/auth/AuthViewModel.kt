package uz.pley.app.presentation.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import uz.pley.app.data.repository.AuthRepository
import javax.inject.Inject

sealed interface AuthUiState {
    data object Idle : AuthUiState
    data object Loading : AuthUiState
    data object Success : AuthUiState
    data class Error(val message: String) : AuthUiState
}

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<AuthUiState>(AuthUiState.Idle)
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    fun loginWithGoogleCredential(credential: String) {
        viewModelScope.launch {
            _uiState.value = AuthUiState.Loading
            authRepository.loginWithCredential(credential)
                .onSuccess {
                    _uiState.value = AuthUiState.Success
                }
                .onFailure {
                    _uiState.value = AuthUiState.Error(it.message ?: "Authentication failed")
                }
        }
    }

    fun loginWithGoogleCode(code: String, redirectUri: String) {
        viewModelScope.launch {
            _uiState.value = AuthUiState.Loading
            authRepository.loginWithCode(code, redirectUri)
                .onSuccess {
                    _uiState.value = AuthUiState.Success
                }
                .onFailure {
                    _uiState.value = AuthUiState.Error(it.message ?: "Authentication failed")
                }
        }
    }

    suspend fun getGoogleAuthUrl(redirectUri: String): Result<String> {
        return authRepository.getGoogleAuthUrl(redirectUri)
    }

    fun setAuthError(message: String) {
        _uiState.value = AuthUiState.Error(message)
    }

    fun resetState() {
        _uiState.value = AuthUiState.Idle
    }
}
