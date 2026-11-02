package uz.pley.app.presentation.navigation

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import uz.pley.app.core.ui.components.kineticTouchEffect
import uz.pley.app.core.ui.theme.DarkCard
import uz.pley.app.core.ui.theme.DarkSurfaceElevated
import uz.pley.app.core.ui.theme.ElectricLime
import uz.pley.app.core.ui.theme.PlatinumSilver
import uz.pley.app.core.ui.theme.PureWhite
import uz.pley.app.core.ui.theme.SlateMuted

enum class BottomTab(val route: NavDestination, val label: String, val icon: ImageVector) {
    HOME(NavDestination.Home, "Home", Icons.Default.Home),
    DISCOVER(NavDestination.Discover, "Discover", Icons.Default.Explore),
    MY_GAMES(NavDestination.MyGames, "My Games", Icons.Default.DateRange),
    PROFILE(NavDestination.Profile, "Profile", Icons.Default.Person)
}

@Composable
fun BottomNavBar(
    currentTab: BottomTab,
    onTabSelected: (BottomTab) -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        color = Color.Transparent,
        modifier = modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .padding(horizontal = 16.dp, vertical = 6.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(28.dp))
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            Color(0xFF141824),
                            Color(0xFF0C0E17)
                        )
                    )
                )
                .border(
                    BorderStroke(1.dp, Color(0x2BFFFFFF)),
                    RoundedCornerShape(28.dp)
                )
                .padding(horizontal = 6.dp, vertical = 6.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                BottomTab.entries.forEach { tab ->
                    val isSelected = tab == currentTab

                    val scale by animateFloatAsState(
                        targetValue = if (isSelected) 1.05f else 1.0f,
                        animationSpec = spring(
                            dampingRatio = Spring.DampingRatioLowBouncy,
                            stiffness = Spring.StiffnessMediumLow
                        ),
                        label = "tab_scale"
                    )

                    val iconTint by animateColorAsState(
                        targetValue = if (isSelected) ElectricLime else Color(0xFF94A3B8),
                        animationSpec = spring(stiffness = Spring.StiffnessLow),
                        label = "tab_icon_tint"
                    )

                    val textColor by animateColorAsState(
                        targetValue = if (isSelected) PureWhite else SlateMuted,
                        animationSpec = spring(stiffness = Spring.StiffnessLow),
                        label = "tab_text_color"
                    )

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(56.dp)
                            .graphicsLayer {
                                scaleX = scale
                                scaleY = scale
                            }
                            .clip(RoundedCornerShape(20.dp))
                            .background(
                                if (isSelected) Color(0x1FD4FF00) else Color.Transparent
                            )
                            .then(
                                if (isSelected) {
                                    Modifier.border(
                                        BorderStroke(1.dp, Color(0x38D4FF00)),
                                        RoundedCornerShape(20.dp)
                                    )
                                } else {
                                    Modifier
                                }
                            )
                            .kineticTouchEffect(pressedScale = 0.94f) {
                                onTabSelected(tab)
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Icon(
                                imageVector = tab.icon,
                                contentDescription = tab.label,
                                tint = iconTint,
                                modifier = Modifier.size(22.dp)
                            )
                            Spacer(modifier = Modifier.height(3.dp))
                            Text(
                                text = tab.label,
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontSize = 11.sp,
                                    letterSpacing = 0.2.sp
                                ),
                                color = textColor,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                            )
                        }
                    }
                }
            }
        }
    }
}
