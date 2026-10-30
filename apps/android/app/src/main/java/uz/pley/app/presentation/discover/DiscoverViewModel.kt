package uz.pley.app.presentation.discover

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import uz.pley.app.core.network.model.SessionItemDto
import uz.pley.app.core.network.model.SportDto
import uz.pley.app.data.repository.SessionsRepository
import javax.inject.Inject

data class FilterState(
    val selectedSport: String? = null,
    val selectedDistrict: String? = null,
    val selectedSkillLevel: String? = null,
    val searchQuery: String = ""
)

sealed interface DiscoverUiState {
    data object Loading : DiscoverUiState
    data class Success(
        val sessions: List<SessionItemDto>,
        val sports: List<SportDto>,
        val filterState: FilterState,
        val isRefreshing: Boolean = false
    ) : DiscoverUiState
    data class Error(val message: String) : DiscoverUiState
}

@HiltViewModel
class DiscoverViewModel @Inject constructor(
    private val sessionsRepository: SessionsRepository
) : ViewModel() {

    private val filterStateFlow = MutableStateFlow(FilterState())
    private val sportsFlow = MutableStateFlow<List<SportDto>>(emptyList())
    private val isRefreshingFlow = MutableStateFlow(false)
    private val errorFlow = MutableStateFlow<String?>(null)
    private var searchJob: Job? = null

    val uiState: StateFlow<DiscoverUiState> = combine(
        sessionsRepository.observeSessions(),
        sportsFlow,
        filterStateFlow,
        isRefreshingFlow,
        errorFlow
    ) { sessions, sports, filters, isRefreshing, error ->
        when {
            error != null && sessions.isEmpty() -> DiscoverUiState.Error(error)
            sessions.isEmpty() && isRefreshing -> DiscoverUiState.Loading
            else -> {
                val filtered = sessions.filter { session ->
                    val matchesSport = filters.selectedSport == null || session.sport.slug.equals(filters.selectedSport, ignoreCase = true)
                    val matchesDistrict = filters.selectedDistrict == null || session.venue.district.contains(filters.selectedDistrict, ignoreCase = true)
                    val matchesSkill = filters.selectedSkillLevel == null || filters.selectedSkillLevel == "ALL_LEVELS" || session.skillLevel.name == filters.selectedSkillLevel
                    val matchesSearch = filters.searchQuery.isBlank() ||
                        session.title.contains(filters.searchQuery, ignoreCase = true) ||
                        session.venue.name.contains(filters.searchQuery, ignoreCase = true) ||
                        session.sport.name.contains(filters.searchQuery, ignoreCase = true)

                    matchesSport && matchesDistrict && matchesSkill && matchesSearch
                }
                DiscoverUiState.Success(
                    sessions = filtered,
                    sports = sports,
                    filterState = filters,
                    isRefreshing = isRefreshing
                )
            }
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = DiscoverUiState.Loading
    )

    init {
        loadInitial()
    }

    private fun loadInitial() {
        viewModelScope.launch {
            isRefreshingFlow.value = true
            sessionsRepository.getSports().onSuccess { sportsFlow.value = it }
            fetchRemote()
            isRefreshingFlow.value = false
        }
    }

    fun onSportSelected(sportSlug: String?) {
        val current = filterStateFlow.value
        val updated = if (current.selectedSport == sportSlug) null else sportSlug
        filterStateFlow.value = current.copy(selectedSport = updated)
        triggerFetch()
    }

    fun onDistrictSelected(district: String?) {
        val current = filterStateFlow.value
        val updated = if (current.selectedDistrict == district) null else district
        filterStateFlow.value = current.copy(selectedDistrict = updated)
        triggerFetch()
    }

    fun onSkillLevelSelected(skill: String?) {
        val current = filterStateFlow.value
        val updated = if (current.selectedSkillLevel == skill) null else skill
        filterStateFlow.value = current.copy(selectedSkillLevel = updated)
        triggerFetch()
    }

    fun onSearchQueryChanged(query: String) {
        filterStateFlow.value = filterStateFlow.value.copy(searchQuery = query)
        searchJob?.cancel()
        searchJob = viewModelScope.launch {
            delay(400)
            triggerFetch()
        }
    }

    fun refresh() {
        viewModelScope.launch {
            isRefreshingFlow.value = true
            fetchRemote()
            isRefreshingFlow.value = false
        }
    }

    private fun triggerFetch() {
        viewModelScope.launch {
            fetchRemote()
        }
    }

    private suspend fun fetchRemote() {
        val current = filterStateFlow.value
        errorFlow.value = null
        sessionsRepository.refreshSessions(
            sport = current.selectedSport,
            district = current.selectedDistrict,
            search = current.searchQuery.ifBlank { null },
            skillLevel = current.selectedSkillLevel
        ).onFailure {
            errorFlow.value = it.message ?: "Failed to fetch sessions"
        }
    }
}

