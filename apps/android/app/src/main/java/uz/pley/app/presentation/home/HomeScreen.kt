package uz.pley.app.presentation.home

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.spring
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.material3.ripple
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
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import uz.pley.app.core.network.model.SessionItemDto
import uz.pley.app.core.network.model.SportDto
import uz.pley.app.core.ui.components.LivePulseRadarBadge
import uz.pley.app.core.ui.components.MatchVisualTag
import uz.pley.app.core.ui.components.PleyImage
import uz.pley.app.core.ui.components.SessionCapacityMeter
import uz.pley.app.core.ui.components.SessionCardSkeleton
import uz.pley.app.core.ui.components.SportNeonBadge
import uz.pley.app.core.ui.components.carbonCard
import uz.pley.app.core.ui.components.glassCard
import uz.pley.app.core.ui.components.kineticTouchEffect
import uz.pley.app.core.ui.components.resolveSportTheme
import uz.pley.app.core.ui.theme.DarkCard
import uz.pley.app.core.ui.theme.DarkSurface
import uz.pley.app.core.ui.theme.DarkSurfaceElevated
import uz.pley.app.core.ui.theme.ElectricLime
import uz.pley.app.core.ui.theme.PlatinumSilver
import uz.pley.app.core.ui.theme.PureWhite
import uz.pley.app.core.ui.theme.SlateMuted
import uz.pley.app.core.ui.theme.StatusAmber

private val CarbonHeroShape = RoundedCornerShape(26.dp)
private val CarbonCardShape = RoundedCornerShape(24.dp)
private val SportPillShape = RoundedCornerShape(16.dp)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToDiscover: () -> Unit,
    onSessionClick: (String) -> Unit,
    onNavigateToMap: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: HomeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(38.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(
                                    brush = Brush.linearGradient(
                                        colors = listOf(ElectricLime, Color(0xFF00E676))
                                    )
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "P",
                                color = Color.Black,
                                fontWeight = FontWeight.Black,
                                fontSize = 22.sp
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "PLEY",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Black,
                                color = PureWhite,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = "TASHKENT RECREATIONAL",
                                style = MaterialTheme.typography.labelSmall,
                                color = SlateMuted
                            )
                        }
                    }
                },
                actions = {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(Color(0x26D4FF00))
                            .border(BorderStroke(1.dp, Color(0x66D4FF00)), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        IconButton(
                            onClick = onNavigateToMap,
                            modifier = Modifier.size(36.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Map,
                                contentDescription = "Discovery Map Radar",
                                tint = ElectricLime,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(DarkCard)
                            .border(BorderStroke(1.dp, Color(0x22FFFFFF)), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        IconButton(
                            onClick = { viewModel.loadData() },
                            modifier = Modifier.size(36.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Refresh",
                                tint = PlatinumSilver,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(16.dp))
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
                is HomeUiState.Loading -> {
                    LazyColumn(
                        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(190.dp)
                                    .carbonCard(shape = CarbonHeroShape)
                            )
                        }
                        items(4) {
                            SessionCardSkeleton()
                        }
                    }
                }

                is HomeUiState.Error -> {
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
                                .glassCard(shape = RoundedCornerShape(26.dp))
                                .padding(28.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .clip(CircleShape)
                                            .background(StatusAmber)
                                    )
                                    Text(
                                        text = "SYNC PAUSED • OFFLINE RESILIENT",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = StatusAmber
                                    )
                                }

                                Text(
                                    text = state.message,
                                    color = PureWhite,
                                    style = MaterialTheme.typography.bodyMedium
                                )

                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(14.dp))
                                        .background(ElectricLime)
                                        .kineticTouchEffect(onClick = { viewModel.loadData() })
                                        .padding(horizontal = 24.dp, vertical = 12.dp)
                                ) {
                                    Text(
                                        text = "Tap to Reconnect",
                                        color = Color(0xFF0F1117),
                                        style = MaterialTheme.typography.labelLarge,
                                        fontWeight = FontWeight.Black
                                    )
                                }
                            }
                        }
                    }
                }

                is HomeUiState.Success -> {
                    val pullState = rememberPullToRefreshState()
                    PullToRefreshBox(
                        isRefreshing = state.isRefreshing,
                        onRefresh = { viewModel.loadData() },
                        state = pullState,
                        modifier = Modifier.fillMaxSize()
                    ) {
                        LazyColumn(
                            contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp),
                            verticalArrangement = Arrangement.spacedBy(20.dp),
                            modifier = Modifier.fillMaxSize()
                        ) {
                            item(contentType = "hero_banner") {
                                HeroSection(onFindMatchClick = onNavigateToDiscover)
                            }

                            if (state.sports.isNotEmpty()) {
                                item(contentType = "sports_row") {
                                    SportsRow(sports = state.sports)
                                }
                            }

                            item(contentType = "section_header") {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.Bottom
                                ) {
                                    Column {
                                        Text(
                                            text = "CURATED FIXTURES",
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                letterSpacing = 1.2.sp
                                            ),
                                            color = ElectricLime
                                        )
                                        Spacer(modifier = Modifier.height(2.dp))
                                        Text(
                                            text = "Open Pickups",
                                            style = MaterialTheme.typography.displaySmall,
                                            color = PureWhite
                                        )
                                    }
                                    Text(
                                        text = "EXPLORE ALL →",
                                        style = MaterialTheme.typography.labelMedium.copy(
                                            fontWeight = FontWeight.Bold,
                                            letterSpacing = 0.5.sp
                                        ),
                                        color = ElectricLime,
                                        modifier = Modifier
                                            .clickable(
                                                interactionSource = remember { MutableInteractionSource() },
                                                indication = ripple(bounded = false),
                                                onClick = onNavigateToDiscover
                                            )
                                            .padding(bottom = 4.dp)
                                    )
                                }
                            }

                            if (state.featuredSessions.isEmpty()) {
                                item(contentType = "empty_fixtures") {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .carbonCard(shape = CarbonCardShape)
                                            .padding(36.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "No open matches on the roster today.",
                                            style = MaterialTheme.typography.bodyMedium,
                                            color = SlateMuted
                                        )
                                    }
                                }
                            } else {
                                items(
                                    items = state.featuredSessions,
                                    key = { it.id },
                                    contentType = { "session_card" }
                                ) { session ->
                                    EditorialSessionCard(
                                        session = session,
                                        onClick = { onSessionClick(session.id) }
                                    )
                                }
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

@Composable
fun HeroSection(
    onFindMatchClick: () -> Unit
) {
    val pagerState = rememberPagerState(pageCount = { 2 })

    Column {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier
                .fillMaxWidth()
                .clip(CarbonHeroShape)
        ) { page ->
            if (page == 0) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .glassCard(shape = CarbonHeroShape, borderAlpha = 0.32f)
                        .padding(22.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            LivePulseRadarBadge(label = "TASHKENT RADAR • LIVE")
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(DarkSurfaceElevated)
                                    .border(BorderStroke(0.5.dp, Color(0x33FFFFFF)), RoundedCornerShape(8.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "38+ MATCHES",
                                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                    color = ElectricLime
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = "Play Without\nthe Friction.",
                            style = MaterialTheme.typography.displayLarge,
                            color = PureWhite
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "Reserve individual spots in vetted casual matches across Tashkent. No squad coordination needed.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = PlatinumSilver
                        )

                        Spacer(modifier = Modifier.height(18.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .kineticTouchEffect(onClick = onFindMatchClick)
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(
                                        brush = Brush.horizontalGradient(
                                            colors = listOf(ElectricLime, Color(0xFF00E676))
                                        )
                                    )
                                    .padding(horizontal = 20.dp, vertical = 12.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = "DISCOVER GAMES",
                                        style = MaterialTheme.typography.labelLarge,
                                        fontWeight = FontWeight.Black,
                                        color = Color.Black
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Icon(
                                        imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                                        contentDescription = null,
                                        tint = Color.Black,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }

                            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                MatchVisualTag(text = "6 Districts", icon = Icons.Default.LocationOn)
                            }
                        }
                    }
                }
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .glassCard(shape = CarbonHeroShape, borderAlpha = 0.32f)
                        .padding(22.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(StatusAmber)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "SKILL TIERS • BALANCED COMPETITION",
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                color = StatusAmber
                            )
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = "Matched by\nSkill Level.",
                            style = MaterialTheme.typography.displayLarge,
                            color = PureWhite
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "From relaxed weekend social rallies to competitive community tournaments with verified rosters.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = PlatinumSilver
                        )

                        Spacer(modifier = Modifier.height(18.dp))

                        Box(
                            modifier = Modifier
                                .kineticTouchEffect(onClick = onFindMatchClick)
                                .clip(RoundedCornerShape(14.dp))
                                .background(DarkSurfaceElevated)
                                .border(BorderStroke(1.dp, Color(0x33FFFFFF)), RoundedCornerShape(14.dp))
                                .padding(horizontal = 20.dp, vertical = 12.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "VIEW SKILL BRACKETS",
                                    style = MaterialTheme.typography.labelLarge,
                                    fontWeight = FontWeight.Bold,
                                    color = PureWhite
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                                    contentDescription = null,
                                    tint = PureWhite,
                                    modifier = Modifier.size(15.dp)
                                )
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {
            repeat(2) { index ->
                val isSelected = pagerState.currentPage == index
                val width by animateDpAsState(
                    targetValue = if (isSelected) 24.dp else 6.dp,
                    animationSpec = spring(
                        dampingRatio = Spring.DampingRatioLowBouncy,
                        stiffness = Spring.StiffnessLow
                    ),
                    label = "pager_indicator"
                )
                Box(
                    modifier = Modifier
                        .padding(horizontal = 3.dp)
                        .size(width = width, height = 4.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(if (isSelected) ElectricLime else Color(0x33FFFFFF))
                )
            }
        }
    }
}

@Composable
fun SportsRow(
    sports: List<SportDto>
) {
    Column {
        Text(
            text = "DISCIPLINES",
            style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 1.sp),
            color = SlateMuted
        )
        Spacer(modifier = Modifier.height(10.dp))
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(
                items = sports,
                key = { it.id },
                contentType = { "sport_pill" }
            ) { sport ->
                val theme = resolveSportTheme(sport.slug)
                Box(
                    modifier = Modifier
                        .kineticTouchEffect(pressedScale = 0.94f)
                        .clip(SportPillShape)
                        .background(
                            brush = Brush.verticalGradient(
                                colors = listOf(
                                    theme.containerColor.copy(alpha = 0.28f),
                                    DarkCard
                                )
                            )
                        )
                        .border(
                            BorderStroke(1.dp, theme.borderColor.copy(alpha = 0.5f)),
                            SportPillShape
                        )
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = sport.icon, fontSize = 16.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = sport.name.uppercase(),
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                            color = PureWhite
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun EditorialSessionCard(
    session: SessionItemDto,
    onClick: () -> Unit
) {
    val theme = resolveSportTheme(session.sport.slug)
    val bookedSlots = (session.maxSlots - session.remainingSlots).coerceAtLeast(0)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .glassCard(shape = CarbonCardShape, borderAlpha = 0.25f)
            .kineticTouchEffect(pressedScale = 0.96f, onClick = onClick)
            .padding(20.dp)
    ) {
        Column {
            if (!session.imageUrl.isNullOrBlank()) {
                PleyImage(
                    imageUrl = session.imageUrl,
                    fallbackText = session.sport.icon,
                    contentDescription = session.title,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(160.dp)
                        .clip(RoundedCornerShape(16.dp))
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    SportNeonBadge(
                        icon = session.sport.icon,
                        theme = theme,
                        size = 36.dp
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = session.sport.name.uppercase(),
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Black,
                                letterSpacing = 1.sp
                            ),
                            color = theme.primaryColor
                        )
                        Text(
                            text = theme.disciplineTag,
                            style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp),
                            color = SlateMuted
                        )
                    }
                }

                MatchVisualTag(
                    text = session.skillLevel.name.replace("_", " "),
                    icon = Icons.Default.Star,
                    tint = PlatinumSilver
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = session.title,
                style = MaterialTheme.typography.headlineLarge,
                color = PureWhite,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                MatchVisualTag(
                    text = session.scheduledAt.take(16).replace("T", " • "),
                    icon = Icons.Default.CalendarMonth
                )
                MatchVisualTag(
                    text = "${session.durationMinutes}m",
                    icon = Icons.Default.Schedule
                )
                MatchVisualTag(
                    text = session.venue.district.uppercase(),
                    icon = Icons.Default.LocationOn,
                    tint = theme.primaryColor
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = session.venue.name,
                style = MaterialTheme.typography.bodySmall,
                color = SlateMuted,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(14.dp))

            SessionCapacityMeter(
                bookedSlots = bookedSlots,
                maxSlots = session.maxSlots,
                accentColor = theme.primaryColor
            )

            Spacer(modifier = Modifier.height(16.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(Color(0x1AFFFFFF))
            )

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(
                        text = "${session.pricePerSlot.toInt()}",
                        style = MaterialTheme.typography.displayMedium,
                        fontWeight = FontWeight.Black,
                        color = PureWhite
                    )
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = "UZS / spot",
                        style = MaterialTheme.typography.labelSmall,
                        color = PlatinumSilver,
                        modifier = Modifier.padding(bottom = 3.dp)
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(theme.containerColor)
                        .border(BorderStroke(1.dp, theme.borderColor), RoundedCornerShape(12.dp))
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "VIEW FIXTURE →",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.5.sp
                        ),
                        color = theme.primaryColor
                    )
                }
            }
        }
    }
}

@Composable
fun HomeSessionCard(
    session: SessionItemDto,
    onClick: () -> Unit
) {
    EditorialSessionCard(
        session = session,
        onClick = onClick
    )
}

@Composable
fun ArchitecturalSportsRow(sports: List<SportDto>) {
    SportsRow(sports = sports)
}

@Composable
fun EditorialHeroSection(onFindMatchClick: () -> Unit) {
    HeroSection(onFindMatchClick = onFindMatchClick)
}
