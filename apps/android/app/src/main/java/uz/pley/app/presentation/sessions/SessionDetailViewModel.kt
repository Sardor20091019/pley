package uz.pley.app.presentation.sessions

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import uz.pley.app.core.network.AppError
import uz.pley.app.core.network.ConnectivityObserver
import uz.pley.app.core.network.model.SessionDetailDto
import uz.pley.app.core.network.toUserFriendlyMessage
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
        val userActionError: String? = null,
        val userActionSuccess: String? = null,
        val isBookingConflict: Boolean = false
    ) : SessionDetailUiState
    data class Error(val message: String) : SessionDetailUiState
}

@HiltViewModel
class SessionDetailViewModel @Inject constructor(
    private val sessionsRepository: SessionsRepository,
    private val authRepository: AuthRepository,
    private val connectivityObserver: ConnectivityObserver,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val sessionId: String = checkNotNull(savedStateHandle["sessionId"])
    private val _uiState = MutableStateFlow<SessionDetailUiState>(SessionDetailUiState.Loading)
    val uiState: StateFlow<SessionDetailUiState> = _uiState.asStateFlow()

    init {
        loadSession()
    }

    fun loadSession(): Unit {
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
                        error.toUserFriendlyMessage()
                    )
                }
        }
    }

    fun bookSpot(): Unit {
        val current = _uiState.value as? SessionDetailUiState.Success ?: return
        if (current.isBooking) return

        if (!connectivityObserver.isConnected.value) {
            _uiState.value = current.copy(
                isBooking = false,
                userActionError = "No internet connection. Please check your network and try again.",
                isBookingConflict = false
            )
            return
        }

        viewModelScope.launch {
            _uiState.value = current.copy(
                isBooking = true,
                userActionError = null,
                userActionSuccess = null,
                isBookingConflict = false
            )
            sessionsRepository.reserveSpot(sessionId)
                .onSuccess {
                    _uiState.value = current.copy(
                        isBooking = false,
                        bookingSuccess = true,
                        userActionSuccess = "Spot confirmed! Your booking is reserved on the team roster.",
                        isBookingConflict = false
                    )
                    loadSession()
                }
                .onFailure { error ->
                    val friendlyMsg = error.toUserFriendlyMessage()
                    val isConflict = error is AppError.Conflict ||
                        friendlyMsg.contains("already", ignoreCase = true) ||
                        friendlyMsg.contains("active reservation", ignoreCase = true) ||
                        friendlyMsg.contains("conflict", ignoreCase = true)

                    _uiState.value = current.copy(
                        isBooking = false,
                        userActionError = friendlyMsg,
                        isBookingConflict = isConflict
                    )
                }
        }
    }

    fun dismissUserActionError(): Unit {
        val current = _uiState.value as? SessionDetailUiState.Success ?: return
        _uiState.value = current.copy(userActionError = null, isBookingConflict = false)
    }

    fun dismissUserActionSuccess(): Unit {
        val current = _uiState.value as? SessionDetailUiState.Success ?: return
        _uiState.value = current.copy(userActionSuccess = null)
    }
}
