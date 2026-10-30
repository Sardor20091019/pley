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
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

fun Modifier.kineticTouchEffect(
    pressedScale: Float = 0.95f,
    maxTiltDegrees: Float = 7f,
    maxTwistDegrees: Float = 4f,
    onClick: (() -> Unit)? = null
): Modifier = composed {
    val scale = remember { Animatable(1f) }
    val offsetX = remember { Animatable(0f) }
    val offsetY = remember { Animatable(0f) }
    val rotationX = remember { Animatable(0f) }
    val rotationY = remember { Animatable(0f) }
    val rotationZ = remember { Animatable(0f) }
    val scope = rememberCoroutineScope()
    val density = LocalDensity.current
    val maxTranslationPx = with(density) { 18.dp.toPx() }

    val springSpec = spring<Float>(
        stiffness = Spring.StiffnessLow,
        dampingRatio = Spring.DampingRatioLowBouncy
    )

    this
        .graphicsLayer {
            scaleX = scale.value
            scaleY = scale.value
            translationX = offsetX.value
            translationY = offsetY.value
            this.rotationX = rotationX.value
            this.rotationY = rotationY.value
            this.rotationZ = rotationZ.value
            cameraDistance = 18f * density.density
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
                var totalDragOffset = Offset.Zero
                val touchSlop = viewConfiguration.touchSlop

                while (true) {
                    val event = awaitPointerEvent()
                    val currentPointer = event.changes.firstOrNull { it.id == pointerId } ?: break

                    if (!currentPointer.pressed) {
                        if (totalDragOffset.getDistance() < touchSlop && onClick != null) {
                            currentPointer.consume()
                            onClick()
                        }
                        break
                    }

                    val currentPosition = currentPointer.position
                    val delta = currentPosition - downPosition
                    totalDragOffset = delta

                    val elasticX = (delta.x * 0.14f).coerceIn(-maxTranslationPx, maxTranslationPx)
                    val elasticY = (delta.y * 0.14f).coerceIn(-maxTranslationPx, maxTranslationPx)
                    val tiltAngleX = (-delta.y * 0.045f).coerceIn(-maxTiltDegrees, maxTiltDegrees)
                    val tiltAngleY = (delta.x * 0.045f).coerceIn(-maxTiltDegrees, maxTiltDegrees)
                    val twistAngleZ = ((delta.x * 0.02f) - (delta.y * 0.015f)).coerceIn(-maxTwistDegrees, maxTwistDegrees)

                    scope.launch {
                        offsetX.animateTo(elasticX, springSpec)
                    }
                    scope.launch {
                        offsetY.animateTo(elasticY, springSpec)
                    }
                    scope.launch {
                        rotationX.animateTo(tiltAngleX, springSpec)
                    }
                    scope.launch {
                        rotationY.animateTo(tiltAngleY, springSpec)
                    }
                    scope.launch {
                        rotationZ.animateTo(twistAngleZ, springSpec)
                    }
                }

                scope.launch {
                    scale.animateTo(1f, springSpec)
                }
                scope.launch {
                    offsetX.animateTo(0f, springSpec)
                }
                scope.launch {
                    offsetY.animateTo(0f, springSpec)
                }
                scope.launch {
                    rotationX.animateTo(0f, springSpec)
                }
                scope.launch {
                    rotationY.animateTo(0f, springSpec)
                }
                scope.launch {
                    rotationZ.animateTo(0f, springSpec)
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
