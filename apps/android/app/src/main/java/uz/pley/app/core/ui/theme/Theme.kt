package uz.pley.app.core.ui.theme

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.TileMode
import kotlin.math.cos
import kotlin.math.sin

private val GlassColorScheme = darkColorScheme(
    primary = NeonCyan,
    onPrimary = GlassDeepIndigo,
    primaryContainer = Color(0x2600F5D4),
    onPrimaryContainer = WarmWhite,
    secondary = NeonIndigo,
    onSecondary = WarmWhite,
    secondaryContainer = Color(0x267B61FF),
    onSecondaryContainer = WarmWhite,
    background = GlassDeepIndigo,
    onBackground = WarmWhite,
    surface = GlassWhite10,
    onSurface = WarmWhite,
    surfaceVariant = GlassWhite5,
    onSurfaceVariant = SoftWhite,
    outline = GlassBorderStart,
    outlineVariant = Color(0x1AFFFFFF),
    error = StatusRed,
    onError = WarmWhite
)

@Composable
fun AmbientCanvas(modifier: Modifier = Modifier) {
    val transition = rememberInfiniteTransition(label = "ambient_canvas")

    val phase1 by transition.animateFloat(
        initialValue = 0f,
        targetValue = (2 * Math.PI).toFloat(),
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 18000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "ambient_phase1"
    )
    val phase2 by transition.animateFloat(
        initialValue = (Math.PI).toFloat(),
        targetValue = (3 * Math.PI).toFloat(),
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 24000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "ambient_phase2"
    )
    val phase3 by transition.animateFloat(
        initialValue = (0.5 * Math.PI).toFloat(),
        targetValue = (2.5 * Math.PI).toFloat(),
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 30000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "ambient_phase3"
    )

    Canvas(modifier = modifier.fillMaxSize()) {
        val w = size.width
        val h = size.height

        drawRect(
            brush = Brush.verticalGradient(
                colors = listOf(
                    GlassDeepIndigo,
                    GlassOceanAbyss,
                    GlassPurpleVoid,
                    GlassMidnightTeal
                )
            ),
            size = size
        )

        val center1 = Offset(
            x = w * 0.3f + w * 0.25f * cos(phase1),
            y = h * 0.25f + h * 0.15f * sin(phase1)
        )
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(
                    AmbientIndigo.copy(alpha = 0.55f),
                    AmbientViolet.copy(alpha = 0.25f),
                    Color.Transparent
                ),
                center = center1,
                radius = w * 0.65f,
                tileMode = TileMode.Clamp
            ),
            radius = w * 0.65f,
            center = center1
        )

        val center2 = Offset(
            x = w * 0.72f + w * 0.18f * sin(phase2),
            y = h * 0.55f + h * 0.2f * cos(phase2)
        )
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(
                    AmbientTeal.copy(alpha = 0.50f),
                    AmbientCyan.copy(alpha = 0.22f),
                    Color.Transparent
                ),
                center = center2,
                radius = w * 0.55f,
                tileMode = TileMode.Clamp
            ),
            radius = w * 0.55f,
            center = center2
        )

        val center3 = Offset(
            x = w * 0.15f + w * 0.22f * cos(phase3 * 0.7f),
            y = h * 0.72f + h * 0.18f * sin(phase3 * 0.7f)
        )
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(
                    AmbientCoral.copy(alpha = 0.40f),
                    AmbientViolet.copy(alpha = 0.18f),
                    Color.Transparent
                ),
                center = center3,
                radius = w * 0.50f,
                tileMode = TileMode.Clamp
            ),
            radius = w * 0.50f,
            center = center3
        )

        drawRect(
            brush = Brush.verticalGradient(
                colors = listOf(
                    Color.Black.copy(alpha = 0.35f),
                    Color.Transparent,
                    Color.Black.copy(alpha = 0.20f)
                )
            ),
            size = size
        )
    }
}

@Composable
fun PleyTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = GlassColorScheme,
        typography = PleyTypography
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            AmbientCanvas()
            content()
        }
    }
}
