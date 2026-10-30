package uz.pley.app.core.ui.components

import android.os.Build
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.BlurredEdgeTreatment
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.asComposeRenderEffect
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

fun Modifier.glassCard(
    shape: Shape = androidx.compose.foundation.shape.RoundedCornerShape(20.dp),
    blurRadius: Dp = 20.dp,
    backgroundAlpha: Float = 0.12f,
    borderAlpha: Float = 0.28f
): Modifier = composed {
    val blurMod = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        Modifier.graphicsLayer {
            renderEffect = android.graphics.RenderEffect
                .createBlurEffect(
                    blurRadius.value * density * 0.4f,
                    blurRadius.value * density * 0.4f,
                    android.graphics.Shader.TileMode.CLAMP
                )
                .asComposeRenderEffect()
        }
    } else {
        Modifier.blur(radius = blurRadius * 0.35f, edgeTreatment = BlurredEdgeTreatment.Unbounded)
    }

    this
        .clip(shape)
        .then(blurMod)
        .background(
            brush = Brush.linearGradient(
                colors = listOf(
                    Color.White.copy(alpha = backgroundAlpha + 0.04f),
                    Color.White.copy(alpha = backgroundAlpha)
                )
            )
        )
        .border(
            width = 1.dp,
            brush = Brush.linearGradient(
                colors = listOf(
                    Color.White.copy(alpha = borderAlpha),
                    Color.White.copy(alpha = borderAlpha * 0.5f),
                    Color.Transparent,
                    Color.White.copy(alpha = borderAlpha * 0.12f)
                ),
                start = Offset(0f, 0f),
                end = Offset(Float.POSITIVE_INFINITY, Float.POSITIVE_INFINITY)
            ),
            shape = shape
        )
}

fun Modifier.glassCardSubtle(
    shape: Shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp)
): Modifier = glassCard(
    shape = shape,
    blurRadius = 12.dp,
    backgroundAlpha = 0.08f,
    borderAlpha = 0.18f
)

fun Modifier.glassCardProminent(
    shape: Shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp)
): Modifier = glassCard(
    shape = shape,
    blurRadius = 28.dp,
    backgroundAlpha = 0.18f,
    borderAlpha = 0.36f
)
