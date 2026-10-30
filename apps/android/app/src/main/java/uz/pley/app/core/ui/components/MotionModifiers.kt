package uz.pley.app.core.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import kotlinx.coroutines.launch

fun Modifier.springPress(
    pressedScale: Float = 0.95f,
    onClick: () -> Unit
): Modifier = composed {
    val scale = remember { Animatable(1f) }
    val scope = rememberCoroutineScope()

    this
        .graphicsLayer {
            scaleX = scale.value
            scaleY = scale.value
        }
        .pointerInput(Unit) {
            detectTapGestures(
                onPress = {
                    scope.launch {
                        scale.animateTo(
                            targetValue = pressedScale,
                            animationSpec = spring(
                                dampingRatio = Spring.DampingRatioLowBouncy,
                                stiffness = Spring.StiffnessMediumLow
                            )
                        )
                    }
                    try {
                        tryAwaitRelease()
                    } finally {
                        scope.launch {
                            scale.animateTo(
                                targetValue = 1f,
                                animationSpec = spring(
                                    dampingRatio = Spring.DampingRatioLowBouncy,
                                    stiffness = Spring.StiffnessLow
                                )
                            )
                        }
                    }
                },
                onTap = {
                    onClick()
                }
            )
        }
}
