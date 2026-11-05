package uz.pley.app.core.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ElectricBolt
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import uz.pley.app.core.ui.theme.DarkCard
import uz.pley.app.core.ui.theme.DarkSurfaceElevated
import uz.pley.app.core.ui.theme.ElectricLime
import uz.pley.app.core.ui.theme.PlatinumSilver
import uz.pley.app.core.ui.theme.PureWhite
import uz.pley.app.core.ui.theme.SlateMuted
import uz.pley.app.core.ui.theme.StatusAmber
import uz.pley.app.core.ui.theme.StatusRed

data class SportVisualTheme(
    val primaryColor: Color,
    val containerColor: Color,
    val borderColor: Color,
    val disciplineTag: String
)

fun resolveSportTheme(slug: String): SportVisualTheme {
    return when (slug.lowercase().trim()) {
        "football", "soccer", "futsal" -> SportThemePresets.Football
        "basketball", "basketball-3x3" -> SportThemePresets.Basketball
        "padel", "tennis" -> SportThemePresets.Padel
        "table-tennis" -> SportThemePresets.TableTennis
        "volleyball" -> SportThemePresets.Volleyball
        "badminton" -> SportThemePresets.Badminton
        "running", "fitness", "crossfit" -> SportThemePresets.Fitness
        else -> SportThemePresets.General
    }
}

object SportThemePresets {
    val Football = SportVisualTheme(
        primaryColor = Color(0xFF00F59B),
        containerColor = Color(0x2600F59B),
        borderColor = Color(0x6600F59B),
        disciplineTag = "PITCH"
    )
    val Basketball = SportVisualTheme(
        primaryColor = Color(0xFFFF6B00),
        containerColor = Color(0x26FF6B00),
        borderColor = Color(0x66FF6B00),
        disciplineTag = "HARDWOOD"
    )
    val Padel = SportVisualTheme(
        primaryColor = ElectricLime,
        containerColor = Color(0x26C8F526),
        borderColor = Color(0x66C8F526),
        disciplineTag = "RACKET"
    )
    val TableTennis = SportVisualTheme(
        primaryColor = Color(0xFF00F0FF),
        containerColor = Color(0x2600F0FF),
        borderColor = Color(0x6600F0FF),
        disciplineTag = "SMASH"
    )
    val Volleyball = SportVisualTheme(
        primaryColor = Color(0xFFFFB800),
        containerColor = Color(0x26FFB800),
        borderColor = Color(0x66FFB800),
        disciplineTag = "COURT"
    )
    val Badminton = SportVisualTheme(
        primaryColor = Color(0xFFA855F7),
        containerColor = Color(0x26A855F7),
        borderColor = Color(0x66A855F7),
        disciplineTag = "SHUTTLE"
    )
    val Fitness = SportVisualTheme(
        primaryColor = Color(0xFFFF2E93),
        containerColor = Color(0x26FF2E93),
        borderColor = Color(0x66FF2E93),
        disciplineTag = "TRACK"
    )
    val General = SportVisualTheme(
        primaryColor = ElectricLime,
        containerColor = Color(0x26C8F526),
        borderColor = Color(0x66C8F526),
        disciplineTag = "ARENA"
    )
}

@Composable
fun SportNeonBadge(
    icon: String,
    theme: SportVisualTheme,
    size: Dp = 40.dp,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .size(size)
            .clip(RoundedCornerShape(14.dp))
            .background(
                brush = Brush.radialGradient(
                    colors = listOf(
                        theme.containerColor,
                        Color(0xFF101422)
                    )
                )
            )
            .border(
                BorderStroke(1.2.dp, theme.borderColor),
                RoundedCornerShape(14.dp)
            ),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = icon,
            fontSize = (size.value * 0.46f).sp
        )
    }
}

@Composable
fun SessionCapacityMeter(
    bookedSlots: Int,
    maxSlots: Int,
    accentColor: Color,
    modifier: Modifier = Modifier
) {
    val safeMax = if (maxSlots > 0) maxSlots else 1
    val fraction = (bookedSlots.toFloat() / safeMax.toFloat()).coerceIn(0f, 1f)
    val remaining = (maxSlots - bookedSlots).coerceAtLeast(0)

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(7.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(7.dp)
                        .clip(CircleShape)
                        .background(accentColor)
                )
                Spacer(modifier = Modifier.width(7.dp))
                Text(
                    text = "$bookedSlots/$safeMax PLAYERS ROSTERED",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.6.sp
                    ),
                    color = PlatinumSilver
                )
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(
                        when {
                            remaining == 0 -> StatusRed.copy(alpha = 0.18f)
                            remaining <= 2 -> StatusAmber.copy(alpha = 0.18f)
                            else -> accentColor.copy(alpha = 0.15f)
                        }
                    )
                    .border(
                        BorderStroke(
                            0.5.dp,
                            when {
                                remaining == 0 -> StatusRed.copy(alpha = 0.6f)
                                remaining <= 2 -> StatusAmber.copy(alpha = 0.6f)
                                else -> accentColor.copy(alpha = 0.5f)
                            }
                        ),
                        RoundedCornerShape(6.dp)
                    )
                    .padding(horizontal = 8.dp, vertical = 2.dp)
            ) {
                Text(
                    text = when {
                        remaining == 0 -> "MATCH FULL"
                        remaining <= 2 -> "🔥 ONLY $remaining LEFT"
                        else -> "⚡ $remaining SPOTS OPEN"
                    },
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Black,
                        fontSize = 10.sp
                    ),
                    color = when {
                        remaining == 0 -> StatusRed
                        remaining <= 2 -> StatusAmber
                        else -> accentColor
                    }
                )
            }
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp))
                .background(Color(0xFF0B0E17))
                .border(BorderStroke(0.5.dp, Color(0x26FFFFFF)), RoundedCornerShape(3.dp))
        ) {
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .fillMaxWidth(fraction)
                    .clip(RoundedCornerShape(3.dp))
                    .background(
                        brush = Brush.horizontalGradient(
                            colors = listOf(
                                accentColor.copy(alpha = 0.7f),
                                accentColor
                            )
                        )
                    )
            )
        }
    }
}

@Composable
fun LivePulseRadarBadge(
    label: String,
    modifier: Modifier = Modifier
) {
    val transition = rememberInfiniteTransition(label = "pulse")
    val alpha by transition.animateFloat(
        initialValue = 0.35f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse_alpha"
    )

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(Color(0xFF0F1526))
            .border(
                BorderStroke(1.dp, Color(0xFF10B981).copy(alpha = 0.45f)),
                RoundedCornerShape(20.dp)
            )
            .padding(horizontal = 12.dp, vertical = 6.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF10B981).copy(alpha = alpha))
            )
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Black,
                    letterSpacing = 0.8.sp
                ),
                color = PureWhite
            )
        }
    }
}

@Composable
fun LiveActivityPulseTicker(
    text: String = "24 Players Active • 5 Matches Filling in Tashkent",
    modifier: Modifier = Modifier
) {
    val transition = rememberInfiniteTransition(label = "pulse_ticker")
    val glowScale by transition.animateFloat(
        initialValue = 0.85f,
        targetValue = 1.25f,
        animationSpec = infiniteRepeatable(
            animation = tween(900, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "ticker_glow"
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(
                brush = Brush.horizontalGradient(
                    colors = listOf(
                        Color(0xFF161F1A),
                        Color(0xFF0F141C),
                        Color(0xFF151922)
                    )
                )
            )
            .border(
                BorderStroke(1.dp, Color(0x3310B981)),
                RoundedCornerShape(12.dp)
            )
            .padding(horizontal = 14.dp, vertical = 8.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(10.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF10B981).copy(alpha = 0.25f * glowScale)),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(6.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF00F59B))
                )
            }

            Spacer(modifier = Modifier.width(10.dp))

            Text(
                text = text.uppercase(),
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Black,
                    letterSpacing = 0.8.sp,
                    fontSize = 10.sp
                ),
                color = PureWhite
            )

            Spacer(modifier = Modifier.weight(1f))

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(Color(0x3300F59B))
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            ) {
                Text(
                    text = "LIVE",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Black,
                        fontSize = 9.sp
                    ),
                    color = Color(0xFF00F59B)
                )
            }
        }
    }
}

@Composable
fun GamifiedPlayerStreakBar(
    streakDays: Int = 3,
    levelName: String = "PLAYMAKER",
    currentXp: Int = 420,
    maxXp: Int = 500,
    modifier: Modifier = Modifier
) {
    val progress = (currentXp.toFloat() / maxXp.toFloat()).coerceIn(0f, 1f)

    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(
                brush = Brush.horizontalGradient(
                    colors = listOf(
                        Color(0xFF1F1A12),
                        Color(0xFF141724),
                        Color(0xFF181528)
                    )
                )
            )
            .border(
                BorderStroke(1.dp, Color(0x33F59E0B)),
                RoundedCornerShape(16.dp)
            )
            .padding(horizontal = 14.dp, vertical = 10.dp)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(Color(0x33FF6B00)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.LocalFireDepartment,
                            contentDescription = null,
                            tint = Color(0xFFFF6B00),
                            modifier = Modifier.size(16.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "$streakDays-MATCH STREAK",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.5.sp
                        ),
                        color = Color(0xFFFF8800)
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.ElectricBolt,
                        contentDescription = null,
                        tint = ElectricLime,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "LVL 3 $levelName",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.5.sp
                        ),
                        color = ElectricLime
                    )
                }
            }

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(5.dp)
                    .clip(RoundedCornerShape(3.dp))
                    .background(Color(0xFF0D101A))
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxHeight()
                        .fillMaxWidth(progress)
                        .clip(RoundedCornerShape(3.dp))
                        .background(
                            brush = Brush.horizontalGradient(
                                colors = listOf(Color(0xFFFF6B00), ElectricLime)
                            )
                        )
                )
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "$currentXp / $maxXp XP TO ALL-STAR",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold
                    ),
                    color = SlateMuted
                )
                Text(
                    text = "NEXT UNLOCK: GOLD BADGE",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold
                    ),
                    color = PlatinumSilver
                )
            }
        }
    }
}

@Composable
fun PlayerRosterStack(
    bookedSlots: Int,
    maxSlots: Int,
    accentColor: Color,
    modifier: Modifier = Modifier
) {
    val remaining = (maxSlots - bookedSlots).coerceAtLeast(0)
    val displayAvatars = bookedSlots.coerceAtMost(4)

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box {
            repeat(displayAvatars) { index ->
                val avatarColor = when (index % 4) {
                    0 -> ElectricLime
                    1 -> Color(0xFF00F5D4)
                    2 -> Color(0xFFFF6B00)
                    else -> Color(0xFFA855F7)
                }
                Box(
                    modifier = Modifier
                        .offset(x = (index * 20).dp)
                        .zIndex((displayAvatars - index).toFloat())
                        .size(28.dp)
                        .clip(CircleShape)
                        .background(avatarColor)
                        .border(BorderStroke(2.dp, Color(0xFF0F131E)), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = ('A' + index).toString(),
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Black,
                            fontSize = 11.sp
                        ),
                        color = Color(0xFF0B0E14)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.width((displayAvatars * 20 + 8).dp))

        if (remaining > 0) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(10.dp))
                    .background(Color(0x1FC8F526))
                    .border(
                        BorderStroke(1.dp, Color(0x55C8F526)),
                        RoundedCornerShape(10.dp)
                    )
                    .padding(horizontal = 8.dp, vertical = 3.dp)
            ) {
                Text(
                    text = "+$remaining OPEN",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Black,
                        fontSize = 10.sp
                    ),
                    color = ElectricLime
                )
            }
        }
    }
}

@Composable
fun UrgencyStatusPill(
    remainingSlots: Int,
    modifier: Modifier = Modifier
) {
    val transition = rememberInfiniteTransition(label = "urgency_pulse")
    val pulseAlpha by transition.animateFloat(
        initialValue = 0.5f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(650, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "urgency_alpha"
    )

    val (badgeText, badgeColor, borderColor) = when {
        remainingSlots == 0 -> Triple("MATCH FULL", Color(0xFF64748B), Color(0x3364748B))
        remainingSlots == 1 -> Triple(
            "🚨 FINAL SPOT",
            StatusRed,
            StatusRed.copy(alpha = pulseAlpha)
        )
        remainingSlots <= 3 -> Triple(
            "🔥 $remainingSlots SPOTS LEFT",
            StatusAmber,
            StatusAmber.copy(alpha = 0.8f)
        )
        else -> Triple(
            "⚡ OPEN PICKUP",
            ElectricLime,
            ElectricLime.copy(alpha = 0.6f)
        )
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(badgeColor.copy(alpha = 0.16f))
            .border(BorderStroke(1.dp, borderColor), RoundedCornerShape(8.dp))
            .padding(horizontal = 9.dp, vertical = 4.dp)
    ) {
        Text(
            text = badgeText,
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.Black,
                fontSize = 10.sp,
                letterSpacing = 0.5.sp
            ),
            color = badgeColor
        )
    }
}

@Composable
fun MatchVisualTag(
    text: String,
    icon: ImageVector? = null,
    iconEmoji: String? = null,
    tint: Color = PlatinumSilver,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(DarkSurfaceElevated)
            .border(
                BorderStroke(0.5.dp, Color(0x26FFFFFF)),
                RoundedCornerShape(8.dp)
            )
            .padding(horizontal = 9.dp, vertical = 5.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            if (icon != null) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = tint,
                    modifier = Modifier.size(13.dp)
                )
            } else if (iconEmoji != null) {
                Text(text = iconEmoji, fontSize = 11.sp)
            }
            Text(
                text = text,
                style = MaterialTheme.typography.labelSmall.copy(
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium
                ),
                color = tint
            )
        }
    }
}

@Composable
fun PerforatedTicketDivider(
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(1.dp)
            .background(
                brush = Brush.horizontalGradient(
                    colors = listOf(
                        Color.Transparent,
                        Color(0x33FFFFFF),
                        Color(0x66FFFFFF),
                        Color(0x33FFFFFF),
                        Color.Transparent
                    )
                )
            )
    )
}
