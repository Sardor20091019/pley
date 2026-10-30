package uz.pley.app.presentation.navigation

import kotlinx.serialization.Serializable

@Serializable
sealed interface NavDestination {

    @Serializable
    data object Home : NavDestination

    @Serializable
    data object Discover : NavDestination

    @Serializable
    data class SessionDetail(val sessionId: String) : NavDestination

    @Serializable
    data object MyGames : NavDestination

    @Serializable
    data object Profile : NavDestination
}

