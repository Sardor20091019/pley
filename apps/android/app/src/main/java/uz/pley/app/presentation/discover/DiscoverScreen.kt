package uz.pley.app.presentation.discover

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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import uz.pley.app.core.ui.components.SessionCardSkeleton
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
import uz.pley.app.core.ui.theme.StatusAmber
import uz.pley.app.presentation.home.HomeSessionCard

private val TashkentDistricts = listOf(
    "Mirabad",
    "Yunusabad",
    "Chilanzar",
    "Yakkasaray",
    "Mirzo-Ulugbek",
    "Shaykhontokhur"
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DiscoverScreen(
    onSessionClick: (String) -> Unit,
    onNavigateToMap: () -> Unit = {},
    modifier: Modifier = Modifier,
    viewModel: DiscoverViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val focusManager = LocalFocusManager.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Discover Games",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Black,
                            color = PureWhite
                        )
                        Text(
                            text = "Tashkent Recreational Catalog",
                            style = MaterialTheme.typography.labelSmall,
                            color = SlateMuted
                        )
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
                is DiscoverUiState.Loading -> {
                    LazyColumn(
                        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(52.dp)
                                    .carbonCard(shape = RoundedCornerShape(16.dp))
                            )
                        }
                        items(5) {
                            SessionCardSkeleton()
                        }
                    }
                }

                is DiscoverUiState.Error -> {
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
                                        text = "RADAR DISCOVERY PAUSED",
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
                                        .kineticTouchEffect(onClick = { viewModel.refresh() })
                                        .padding(horizontal = 24.dp, vertical = 12.dp)
                                ) {
                                    Text(
                                        text = "Tap to Retry",
                                        color = Color(0xFF0F1117),
                                        style = MaterialTheme.typography.labelLarge,
                                        fontWeight = FontWeight.Black
                                    )
                                }
                            }
                        }
                    }
                }

                is DiscoverUiState.Success -> {
                    val pullState = rememberPullToRefreshState()
                    PullToRefreshBox(
                        isRefreshing = state.isRefreshing,
                        onRefresh = { viewModel.refresh() },
                        state = pullState,
                        modifier = Modifier.fillMaxSize()
                    ) {
                        LazyColumn(
                            contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp),
                            verticalArrangement = Arrangement.spacedBy(18.dp),
                            modifier = Modifier.fillMaxSize()
                        ) {
                            item(contentType = "search_field") {
                                OutlinedTextField(
                                    value = state.filterState.searchQuery,
                                    onValueChange = { viewModel.onSearchQueryChanged(it) },
                                    modifier = Modifier.fillMaxWidth(),
                                    placeholder = {
                                        Text(
                                            "Search by sport, venue, district...",
                                            style = MaterialTheme.typography.bodyMedium,
                                            color = SlateMuted
                                        )
                                    },
                                    leadingIcon = {
                                        Icon(
                                            imageVector = Icons.Default.Search,
                                            contentDescription = null,
                                            tint = ElectricLime,
                                            modifier = Modifier.size(18.dp)
                                        )
                                    },
                                    trailingIcon = {
                                        if (state.filterState.searchQuery.isNotEmpty()) {
                                            IconButton(
                                                onClick = { viewModel.onSearchQueryChanged("") },
                                                modifier = Modifier.size(24.dp)
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Default.Clear,
                                                    contentDescription = "Clear search",
                                                    tint = SlateMuted,
                                                    modifier = Modifier.size(16.dp)
                                                )
                                            }
                                        }
                                    },
                                    shape = RoundedCornerShape(16.dp),
                                    singleLine = true,
                                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                                    keyboardActions = KeyboardActions(onSearch = { focusManager.clearFocus() }),
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedContainerColor = DarkCard,
                                        unfocusedContainerColor = DarkCard,
                                        focusedBorderColor = ElectricLime,
                                        unfocusedBorderColor = Color(0x22FFFFFF),
                                        cursorColor = ElectricLime,
                                        focusedTextColor = PureWhite,
                                        unfocusedTextColor = PureWhite
                                    )
                                )
                            }

                            item(contentType = "sport_chips") {
                                Column {
                                    Text(
                                        text = "SPORTS",
                                        style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 1.sp),
                                        color = SlateMuted
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                        items(
                                            items = state.sports,
                                            key = { it.id },
                                            contentType = { "sport_filter_chip" }
                                        ) { sport ->
                                            val isSelected = state.filterState.selectedSport.equals(sport.slug, ignoreCase = true)
                                            val theme = resolveSportTheme(sport.slug)
                                            Box(
                                                modifier = Modifier
                                                    .clip(RoundedCornerShape(14.dp))
                                                    .background(
                                                        if (isSelected) {
                                                            Brush.horizontalGradient(
                                                                colors = listOf(
                                                                    theme.primaryColor,
                                                                    theme.primaryColor.copy(alpha = 0.85f)
                                                                )
                                                            )
                                                        } else {
                                                            Brush.verticalGradient(
                                                                colors = listOf(
                                                                    theme.containerColor.copy(alpha = 0.25f),
                                                                    DarkCard
                                                                )
                                                            )
                                                        }
                                                    )
                                                    .border(
                                                        BorderStroke(
                                                            1.dp,
                                                            if (isSelected) theme.primaryColor else theme.borderColor.copy(alpha = 0.4f)
                                                        ),
                                                        RoundedCornerShape(14.dp)
                                                    )
                                                    .kineticTouchEffect(pressedScale = 0.94f) {
                                                        viewModel.onSportSelected(sport.slug)
                                                    }
                                                    .padding(horizontal = 14.dp, vertical = 9.dp)
                                            ) {
                                                Text(
                                                    text = "${sport.icon} ${sport.name}",
                                                    style = MaterialTheme.typography.labelMedium,
                                                    color = if (isSelected) Color.Black else PureWhite,
                                                    fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold
                                                )
                                            }
                                        }
                                    }
                                }
                            }

                            item(contentType = "district_chips") {
                                Column {
                                    Text(
                                        text = "DISTRICT",
                                        style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 1.sp),
                                        color = SlateMuted
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                        items(
                                            items = TashkentDistricts,
                                            contentType = { "district_filter_chip" }
                                        ) { district ->
                                            val isSelected = state.filterState.selectedDistrict == district
                                            Box(
                                                modifier = Modifier
                                                    .clip(RoundedCornerShape(12.dp))
                                                    .background(
                                                        if (isSelected) ElectricLime else DarkSurfaceElevated
                                                    )
                                                    .border(
                                                        BorderStroke(
                                                            1.dp,
                                                            if (isSelected) ElectricLime else Color(0x22FFFFFF)
                                                        ),
                                                        RoundedCornerShape(12.dp)
                                                    )
                                                    .kineticTouchEffect(pressedScale = 0.94f) {
                                                        viewModel.onDistrictSelected(district)
                                                    }
                                                    .padding(horizontal = 14.dp, vertical = 8.dp)
                                            ) {
                                                Text(
                                                    text = district,
                                                    style = MaterialTheme.typography.labelMedium,
                                                    color = if (isSelected) Color.Black else PlatinumSilver,
                                                    fontWeight = if (isSelected) FontWeight.Black else FontWeight.Medium
                                                )
                                            }
                                        }
                                    }
                                }
                            }

                            item(contentType = "result_counter") {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(
                                            modifier = Modifier
                                                .size(6.dp)
                                                .clip(CircleShape)
                                                .background(ElectricLime)
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = "${state.sessions.size} open fixtures found",
                                            style = MaterialTheme.typography.titleSmall,
                                            color = PlatinumSilver
                                        )
                                    }
                                }
                            }

                            if (state.sessions.isEmpty()) {
                                item(contentType = "empty_results") {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .carbonCard(shape = RoundedCornerShape(20.dp))
                                            .padding(40.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "No matches match your current filters.",
                                            style = MaterialTheme.typography.bodyMedium,
                                            color = SlateMuted
                                        )
                                    }
                                }
                            } else {
                                items(
                                    items = state.sessions,
                                    key = { it.id },
                                    contentType = { "session_card" }
                                ) { session ->
                                    HomeSessionCard(
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
