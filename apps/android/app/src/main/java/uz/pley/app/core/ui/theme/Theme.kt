package uz.pley.app.core.ui.theme

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

private val LuxuryDarkColorScheme = darkColorScheme(
    primary = ElectricLime,
    onPrimary = Color(0xFF0B0E14),
    primaryContainer = ElectricLimeMuted,
    onPrimaryContainer = PureWhite,
    secondary = CyberCyan,
    onSecondary = DarkCanvas,
    secondaryContainer = DarkSurfaceElevated,
    onSecondaryContainer = PureWhite,
    background = DarkCanvas,
    onBackground = PureWhite,
    surface = DarkSurface,
    onSurface = PureWhite,
    surfaceVariant = DarkCard,
    onSurfaceVariant = PlatinumSilver,
    outline = HairlineBorder,
    outlineVariant = Color(0x14FFFFFF),
    error = StatusRed,
    onError = PureWhite
)

@Composable
fun AmbientCanvas(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier.fillMaxSize()) {
        val w = size.width
        val h = size.height

        drawRect(
            brush = Brush.verticalGradient(
                colors = listOf(
                    Color(0xFF0F131E),
                    Color(0xFF0B0E17),
                    Color(0xFF080A10)
                )
            ),
            size = size
        )

        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(
                    Color(0x1CC8F526),
                    Color.Transparent
                ),
                center = Offset(w * 0.5f, -h * 0.04f),
                radius = w * 0.85f
            ),
            radius = w * 0.85f,
            center = Offset(w * 0.5f, -h * 0.04f)
        )

        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(
                    Color(0x1200F5D4),
                    Color.Transparent
                ),
                center = Offset(w * 0.9f, h * 0.55f),
                radius = w * 0.65f
            ),
            radius = w * 0.65f,
            center = Offset(w * 0.9f, h * 0.55f)
        )
    }
}

@Composable
fun PleyTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LuxuryDarkColorScheme,
        typography = PleyTypography
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(DarkCanvas)
        ) {
            AmbientCanvas()
            content()
        }
    }
}
