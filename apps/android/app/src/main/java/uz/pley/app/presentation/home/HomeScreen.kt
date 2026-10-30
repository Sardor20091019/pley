package uz.pley.app.presentation.home

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.spring
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
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
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
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
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
import uz.pley.app.core.ui.components.PleyImage
import uz.pley.app.core.ui.components.SessionCardSkeleton
import uz.pley.app.core.ui.components.glassCard
import uz.pley.app.core.ui.components.glassCardProminent
import uz.pley.app.core.ui.components.glassCardSubtle
import uz.pley.app.core.ui.components.springPress
import uz.pley.app.core.ui.theme.BurnishedOchre
import uz.pley.app.core.ui.theme.DimWhite
import uz.pley.app.core.ui.theme.GlassDeepIndigo
import uz.pley.app.core.ui.theme.NeonCyan
import uz.pley.app.core.ui.theme.NeonIndigo
import uz.pley.app.core.ui.theme.RawTerracotta
import uz.pley.app.core.ui.theme.SoftWhite
import uz.pley.app.core.ui.theme.StatusGreen
import uz.pley.app.core.ui.theme.StatusRed
import uz.pley.app.core.ui.theme.WarmWhite

private val GlassHeroShape = RoundedCornerShape(
    topStart = 28.dp,
    topEnd = 10.dp,
    bottomEnd = 28.dp,
    bottomStart = 10.dp
)

private val GlassCardShape = RoundedCornerShape(20.dp)

private val SportPillShape = RoundedCornerShape(12.dp)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToDiscover: () -> Unit,
    onSessionClick: (String) -> Unit,
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
                                .size(36.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(
                                    Brush.linearGradient(
                                        colors = listOf(NeonCyan, NeonIndigo),
                                        start = Offset(0f, 0f),
                                        end = Offset(Float.POSITIVE_INFINITY, Float.POSITIVE_INFINITY)
                                    )
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "P",
                                color = GlassDeepIndigo,
                                fontWeight = FontWeight.Black,
                                fontSize = 20.sp
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "PLEY",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Black,
                                color = WarmWhite
                            )
                            Text(
                                text = "TASHKENT RECREATIONAL",
                                style = MaterialTheme.typography.labelSmall,
                                color = DimWhite
                            )
                        }
                    }
                },
                actions = {
                    IconButton(
                        onClick = { viewModel.loadData() },
                        modifier = Modifier.minimumInteractiveComponentSize()
                    ) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Refresh",
                            tint = SoftWhite
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
                is HomeUiState.Loading -> {
                    LazyColumn(
                        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(200.dp)
                                    .glassCardProminent(shape = GlassHeroShape)
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
                            .padding(28.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .glassCard(shape = RoundedCornerShape(16.dp))
                                .padding(28.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = state.message,
                                    color = RawTerracotta,
                                    style = MaterialTheme.typography.bodyLarge
                                )
                                Spacer(modifier = Modifier.height(20.dp))
                                Button(
                                    onClick = { viewModel.loadData() },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = NeonCyan,
                                        contentColor = GlassDeepIndigo
                                    ),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier.minimumInteractiveComponentSize()
                                ) {
                                    Text("Retry Connection", fontWeight = FontWeight.Bold)
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
                            contentPadding = PaddingValues(horizontal = 20.dp, vertical = 14.dp),
                            verticalArrangement = Arrangement.spacedBy(16.dp),
                            modifier = Modifier.fillMaxSize()
                        ) {
                            item(contentType = "glass_hero") {
                                GlassHeroSection(onFindMatchClick = onNavigateToDiscover)
                            }

                            if (state.sports.isNotEmpty()) {
                                item(contentType = "glass_sports") {
                                    GlassSportsRow(sports = state.sports)
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
                                            style = MaterialTheme.typography.labelSmall,
                                            color = NeonCyan.copy(alpha = 0.8f)
                                        )
                                        Text(
                                            text = "Open Pickups",
                                            style = MaterialTheme.typography.displaySmall,
                                            color = WarmWhite
                                        )
                                    }
                                    Text(
                                        text = "EXPLORE ALL →",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = NeonCyan,
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
                                            .glassCardSubtle(shape = GlassCardShape)
                                            .padding(32.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "No open matches on the roster today.",
                                            style = MaterialTheme.typography.bodyMedium,
                                            color = SoftWhite
                                        )
                                    }
                                }
                            } else {
                                items(
                                    items = state.featuredSessions,
                                    key = { it.id },
                                    contentType = { "glass_session_card" }
                                ) { session ->
                                    EditorialSessionCard(
                                        session = session,
                                        onClick = { onSessionClick(session.id) }
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

@Composable
fun GlassHeroSection(
    onFindMatchClick: () -> Unit
) {
    val pagerState = rememberPagerState(pageCount = { 2 })

    Column {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier
                .fillMaxWidth()
                .clip(GlassHeroShape)
        ) { page ->
            if (page == 0) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .glassCardProminent(shape = RoundedCornerShape(0.dp))
                        .padding(28.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(7.dp)
                                    .clip(CircleShape)
                                    .background(NeonCyan)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "COMMUNITY RECREATION • TASHKENT",
                                style = MaterialTheme.typography.labelSmall,
                                color = NeonCyan
                            )
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = "Play Without\nthe Friction.",
                            style = MaterialTheme.typography.displayLarge,
                            color = WarmWhite
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = "Reserve individual spots in vetted casual matches. No squad coordination needed.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = SoftWhite
                        )

                        Spacer(modifier = Modifier.height(24.dp))

                        Box(
                            modifier = Modifier
                                .springPress { onFindMatchClick() }
                                .clip(RoundedCornerShape(12.dp))
                                .background(
                                    Brush.linearGradient(
                                        colors = listOf(NeonCyan, NeonIndigo.copy(alpha = 0.9f)),
                                        start = Offset(0f, 0f),
                                        end = Offset(Float.POSITIVE_INFINITY, 0f)
                                    )
                                )
                                .padding(horizontal = 20.dp, vertical = 13.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "DISCOVER GAMES",
                                    style = MaterialTheme.typography.labelLarge,
                                    color = GlassDeepIndigo
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                                    contentDescription = null,
                                    tint = GlassDeepIndigo,
                                    modifier = Modifier.size(15.dp)
                                )
                            }
                        }
                    }
                }
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .glassCardProminent(shape = RoundedCornerShape(0.dp))
                        .padding(28.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(7.dp)
                                    .clip(CircleShape)
                                    .background(BurnishedOchre)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "CALIBRATED COMPETITION",
                                style = MaterialTheme.typography.labelSmall,
                                color = BurnishedOchre
                            )
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = "Matched by\nSkill Tiers.",
                            style = MaterialTheme.typography.displayLarge,
                            color = WarmWhite
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = "From relaxed weekend social rallies to competitive tier tournaments.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = SoftWhite
                        )

                        Spacer(modifier = Modifier.height(24.dp))

                        Box(
                            modifier = Modifier
                                .springPress { onFindMatchClick() }
                                .clip(RoundedCornerShape(12.dp))
                                .background(
                                    Brush.linearGradient(
                                        colors = listOf(
                                            Color.White.copy(alpha = 0.22f),
                                            Color.White.copy(alpha = 0.12f)
                                        )
                                    )
                                )
                                .border(
                                    1.dp,
                                    Color.White.copy(alpha = 0.35f),
                                    RoundedCornerShape(12.dp)
                                )
                                .padding(horizontal = 20.dp, vertical = 13.dp)
                        ) {
                            Text(
                                text = "VIEW SKILL BRACKETS",
                                style = MaterialTheme.typography.labelLarge,
                                color = WarmWhite
                            )
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
                    targetValue = if (isSelected) 22.dp else 5.dp,
                    animationSpec = spring(
                        dampingRatio = Spring.DampingRatioLowBouncy,
                        stiffness = Spring.StiffnessLow
                    ),
                    label = "pager_dot_width"
                )
                Box(
                    modifier = Modifier
                        .padding(horizontal = 3.dp)
                        .size(width = width, height = 4.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(
                            if (isSelected) NeonCyan else Color.White.copy(alpha = 0.25f)
                        )
                )
            }
        }
    }
}

@Composable
fun GlassSportsRow(
    sports: List<SportDto>
) {
    Column {
        Text(
            text = "DISCIPLINES",
            style = MaterialTheme.typography.labelSmall,
            color = DimWhite
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
                Box(
                    modifier = Modifier
                        .springPress {}
                        .glassCardSubtle(shape = SportPillShape)
                        .padding(horizontal = 14.dp, vertical = 10.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = sport.icon, fontSize = 16.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = sport.name.uppercase(),
                            style = MaterialTheme.typography.labelMedium,
                            color = WarmWhite
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
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .springPress(pressedScale = 0.97f, onClick = onClick)
            .glassCard(shape = GlassCardShape)
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
                        .height(150.dp)
                        .clip(RoundedCornerShape(14.dp))
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = session.sport.icon, fontSize = 17.sp)
                    Spacer(modifier = Modifier.width(7.dp))
                    Text(
                        text = session.sport.name.uppercase(),
                        style = MaterialTheme.typography.labelSmall,
                        color = BurnishedOchre
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(
                            if (session.remainingSlots > 2)
                                StatusGreen.copy(alpha = 0.18f)
                            else
                                StatusRed.copy(alpha = 0.18f)
                        )
                        .border(
                            0.5.dp,
                            if (session.remainingSlots > 2)
                                StatusGreen.copy(alpha = 0.5f)
                            else
                                StatusRed.copy(alpha = 0.5f),
                            RoundedCornerShape(6.dp)
                        )
                        .padding(horizontal = 9.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "${session.remainingSlots} SLOTS LEFT",
                        color = if (session.remainingSlots > 2) StatusGreen else StatusRed,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = session.title,
                style = MaterialTheme.typography.headlineLarge,
                color = WarmWhite,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.CalendarMonth,
                    contentDescription = null,
                    tint = DimWhite,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = session.scheduledAt.take(16).replace("T", " • "),
                    style = MaterialTheme.typography.bodySmall,
                    color = SoftWhite
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(text = "·", style = MaterialTheme.typography.bodySmall, color = DimWhite)
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = "${session.durationMinutes} MIN",
                    style = MaterialTheme.typography.labelSmall,
                    color = DimWhite
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.LocationOn,
                    contentDescription = null,
                    tint = DimWhite,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "${session.venue.district.uppercase()} — ${session.venue.name}",
                    style = MaterialTheme.typography.bodySmall,
                    color = DimWhite,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(0.5.dp)
                    .background(Color.White.copy(alpha = 0.12f))
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
                        color = WarmWhite
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "UZS",
                        style = MaterialTheme.typography.labelSmall,
                        color = SoftWhite,
                        modifier = Modifier.padding(bottom = 3.dp)
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(7.dp))
                        .background(Color.White.copy(alpha = 0.10f))
                        .border(
                            0.5.dp,
                            Color.White.copy(alpha = 0.22f),
                            RoundedCornerShape(7.dp)
                        )
                        .padding(horizontal = 11.dp, vertical = 5.dp)
                ) {
                    Text(
                        text = session.skillLevel.name.replace("_", " "),
                        style = MaterialTheme.typography.labelSmall,
                        color = SoftWhite
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
    GlassSportsRow(sports = sports)
}

@Composable
fun EditorialHeroSection(onFindMatchClick: () -> Unit) {
    GlassHeroSection(onFindMatchClick = onFindMatchClick)
}
