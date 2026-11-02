package uz.pley.app.core.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import kotlinx.coroutines.launch

fun Modifier.kineticTouchEffect(
    pressedScale: Float = 0.96f,
    maxTiltDegrees: Float = 2.5f,
    maxTwistDegrees: Float = 1.5f,
    onClick: (() -> Unit)? = null
): Modifier = composed {
    val scale = remember { Animatable(1f) }
    val rotationX = remember { Animatable(0f) }
    val rotationY = remember { Animatable(0f) }
    val scope = rememberCoroutineScope()

    val springSpec = spring<Float>(
        stiffness = Spring.StiffnessMediumLow,
        dampingRatio = Spring.DampingRatioLowBouncy
    )

    this
        .graphicsLayer {
            scaleX = scale.value
            scaleY = scale.value
            this.rotationX = rotationX.value
            this.rotationY = rotationY.value
        }
        .pointerInput(onClick) {
            awaitEachGesture {
                val down = awaitFirstDown(requireUnconsumed = false)
                val downPosition = down.position

                scope.launch {
                    scale.animateTo(
                        targetValue = pressedScale,
                        animationSpec = springSpec
                    )
                }

                val pointerId = down.id
                var hasDragged = false
                val touchSlop = viewConfiguration.touchSlop

                while (true) {
                    val event = awaitPointerEvent()
                    val currentPointer = event.changes.firstOrNull { it.id == pointerId } ?: break

                    if (!currentPointer.pressed) {
                        if (!hasDragged && onClick != null) {
                            currentPointer.consume()
                            onClick()
                        }
                        break
                    }

                    val currentPosition = currentPointer.position
                    val delta = currentPosition - downPosition

                    if (delta.getDistance() > touchSlop) {
                        hasDragged = true
                        scope.launch {
                            scale.animateTo(1f, springSpec)
                            rotationX.animateTo(0f, springSpec)
                            rotationY.animateTo(0f, springSpec)
                        }
                    } else if (!hasDragged) {
                        val tiltAngleX = (-delta.y * 0.02f).coerceIn(-maxTiltDegrees, maxTiltDegrees)
                        val tiltAngleY = (delta.x * 0.02f).coerceIn(-maxTiltDegrees, maxTiltDegrees)
                        scope.launch {
                            rotationX.animateTo(tiltAngleX, springSpec)
                            rotationY.animateTo(tiltAngleY, springSpec)
                        }
                    }
                }

                scope.launch {
                    scale.animateTo(1f, springSpec)
                    rotationX.animateTo(0f, springSpec)
                    rotationY.animateTo(0f, springSpec)
                }
            }
        }
}

fun Modifier.springPress(
    pressedScale: Float = 0.95f,
    onClick: () -> Unit
): Modifier = kineticTouchEffect(
    pressedScale = pressedScale,
    onClick = onClick
)
