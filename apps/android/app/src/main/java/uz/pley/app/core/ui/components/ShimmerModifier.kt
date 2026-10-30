package uz.pley.app.core.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

fun Modifier.shimmerEffect(): Modifier = composed {
    val transition = rememberInfiniteTransition(label = "shimmer_transition")
    val translateAnimation by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1400f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "shimmer_float"
    )

    val shimmerColors = listOf(
        Color.White.copy(alpha = 0.04f),
        Color.White.copy(alpha = 0.12f),
        Color.White.copy(alpha = 0.04f)
    )

    background(
        Brush.linearGradient(
            colors = shimmerColors,
            start = Offset(x = translateAnimation - 400f, y = translateAnimation - 400f),
            end = Offset(x = translateAnimation, y = translateAnimation)
        )
    )
}
