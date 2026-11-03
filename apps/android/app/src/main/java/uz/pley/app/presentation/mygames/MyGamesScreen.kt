package uz.pley.app.presentation.mygames

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import uz.pley.app.core.ui.components.PleyAlertDialog
import uz.pley.app.core.ui.components.PleyAlertTone
import uz.pley.app.core.ui.components.PleyEmptyState
import uz.pley.app.core.ui.components.SessionCardSkeleton
import uz.pley.app.core.ui.components.SportNeonBadge
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

private val TicketShape = RoundedCornerShape(24.dp)

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

    val successState = uiState as? MyGamesUiState.Success
    if (successState?.cancelError != null) {
        PleyAlertDialog(
            title = "Cancellation Failed",
            message = successState.cancelError,
            tone = PleyAlertTone.ERROR,
            primaryButtonText = "Got It",
            onPrimaryClick = { viewModel.clearCancelError() },
            onDismiss = { viewModel.clearCancelError() }
        )
    }

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
                        PleyEmptyState(
                            title = "Sign In Required",
                            description = "Sign in with your Google account to view your confirmed match spots and roster tickets.",
                            iconEmoji = "🔒",
                            actionLabel = "Sign In / Register",
                            onActionClick = onNavigateToAuth
                        )
                    }
                }

                is MyGamesUiState.Loading -> {
                    LazyColumn(
                        contentPadding = PaddingValues(horizontal = 18.dp, vertical = 10.dp),
                        verticalArrangement = Arrangement.spacedBy(18.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(48.dp)
                                    .clip(RoundedCornerShape(16.dp))
                                    .background(DarkCard)
                            )
                        }
                        items(3) {
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
                        PleyEmptyState(
                            title = "Error Loading Matches",
                            description = state.message,
                            iconEmoji = "⚠️",
                            actionLabel = "Tap to Retry",
                            onActionClick = { viewModel.refresh() }
                        )
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
                                .padding(horizontal = 18.dp, vertical = 10.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(20.dp))
                                    .background(DarkSurfaceElevated)
                                    .border(BorderStroke(1.dp, Color(0x28FFFFFF)), RoundedCornerShape(20.dp))
                                    .padding(4.dp)
                            ) {
                                Row(modifier = Modifier.fillMaxWidth()) {
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(48.dp)
                                            .clip(RoundedCornerShape(16.dp))
                                            .background(
                                                if (selectedTab == 0) ElectricLime else Color.Transparent
                                            )
                                            .kineticTouchEffect(pressedScale = 0.94f) {
                                                selectedTab = 0
                                            },
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "Upcoming (${state.upcomingBookings.size})",
                                            style = MaterialTheme.typography.labelLarge,
                                            fontWeight = FontWeight.Bold,
                                            color = if (selectedTab == 0) Color(0xFF0B0E14) else PlatinumSilver
                                        )
                                    }
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(48.dp)
                                            .clip(RoundedCornerShape(16.dp))
                                            .background(
                                                if (selectedTab == 1) ElectricLime else Color.Transparent
                                            )
                                            .kineticTouchEffect(pressedScale = 0.94f) {
                                                selectedTab = 1
                                            },
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "Past (${state.pastBookings.size})",
                                            style = MaterialTheme.typography.labelLarge,
                                            fontWeight = FontWeight.Bold,
                                            color = if (selectedTab == 1) Color(0xFF0B0E14) else PlatinumSilver
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(18.dp))

                            val currentList = if (selectedTab == 0) state.upcomingBookings else state.pastBookings

                            if (currentList.isEmpty()) {
                                PleyEmptyState(
                                    title = if (selectedTab == 0) "No Upcoming Matches" else "No Past History",
                                    description = if (selectedTab == 0)
                                        "You don't have any booked match spots right now. Check out the open rallies in Tashkent!"
                                    else
                                        "Matches you complete or cancel will appear in this history tab.",
                                    iconEmoji = if (selectedTab == 0) "🎾" else "📋"
                                )
                            } else {
                                LazyColumn(
                                    verticalArrangement = Arrangement.spacedBy(18.dp),
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
                                        Spacer(modifier = Modifier.height(36.dp))
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
                    text = "Release Match Spot",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = PureWhite
                )
            },
            text = {
                Text(
                    text = "Are you sure you want to release your spot in '${target.sessionTitle}'? Other waiting players will be given access.",
                    style = MaterialTheme.typography.bodyMedium,
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
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.height(48.dp)
                ) {
                    Text("Release Spot", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(
                    onClick = { bookingToCancel = null },
                    modifier = Modifier.height(48.dp)
                ) {
                    Text("Keep Spot", color = PureWhite, fontWeight = FontWeight.SemiBold)
                }
            },
            containerColor = DarkCard,
            shape = RoundedCornerShape(24.dp)
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
            .clip(TicketShape)
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF151A2A),
                        Color(0xFF0F131E)
                    )
                )
            )
            .border(BorderStroke(1.dp, Color(0x30FFFFFF)), TicketShape)
            .kineticTouchEffect(pressedScale = 0.97f, onClick = onSessionClick)
            .padding(18.dp)
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
                        size = 38.dp
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
                            BorderStroke(
                                1.dp,
                                if (booking.status.name == "CONFIRMED")
                                    StatusGreen.copy(alpha = 0.5f)
                                else
                                    Color(0x22FFFFFF)
                            ),
                            RoundedCornerShape(8.dp)
                        )
                        .padding(horizontal = 10.dp, vertical = 5.dp)
                ) {
                    Text(
                        text = booking.status.name,
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            fontSize = 10.sp
                        ),
                        color = if (booking.status.name == "CONFIRMED") StatusGreen else PlatinumSilver
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = booking.sessionTitle,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = PureWhite
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                MatchVisualTag(
                    text = booking.scheduledAt.take(16).replace("T", " • "),
                    icon = Icons.Default.CalendarMonth
                )
                MatchVisualTag(
                    text = "${booking.durationMinutes}m",
                    tint = theme.primaryColor
                )
                MatchVisualTag(
                    text = booking.venueDistrict,
                    icon = Icons.Default.LocationOn
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = booking.venueName,
                style = MaterialTheme.typography.bodySmall,
                color = SlateMuted
            )

            Spacer(modifier = Modifier.height(14.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(Color(0x1AFFFFFF))
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Total Paid",
                        style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp),
                        color = SlateMuted
                    )
                    Text(
                        text = "${booking.totalPrice.toInt()} UZS",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Black,
                        color = PureWhite
                    )
                }

                if (booking.isEligibleForCancel) {
                    OutlinedButton(
                        onClick = onCancelClick,
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = StatusRed
                        ),
                        border = BorderStroke(1.dp, StatusRed.copy(alpha = 0.6f)),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .height(48.dp)
                            .minimumInteractiveComponentSize()
                    ) {
                        Text(
                            text = "Release Spot",
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                        )
                    }
                } else {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = null,
                            tint = StatusGreen,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Roster Locked",
                            style = MaterialTheme.typography.labelSmall,
                            color = SlateMuted
                        )
                    }
                }
            }
        }
    }
}
