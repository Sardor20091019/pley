package uz.pley.app.presentation.mygames

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import uz.pley.app.core.network.model.UserBookingDto
import uz.pley.app.core.ui.components.SessionCardSkeleton
import uz.pley.app.core.ui.theme.NeonCyan

private val BrandPrimary = NeonCyan

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MyGamesScreen(
    onNavigateToAuth: () -> Unit,
    onSessionClick: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: MyGamesViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle(minActiveState = Lifecycle.State.STARTED)
    var selectedTab by remember { mutableIntStateOf(0) }
    var bookingToCancel by remember { mutableStateOf<UserBookingDto?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Games", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        modifier = modifier
    ) { innerPadding ->
        Surface(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (val state = uiState) {
                is MyGamesUiState.Loading -> {
                    LazyColumn(
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(3) {
                            SessionCardSkeleton()
                        }
                    }
                }

                is MyGamesUiState.NotAuthenticated -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = "Track Your Matches",
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Sign in to view your upcoming bookings, spot confirmations, and game history.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(20.dp))
                        Button(
                            onClick = onNavigateToAuth,
                            colors = ButtonDefaults.buttonColors(
                                containerColor = BrandPrimary,
                                contentColor = Color.Black
                            ),
                            modifier = Modifier.minimumInteractiveComponentSize()
                        ) {
                            Text("Sign In Now", fontWeight = FontWeight.Bold)
                        }
                    }
                }

                is MyGamesUiState.Error -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(state.message, color = MaterialTheme.colorScheme.error)
                    }
                }

                is MyGamesUiState.Success -> {
                    val pullState = rememberPullToRefreshState()
                    PullToRefreshBox(
                        isRefreshing = state.isRefreshing,
                        onRefresh = { viewModel.refresh() },
                        state = pullState,
                        modifier = Modifier.fillMaxSize()
                    ) {
                        Column(modifier = Modifier.fillMaxSize()) {
                            TabRow(
                                selectedTabIndex = selectedTab,
                                containerColor = MaterialTheme.colorScheme.surface
                            ) {
                                Tab(
                                    selected = selectedTab == 0,
                                    onClick = { selectedTab = 0 },
                                    text = { Text("Upcoming (${state.upcomingBookings.size})") },
                                    modifier = Modifier.minimumInteractiveComponentSize()
                                )
                                Tab(
                                    selected = selectedTab == 1,
                                    onClick = { selectedTab = 1 },
                                    text = { Text("Past & Cancelled (${state.pastBookings.size})") },
                                    modifier = Modifier.minimumInteractiveComponentSize()
                                )
                            }

                            val currentList = if (selectedTab == 0) state.upcomingBookings else state.pastBookings

                            if (currentList.isEmpty()) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .padding(32.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = if (selectedTab == 0) "No upcoming matches booked." else "No past games found.",
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            } else {
                                LazyColumn(
                                    contentPadding = PaddingValues(16.dp),
                                    verticalArrangement = Arrangement.spacedBy(12.dp),
                                    modifier = Modifier.fillMaxSize()
                                ) {
                                    items(
                                        items = currentList,
                                        key = { it.id },
                                        contentType = { "booking_card" }
                                    ) { booking ->
                                        BookingCard(
                                            booking = booking,
                                            isCancelling = state.isCancelling,
                                            onCancelClick = { bookingToCancel = booking }
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (bookingToCancel != null) {
        val target = bookingToCancel!!
        AlertDialog(
            onDismissRequest = { bookingToCancel = null },
            title = { Text("Cancel Match Reservation") },
            text = { Text("Are you sure you want to cancel your spot in '${target.sessionTitle}'?") },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.cancelBooking(target.id)
                        bookingToCancel = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                    modifier = Modifier.minimumInteractiveComponentSize()
                ) {
                    Text("Confirm Cancellation")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = { bookingToCancel = null },
                    modifier = Modifier.minimumInteractiveComponentSize()
                ) {
                    Text("Keep Spot")
                }
            }
        )
    }
}

@Composable
fun BookingCard(
    booking: UserBookingDto,
    isCancelling: Boolean,
    onCancelClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "${booking.sportIcon} ${booking.sportName}",
                    style = MaterialTheme.typography.labelMedium,
                    color = BrandPrimary
                )
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(
                            if (booking.status.name == "CONFIRMED") BrandPrimary.copy(alpha = 0.2f)
                            else MaterialTheme.colorScheme.surfaceVariant
                        )
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = booking.status.name,
                        color = if (booking.status.name == "CONFIRMED") BrandPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = booking.sessionTitle,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.CalendarMonth,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = booking.scheduledAt.take(16).replace("T", " "),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.LocationOn,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "${booking.venueDistrict} • ${booking.venueName}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "${booking.totalPrice.toInt()} UZS",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = BrandPrimary
                )

                if (booking.status.name == "CONFIRMED" && booking.isEligibleForCancel) {
                    OutlinedButton(
                        onClick = onCancelClick,
                        enabled = !isCancelling,
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.minimumInteractiveComponentSize()
                    ) {
                        Text("Cancel Spot", color = MaterialTheme.colorScheme.error)
                    }
                }
            }
        }
    }
}
