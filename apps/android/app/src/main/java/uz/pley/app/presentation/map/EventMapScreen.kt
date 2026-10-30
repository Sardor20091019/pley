package uz.pley.app.presentation.map

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
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
import uz.pley.app.core.network.model.SessionItemDto
import uz.pley.app.core.ui.components.MatchVisualTag
import uz.pley.app.core.ui.components.SessionCapacityMeter
import uz.pley.app.core.ui.components.SportNeonBadge
import uz.pley.app.core.ui.components.glassCard
import uz.pley.app.core.ui.components.kineticTouchEffect
import uz.pley.app.core.ui.components.resolveSportTheme
import uz.pley.app.core.ui.theme.DarkBackground
import uz.pley.app.core.ui.theme.ElectricLime
import uz.pley.app.core.ui.theme.PlatinumSilver
import uz.pley.app.core.ui.theme.PureWhite
import uz.pley.app.core.ui.theme.SlateMuted

private val TashkentCenter = LatLng(41.311081, 69.240562)

private val TashkentDistricts = listOf(
    "All",
    "Mirabad",
    "Yunusabad",
    "Chilanzar",
    "Yakkasaray",
    "Mirzo-Ulugbek",
    "Shaykhontokhur"
)

fun SessionItemDto.toLatLng(): LatLng {
    val venueLat = venue.latitude
    val venueLng = venue.longitude
    if (venueLat != null && venueLng != null && venueLat != 0.0 && venueLng != 0.0) {
        return LatLng(venueLat, venueLng)
    }
    val base = when (venue.district.lowercase().trim()) {
        "mirabad" -> LatLng(41.2918, 69.2736)
        "yunusabad" -> LatLng(41.3645, 69.2872)
        "chilanzar" -> LatLng(41.2721, 69.2044)
        "yakkasaray" -> LatLng(41.2825, 69.2458)
        "mirzo-ulugbek", "mirzo ulugbek" -> LatLng(41.3323, 69.3400)
        "shaykhontokhur" -> LatLng(41.3256, 69.2319)
        else -> TashkentCenter
    }
    val hash = id.hashCode()
    val latOffset = ((hash % 100).toDouble() / 15000.0)
    val lngOffset = (((hash / 100) % 100).toDouble() / 15000.0)
    return LatLng(base.latitude + latOffset, base.longitude + lngOffset)
}

@Composable
fun EventMapScreen(
    onBack: () -> Unit,
    onSessionClick: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: MapViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(TashkentCenter, 12.5f)
    }
    val scope = rememberCoroutineScope()
    val mapProperties = remember {
        MapProperties(
            mapStyleOptions = MapStyleOptions(MapDarkStyle.JSON),
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
                val targetLatLng = targetSession.toLatLng()
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
        GoogleMap(
            modifier = Modifier.fillMaxSize(),
            cameraPositionState = cameraPositionState,
            properties = mapProperties,
            uiSettings = mapUiSettings
        ) {
            uiState.sessions.forEachIndexed { index, session ->
                val isSelected = session.id == uiState.selectedSessionId
                val markerState = rememberMarkerState(
                    key = session.id,
                    position = session.toLatLng()
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
                        .glassCard(shape = RoundedCornerShape(24.dp), borderAlpha = 0.3f)
                        .padding(horizontal = 8.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier
                            .size(38.dp)
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

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Discovery Radar",
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

                    IconButton(
                        onClick = { viewModel.loadSessions() },
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(Color(0x26FFFFFF))
                    ) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Refresh",
                            tint = PureWhite,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    TashkentDistricts.forEach { district ->
                        val isSelected = if (district == "All") {
                            uiState.selectedDistrict == null
                        } else {
                            uiState.selectedDistrict.equals(district, ignoreCase = true)
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(if (isSelected) ElectricLime else Color(0xD910131D))
                                .border(
                                    BorderStroke(
                                        1.dp,
                                        if (isSelected) PureWhite else Color(0x33FFFFFF)
                                    ),
                                    RoundedCornerShape(20.dp)
                                )
                                .kineticTouchEffect(pressedScale = 0.94f) {
                                    val filterValue = if (district == "All") null else district
                                    viewModel.filterByDistrict(filterValue)
                                }
                                .padding(horizontal = 14.dp, vertical = 7.dp)
                        ) {
                            Text(
                                text = district,
                                color = if (isSelected) Color(0xFF0F1117) else PureWhite,
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = if (isSelected) FontWeight.Black else FontWeight.Medium
                            )
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

        if (uiState.sessions.isNotEmpty()) {
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .navigationBarsPadding()
                    .padding(bottom = 76.dp)
            ) {
                HorizontalPager(
                    state = pagerState,
                    contentPadding = PaddingValues(horizontal = 24.dp),
                    pageSpacing = 16.dp,
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
                .clip(RoundedCornerShape(16.dp))
                .background(if (isSelected) theme.primaryColor else Color(0xF010131D))
                .border(
                    BorderStroke(
                        1.5.dp,
                        if (isSelected) PureWhite else theme.borderColor
                    ),
                    RoundedCornerShape(16.dp)
                )
                .padding(horizontal = 10.dp, vertical = 6.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Text(
                    text = session.sport.icon,
                    fontSize = 15.sp
                )
                Text(
                    text = "${session.pricePerSlot.toInt()}k",
                    color = if (isSelected) Color(0xFF0F1117) else theme.primaryColor,
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Black
                )
            }
        }
        Box(
            modifier = Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(if (isSelected) theme.primaryColor else PureWhite)
        )
    }
}

@Composable
private fun MapSessionCarouselCard(
    session: SessionItemDto,
    onClick: () -> Unit
) {
    val theme = resolveSportTheme(session.sport.slug)
    val bookedSlots = (session.maxSlots - session.remainingSlots).coerceAtLeast(0)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .glassCard(
                shape = RoundedCornerShape(24.dp),
                backgroundColor = Color(0xFF141724),
                borderAlpha = 0.28f
            )
            .kineticTouchEffect(pressedScale = 0.96f, onClick = onClick)
            .padding(18.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    SportNeonBadge(
                        icon = session.sport.icon,
                        theme = theme,
                        size = 36.dp
                    )
                    Column {
                        Text(
                            text = session.sport.name.uppercase(),
                            color = theme.primaryColor,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 1.sp
                        )
                        Text(
                            text = session.skillLevel.name.replace("_", " "),
                            color = SlateMuted,
                            style = MaterialTheme.typography.labelSmall
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(theme.containerColor)
                        .border(BorderStroke(0.5.dp, theme.borderColor), RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "${session.remainingSlots} spots left",
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
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MatchVisualTag(
                    text = "${session.venue.name} • ${session.venue.district.uppercase()}",
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
                        text = " UZS / slot",
                        color = SlateMuted,
                        style = MaterialTheme.typography.labelSmall,
                        modifier = Modifier.padding(bottom = 2.dp)
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(
                            brush = Brush.horizontalGradient(
                                colors = listOf(theme.primaryColor, theme.primaryColor.copy(alpha = 0.85f))
                            )
                        )
                        .kineticTouchEffect(onClick = onClick)
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "Join Match",
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
