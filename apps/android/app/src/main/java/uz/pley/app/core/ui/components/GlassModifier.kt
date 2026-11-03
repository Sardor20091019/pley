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
    backgroundColor: Color = Color(0xFF141928),
    borderAlpha: Float = 0.24f,
    strokeWidth: Dp = 1.dp
): Modifier = composed {
    this
        .clip(shape)
        .background(
            brush = Brush.verticalGradient(
                colors = listOf(
                    backgroundColor,
                    Color(0xFF0D101A)
                )
            )
        )
        .border(
            width = strokeWidth,
            brush = Brush.verticalGradient(
                colors = listOf(
                    Color.White.copy(alpha = borderAlpha),
                    Color.White.copy(alpha = borderAlpha * 0.4f),
                    Color(0x0AFFFFFF)
                )
            ),
            shape = shape
        )
}

fun Modifier.carbonCard(
    shape: Shape = RoundedCornerShape(22.dp),
    containerColor: Color = DarkCard,
    borderAlpha: Float = 0.22f,
    backgroundAlpha: Float = 1.0f,
    borderColor: Color? = null
): Modifier = composed {
    val bgColors = listOf(
        containerColor.copy(alpha = backgroundAlpha),
        Color(0xFF0C0F18).copy(alpha = backgroundAlpha)
    )
    val borderColors = if (borderColor != null) {
        listOf(
            borderColor,
            borderColor.copy(alpha = borderColor.alpha * 0.4f),
            Color(0x0AFFFFFF)
        )
    } else {
        listOf(
            Color.White.copy(alpha = borderAlpha),
            Color.White.copy(alpha = borderAlpha * 0.35f),
            Color(0x08FFFFFF)
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
    shape: Shape = RoundedCornerShape(18.dp)
): Modifier = glassCard(
    shape = shape,
    backgroundColor = Color(0xFF111624),
    borderAlpha = 0.18f
)

fun Modifier.glassCardProminent(
    shape: Shape = RoundedCornerShape(26.dp)
): Modifier = glassCard(
    shape = shape,
    backgroundColor = Color(0xFF1A2134),
    borderAlpha = 0.35f
)
