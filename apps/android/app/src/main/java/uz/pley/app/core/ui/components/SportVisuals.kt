package uz.pley.app.core.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import uz.pley.app.core.ui.theme.DarkSurfaceElevated
import uz.pley.app.core.ui.theme.ElectricLime
import uz.pley.app.core.ui.theme.PlatinumSilver
import uz.pley.app.core.ui.theme.PureWhite
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
        "basketball" -> SportThemePresets.Basketball
        "padel", "tennis" -> SportThemePresets.Padel
        "volleyball", "badminton" -> SportThemePresets.Volleyball
        "running", "fitness", "crossfit" -> SportThemePresets.Fitness
        else -> SportThemePresets.General
    }
}

object SportThemePresets {
    val Football = SportVisualTheme(
        primaryColor = Color(0xFF10B981),
        containerColor = Color(0x2610B981),
        borderColor = Color(0x6610B981),
        disciplineTag = "PITCH"
    )
    val Basketball = SportVisualTheme(
        primaryColor = Color(0xFFF97316),
        containerColor = Color(0x26F97316),
        borderColor = Color(0x66F97316),
        disciplineTag = "HARDWOOD"
    )
    val Padel = SportVisualTheme(
        primaryColor = ElectricLime,
        containerColor = Color(0x26C8F526),
        borderColor = Color(0x66C8F526),
        disciplineTag = "RACKET"
    )
    val Volleyball = SportVisualTheme(
        primaryColor = Color(0xFF06B6D4),
        containerColor = Color(0x2606B6D4),
        borderColor = Color(0x6606B6D4),
        disciplineTag = "COURT"
    )
    val Fitness = SportVisualTheme(
        primaryColor = Color(0xFFA855F7),
        containerColor = Color(0x26A855F7),
        borderColor = Color(0x66A855F7),
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
