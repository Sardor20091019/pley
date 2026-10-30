package uz.pley.app.presentation.navigation

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import uz.pley.app.core.network.ConnectivityObserver
import uz.pley.app.core.storage.TokenManager
import uz.pley.app.core.ui.components.NetworkStatusBar
import uz.pley.app.presentation.auth.AuthDialog
import uz.pley.app.presentation.discover.DiscoverScreen
import uz.pley.app.presentation.home.HomeScreen
import uz.pley.app.presentation.map.EventMapScreen
import uz.pley.app.presentation.mygames.MyGamesScreen
import uz.pley.app.presentation.profile.ProfileScreen
import uz.pley.app.presentation.sessions.SessionDetailScreen
import javax.inject.Inject

@HiltViewModel
class AppLifecycleViewModel @Inject constructor(
    connectivityObserver: ConnectivityObserver,
    val tokenManager: TokenManager
) : ViewModel() {
    val isOnline: StateFlow<Boolean> = connectivityObserver.isConnected
}

@Composable
fun AppNavHost(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController(),
    lifecycleViewModel: AppLifecycleViewModel = hiltViewModel()
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    var isAuthDialogOpen by remember { mutableStateOf(false) }
    val isOnline by lifecycleViewModel.isOnline.collectAsStateWithLifecycle()

    LaunchedEffect(Unit) {
        lifecycleViewModel.tokenManager.sessionExpiredEvent.collect {
            isAuthDialogOpen = true
        }
    }

    val currentTab = when {
        currentRoute?.contains("Home") == true -> BottomTab.HOME
        currentRoute?.contains("Discover") == true -> BottomTab.DISCOVER
        currentRoute?.contains("EventMap") == true -> BottomTab.DISCOVER
        currentRoute?.contains("MyGames") == true -> BottomTab.MY_GAMES
        currentRoute?.contains("Profile") == true -> BottomTab.PROFILE
        else -> null
    }

    Scaffold(
        topBar = {
            NetworkStatusBar(isOnline = isOnline)
        },
        bottomBar = {
            if (currentTab != null) {
                BottomNavBar(
                    currentTab = currentTab,
                    onTabSelected = { tab ->
                        navController.navigate(tab.route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }
        },
        modifier = modifier
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = NavDestination.Home,
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            composable<NavDestination.Home> {
                HomeScreen(
                    onNavigateToDiscover = {
                        navController.navigate(NavDestination.Discover) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    onSessionClick = { sessionId ->
                        navController.navigate(NavDestination.SessionDetail(sessionId = sessionId))
                    },
                    onNavigateToMap = {
                        navController.navigate(NavDestination.EventMap)
                    }
                )
            }

            composable<NavDestination.Discover> {
                DiscoverScreen(
                    onSessionClick = { sessionId ->
                        navController.navigate(NavDestination.SessionDetail(sessionId = sessionId))
                    },
                    onNavigateToMap = {
                        navController.navigate(NavDestination.EventMap)
                    }
                )
            }

            composable<NavDestination.EventMap> {
                EventMapScreen(
                    onBack = { navController.popBackStack() },
                    onSessionClick = { sessionId ->
                        navController.navigate(NavDestination.SessionDetail(sessionId = sessionId))
                    }
                )
            }

            composable<NavDestination.SessionDetail> { backStackEntry ->
                val detail = backStackEntry.toRoute<NavDestination.SessionDetail>()
                SessionDetailScreen(
                    onBack = { navController.popBackStack() },
                    onNavigateToAuth = { isAuthDialogOpen = true }
                )
            }

            composable<NavDestination.MyGames> {
                MyGamesScreen(
                    onNavigateToAuth = { isAuthDialogOpen = true },
                    onSessionClick = { sessionId ->
                        navController.navigate(NavDestination.SessionDetail(sessionId = sessionId))
                    }
                )
            }

            composable<NavDestination.Profile> {
                ProfileScreen(
                    onNavigateToAuth = { isAuthDialogOpen = true }
                )
            }
        }
    }

    if (isAuthDialogOpen) {
        AuthDialog(
            onDismiss = { isAuthDialogOpen = false },
            onSuccess = { isAuthDialogOpen = false }
        )
    }
}
