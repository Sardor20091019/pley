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
import uz.pley.app.core.ui.components.MatchVisualTag
import uz.pley.app.core.ui.components.PleyEmptyState
import uz.pley.app.core.ui.components.PleyImage
import uz.pley.app.core.ui.components.SessionCapacityMeter
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
import uz.pley.app.core.ui.theme.StatusAmber

private val ModernCardShape = RoundedCornerShape(24.dp)
private val SportChipShape = RoundedCornerShape(16.dp)

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
                                .size(42.dp)
                                .clip(RoundedCornerShape(13.dp))
                                .background(
                                    brush = Brush.linearGradient(
                                        colors = listOf(ElectricLime, Color(0xFF10B981))
                                    )
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "P",
                                color = Color(0xFF0B0E14),
                                fontWeight = FontWeight.Black,
                                fontSize = 24.sp
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "PLEY",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Black,
                                color = PureWhite,
                                letterSpacing = 1.2.sp
                            )
                            Text(
                                text = "Tashkent Sports Hub",
                                style = MaterialTheme.typography.labelSmall,
                                color = SlateMuted
                            )
                        }
                    }
                },
                actions = {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        IconButton(
                            onClick = onNavigateToMap,
                            modifier = Modifier
                                .size(44.dp)
                                .background(Color(0x1FC8F526), CircleShape)
                                .border(BorderStroke(1.dp, Color(0x40C8F526)), CircleShape)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Map,
                                contentDescription = "Discovery Map Radar",
                                tint = ElectricLime,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        IconButton(
                            onClick = { viewModel.loadData() },
                            modifier = Modifier
                                .size(44.dp)
                                .background(DarkCard, CircleShape)
                                .border(BorderStroke(1.dp, Color(0x28FFFFFF)), CircleShape)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Refresh",
                                tint = PlatinumSilver,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(10.dp))
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
                        contentPadding = PaddingValues(horizontal = 18.dp, vertical = 10.dp),
                        verticalArrangement = Arrangement.spacedBy(18.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(180.dp)
                                    .clip(ModernCardShape)
                                    .background(DarkCard)
                            )
                        }
                        items(3) {
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
                        PleyEmptyState(
                            title = "Connection Paused",
                            description = state.message,
                            iconEmoji = "📡",
                            actionLabel = "Tap to Reconnect",
                            onActionClick = { viewModel.loadData() }
                        )
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
                            contentPadding = PaddingValues(horizontal = 18.dp, vertical = 10.dp),
                            verticalArrangement = Arrangement.spacedBy(20.dp),
                            modifier = Modifier.fillMaxSize()
                        ) {
                            item(contentType = "hero_banner") {
                                HeroSection(onFindMatchClick = onNavigateToDiscover)
                            }

                            if (state.sports.isNotEmpty()) {
                                item(contentType = "sports_row") {
                                    SportsRow(
                                        sports = state.sports,
                                        onSportClick = { onNavigateToDiscover() }
                                    )
                                }
                            }

                            item(contentType = "section_header") {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 4.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(
                                            text = "UPCOMING MATCHES",
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                letterSpacing = 1.sp,
                                                fontWeight = FontWeight.Bold
                                            ),
                                            color = ElectricLime
                                        )
                                        Spacer(modifier = Modifier.height(2.dp))
                                        Text(
                                            text = "Open Rallies & Pickups",
                                            style = MaterialTheme.typography.headlineMedium,
                                            fontWeight = FontWeight.Bold,
                                            color = PureWhite
                                        )
                                    }
                                    Box(
                                        modifier = Modifier
                                            .height(48.dp)
                                            .clip(RoundedCornerShape(12.dp))
                                            .clickable(
                                                interactionSource = remember { MutableInteractionSource() },
                                                indication = ripple(bounded = true),
                                                onClick = onNavigateToDiscover
                                            )
                                            .padding(horizontal = 12.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "SEE ALL →",
                                            style = MaterialTheme.typography.labelLarge.copy(
                                                fontWeight = FontWeight.Black,
                                                letterSpacing = 0.5.sp
                                            ),
                                            color = ElectricLime
                                        )
                                    }
                                }
                            }

                            if (state.featuredSessions.isEmpty()) {
                                item(contentType = "empty_fixtures") {
                                    PleyEmptyState(
                                        title = "No Matches Today",
                                        description = "No open matches on the roster today. Check back soon or explore upcoming sports.",
                                        iconEmoji = "🎾",
                                        actionLabel = "Explore All Sports",
                                        onActionClick = onNavigateToDiscover
                                    )
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
                                Spacer(modifier = Modifier.height(28.dp))
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
                .clip(ModernCardShape)
        ) { page ->
            if (page == 0) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(ModernCardShape)
                        .background(
                            brush = Brush.verticalGradient(
                                colors = listOf(
                                    Color(0xFF161C2C),
                                    Color(0xFF0F131E)
                                )
                            )
                        )
                        .border(
                            BorderStroke(1.dp, Color(0x33FFFFFF)),
                            ModernCardShape
                        )
                        .padding(22.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Color(0x1FC8F526))
                                    .border(BorderStroke(1.dp, Color(0x40C8F526)), RoundedCornerShape(8.dp))
                                    .padding(horizontal = 9.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "⚡ TASHKENT LIVE",
                                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                    color = ElectricLime
                                )
                            }

                            Text(
                                text = "Casual • Social",
                                style = MaterialTheme.typography.labelSmall,
                                color = SlateMuted
                            )
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = "Play Without\nthe Friction.",
                            style = MaterialTheme.typography.headlineLarge.copy(
                                fontSize = 26.sp,
                                lineHeight = 31.sp
                            ),
                            fontWeight = FontWeight.Black,
                            color = PureWhite
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "Join friendly casual matches across Tashkent. Book a solo spot — we assemble the squad.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = PlatinumSilver
                        )

                        Spacer(modifier = Modifier.height(20.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .height(48.dp)
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(
                                        brush = Brush.horizontalGradient(
                                            colors = listOf(ElectricLime, Color(0xFF10B981))
                                        )
                                    )
                                    .kineticTouchEffect(onClick = onFindMatchClick)
                                    .padding(horizontal = 20.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = "FIND A MATCH",
                                        style = MaterialTheme.typography.labelLarge,
                                        fontWeight = FontWeight.Black,
                                        color = Color(0xFF0B0E14)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Icon(
                                        imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                                        contentDescription = null,
                                        tint = Color(0xFF0B0E14),
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }

                            MatchVisualTag(text = "12 Districts", icon = Icons.Default.LocationOn)
                        }
                    }
                }
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(ModernCardShape)
                        .background(
                            brush = Brush.verticalGradient(
                                colors = listOf(
                                    Color(0xFF161C2C),
                                    Color(0xFF0F131E)
                                )
                            )
                        )
                        .border(
                            BorderStroke(1.dp, Color(0x33FFFFFF)),
                            ModernCardShape
                        )
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
                                text = "BALANCED TIERS • FAIR PLAY",
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                color = StatusAmber
                            )
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = "Matched by\nSkill Level.",
                            style = MaterialTheme.typography.headlineLarge.copy(
                                fontSize = 26.sp,
                                lineHeight = 31.sp
                            ),
                            fontWeight = FontWeight.Black,
                            color = PureWhite
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "Filter by Beginner, Intermediate, or Advanced so games remain fun, competitive, and fair.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = PlatinumSilver
                        )

                        Spacer(modifier = Modifier.height(20.dp))

                        Box(
                            modifier = Modifier
                                .height(48.dp)
                                .clip(RoundedCornerShape(14.dp))
                                .background(DarkSurfaceElevated)
                                .border(BorderStroke(1.dp, Color(0x33FFFFFF)), RoundedCornerShape(14.dp))
                                .kineticTouchEffect(onClick = onFindMatchClick)
                                .padding(horizontal = 20.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "BROWSE SKILL LEVELS",
                                    style = MaterialTheme.typography.labelLarge,
                                    fontWeight = FontWeight.Bold,
                                    color = PureWhite
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                                    contentDescription = null,
                                    tint = PureWhite,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

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
    sports: List<SportDto>,
    onSportClick: () -> Unit = {}
) {
    Column {
        Text(
            text = "EXPLORE BY SPORT",
            style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 0.8.sp),
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
                        .height(48.dp)
                        .clip(SportChipShape)
                        .background(
                            brush = Brush.verticalGradient(
                                colors = listOf(
                                    theme.containerColor.copy(alpha = 0.35f),
                                    Color(0xFF131726)
                                )
                            )
                        )
                        .border(
                            BorderStroke(1.dp, theme.borderColor.copy(alpha = 0.6f)),
                            SportChipShape
                        )
                        .kineticTouchEffect(pressedScale = 0.94f, onClick = onSportClick)
                        .padding(horizontal = 16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = sport.icon, fontSize = 18.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = sport.name,
                            style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold),
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
            .clip(ModernCardShape)
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF151A2A),
                        Color(0xFF0F131E)
                    )
                )
            )
            .border(
                BorderStroke(1.dp, Color(0x2EFFFFFF)),
                ModernCardShape
            )
            .kineticTouchEffect(pressedScale = 0.97f, onClick = onClick)
            .padding(18.dp)
    ) {
        Column {
            if (!session.imageUrl.isNullOrBlank()) {
                PleyImage(
                    imageUrl = session.imageUrl,
                    fallbackText = session.sport.icon,
                    contentDescription = session.title,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(150.dp)
                        .clip(RoundedCornerShape(16.dp))
                )
                Spacer(modifier = Modifier.height(14.dp))
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
                        size = 38.dp
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
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = PureWhite,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(10.dp))

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
                    text = session.venue.district,
                    icon = Icons.Default.LocationOn,
                    tint = theme.primaryColor
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

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
                        text = "Price per player",
                        style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp),
                        color = SlateMuted
                    )
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(
                            text = "${session.pricePerSlot.toInt()}",
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
                }

                Box(
                    modifier = Modifier
                        .height(48.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(theme.containerColor)
                        .border(BorderStroke(1.dp, theme.borderColor), RoundedCornerShape(12.dp))
                        .padding(horizontal = 16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "JOIN MATCH",
                            style = MaterialTheme.typography.labelLarge.copy(
                                fontWeight = FontWeight.Black,
                                letterSpacing = 0.5.sp
                            ),
                            color = theme.primaryColor
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                            contentDescription = null,
                            tint = theme.primaryColor,
                            modifier = Modifier.size(16.dp)
                        )
                    }
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
