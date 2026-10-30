package uz.pley.app.presentation.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import uz.pley.app.core.network.model.AchievementDto
import uz.pley.app.core.network.model.SkillLevel
import uz.pley.app.core.network.model.UpdateProfileDto
import uz.pley.app.core.network.model.UserDto
import uz.pley.app.data.repository.AuthRepository
import uz.pley.app.data.repository.ProfileRepository
import javax.inject.Inject

sealed interface ProfileUiState {
    data object Loading : ProfileUiState
    data object Unauthenticated : ProfileUiState
    data class Authenticated(
        val user: UserDto,
        val achievements: List<AchievementDto>,
        val isUpdating: Boolean = false,
        val errorMessage: String? = null
    ) : ProfileUiState
}

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val profileRepository: ProfileRepository
) : ViewModel() {

    private val achievementsFlow = MutableStateFlow<List<AchievementDto>>(emptyList())
    private val isUpdatingFlow = MutableStateFlow(false)
    private val errorFlow = MutableStateFlow<String?>(null)

    val uiState: StateFlow<ProfileUiState> = combine(
        authRepository.currentUserFlow,
        authRepository.tokenFlow,
        achievementsFlow,
        isUpdatingFlow,
        errorFlow
    ) { user, token, achievements, isUpdating, error ->
        if (token.isNullOrBlank()) {
            ProfileUiState.Unauthenticated
        } else if (user != null) {
            ProfileUiState.Authenticated(
                user = user,
                achievements = achievements,
                isUpdating = isUpdating,
                errorMessage = error
            )
        } else {
            ProfileUiState.Loading
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = ProfileUiState.Loading
    )

    init {
        syncProfile()
    }

    fun syncProfile() {
        viewModelScope.launch {
            if (!authRepository.isAuthenticated()) return@launch
            authRepository.syncProfile()
            profileRepository.getAchievements().onSuccess {
                achievementsFlow.value = it
            }
        }
    }

    fun updateProfile(firstName: String, skillLevel: SkillLevel, preferredSports: String) {
        viewModelScope.launch {
            isUpdatingFlow.value = true
            errorFlow.value = null
            profileRepository.updateProfile(
                UpdateProfileDto(
                    firstName = firstName,
                    skillLevel = skillLevel,
                    preferredSports = preferredSports
                )
            ).onFailure {
                errorFlow.value = it.message ?: "Failed to update profile"
            }
            isUpdatingFlow.value = false
        }
    }

    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
        }
    }
}

