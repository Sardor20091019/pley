package uz.pley.app.presentation.discover

import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
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
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import uz.pley.app.core.ui.components.SessionCardSkeleton
import uz.pley.app.core.ui.theme.NeonCyan
import uz.pley.app.presentation.home.HomeSessionCard

private val BrandPrimary = NeonCyan

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
    modifier: Modifier = Modifier,
    viewModel: DiscoverViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val focusManager = LocalFocusManager.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Discover Games", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        modifier = modifier
    ) { innerPadding ->
        Surface(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (val state = uiState) {
                is DiscoverUiState.Loading -> {
                    LazyColumn(
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(14.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(56.dp)
                                    .padding(vertical = 4.dp)
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
                        Text(
                            text = state.message,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodyLarge
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = { viewModel.refresh() },
                            modifier = Modifier.minimumInteractiveComponentSize()
                        ) {
                            Text("Retry")
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
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(16.dp),
                            modifier = Modifier.fillMaxSize()
                        ) {
                            item(contentType = "search_field") {
                                OutlinedTextField(
                                    value = state.filterState.searchQuery,
                                    onValueChange = { viewModel.onSearchQueryChanged(it) },
                                    modifier = Modifier.fillMaxWidth(),
                                    placeholder = { Text("Search by sport, venue, or title...") },
                                    leadingIcon = {
                                        Icon(
                                            imageVector = Icons.Default.Search,
                                            contentDescription = null
                                        )
                                    },
                                    trailingIcon = {
                                        if (state.filterState.searchQuery.isNotEmpty()) {
                                            IconButton(
                                                onClick = { viewModel.onSearchQueryChanged("") },
                                                modifier = Modifier.minimumInteractiveComponentSize()
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Default.Clear,
                                                    contentDescription = "Clear search"
                                                )
                                            }
                                        }
                                    },
                                    shape = RoundedCornerShape(12.dp),
                                    singleLine = true,
                                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                                    keyboardActions = KeyboardActions(onSearch = { focusManager.clearFocus() }),
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedBorderColor = BrandPrimary,
                                        cursorColor = BrandPrimary
                                    )
                                )
                            }

                            item(contentType = "sport_chips") {
                                Column {
                                    Text(
                                        text = "Filter by Sport",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                    Spacer(modifier = Modifier.height(6.dp))
                                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                        items(
                                            items = state.sports,
                                            key = { it.id },
                                            contentType = { "sport_filter_chip" }
                                        ) { sport ->
                                            val isSelected = state.filterState.selectedSport.equals(sport.slug, ignoreCase = true)
                                            FilterChip(
                                                selected = isSelected,
                                                onClick = { viewModel.onSportSelected(sport.slug) },
                                                label = { Text("${sport.icon} ${sport.name}") },
                                                modifier = Modifier.minimumInteractiveComponentSize(),
                                                colors = FilterChipDefaults.filterChipColors(
                                                    selectedContainerColor = BrandPrimary,
                                                    selectedLabelColor = MaterialTheme.colorScheme.onPrimary
                                                )
                                            )
                                        }
                                    }
                                }
                            }

                            item(contentType = "district_chips") {
                                Column {
                                    Text(
                                        text = "District",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                    Spacer(modifier = Modifier.height(6.dp))
                                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                        items(
                                            items = TashkentDistricts,
                                            contentType = { "district_filter_chip" }
                                        ) { district ->
                                            val isSelected = state.filterState.selectedDistrict == district
                                            FilterChip(
                                                selected = isSelected,
                                                onClick = { viewModel.onDistrictSelected(district) },
                                                label = { Text(district) },
                                                modifier = Modifier.minimumInteractiveComponentSize(),
                                                colors = FilterChipDefaults.filterChipColors(
                                                    selectedContainerColor = BrandPrimary,
                                                    selectedLabelColor = MaterialTheme.colorScheme.onPrimary
                                                )
                                            )
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
                                    Text(
                                        text = "${state.sessions.size} sessions found",
                                        style = MaterialTheme.typography.titleSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            if (state.sessions.isEmpty()) {
                                item(contentType = "empty_results") {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(top = 40.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "No matches match your current filters.",
                                            style = MaterialTheme.typography.bodyMedium,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
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
                        }
                    }
                }
            }
        }
    }
}
