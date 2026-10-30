package uz.pley.app.core.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import uz.pley.app.core.ui.theme.DarkCard

fun Modifier.glassCard(
    shape: Shape = RoundedCornerShape(24.dp),
    backgroundColor: Color = Color(0xFF141724),
    borderAlpha: Float = 0.22f,
    strokeWidth: Dp = 1.dp
): Modifier = composed {
    this
        .clip(shape)
        .background(
            brush = Brush.verticalGradient(
                colors = listOf(
                    backgroundColor,
                    Color(0xFF0C0E15)
                )
            )
        )
        .border(
            width = strokeWidth,
            brush = Brush.verticalGradient(
                colors = listOf(
                    Color.White.copy(alpha = borderAlpha),
                    Color.White.copy(alpha = borderAlpha * 0.35f),
                    Color.Transparent
                )
            ),
            shape = shape
        )
}

fun Modifier.carbonCard(
    shape: Shape = RoundedCornerShape(20.dp),
    containerColor: Color = DarkCard,
    borderAlpha: Float = 0.20f,
    backgroundAlpha: Float = 1.0f,
    borderColor: Color? = null
): Modifier = composed {
    val bgColors = if (backgroundAlpha < 1.0f) {
        listOf(
            containerColor.copy(alpha = backgroundAlpha),
            Color(0xFF090B10).copy(alpha = backgroundAlpha)
        )
    } else {
        listOf(
            containerColor,
            Color(0xFF090B10)
        )
    }
    val borderColors = if (borderColor != null) {
        listOf(
            borderColor,
            borderColor.copy(alpha = borderColor.alpha * 0.3f),
            Color.Transparent
        )
    } else {
        listOf(
            Color.White.copy(alpha = borderAlpha),
            Color.White.copy(alpha = borderAlpha * 0.25f),
            Color.Transparent
        )
    }
    this
        .clip(shape)
        .background(
            brush = Brush.verticalGradient(
                colors = bgColors
            )
        )
        .border(
            width = 1.dp,
            brush = Brush.verticalGradient(
                colors = borderColors
            ),
            shape = shape
        )
}

fun Modifier.glassCardSubtle(
    shape: Shape = RoundedCornerShape(16.dp)
): Modifier = glassCard(
    shape = shape,
    backgroundColor = Color(0xFF11141E),
    borderAlpha = 0.16f
)

fun Modifier.glassCardProminent(
    shape: Shape = RoundedCornerShape(24.dp)
): Modifier = glassCard(
    shape = shape,
    backgroundColor = Color(0xFF191D2C),
    borderAlpha = 0.35f
)
