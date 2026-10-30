package uz.pley.app.presentation.sessions

import androidx.compose.foundation.background
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
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import uz.pley.app.core.network.model.ParticipantDto
import uz.pley.app.core.network.model.SessionDetailDto
import uz.pley.app.core.ui.components.PleyImage
import uz.pley.app.core.ui.components.shimmerEffect
import uz.pley.app.core.ui.theme.NeonCyan

private val BrandPrimary = NeonCyan

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun SessionDetailScreen(
    onBack: () -> Unit,
    onNavigateToAuth: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: SessionDetailViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle(minActiveState = Lifecycle.State.STARTED)

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Match Details") },
                navigationIcon = {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier.minimumInteractiveComponentSize()
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back"
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
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
        modifier = modifier
    ) { innerPadding ->
        Surface(
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
                                .height(180.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .shimmerEffect()
                        )
                        Box(
                            modifier = Modifier
                                .width(200.dp)
                                .height(24.dp)
                                .clip(RoundedCornerShape(4.dp))
                                .shimmerEffect()
                        )
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(80.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .shimmerEffect()
                        )
                    }
                }

                is SessionDetailUiState.Error -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = state.message,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodyLarge
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = { viewModel.loadSession() },
                            modifier = Modifier.minimumInteractiveComponentSize()
                        ) {
                            Text("Retry")
                        }
                    }
                }

                is SessionDetailUiState.Success -> {
                    val session = state.session
                    LazyColumn(
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        if (!session.imageUrl.isNullOrBlank()) {
                            item(contentType = "session_cover") {
                                PleyImage(
                                    imageUrl = session.imageUrl,
                                    fallbackText = session.sport.icon,
                                    contentDescription = session.title,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(180.dp)
                                        .clip(RoundedCornerShape(16.dp))
                                )
                            }
                        }

                        if (state.userActionError != null) {
                            item(contentType = "error_banner") {
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = state.userActionError,
                                        color = MaterialTheme.colorScheme.onErrorContainer,
                                        modifier = Modifier.padding(12.dp),
                                        style = MaterialTheme.typography.bodyMedium
                                    )
                                }
                            }
                        }

                        item(contentType = "header_card") {
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = "${session.sport.icon} ${session.sport.name}",
                                            style = MaterialTheme.typography.labelLarge,
                                            color = BrandPrimary
                                        )
                                        Box(
                                            modifier = Modifier
                                                .clip(RoundedCornerShape(6.dp))
                                                .background(BrandPrimary.copy(alpha = 0.2f))
                                                .padding(horizontal = 8.dp, vertical = 4.dp)
                                        ) {
                                            Text(
                                                text = "${session.remainingSlots} spots remaining",
                                                color = BrandPrimary,
                                                style = MaterialTheme.typography.labelSmall,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(8.dp))

                                    Text(
                                        text = session.title,
                                        style = MaterialTheme.typography.headlineMedium,
                                        fontWeight = FontWeight.Bold
                                    )

                                    Spacer(modifier = Modifier.height(12.dp))

                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        DetailBadge(text = session.skillLevel.name.replace("_", " "))
                                        DetailBadge(text = session.sessionVibe.name)
                                        if (session.equipmentProvided) {
                                            DetailBadge(text = "Equipment Provided")
                                        }
                                    }
                                }
                            }
                        }

                        item(contentType = "info_card") {
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(
                                    modifier = Modifier.padding(16.dp),
                                    verticalArrangement = Arrangement.spacedBy(12.dp)
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            imageVector = Icons.Default.Schedule,
                                            contentDescription = null,
                                            tint = BrandPrimary,
                                            modifier = Modifier.size(20.dp)
                                        )
                                        Spacer(modifier = Modifier.width(10.dp))
                                        Column {
                                            Text(
                                                text = session.scheduledAt.take(16).replace("T", " "),
                                                style = MaterialTheme.typography.titleSmall,
                                                fontWeight = FontWeight.Bold
                                            )
                                            Text(
                                                text = "Duration: ${session.durationMinutes} minutes",
                                                style = MaterialTheme.typography.bodySmall,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        }
                                    }

                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            imageVector = Icons.Default.LocationOn,
                                            contentDescription = null,
                                            tint = BrandPrimary,
                                            modifier = Modifier.size(20.dp)
                                        )
                                        Spacer(modifier = Modifier.width(10.dp))
                                        Column {
                                            Text(
                                                text = "${session.venue.district} • ${session.venue.name}",
                                                style = MaterialTheme.typography.titleSmall,
                                                fontWeight = FontWeight.Bold
                                            )
                                            Text(
                                                text = session.venue.address,
                                                style = MaterialTheme.typography.bodySmall,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
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
                                        text = "Venue Amenities",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    FlowRow(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        verticalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        session.venueAmenities.forEach { amenity ->
                                            Box(
                                                modifier = Modifier
                                                    .clip(RoundedCornerShape(8.dp))
                                                    .background(MaterialTheme.colorScheme.surfaceVariant)
                                                    .padding(horizontal = 10.dp, vertical = 6.dp)
                                            ) {
                                                Text(
                                                    text = amenity,
                                                    style = MaterialTheme.typography.labelMedium
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        item(contentType = "players_roster") {
                            Column {
                                Text(
                                    text = "Players (${session.bookedSlots} / ${session.maxSlots})",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.height(10.dp))
                                if (session.participants.isEmpty()) {
                                    Text(
                                        text = "Be the first player to join this match!",
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                } else {
                                    LazyRow(
                                        horizontalArrangement = Arrangement.spacedBy(12.dp)
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
                                Card(
                                    shape = RoundedCornerShape(16.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(modifier = Modifier.padding(16.dp)) {
                                        Text(
                                            text = "Rules & Information",
                                            style = MaterialTheme.typography.titleSmall,
                                            fontWeight = FontWeight.Bold
                                        )
                                        Spacer(modifier = Modifier.height(6.dp))
                                        Text(
                                            text = session.rulesNotes,
                                            style = MaterialTheme.typography.bodyMedium
                                        )
                                    }
                                }
                            }
                        }

                        item {
                            Spacer(modifier = Modifier.height(60.dp))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DetailBadge(text: String) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun ParticipantAvatar(player: ParticipantDto) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.width(64.dp)
    ) {
        if (!player.avatarUrl.isNullOrBlank()) {
            PleyImage(
                imageUrl = player.avatarUrl,
                fallbackText = player.firstName.take(1).uppercase(),
                contentDescription = player.firstName,
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
            )
        } else {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(BrandPrimary.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = player.firstName.take(1).uppercase(),
                    fontWeight = FontWeight.Bold,
                    color = BrandPrimary,
                    fontSize = 18.sp
                )
            }
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = player.firstName,
            style = MaterialTheme.typography.labelSmall,
            maxLines = 1
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

    Surface(
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Total Price",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = "${session.totalPrice.toInt()} UZS",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = BrandPrimary
                )
            }

            if (alreadyBooked) {
                Button(
                    onClick = {},
                    enabled = false,
                    colors = ButtonDefaults.buttonColors(
                        disabledContainerColor = BrandPrimary.copy(alpha = 0.3f),
                        disabledContentColor = Color.White
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.minimumInteractiveComponentSize()
                ) {
                    Icon(imageVector = Icons.Default.Check, contentDescription = null)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Spot Reserved")
                }
            } else {
                Button(
                    onClick = onBookClick,
                    enabled = !isBooking && session.remainingSlots > 0,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = BrandPrimary,
                        contentColor = Color.Black
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.minimumInteractiveComponentSize()
                ) {
                    if (isBooking) {
                        CircularProgressIndicator(
                            color = Color.Black,
                            modifier = Modifier.size(18.dp),
                            strokeWidth = 2.dp
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                    }
                    Text(
                        text = if (!isAuthenticated) "Login to Reserve" else "Reserve Spot",
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}
