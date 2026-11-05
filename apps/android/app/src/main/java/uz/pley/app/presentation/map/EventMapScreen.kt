package uz.pley.app.presentation.map

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.FormatListBulleted
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MapStyleOptions
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.MapProperties
import com.google.maps.android.compose.MapUiSettings
import com.google.maps.android.compose.MarkerComposable
import com.google.maps.android.compose.rememberCameraPositionState
import com.google.maps.android.compose.rememberMarkerState
import kotlinx.coroutines.launch
import uz.pley.app.core.network.model.DistrictDto
import uz.pley.app.core.network.model.SessionItemDto
import uz.pley.app.core.ui.components.MatchVisualTag
import uz.pley.app.core.ui.components.PleyEmptyState
import uz.pley.app.core.ui.components.SessionCapacityMeter
import uz.pley.app.core.ui.components.SportNeonBadge
import uz.pley.app.core.ui.components.kineticTouchEffect
import uz.pley.app.core.ui.components.resolveSportTheme
import uz.pley.app.core.ui.theme.DarkBackground
import uz.pley.app.core.ui.theme.DarkCard
import uz.pley.app.core.ui.theme.ElectricLime
import uz.pley.app.core.ui.theme.PlatinumSilver
import uz.pley.app.core.ui.theme.PureWhite
import uz.pley.app.core.ui.theme.SlateMuted
import uz.pley.app.core.ui.theme.StatusRed
import kotlin.math.cos
import kotlin.math.sin

private val TashkentCenter = LatLng(41.311081, 69.240562)

enum class MapDisplayMode {
    MAP,
    RADAR,
    LIST
}

fun SessionItemDto.toLatLng(districts: List<DistrictDto> = emptyList()): LatLng {
    val venueLat = venue.latitude
    val venueLng = venue.longitude
    if (venueLat != null && venueLng != null && venueLat != 0.0 && venueLng != 0.0) {
        return LatLng(venueLat, venueLng)
    }
    val matchedDistrict = districts.firstOrNull {
        it.name.equals(venue.district, ignoreCase = true) ||
        it.slug.equals(venue.district.replace(" ", "-"), ignoreCase = true)
    }
    val base = if (matchedDistrict != null) {
        LatLng(matchedDistrict.lat, matchedDistrict.lng)
    } else {
        TashkentCenter
    }
    val jitterLat = ((id.hashCode() % 100) - 50) * 0.00018
    val jitterLng = (((id.hashCode() / 100) % 100) - 50) * 0.00018
    return LatLng(base.latitude + jitterLat, base.longitude + jitterLng)
}

@Composable
fun EventMapScreen(
    onBack: () -> Unit,
    onSessionClick: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: MapViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    val isGooglePlayServicesAvailable = remember(context) {
        runCatching {
            GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context) == ConnectionResult.SUCCESS
        }.getOrDefault(false)
    }

    var displayMode by remember {
        mutableStateOf(if (isGooglePlayServicesAvailable) MapDisplayMode.MAP else MapDisplayMode.RADAR)
    }
    var isMapLoaded by remember { mutableStateOf(false) }

    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(TashkentCenter, 12.5f)
    }
    val mapProperties = remember {
        MapProperties(
            mapStyleOptions = runCatching { MapStyleOptions(MapDarkStyle.JSON) }.getOrNull(),
            isMyLocationEnabled = false
        )
    }
    val mapUiSettings = remember {
        MapUiSettings(
            zoomControlsEnabled = false,
            myLocationButtonEnabled = false,
            compassEnabled = false,
            mapToolbarEnabled = false
        )
    }

    val sessionsCount = uiState.sessions.size
    val pagerState = rememberPagerState(
        initialPage = 0,
        pageCount = { sessionsCount }
    )

    LaunchedEffect(pagerState) {
        snapshotFlow { pagerState.currentPage }.collect { page ->
            if (page in uiState.sessions.indices) {
                val targetSession = uiState.sessions[page]
                val targetLatLng = targetSession.toLatLng(uiState.districts)
                viewModel.selectSession(targetSession.id)
                scope.launch {
                    cameraPositionState.animate(
                        update = CameraUpdateFactory.newLatLngZoom(targetLatLng, 14.5f),
                        durationMs = 600
                    )
                }
            }
        }
    }

    LaunchedEffect(uiState.selectedSessionId) {
        val selectedId = uiState.selectedSessionId
        if (selectedId != null) {
            val index = uiState.sessions.indexOfFirst { it.id == selectedId }
            if (index != -1 && index != pagerState.currentPage) {
                scope.launch {
                    pagerState.animateScrollToPage(index)
                }
            }
        }
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(DarkBackground)
    ) {
        when (displayMode) {
            MapDisplayMode.MAP -> {
                if (isGooglePlayServicesAvailable) {
                    Box(modifier = Modifier.fillMaxSize()) {
                        GoogleMap(
                            modifier = Modifier.fillMaxSize(),
                            cameraPositionState = cameraPositionState,
                            properties = mapProperties,
                            uiSettings = mapUiSettings,
                            onMapLoaded = { isMapLoaded = true }
                        ) {
                            uiState.sessions.forEachIndexed { index, session ->
                                val isSelected = session.id == uiState.selectedSessionId
                                val markerState = rememberMarkerState(
                                    key = session.id,
                                    position = session.toLatLng(uiState.districts)
                                )

                                MarkerComposable(
                                    state = markerState,
                                    zIndex = if (isSelected) 10f else 1f,
                                    onClick = {
                                        scope.launch {
                                            pagerState.animateScrollToPage(index)
                                        }
                                        true
                                    }
                                ) {
                                    MapMarkerBadge(
                                        session = session,
                                        isSelected = isSelected
                                    )
                                }
                            }
                        }

                        if (!isMapLoaded) {
                            Box(
                                modifier = Modifier
                                    .align(Alignment.Center)
                                    .padding(horizontal = 24.dp)
                                    .clip(RoundedCornerShape(16.dp))
                                    .background(Color(0xE6141824))
                                    .border(BorderStroke(1.dp, Color(0x33FFFFFF)), RoundedCornerShape(16.dp))
                                    .padding(horizontal = 16.dp, vertical = 12.dp)
                            ) {
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        CircularProgressIndicator(
                                            color = ElectricLime,
                                            strokeWidth = 2.dp,
                                            modifier = Modifier.size(16.dp)
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = "Connecting to Google Maps...",
                                            color = PureWhite,
                                            style = MaterialTheme.typography.labelSmall,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                    Text(
                                        text = "If tiles appear grey, Google Cloud requires billing enabled. Tap below to use interactive Radar mode.",
                                        color = PlatinumSilver,
                                        style = MaterialTheme.typography.bodySmall,
                                        fontSize = 11.sp
                                    )
                                    Button(
                                        onClick = { displayMode = MapDisplayMode.RADAR },
                                        colors = ButtonDefaults.buttonColors(containerColor = ElectricLime),
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier.height(34.dp),
                                        contentPadding = PaddingValues(horizontal = 14.dp)
                                    ) {
                                        Text(
                                            text = "Switch to Radar Mode 📡",
                                            color = Color(0xFF0F1117),
                                            style = MaterialTheme.typography.labelSmall,
                                            fontWeight = FontWeight.Black
                                        )
                                    }
                                }
                            }
                        }
                    }
                } else {
                    DiscoveryRadarCanvas(
                        sessions = uiState.sessions,
                        districts = uiState.districts,
                        selectedSessionId = uiState.selectedSessionId,
                        onBlipClick = { session, index ->
                            viewModel.selectSession(session.id)
                            scope.launch {
                                pagerState.animateScrollToPage(index)
                            }
                        },
                        modifier = Modifier.fillMaxSize()
                    )
                }
            }

            MapDisplayMode.RADAR -> {
                DiscoveryRadarCanvas(
                    sessions = uiState.sessions,
                    districts = uiState.districts,
                    selectedSessionId = uiState.selectedSessionId,
                    onBlipClick = { session, index ->
                        viewModel.selectSession(session.id)
                        scope.launch {
                            pagerState.animateScrollToPage(index)
                        }
                    },
                    modifier = Modifier.fillMaxSize()
                )
            }

            MapDisplayMode.LIST -> {
                if (uiState.sessions.isEmpty() && !uiState.isLoading) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(top = 220.dp, start = 20.dp, end = 20.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        PleyEmptyState(
                            title = "No Venues In District",
                            description = "No active matches scheduled in this district right now. Try switching to 'All'.",
                            iconEmoji = "📍",
                            actionLabel = "Show All Districts",
                            onActionClick = { viewModel.filterByDistrict(null) }
                        )
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(top = 215.dp),
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        items(uiState.sessions, key = { it.id }) { session ->
                            MapSessionCarouselCard(
                                session = session,
                                onClick = { onSessionClick(session.id) }
                            )
                        }
                        item {
                            Spacer(modifier = Modifier.height(30.dp))
                        }
                    }
                }
            }
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(24.dp))
                        .background(
                            brush = Brush.verticalGradient(
                                colors = listOf(
                                    Color(0xFF161A28),
                                    Color(0xFF0F121C)
                                )
                            )
                        )
                        .border(BorderStroke(1.dp, Color(0x33FFFFFF)), RoundedCornerShape(24.dp))
                        .padding(horizontal = 8.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        IconButton(
                            onClick = onBack,
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(Color(0x26FFFFFF))
                        ) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                contentDescription = "Back",
                                tint = PureWhite,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = when (displayMode) {
                                MapDisplayMode.MAP -> "Google Maps View"
                                MapDisplayMode.RADAR -> "Discovery Radar"
                                MapDisplayMode.LIST -> "Venue Roster"
                            },
                            color = PureWhite,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Black
                        )
                        Text(
                            text = "${uiState.sessions.size} venues live in Tashkent",
                            color = ElectricLime,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        IconButton(
                            onClick = { viewModel.loadSessions() },
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(Color(0x26FFFFFF))
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Refresh",
                                tint = PureWhite,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xE6121520))
                        .border(BorderStroke(1.dp, Color(0x28FFFFFF)), RoundedCornerShape(16.dp))
                        .padding(4.dp),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    ModeSegmentPill(
                        label = "Map",
                        icon = Icons.Default.Map,
                        isSelected = displayMode == MapDisplayMode.MAP,
                        onClick = { displayMode = MapDisplayMode.MAP },
                        modifier = Modifier.weight(1f)
                    )
                    ModeSegmentPill(
                        label = "Radar",
                        icon = Icons.Default.Explore,
                        isSelected = displayMode == MapDisplayMode.RADAR,
                        onClick = { displayMode = MapDisplayMode.RADAR },
                        modifier = Modifier.weight(1f)
                    )
                    ModeSegmentPill(
                        label = "List",
                        icon = Icons.AutoMirrored.Filled.FormatListBulleted,
                        isSelected = displayMode == MapDisplayMode.LIST,
                        onClick = { displayMode = MapDisplayMode.LIST },
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val isAllSelected = uiState.selectedDistrict == null
                    Box(
                        modifier = Modifier
                            .height(48.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(
                                if (isAllSelected) {
                                    Brush.horizontalGradient(
                                        colors = listOf(
                                            ElectricLime,
                                            Color(0xFFC4F22A)
                                        )
                                    )
                                } else {
                                    Brush.verticalGradient(
                                        colors = listOf(
                                            Color(0xEB1E2333),
                                            Color(0xEB131622)
                                        )
                                    )
                                }
                            )
                            .border(
                                BorderStroke(
                                    1.dp,
                                    if (isAllSelected) ElectricLime else Color(0x33FFFFFF)
                                ),
                                RoundedCornerShape(14.dp)
                            )
                            .kineticTouchEffect(pressedScale = 0.94f) {
                                viewModel.filterByDistrict(null)
                            }
                            .padding(horizontal = 16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(
                                text = "📍",
                                fontSize = 12.sp
                            )
                            Text(
                                text = "All",
                                color = if (isAllSelected) Color(0xFF0F1117) else PureWhite,
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = if (isAllSelected) FontWeight.Black else FontWeight.Bold
                            )
                        }
                    }

                    uiState.districts.forEach { district ->
                        val isSelected = uiState.selectedDistrict.equals(district.name, ignoreCase = true) ||
                                uiState.selectedDistrict.equals(district.slug, ignoreCase = true)

                        Box(
                            modifier = Modifier
                                .height(48.dp)
                                .clip(RoundedCornerShape(14.dp))
                                .background(
                                    if (isSelected) {
                                        Brush.horizontalGradient(
                                            colors = listOf(
                                                ElectricLime,
                                                Color(0xFFBCE824)
                                            )
                                        )
                                    } else {
                                        Brush.verticalGradient(
                                            colors = listOf(
                                                Color(0xEB1E2333),
                                                Color(0xEB131622)
                                            )
                                        )
                                    }
                                )
                                .border(
                                    BorderStroke(
                                        1.dp,
                                        if (isSelected) ElectricLime else Color(0x33FFFFFF)
                                    ),
                                    RoundedCornerShape(14.dp)
                                )
                                .kineticTouchEffect(pressedScale = 0.94f) {
                                    val filterValue = if (isSelected) null else district.name
                                    viewModel.filterByDistrict(filterValue)
                                }
                                .padding(horizontal = 15.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                if (isSelected) {
                                    Box(
                                        modifier = Modifier
                                            .size(6.dp)
                                            .clip(CircleShape)
                                            .background(Color(0xFF0F1117))
                                    )
                                }
                                Text(
                                    text = district.name,
                                    color = if (isSelected) Color(0xFF0F1117) else PureWhite,
                                    style = MaterialTheme.typography.labelMedium,
                                    fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold
                                )
                            }
                        }
                    }
                }

                AnimatedVisibility(
                    visible = uiState.errorMessage != null,
                    enter = slideInVertically() + fadeIn(),
                    exit = slideOutVertically() + fadeOut()
                ) {
                    val errorMsg = uiState.errorMessage.orEmpty()
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color(0xFA200B0B))
                            .border(BorderStroke(1.dp, StatusRed.copy(alpha = 0.7f)), RoundedCornerShape(16.dp))
                            .padding(horizontal = 14.dp, vertical = 10.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.WifiOff,
                                    contentDescription = null,
                                    tint = StatusRed,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = errorMsg,
                                    color = PureWhite,
                                    style = MaterialTheme.typography.labelSmall,
                                    maxLines = 2,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Button(
                                onClick = { viewModel.loadSessions() },
                                colors = ButtonDefaults.buttonColors(containerColor = StatusRed),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.height(34.dp),
                                contentPadding = PaddingValues(horizontal = 10.dp)
                            ) {
                                Text(
                                    text = "Retry",
                                    color = PureWhite,
                                    style = MaterialTheme.typography.labelSmall,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            IconButton(
                                onClick = { viewModel.clearErrorMessage() },
                                modifier = Modifier.size(34.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Close,
                                    contentDescription = "Dismiss",
                                    tint = PlatinumSilver,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }
            }
        }

        if (uiState.isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0x66000000)),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(
                    color = ElectricLime,
                    strokeWidth = 3.dp,
                    modifier = Modifier.size(44.dp)
                )
            }
        }

        if (displayMode != MapDisplayMode.LIST && uiState.sessions.isNotEmpty()) {
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .navigationBarsPadding()
                    .padding(bottom = 16.dp)
            ) {
                HorizontalPager(
                    state = pagerState,
                    contentPadding = PaddingValues(horizontal = 20.dp),
                    pageSpacing = 14.dp,
                    modifier = Modifier.fillMaxWidth()
                ) { page ->
                    val session = uiState.sessions[page]
                    MapSessionCarouselCard(
                        session = session,
                        onClick = { onSessionClick(session.id) }
                    )
                }
            }
        }
    }
}

@Composable
private fun ModeSegmentPill(
    label: String,
    icon: ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .height(42.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(if (isSelected) ElectricLime else Color.Transparent)
            .kineticTouchEffect(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (isSelected) Color(0xFF0F1117) else PlatinumSilver,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = label,
                color = if (isSelected) Color(0xFF0F1117) else PlatinumSilver,
                style = MaterialTheme.typography.labelSmall,
                fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold
            )
        }
    }
}

@Composable
private fun DiscoveryRadarCanvas(
    sessions: List<SessionItemDto>,
    districts: List<DistrictDto> = emptyList(),
    selectedSessionId: String?,
    onBlipClick: (SessionItemDto, Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "radar_sweep")
    val sweepAngle by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 4000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "sweep_angle"
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF090C14))
            .pointerInput(sessions) {
                detectTapGestures { tapOffset ->
                    val centerX = size.width / 2f
                    val centerY = size.height / 2f
                    val maxRadius = minOf(size.width, size.height) * 0.42f

                    sessions.forEachIndexed { index, session ->
                        val latLng = session.toLatLng(districts)
                        val dLat = (latLng.latitude - TashkentCenter.latitude) / 0.12f
                        val dLng = (latLng.longitude - TashkentCenter.longitude) / 0.12f
                        val blipX = centerX + (dLng.toFloat() * maxRadius)
                        val blipY = centerY - (dLat.toFloat() * maxRadius)

                        val distance = kotlin.math.hypot(tapOffset.x - blipX, tapOffset.y - blipY)
                        if (distance <= 36.dp.toPx()) {
                            onBlipClick(session, index)
                            return@detectTapGestures
                        }
                    }
                }
            }
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val centerX = size.width / 2f
            val centerY = size.height / 2f
            val maxRadius = minOf(size.width, size.height) * 0.42f

            val ringFractions = listOf(0.25f, 0.50f, 0.75f, 1.0f)
            ringFractions.forEach { frac ->
                drawCircle(
                    color = Color(0x24D4FF00),
                    radius = maxRadius * frac,
                    center = Offset(centerX, centerY),
                    style = Stroke(width = 1.2f)
                )
            }

            drawLine(
                color = Color(0x1AD4FF00),
                start = Offset(centerX - maxRadius, centerY),
                end = Offset(centerX + maxRadius, centerY),
                strokeWidth = 1f
            )
            drawLine(
                color = Color(0x1AD4FF00),
                start = Offset(centerX, centerY - maxRadius),
                end = Offset(centerX, centerY + maxRadius),
                strokeWidth = 1f
            )

            val sweepRad = Math.toRadians(sweepAngle.toDouble())
            val lineEndX = centerX + (maxRadius * cos(sweepRad)).toFloat()
            val lineEndY = centerY + (maxRadius * sin(sweepRad)).toFloat()
            drawLine(
                brush = Brush.radialGradient(
                    colors = listOf(ElectricLime.copy(alpha = 0.5f), Color.Transparent),
                    center = Offset(centerX, centerY),
                    radius = maxRadius
                ),
                start = Offset(centerX, centerY),
                end = Offset(lineEndX, lineEndY),
                strokeWidth = 2.5f
            )

            drawCircle(
                color = ElectricLime,
                radius = 4.dp.toPx(),
                center = Offset(centerX, centerY)
            )

            sessions.forEach { session ->
                val isSelected = session.id == selectedSessionId
                val theme = resolveSportTheme(session.sport.slug)
                val latLng = session.toLatLng(districts)
                val dLat = (latLng.latitude - TashkentCenter.latitude) / 0.12f
                val dLng = (latLng.longitude - TashkentCenter.longitude) / 0.12f

                val blipX = (centerX + (dLng.toFloat() * maxRadius)).coerceIn(24f, size.width - 24f)
                val blipY = (centerY - (dLat.toFloat() * maxRadius)).coerceIn(24f, size.height - 24f)

                if (isSelected) {
                    drawCircle(
                        color = theme.primaryColor.copy(alpha = 0.35f),
                        radius = 20.dp.toPx(),
                        center = Offset(blipX, blipY)
                    )
                    drawCircle(
                        color = PureWhite,
                        radius = 12.dp.toPx(),
                        center = Offset(blipX, blipY),
                        style = Stroke(width = 2.dp.toPx())
                    )
                }

                drawCircle(
                    color = if (isSelected) PureWhite else theme.primaryColor,
                    radius = if (isSelected) 8.dp.toPx() else 6.dp.toPx(),
                    center = Offset(blipX, blipY)
                )
            }
        }
    }
}

@Composable
private fun MapMarkerBadge(
    session: SessionItemDto,
    isSelected: Boolean
) {
    val theme = resolveSportTheme(session.sport.slug)
    val scale by animateFloatAsState(
        targetValue = if (isSelected) 1.15f else 1.0f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioLowBouncy,
            stiffness = Spring.StiffnessMediumLow
        ),
        label = "marker_scale"
    )

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.graphicsLayer {
            scaleX = scale
            scaleY = scale
        }
    ) {
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(14.dp))
                .background(
                    if (isSelected) theme.primaryColor else Color(0xEB131724)
                )
                .border(
                    BorderStroke(
                        1.5.dp,
                        if (isSelected) PureWhite else theme.borderColor
                    ),
                    RoundedCornerShape(14.dp)
                )
                .padding(horizontal = 10.dp, vertical = 6.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(text = session.sport.icon, fontSize = 16.sp)
                Text(
                    text = "${session.pricePerSlot.toInt() / 1000}k",
                    color = if (isSelected) Color(0xFF0F1117) else PureWhite,
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Black
                )
            }
        }

        Box(
            modifier = Modifier
                .size(width = 8.dp, height = 4.dp)
                .clip(RoundedCornerShape(2.dp))
                .background(if (isSelected) theme.primaryColor else Color(0xCC131724))
        )
    }
}

@Composable
fun MapSessionCarouselCard(
    session: SessionItemDto,
    onClick: () -> Unit
) {
    val theme = resolveSportTheme(session.sport.slug)
    val bookedSlots = (session.maxSlots - session.remainingSlots).coerceAtLeast(0)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(22.dp))
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF161B28),
                        Color(0xFF0F121C)
                    )
                )
            )
            .border(BorderStroke(1.dp, Color(0x33FFFFFF)), RoundedCornerShape(22.dp))
            .padding(16.dp)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    SportNeonBadge(
                        icon = session.sport.icon,
                        theme = theme,
                        size = 34.dp
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = session.sport.name.uppercase(),
                            color = theme.primaryColor,
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Black)
                        )
                        Text(
                            text = session.venue.district.uppercase(),
                            color = SlateMuted,
                            style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp)
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0x1AD4FF00))
                        .border(BorderStroke(1.dp, Color(0x33D4FF00)), RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = session.skillLevel.name.replace("_", " "),
                        color = theme.primaryColor,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Text(
                text = session.title,
                color = PureWhite,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                MatchVisualTag(
                    text = "${session.venue.name} • ${session.venue.district}",
                    icon = Icons.Default.LocationOn
                )
                MatchVisualTag(
                    text = "${session.durationMinutes}m",
                    icon = Icons.Default.AccessTime
                )
            }

            SessionCapacityMeter(
                bookedSlots = bookedSlots,
                maxSlots = session.maxSlots,
                accentColor = theme.primaryColor
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(
                        text = "${session.pricePerSlot.toInt()}",
                        color = PureWhite,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Black
                    )
                    Text(
                        text = " UZS",
                        color = SlateMuted,
                        style = MaterialTheme.typography.labelSmall,
                        modifier = Modifier.padding(bottom = 2.dp)
                    )
                }

                Box(
                    modifier = Modifier
                        .height(48.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(
                            brush = Brush.horizontalGradient(
                                colors = listOf(theme.primaryColor, theme.primaryColor.copy(alpha = 0.85f))
                            )
                        )
                        .kineticTouchEffect(onClick = onClick)
                        .padding(horizontal = 18.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "VIEW MATCH",
                        color = Color(0xFF0F1117),
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Black
                    )
                }
            }
        }
    }
}

@Composable
fun EventDiscoveryMapScreen(
    onBack: () -> Unit,
    onSessionClick: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: MapViewModel = hiltViewModel()
) {
    EventMapScreen(
        onBack = onBack,
        onSessionClick = onSessionClick,
        modifier = modifier,
        viewModel = viewModel
    )
}
