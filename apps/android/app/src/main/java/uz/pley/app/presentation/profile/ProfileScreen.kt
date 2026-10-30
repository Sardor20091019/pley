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
import uz.pley.app.core.ui.components.PleyImage
import uz.pley.app.core.ui.components.carbonCard
import uz.pley.app.core.ui.components.glassCard
import uz.pley.app.core.ui.components.kineticTouchEffect
import uz.pley.app.core.ui.components.shimmerEffect
import uz.pley.app.core.ui.theme.DarkCard
import uz.pley.app.core.ui.theme.DarkSurfaceElevated
import uz.pley.app.core.ui.theme.ElectricLime
import uz.pley.app.core.ui.theme.PlatinumSilver
import uz.pley.app.core.ui.theme.PureWhite
import uz.pley.app.core.ui.theme.SlateMuted
import uz.pley.app.core.ui.theme.StatusRed

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
                            .padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(96.dp)
                                .clip(RoundedCornerShape(20.dp))
                                .shimmerEffect()
                        )
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(160.dp)
                                .clip(RoundedCornerShape(20.dp))
                                .shimmerEffect()
                        )
                    }
                }

                is ProfileUiState.Unauthenticated -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(28.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .glassCard(shape = RoundedCornerShape(24.dp))
                                .padding(32.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = "Connect Your Account",
                                    style = MaterialTheme.typography.headlineLarge,
                                    fontWeight = FontWeight.Bold,
                                    color = PureWhite
                                )
                                Spacer(modifier = Modifier.height(10.dp))
                                Text(
                                    text = "Sign in to manage your sports preferences, view skill ratings, and unlock community achievement badges.",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = PlatinumSilver
                                )
                                Spacer(modifier = Modifier.height(24.dp))
                                Button(
                                    onClick = onNavigateToAuth,
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = ElectricLime,
                                        contentColor = Color.Black
                                    ),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier.minimumInteractiveComponentSize()
                                ) {
                                    Text("Sign In with Google", fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }

                is ProfileUiState.Authenticated -> {
                    val user = state.user
                    LazyColumn(
                        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        item(contentType = "user_header") {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .glassCard(shape = RoundedCornerShape(22.dp))
                                    .padding(20.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    if (!user.avatarUrl.isNullOrBlank()) {
                                        PleyImage(
                                            imageUrl = user.avatarUrl,
                                            fallbackText = user.firstName.take(1).uppercase(),
                                            contentDescription = user.firstName,
                                            modifier = Modifier
                                                .size(60.dp)
                                                .clip(CircleShape)
                                        )
                                    } else {
                                        Box(
                                            modifier = Modifier
                                                .size(60.dp)
                                                .clip(CircleShape)
                                                .background(ElectricLime),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                text = user.firstName.take(1).uppercase(),
                                                color = Color.Black,
                                                fontWeight = FontWeight.Black,
                                                fontSize = 24.sp
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
                                        Spacer(modifier = Modifier.height(6.dp))
                                        Box(
                                            modifier = Modifier
                                                .clip(RoundedCornerShape(6.dp))
                                                .background(ElectricLime.copy(alpha = 0.16f))
                                                .border(
                                                    0.5.dp,
                                                    ElectricLime.copy(alpha = 0.45f),
                                                    RoundedCornerShape(6.dp)
                                                )
                                                .padding(horizontal = 8.dp, vertical = 3.dp)
                                        ) {
                                            Text(
                                                text = user.role.name,
                                                style = MaterialTheme.typography.labelSmall,
                                                color = ElectricLime,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }
                                }
                            }
                        }

                        item(contentType = "preferences_card") {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .glassCard(shape = RoundedCornerShape(22.dp))
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
                                        IconButton(
                                            onClick = { isEditingProfile = true },
                                            modifier = Modifier.size(32.dp)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Edit,
                                                contentDescription = "Edit Preferences",
                                                tint = ElectricLime,
                                                modifier = Modifier.size(18.dp)
                                            )
                                        }
                                    }

                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(0.5.dp)
                                            .background(Color(0x1AFFFFFF))
                                    )

                                    PreferenceRow(label = "Skill Level", value = user.skillLevel.name.replace("_", " "))
                                    PreferenceRow(label = "Preferred Sports", value = user.preferredSports)
                                    PreferenceRow(label = "District", value = user.preferredNeighborhoods)
                                    PreferenceRow(label = "Age Bracket", value = user.ageBracket)
                                }
                            }
                        }

                        if (state.achievements.isNotEmpty()) {
                            item(contentType = "achievements_row") {
                                Column {
                                    Text(
                                        text = "ACHIEVEMENTS",
                                        style = MaterialTheme.typography.labelSmall,
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
                                    .minimumInteractiveComponentSize(),
                                shape = RoundedCornerShape(14.dp),
                                border = BorderStroke(1.dp, StatusRed.copy(alpha = 0.5f)),
                                colors = ButtonDefaults.outlinedButtonColors(
                                    contentColor = StatusRed
                                )
                            ) {
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ExitToApp,
                                    contentDescription = null,
                                    tint = StatusRed,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Log Out",
                                    color = StatusRed,
                                    style = MaterialTheme.typography.labelMedium
                                )
                            }
                        }

                        item {
                            Spacer(modifier = Modifier.height(72.dp))
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
            .width(140.dp)
            .glassCard(shape = RoundedCornerShape(16.dp))
            .kineticTouchEffect(pressedScale = 0.94f)
            .padding(14.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text = achievement.badge, fontSize = 28.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = achievement.title,
                style = MaterialTheme.typography.labelMedium,
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
                        unfocusedBorderColor = Color(0x22FFFFFF),
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
                        unfocusedBorderColor = Color(0x22FFFFFF),
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
                colors = ButtonDefaults.buttonColors(containerColor = ElectricLime, contentColor = Color.Black),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.minimumInteractiveComponentSize(),
                enabled = firstName.isNotBlank()
            ) {
                Text("Save Changes", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(
                onClick = onDismiss,
                modifier = Modifier.minimumInteractiveComponentSize()
            ) {
                Text("Cancel", color = SlateMuted)
            }
        }
    )
}
