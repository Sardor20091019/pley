package uz.pley.app.presentation.sessions

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import uz.pley.app.core.network.model.ParticipantDto
import uz.pley.app.core.network.model.SessionDetailDto
import uz.pley.app.core.ui.components.MatchVisualTag
import uz.pley.app.core.ui.components.PleyAlertDialog
import uz.pley.app.core.ui.components.PleyAlertTone
import uz.pley.app.core.ui.components.PleyEmptyState
import uz.pley.app.core.ui.components.PleyImage
import uz.pley.app.core.ui.components.SessionCapacityMeter
import uz.pley.app.core.ui.components.SportNeonBadge
import uz.pley.app.core.ui.components.kineticTouchEffect
import uz.pley.app.core.ui.components.resolveSportTheme
import uz.pley.app.core.ui.components.shimmerEffect
import uz.pley.app.core.ui.theme.DarkCard
import uz.pley.app.core.ui.theme.DarkSurfaceElevated
import uz.pley.app.core.ui.theme.ElectricLime
import uz.pley.app.core.ui.theme.PlatinumSilver
import uz.pley.app.core.ui.theme.PureWhite
import uz.pley.app.core.ui.theme.SlateMuted
import uz.pley.app.core.ui.theme.StatusGreen

private val DetailCardShape = RoundedCornerShape(22.dp)

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun SessionDetailScreen(
    onBack: () -> Unit,
    onNavigateToAuth: () -> Unit,
    onNavigateToMyGames: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: SessionDetailViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle(minActiveState = Lifecycle.State.STARTED)
    val snackbarHostState = remember { SnackbarHostState() }

    val successState = uiState as? SessionDetailUiState.Success
    if (successState?.userActionError != null) {
        if (successState.isBookingConflict) {
            PleyAlertDialog(
                title = "Already Reserved",
                message = successState.userActionError,
                tone = PleyAlertTone.WARNING,
                primaryButtonText = "View in My Games",
                onPrimaryClick = {
                    viewModel.dismissUserActionError()
                    onNavigateToMyGames()
                },
                secondaryButtonText = "Dismiss",
                onSecondaryClick = { viewModel.dismissUserActionError() },
                onDismiss = { viewModel.dismissUserActionError() }
            )
        } else {
            val isOffline = successState.userActionError.contains("connection", ignoreCase = true) ||
                successState.userActionError.contains("internet", ignoreCase = true)
            PleyAlertDialog(
                title = if (isOffline) "Connection Error" else "Booking Issue",
                message = successState.userActionError,
                tone = if (isOffline) PleyAlertTone.OFFLINE else PleyAlertTone.ERROR,
                primaryButtonText = "Got It",
                onPrimaryClick = { viewModel.dismissUserActionError() },
                onDismiss = { viewModel.dismissUserActionError() }
            )
        }
    }

    if (successState?.userActionSuccess != null) {
        PleyAlertDialog(
            title = "Spot Reserved!",
            message = successState.userActionSuccess,
            tone = PleyAlertTone.SUCCESS,
            primaryButtonText = "View in My Games",
            onPrimaryClick = {
                viewModel.dismissUserActionSuccess()
                onNavigateToMyGames()
            },
            secondaryButtonText = "Done",
            onSecondaryClick = { viewModel.dismissUserActionSuccess() },
            onDismiss = { viewModel.dismissUserActionSuccess() }
        )
    }

    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Match Details",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Black,
                        color = PureWhite
                    )
                },
                navigationIcon = {
                    Box(
                        modifier = Modifier
                            .padding(start = 8.dp)
                            .size(48.dp)
                            .clip(CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        IconButton(
                            onClick = onBack,
                            modifier = Modifier
                                .size(44.dp)
                                .background(DarkCard, CircleShape)
                                .border(BorderStroke(1.dp, Color(0x28FFFFFF)), CircleShape)
                        ) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                contentDescription = "Back",
                                tint = PureWhite,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.Transparent
                )
            )
        },
        bottomBar = {
            val state = uiState as? SessionDetailUiState.Success
            if (state != null) {
                BottomBookingBar(
                    session = state.session,
                    isAuthenticated = state.isAuthenticated,
                    isBooking = state.isBooking,
                    onBookClick = {
                        if (!state.isAuthenticated) {
                            onNavigateToAuth()
                        } else {
                            viewModel.bookSpot()
                        }
                    }
                )
            }
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
                is SessionDetailUiState.Loading -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(200.dp)
                                .clip(DetailCardShape)
                                .shimmerEffect()
                        )
                        Box(
                            modifier = Modifier
                                .width(220.dp)
                                .height(28.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .shimmerEffect()
                        )
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp)
                                .clip(DetailCardShape)
                                .shimmerEffect()
                        )
                    }
                }

                is SessionDetailUiState.Error -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        PleyEmptyState(
                            title = "Could Not Load Match",
                            description = state.message,
                            iconEmoji = "⚠️",
                            actionLabel = "Retry",
                            onActionClick = { viewModel.loadSession() }
                        )
                    }
                }

                is SessionDetailUiState.Success -> {
                    val session = state.session
                    val theme = resolveSportTheme(session.sport.slug)

                    LazyColumn(
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        if (!session.imageUrl.isNullOrBlank()) {
                            item(contentType = "hero_image") {
                                PleyImage(
                                    imageUrl = session.imageUrl,
                                    fallbackText = session.sport.icon,
                                    contentDescription = session.title,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(210.dp)
                                        .clip(DetailCardShape)
                                        .border(BorderStroke(1.dp, Color(0x28FFFFFF)), DetailCardShape)
                                )
                            }
                        }

                        item(contentType = "main_card") {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(DetailCardShape)
                                    .background(
                                        brush = Brush.verticalGradient(
                                            colors = listOf(
                                                Color(0xFF151928),
                                                Color(0xFF0F121C)
                                            )
                                        )
                                    )
                                    .border(BorderStroke(1.dp, Color(0x30FFFFFF)), DetailCardShape)
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
                                                icon = session.sport.icon,
                                                theme = theme,
                                                size = 42.dp
                                            )
                                            Spacer(modifier = Modifier.width(12.dp))
                                            Column {
                                                Text(
                                                    text = session.sport.name.uppercase(),
                                                    style = MaterialTheme.typography.titleMedium,
                                                    fontWeight = FontWeight.Black,
                                                    color = theme.primaryColor
                                                )
                                                Text(
                                                    text = "OFFICIAL RECREATIONAL",
                                                    style = MaterialTheme.typography.labelSmall,
                                                    color = SlateMuted
                                                )
                                            }
                                        }

                                        MatchVisualTag(
                                            text = session.skillLevel.name.replace("_", " "),
                                            tint = PlatinumSilver
                                        )
                                    }

                                    Spacer(modifier = Modifier.height(14.dp))

                                    Text(
                                        text = session.title,
                                        style = MaterialTheme.typography.headlineLarge,
                                        fontWeight = FontWeight.Bold,
                                        color = PureWhite
                                    )

                                    Spacer(modifier = Modifier.height(14.dp))

                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        MatchVisualTag(text = session.sessionVibe.name)
                                        if (session.equipmentProvided) {
                                            MatchVisualTag(text = "Equipment Provided", tint = ElectricLime)
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(16.dp))

                                    SessionCapacityMeter(
                                        bookedSlots = session.bookedSlots,
                                        maxSlots = session.maxSlots,
                                        accentColor = theme.primaryColor
                                    )
                                }
                            }
                        }

                        item(contentType = "info_card") {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(DetailCardShape)
                                    .background(
                                        brush = Brush.verticalGradient(
                                            colors = listOf(
                                                Color(0xFF131724),
                                                Color(0xFF0D0F18)
                                            )
                                        )
                                    )
                                    .border(BorderStroke(1.dp, Color(0x28FFFFFF)), DetailCardShape)
                                    .padding(20.dp)
                            ) {
                                Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(
                                            modifier = Modifier
                                                .size(42.dp)
                                                .clip(RoundedCornerShape(12.dp))
                                                .background(DarkSurfaceElevated)
                                                .border(BorderStroke(1.dp, Color(0x22FFFFFF)), RoundedCornerShape(12.dp)),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Schedule,
                                                contentDescription = null,
                                                tint = theme.primaryColor,
                                                modifier = Modifier.size(20.dp)
                                            )
                                        }
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Column {
                                            Text(
                                                text = session.scheduledAt.take(16).replace("T", " • "),
                                                style = MaterialTheme.typography.titleMedium,
                                                fontWeight = FontWeight.Bold,
                                                color = PureWhite
                                            )
                                            Text(
                                                text = "Duration: ${session.durationMinutes} minutes",
                                                style = MaterialTheme.typography.bodySmall,
                                                color = SlateMuted
                                            )
                                        }
                                    }

                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(1.dp)
                                            .background(Color(0x1AFFFFFF))
                                    )

                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(
                                            modifier = Modifier
                                                .size(42.dp)
                                                .clip(RoundedCornerShape(12.dp))
                                                .background(DarkSurfaceElevated)
                                                .border(BorderStroke(1.dp, Color(0x22FFFFFF)), RoundedCornerShape(12.dp)),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.LocationOn,
                                                contentDescription = null,
                                                tint = theme.primaryColor,
                                                modifier = Modifier.size(20.dp)
                                            )
                                        }
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Column {
                                            Text(
                                                text = "${session.venue.district} • ${session.venue.name}",
                                                style = MaterialTheme.typography.titleMedium,
                                                fontWeight = FontWeight.Bold,
                                                color = PureWhite
                                            )
                                            Text(
                                                text = session.venue.address,
                                                style = MaterialTheme.typography.bodySmall,
                                                color = SlateMuted
                                            )
                                        }
                                    }
                                }
                            }
                        }

                        if (session.venueAmenities.isNotEmpty()) {
                            item(contentType = "amenities") {
                                Column {
                                    Text(
                                        text = "VENUE AMENITIES",
                                        style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 0.8.sp),
                                        color = SlateMuted
                                    )
                                    Spacer(modifier = Modifier.height(10.dp))
                                    FlowRow(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        verticalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        session.venueAmenities.forEach { amenity ->
                                            MatchVisualTag(text = amenity)
                                        }
                                    }
                                }
                            }
                        }

                        item(contentType = "players_roster") {
                            Column {
                                Text(
                                    text = "ROSTERED PLAYERS (${session.bookedSlots} / ${session.maxSlots})",
                                    style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 0.8.sp),
                                    color = SlateMuted
                                )
                                Spacer(modifier = Modifier.height(10.dp))
                                if (session.participants.isEmpty()) {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clip(DetailCardShape)
                                            .background(DarkCard)
                                            .border(BorderStroke(1.dp, Color(0x20FFFFFF)), DetailCardShape)
                                            .padding(20.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "Be the first player to join this match!",
                                            style = MaterialTheme.typography.bodyMedium,
                                            color = SlateMuted
                                        )
                                    }
                                } else {
                                    LazyRow(
                                        horizontalArrangement = Arrangement.spacedBy(14.dp)
                                    ) {
                                        items(
                                            items = session.participants,
                                            key = { it.userId },
                                            contentType = { "player_avatar" }
                                        ) { player ->
                                            ParticipantAvatar(player = player)
                                        }
                                    }
                                }
                            }
                        }

                        if (!session.rulesNotes.isNullOrBlank()) {
                            item(contentType = "rules_card") {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(DetailCardShape)
                                        .background(DarkCard)
                                        .border(BorderStroke(1.dp, Color(0x20FFFFFF)), DetailCardShape)
                                        .padding(20.dp)
                                ) {
                                    Column {
                                        Text(
                                            text = "Rules & Information",
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.Bold,
                                            color = PureWhite
                                        )
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Text(
                                            text = session.rulesNotes,
                                            style = MaterialTheme.typography.bodyMedium,
                                            color = PlatinumSilver
                                        )
                                    }
                                }
                            }
                        }

                        item {
                            Spacer(modifier = Modifier.height(100.dp))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DetailBadge(text: String) {
    MatchVisualTag(text = text)
}

@Composable
fun ParticipantAvatar(player: ParticipantDto) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.width(68.dp)
    ) {
        if (!player.avatarUrl.isNullOrBlank()) {
            PleyImage(
                imageUrl = player.avatarUrl,
                fallbackText = player.firstName.take(1).uppercase(),
                contentDescription = player.firstName,
                modifier = Modifier
                    .size(52.dp)
                    .clip(CircleShape)
                    .border(BorderStroke(1.5.dp, Color(0x33FFFFFF)), CircleShape)
            )
        } else {
            Box(
                modifier = Modifier
                    .size(52.dp)
                    .clip(CircleShape)
                    .background(
                        brush = Brush.linearGradient(
                            colors = listOf(ElectricLime, Color(0xFF00E676))
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = player.firstName.take(1).uppercase(),
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0A0C05),
                    fontSize = 20.sp
                )
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = player.firstName,
            style = MaterialTheme.typography.labelSmall,
            color = PlatinumSilver,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

@Composable
fun BottomBookingBar(
    session: SessionDetailDto,
    isAuthenticated: Boolean,
    isBooking: Boolean,
    onBookClick: () -> Unit
) {
    val alreadyBooked = session.currentUserBookingStatus == "CONFIRMED"
    val theme = resolveSportTheme(session.sport.slug)

    Surface(
        color = Color.Transparent,
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(26.dp))
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            Color(0xFF161B28),
                            Color(0xFF0E1119)
                        )
                    )
                )
                .border(BorderStroke(1.dp, Color(0x33FFFFFF)), RoundedCornerShape(26.dp))
                .padding(horizontal = 18.dp, vertical = 14.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "TOTAL FEE",
                        style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 0.8.sp),
                        color = SlateMuted
                    )
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(
                            text = "${session.pricePerSlot.toInt()}",
                            style = MaterialTheme.typography.headlineMedium,
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
                }

                if (alreadyBooked) {
                    Box(
                        modifier = Modifier
                            .height(52.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(StatusGreen.copy(alpha = 0.2f))
                            .border(BorderStroke(1.dp, StatusGreen.copy(alpha = 0.6f)), RoundedCornerShape(14.dp))
                            .padding(horizontal = 20.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Check,
                                contentDescription = null,
                                tint = StatusGreen,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Spot Reserved",
                                color = StatusGreen,
                                style = MaterialTheme.typography.labelLarge,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                } else {
                    Box(
                        modifier = Modifier
                            .height(52.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(
                                if (session.isFull || isBooking)
                                    Color(0xFF232838)
                                else
                                    theme.primaryColor
                            )
                            .kineticTouchEffect(
                                pressedScale = 0.95f,
                                onClick = if (!session.isFull && !isBooking) onBookClick else null
                            )
                            .padding(horizontal = 24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        if (isBooking) {
                            CircularProgressIndicator(
                                color = Color.Black,
                                strokeWidth = 2.dp,
                                modifier = Modifier.size(22.dp)
                            )
                        } else {
                            Text(
                                text = if (session.isFull) "MATCH FULL" else if (!isAuthenticated) "SIGN IN TO BOOK" else "BOOK SPOT",
                                color = if (session.isFull) SlateMuted else Color(0xFF0A0C05),
                                style = MaterialTheme.typography.labelLarge,
                                fontWeight = FontWeight.Black
                            )
                        }
                    }
                }
            }
        }
    }
}
