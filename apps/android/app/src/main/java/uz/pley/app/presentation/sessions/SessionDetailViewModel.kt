package uz.pley.app.presentation.sessions

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import uz.pley.app.core.network.model.SessionDetailDto
import uz.pley.app.data.repository.AuthRepository
import uz.pley.app.data.repository.SessionsRepository
import javax.inject.Inject

sealed interface SessionDetailUiState {
    data object Loading : SessionDetailUiState
    data class Success(
        val session: SessionDetailDto,
        val isAuthenticated: Boolean,
        val isBooking: Boolean = false,
        val bookingSuccess: Boolean = false,
        val userActionError: String? = null
    ) : SessionDetailUiState
    data class Error(val message: String) : SessionDetailUiState
}

@HiltViewModel
class SessionDetailViewModel @Inject constructor(
    private val sessionsRepository: SessionsRepository,
    private val authRepository: AuthRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val sessionId: String = checkNotNull(savedStateHandle["sessionId"])
    private val _uiState = MutableStateFlow<SessionDetailUiState>(SessionDetailUiState.Loading)
    val uiState: StateFlow<SessionDetailUiState> = _uiState.asStateFlow()

    init {
        loadSession()
    }

    fun loadSession() {
        viewModelScope.launch {
            _uiState.value = SessionDetailUiState.Loading
            val isAuth = authRepository.isAuthenticated()
            sessionsRepository.getSessionDetail(sessionId)
                .onSuccess { detail ->
                    _uiState.value = SessionDetailUiState.Success(
                        session = detail,
                        isAuthenticated = isAuth
                    )
                }
                .onFailure { error ->
                    _uiState.value = SessionDetailUiState.Error(
                        error.message ?: "Failed to load session details"
                    )
                }
        }
    }

    fun bookSpot() {
        val current = _uiState.value as? SessionDetailUiState.Success ?: return
        if (current.isBooking) return

        viewModelScope.launch {
            _uiState.value = current.copy(isBooking = true, userActionError = null)
            sessionsRepository.reserveSpot(sessionId)
                .onSuccess {
                    loadSession()
                }
                .onFailure { error ->
                    _uiState.value = current.copy(
                        isBooking = false,
                        userActionError = error.message ?: "Could not reserve spot. Please try again."
                    )
                }
        }
    }
}

