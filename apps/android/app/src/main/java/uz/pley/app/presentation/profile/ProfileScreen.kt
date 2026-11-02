package uz.pley.app.presentation.profile

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
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusDirection
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import uz.pley.app.core.network.model.AchievementDto
import uz.pley.app.core.network.model.SkillLevel
import uz.pley.app.core.network.model.UserDto
import uz.pley.app.core.ui.components.PleyEmptyState
import uz.pley.app.core.ui.components.PleyImage
import uz.pley.app.core.ui.components.kineticTouchEffect
import uz.pley.app.core.ui.components.shimmerEffect
import uz.pley.app.core.ui.theme.DarkCard
import uz.pley.app.core.ui.theme.DarkSurfaceElevated
import uz.pley.app.core.ui.theme.ElectricLime
import uz.pley.app.core.ui.theme.PlatinumSilver
import uz.pley.app.core.ui.theme.PureWhite
import uz.pley.app.core.ui.theme.SlateMuted
import uz.pley.app.core.ui.theme.StatusRed

private val ProfileCardShape = RoundedCornerShape(22.dp)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    onNavigateToAuth: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: ProfileViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle(minActiveState = Lifecycle.State.STARTED)
    var isEditingProfile by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Player Profile",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Black,
                            color = PureWhite
                        )
                        Text(
                            text = "Member Account & Preferences",
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
                is ProfileUiState.Loading -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(110.dp)
                                .clip(ProfileCardShape)
                                .shimmerEffect()
                        )
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(180.dp)
                                .clip(ProfileCardShape)
                                .shimmerEffect()
                        )
                    }
                }

                is ProfileUiState.Unauthenticated -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        PleyEmptyState(
                            title = "Connect Your Account",
                            description = "Sign in to manage your preferred sports, view skill ratings, and track your match achievement badges.",
                            iconEmoji = "👤",
                            actionLabel = "Sign In with Google",
                            onActionClick = onNavigateToAuth
                        )
                    }
                }

                is ProfileUiState.Authenticated -> {
                    val user = state.user
                    LazyColumn(
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        item(contentType = "user_header") {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(ProfileCardShape)
                                    .background(
                                        brush = Brush.verticalGradient(
                                            colors = listOf(
                                                Color(0xFF151928),
                                                Color(0xFF0F121C)
                                            )
                                        )
                                    )
                                    .border(BorderStroke(1.dp, Color(0x33FFFFFF)), ProfileCardShape)
                                    .padding(20.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    if (!user.avatarUrl.isNullOrBlank()) {
                                        PleyImage(
                                            imageUrl = user.avatarUrl,
                                            fallbackText = user.firstName.take(1).uppercase(),
                                            contentDescription = user.firstName,
                                            modifier = Modifier
                                                .size(64.dp)
                                                .clip(CircleShape)
                                                .border(BorderStroke(1.5.dp, ElectricLime), CircleShape)
                                        )
                                    } else {
                                        Box(
                                            modifier = Modifier
                                                .size(64.dp)
                                                .clip(CircleShape)
                                                .background(
                                                    brush = Brush.linearGradient(
                                                        colors = listOf(ElectricLime, Color(0xFF00E676))
                                                    )
                                                ),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                text = user.firstName.take(1).uppercase(),
                                                color = Color(0xFF0A0C05),
                                                fontWeight = FontWeight.Black,
                                                fontSize = 26.sp
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.width(16.dp))

                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = "${user.firstName} ${user.lastName.orEmpty()}".trim(),
                                            style = MaterialTheme.typography.titleLarge,
                                            fontWeight = FontWeight.Bold,
                                            color = PureWhite
                                        )
                                        Spacer(modifier = Modifier.height(2.dp))
                                        Text(
                                            text = user.email,
                                            style = MaterialTheme.typography.bodySmall,
                                            color = SlateMuted
                                        )
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                            Box(
                                                modifier = Modifier
                                                    .clip(RoundedCornerShape(8.dp))
                                                    .background(ElectricLime.copy(alpha = 0.16f))
                                                    .border(
                                                        0.5.dp,
                                                        ElectricLime.copy(alpha = 0.45f),
                                                        RoundedCornerShape(8.dp)
                                                    )
                                                    .padding(horizontal = 8.dp, vertical = 3.dp)
                                            ) {
                                                Text(
                                                    text = user.role.name,
                                                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                                    color = ElectricLime
                                                )
                                            }

                                            Box(
                                                modifier = Modifier
                                                    .clip(RoundedCornerShape(8.dp))
                                                    .background(DarkSurfaceElevated)
                                                    .border(0.5.dp, Color(0x28FFFFFF), RoundedCornerShape(8.dp))
                                                    .padding(horizontal = 8.dp, vertical = 3.dp)
                                            ) {
                                                Text(
                                                    text = user.skillLevel.name.replace("_", " "),
                                                    style = MaterialTheme.typography.labelSmall,
                                                    color = PlatinumSilver
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        item(contentType = "preferences_card") {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(ProfileCardShape)
                                    .background(DarkCard)
                                    .border(BorderStroke(1.dp, Color(0x28FFFFFF)), ProfileCardShape)
                                    .padding(20.dp)
                            ) {
                                Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = "Preferences",
                                            style = MaterialTheme.typography.titleLarge,
                                            fontWeight = FontWeight.Bold,
                                            color = PureWhite
                                        )
                                        Box(
                                            modifier = Modifier
                                                .size(48.dp)
                                                .clip(CircleShape),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            IconButton(
                                                onClick = { isEditingProfile = true },
                                                modifier = Modifier.size(44.dp)
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Default.Edit,
                                                    contentDescription = "Edit Preferences",
                                                    tint = ElectricLime,
                                                    modifier = Modifier.size(20.dp)
                                                )
                                            }
                                        }
                                    }

                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(1.dp)
                                            .background(Color(0x1AFFFFFF))
                                    )

                                    PreferenceRow(label = "Skill Level", value = user.skillLevel.name.replace("_", " "))
                                    PreferenceRow(label = "Preferred Sports", value = user.preferredSports)
                                    PreferenceRow(label = "Home District", value = user.preferredNeighborhoods)
                                    PreferenceRow(label = "Age Bracket", value = user.ageBracket)
                                }
                            }
                        }

                        if (state.achievements.isNotEmpty()) {
                            item(contentType = "achievements_row") {
                                Column {
                                    Text(
                                        text = "COMMUNITY ACHIEVEMENTS",
                                        style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 0.8.sp),
                                        color = SlateMuted
                                    )
                                    Spacer(modifier = Modifier.height(10.dp))
                                    LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                        items(
                                            items = state.achievements,
                                            key = { it.id },
                                            contentType = { "achievement_card" }
                                        ) { item ->
                                            AchievementCard(achievement = item)
                                        }
                                    }
                                }
                            }
                        }

                        item(contentType = "logout_button") {
                            OutlinedButton(
                                onClick = { viewModel.logout() },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(50.dp)
                                    .minimumInteractiveComponentSize(),
                                shape = RoundedCornerShape(14.dp),
                                border = BorderStroke(1.dp, StatusRed.copy(alpha = 0.6f)),
                                colors = ButtonDefaults.outlinedButtonColors(
                                    contentColor = StatusRed
                                )
                            ) {
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ExitToApp,
                                    contentDescription = null,
                                    tint = StatusRed,
                                    modifier = Modifier.size(20.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Log Out",
                                    color = StatusRed,
                                    style = MaterialTheme.typography.labelLarge,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        item {
                            Spacer(modifier = Modifier.height(32.dp))
                        }
                    }

                    if (isEditingProfile) {
                        EditProfileDialog(
                            user = user,
                            onDismiss = { isEditingProfile = false },
                            onSave = { name, skill, sports ->
                                viewModel.updateProfile(name, skill, sports)
                                isEditingProfile = false
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun PreferenceRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = SlateMuted
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.SemiBold,
            color = PureWhite
        )
    }
}

@Composable
fun AchievementCard(achievement: AchievementDto) {
    Box(
        modifier = Modifier
            .width(150.dp)
            .clip(RoundedCornerShape(18.dp))
            .background(DarkCard)
            .border(BorderStroke(1.dp, Color(0x28FFFFFF)), RoundedCornerShape(18.dp))
            .kineticTouchEffect(pressedScale = 0.94f)
            .padding(16.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text = achievement.badge, fontSize = 32.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = achievement.title,
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.Bold,
                color = PureWhite
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = achievement.description,
                style = MaterialTheme.typography.labelSmall,
                color = SlateMuted
            )
        }
    }
}

@Composable
fun EditProfileDialog(
    user: UserDto,
    onDismiss: () -> Unit,
    onSave: (String, SkillLevel, String) -> Unit
) {
    var firstName by remember { mutableStateOf(user.firstName) }
    var preferredSports by remember { mutableStateOf(user.preferredSports) }
    val focusManager = LocalFocusManager.current

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "Edit Player Profile",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = PureWhite
            )
        },
        containerColor = DarkCard,
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                OutlinedTextField(
                    value = firstName,
                    onValueChange = { firstName = it },
                    label = { Text("First Name", color = SlateMuted) },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        capitalization = KeyboardCapitalization.Words,
                        imeAction = ImeAction.Next
                    ),
                    keyboardActions = KeyboardActions(
                        onNext = { focusManager.moveFocus(FocusDirection.Down) }
                    ),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = ElectricLime,
                        unfocusedBorderColor = Color(0x28FFFFFF),
                        cursorColor = ElectricLime,
                        focusedTextColor = PureWhite,
                        unfocusedTextColor = PureWhite
                    ),
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = preferredSports,
                    onValueChange = { preferredSports = it },
                    label = { Text("Preferred Sports (e.g. football, padel)", color = SlateMuted) },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                    keyboardActions = KeyboardActions(
                        onDone = { focusManager.clearFocus() }
                    ),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = ElectricLime,
                        unfocusedBorderColor = Color(0x28FFFFFF),
                        cursorColor = ElectricLime,
                        focusedTextColor = PureWhite,
                        unfocusedTextColor = PureWhite
                    ),
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = { onSave(firstName.trim(), user.skillLevel, preferredSports.trim()) },
                colors = ButtonDefaults.buttonColors(
                    containerColor = ElectricLime,
                    contentColor = Color(0xFF0A0C05)
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .height(48.dp)
                    .minimumInteractiveComponentSize(),
                enabled = firstName.isNotBlank()
            ) {
                Text("Save Changes", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(
                onClick = onDismiss,
                modifier = Modifier
                    .height(48.dp)
                    .minimumInteractiveComponentSize()
            ) {
                Text("Cancel", color = SlateMuted)
            }
        },
        shape = RoundedCornerShape(22.dp)
    )
}
