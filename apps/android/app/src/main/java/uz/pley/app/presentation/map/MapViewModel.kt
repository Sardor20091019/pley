package uz.pley.app.presentation.map

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import uz.pley.app.core.network.model.SessionItemDto
import uz.pley.app.data.repository.SessionsRepository
import javax.inject.Inject

data class MapUiState(
    val sessions: List<SessionItemDto> = emptyList(),
    val selectedIndex: Int = 0,
    val selectedSessionId: String? = null,
    val selectedDistrict: String? = null,
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

@HiltViewModel
class MapViewModel @Inject constructor(
    private val sessionsRepository: SessionsRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(MapUiState(isLoading = true))
    val uiState: StateFlow<MapUiState> = _uiState.asStateFlow()

    init {
        loadSessions()
    }

    fun selectIndex(index: Int) {
        val validIndex = index.coerceIn(0, (_uiState.value.sessions.size - 1).coerceAtLeast(0))
        val sessionId = _uiState.value.sessions.getOrNull(validIndex)?.id
        _uiState.update {
            it.copy(
                selectedIndex = validIndex,
                selectedSessionId = sessionId
            )
        }
    }

    fun selectSession(sessionId: String?) {
        val index = _uiState.value.sessions.indexOfFirst { it.id == sessionId }
        _uiState.update {
            it.copy(
                selectedSessionId = sessionId,
                selectedIndex = if (index != -1) index else it.selectedIndex
            )
        }
    }

    fun filterByDistrict(district: String?) {
        _uiState.update { it.copy(selectedDistrict = district, selectedIndex = 0, selectedSessionId = null) }
        loadSessions()
    }

    fun loadSessions() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val district = _uiState.value.selectedDistrict
            sessionsRepository.refreshSessions(district = district)
                .onSuccess { items ->
                    _uiState.update {
                        it.copy(
                            sessions = items,
                            selectedIndex = 0,
                            selectedSessionId = items.firstOrNull()?.id,
                            isLoading = false,
                            errorMessage = null
                        )
                    }
                }
                .onFailure { throwable ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = throwable.localizedMessage ?: "Failed to load map events"
                        )
                    }
                }
        }
    }
}

