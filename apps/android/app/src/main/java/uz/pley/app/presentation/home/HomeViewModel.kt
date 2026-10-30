package uz.pley.app.presentation.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import uz.pley.app.core.network.model.SessionItemDto
import uz.pley.app.core.network.model.SportDto
import uz.pley.app.data.repository.SessionsRepository
import javax.inject.Inject

sealed interface HomeUiState {
    data object Loading : HomeUiState
    data class Success(
        val featuredSessions: List<SessionItemDto>,
        val sports: List<SportDto>,
        val isRefreshing: Boolean = false
    ) : HomeUiState
    data class Error(val message: String) : HomeUiState
}

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val sessionsRepository: SessionsRepository
) : ViewModel() {

    private val isRefreshingFlow = MutableStateFlow(false)
    private val sportsFlow = MutableStateFlow<List<SportDto>>(emptyList())
    private val errorMessageFlow = MutableStateFlow<String?>(null)

    val uiState: StateFlow<HomeUiState> = combine(
        sessionsRepository.observeSessions(),
        sportsFlow,
        isRefreshingFlow,
        errorMessageFlow
    ) { sessions, sports, isRefreshing, error ->
        when {
            error != null && sessions.isEmpty() -> HomeUiState.Error(error)
            sessions.isEmpty() && isRefreshing -> HomeUiState.Loading
            else -> HomeUiState.Success(
                featuredSessions = sessions.take(6),
                sports = sports,
                isRefreshing = isRefreshing
            )
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = HomeUiState.Loading
    )

    init {
        loadData()
    }

    fun loadData() {
        viewModelScope.launch {
            isRefreshingFlow.value = true
            errorMessageFlow.value = null

            sessionsRepository.getSports()
                .onSuccess { sportsFlow.value = it }

            sessionsRepository.refreshSessions()
                .onFailure { errorMessageFlow.value = it.message ?: "Failed to load featured games" }

            isRefreshingFlow.value = false
        }
    }
}

