package uz.pley.app.presentation.mygames

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import uz.pley.app.core.network.model.UserBookingDto
import uz.pley.app.data.repository.AuthRepository
import uz.pley.app.data.repository.BookingsRepository
import javax.inject.Inject

sealed interface MyGamesUiState {
    data object Loading : MyGamesUiState
    data object NotAuthenticated : MyGamesUiState
    data class Success(
        val upcomingBookings: List<UserBookingDto>,
        val pastBookings: List<UserBookingDto>,
        val isCancelling: Boolean = false,
        val cancelError: String? = null,
        val isRefreshing: Boolean = false
    ) : MyGamesUiState
    data class Error(val message: String) : MyGamesUiState
}

@HiltViewModel
class MyGamesViewModel @Inject constructor(
    private val bookingsRepository: BookingsRepository,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val isCancellingFlow = MutableStateFlow(false)
    private val cancelErrorFlow = MutableStateFlow<String?>(null)
    private val isRefreshingFlow = MutableStateFlow(false)
    private val errorFlow = MutableStateFlow<String?>(null)

    val uiState: StateFlow<MyGamesUiState> = combine(
        bookingsRepository.observeMyBookings(),
        authRepository.tokenFlow,
        isCancellingFlow,
        cancelErrorFlow,
        isRefreshingFlow
    ) { bookings, token, isCancelling, cancelError, isRefreshing ->
        if (token.isNullOrBlank()) {
            MyGamesUiState.NotAuthenticated
        } else {
            val upcoming = bookings.filter { it.status.name == "CONFIRMED" || it.status.name == "PENDING_PAYMENT" }
            val past = bookings.filter { it.status.name != "CONFIRMED" && it.status.name != "PENDING_PAYMENT" }
            MyGamesUiState.Success(
                upcomingBookings = upcoming,
                pastBookings = past,
                isCancelling = isCancelling,
                cancelError = cancelError,
                isRefreshing = isRefreshing
            )
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = MyGamesUiState.Loading
    )

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            if (!authRepository.isAuthenticated()) return@launch
            isRefreshingFlow.value = true
            bookingsRepository.refreshMyBookings()
                .onFailure {
                    errorFlow.value = it.message ?: "Failed to refresh bookings"
                }
            isRefreshingFlow.value = false
        }
    }

    fun cancelBooking(bookingId: String) {
        viewModelScope.launch {
            isCancellingFlow.value = true
            cancelErrorFlow.value = null
            bookingsRepository.cancelBooking(bookingId)
                .onFailure {
                    cancelErrorFlow.value = it.message ?: "Failed to cancel booking"
                }
            isCancellingFlow.value = false
        }
    }
}

