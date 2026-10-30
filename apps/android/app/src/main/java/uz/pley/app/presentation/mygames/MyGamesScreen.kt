package uz.pley.app.presentation.mygames

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import uz.pley.app.core.network.model.UserBookingDto
import uz.pley.app.core.ui.components.MatchVisualTag
import uz.pley.app.core.ui.components.PerforatedTicketDivider
import uz.pley.app.core.ui.components.SessionCardSkeleton
import uz.pley.app.core.ui.components.SportNeonBadge
import uz.pley.app.core.ui.components.carbonCard
import uz.pley.app.core.ui.components.glassCard
import uz.pley.app.core.ui.components.kineticTouchEffect
import uz.pley.app.core.ui.components.resolveSportTheme
import uz.pley.app.core.ui.theme.DarkCard
import uz.pley.app.core.ui.theme.DarkSurfaceElevated
import uz.pley.app.core.ui.theme.ElectricLime
import uz.pley.app.core.ui.theme.PlatinumSilver
import uz.pley.app.core.ui.theme.PureWhite
import uz.pley.app.core.ui.theme.SlateMuted
import uz.pley.app.core.ui.theme.StatusGreen
import uz.pley.app.core.ui.theme.StatusRed

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
                title = {
                    Column {
                        Text(
                            text = "My Games",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Black,
                            color = PureWhite
                        )
                        Text(
                            text = "Your Reserved Match Roster",
                            style = MaterialTheme.typography.labelSmall,
                            color = SlateMuted
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.Transparent
                )
            )
        },
        containerColor = Color.Transparent,
        modifier = modifier
    ) { innerPadding ->
        Surface(
            color = Color.Transparent,
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (val state = uiState) {
                is MyGamesUiState.NotAuthenticated -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .glassCard(shape = RoundedCornerShape(26.dp), borderAlpha = 0.3f)
                                .padding(28.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(54.dp)
                                        .clip(CircleShape)
                                        .background(Color(0x26D4FF00))
                                        .border(BorderStroke(1.dp, Color(0x66D4FF00)), CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(text = "⚡", fontSize = 24.sp)
                                }

                                Text(
                                    text = "Sign in to view your booked match spots",
                                    style = MaterialTheme.typography.bodyLarge,
                                    color = PureWhite,
                                    fontWeight = FontWeight.Bold
                                )

                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(14.dp))
                                        .background(ElectricLime)
                                        .kineticTouchEffect(onClick = onNavigateToAuth)
                                        .padding(horizontal = 28.dp, vertical = 12.dp)
                                ) {
                                    Text(
                                        text = "Sign In / Register",
                                        color = Color(0xFF0F1117),
                                        style = MaterialTheme.typography.labelLarge,
                                        fontWeight = FontWeight.Black
                                    )
                                }
                            }
                        }
                    }
                }

                is MyGamesUiState.Loading -> {
                    LazyColumn(
                        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(48.dp)
                                    .carbonCard(shape = RoundedCornerShape(14.dp))
                            )
                        }
                        items(4) {
                            SessionCardSkeleton()
                        }
                    }
                }

                is MyGamesUiState.Error -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .glassCard(shape = RoundedCornerShape(24.dp))
                                .padding(28.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                Text(
                                    text = state.message,
                                    color = StatusRed,
                                    style = MaterialTheme.typography.bodyMedium
                                )
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(ElectricLime)
                                        .kineticTouchEffect(onClick = { viewModel.refresh() })
                                        .padding(horizontal = 24.dp, vertical = 10.dp)
                                ) {
                                    Text(
                                        text = "Retry",
                                        color = Color.Black,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
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
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(horizontal = 20.dp, vertical = 12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .glassCard(shape = RoundedCornerShape(18.dp), borderAlpha = 0.25f)
                                    .padding(4.dp)
                            ) {
                                Row(modifier = Modifier.fillMaxWidth()) {
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(14.dp))
                                            .background(
                                                if (selectedTab == 0) ElectricLime else Color.Transparent
                                            )
                                            .kineticTouchEffect(pressedScale = 0.94f) {
                                                selectedTab = 0
                                            }
                                            .padding(vertical = 10.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "Upcoming (${state.upcomingBookings.size})",
                                            style = MaterialTheme.typography.labelMedium,
                                            fontWeight = FontWeight.Bold,
                                            color = if (selectedTab == 0) Color.Black else SlateMuted
                                        )
                                    }
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(14.dp))
                                            .background(
                                                if (selectedTab == 1) ElectricLime else Color.Transparent
                                            )
                                            .kineticTouchEffect(pressedScale = 0.94f) {
                                                selectedTab = 1
                                            }
                                            .padding(vertical = 10.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "Past (${state.pastBookings.size})",
                                            style = MaterialTheme.typography.labelMedium,
                                            fontWeight = FontWeight.Bold,
                                            color = if (selectedTab == 1) Color.Black else SlateMuted
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(16.dp))

                            val currentList = if (selectedTab == 0) state.upcomingBookings else state.pastBookings

                            if (currentList.isEmpty()) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .carbonCard(shape = RoundedCornerShape(20.dp))
                                        .padding(40.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = if (selectedTab == 0) "No upcoming matches booked." else "No past matches recorded.",
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = SlateMuted
                                    )
                                }
                            } else {
                                LazyColumn(
                                    verticalArrangement = Arrangement.spacedBy(16.dp),
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
                                            onCancelClick = { bookingToCancel = booking },
                                            onSessionClick = { onSessionClick(booking.sessionId) }
                                        )
                                    }

                                    item {
                                        Spacer(modifier = Modifier.height(72.dp))
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
            title = {
                Text(
                    text = "Cancel Match Spot",
                    fontWeight = FontWeight.Bold,
                    color = PureWhite
                )
            },
            text = {
                Text(
                    text = "Are you sure you want to release your spot in '${target.sessionTitle}'?",
                    color = PlatinumSilver
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.cancelBooking(target.id)
                        bookingToCancel = null
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = StatusRed,
                        contentColor = PureWhite
                    )
                ) {
                    Text("Release Spot")
                }
            },
            dismissButton = {
                TextButton(onClick = { bookingToCancel = null }) {
                    Text("Keep Spot", color = SlateMuted)
                }
            },
            containerColor = DarkCard,
            shape = RoundedCornerShape(20.dp)
        )
    }
}

@Composable
fun BookingCard(
    booking: UserBookingDto,
    isCancelling: Boolean,
    onCancelClick: () -> Unit,
    onSessionClick: () -> Unit = {}
) {
    val theme = resolveSportTheme(booking.sportName)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .glassCard(shape = RoundedCornerShape(24.dp), borderAlpha = 0.25f)
            .kineticTouchEffect(pressedScale = 0.96f, onClick = onSessionClick)
            .padding(20.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    SportNeonBadge(
                        icon = booking.sportIcon,
                        theme = theme,
                        size = 36.dp
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = booking.sportName.uppercase(),
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Black,
                                letterSpacing = 1.sp
                            ),
                            color = theme.primaryColor
                        )
                        Text(
                            text = "PASS #${booking.id.takeLast(6).uppercase()}",
                            style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp),
                            color = SlateMuted
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(
                            if (booking.status.name == "CONFIRMED")
                                StatusGreen.copy(alpha = 0.16f)
                            else
                                DarkSurfaceElevated
                        )
                        .border(
                            0.5.dp,
                            if (booking.status.name == "CONFIRMED")
                                StatusGreen.copy(alpha = 0.5f)
                            else
                                Color(0x22FFFFFF),
                            RoundedCornerShape(8.dp)
                        )
                        .padding(horizontal = 9.dp, vertical = 4.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        if (booking.status.name == "CONFIRMED") {
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = null,
                                tint = StatusGreen,
                                modifier = Modifier.size(12.dp)
                            )
                        }
                        Text(
                            text = booking.status.name,
                            color = if (booking.status.name == "CONFIRMED") StatusGreen else SlateMuted,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = booking.sessionTitle,
                style = MaterialTheme.typography.headlineLarge,
                color = PureWhite
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                MatchVisualTag(
                    text = booking.scheduledAt.take(16).replace("T", " • "),
                    icon = Icons.Default.CalendarMonth
                )
                MatchVisualTag(
                    text = "${booking.venueDistrict} • ${booking.venueName}",
                    icon = Icons.Default.LocationOn,
                    tint = theme.primaryColor
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            PerforatedTicketDivider()

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(
                        text = "${booking.totalPrice.toInt()}",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Black,
                        color = PureWhite
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "UZS",
                        style = MaterialTheme.typography.labelSmall,
                        color = PlatinumSilver,
                        modifier = Modifier.padding(bottom = 2.dp)
                    )
                }

                if (booking.status.name == "CONFIRMED" && booking.isEligibleForCancel) {
                    OutlinedButton(
                        onClick = onCancelClick,
                        enabled = !isCancelling,
                        shape = RoundedCornerShape(10.dp),
                        border = BorderStroke(1.dp, StatusRed.copy(alpha = 0.5f)),
                        modifier = Modifier.minimumInteractiveComponentSize()
                    ) {
                        Text(
                            text = "Cancel Spot",
                            color = StatusRed,
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}
