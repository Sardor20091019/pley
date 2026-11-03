package uz.pley.app.core.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import uz.pley.app.core.ui.theme.ElectricLime
import uz.pley.app.core.ui.theme.PlatinumSilver
import uz.pley.app.core.ui.theme.PureWhite
import uz.pley.app.core.ui.theme.StatusRed

enum class PleyAlertTone {
    ERROR,
    WARNING,
    SUCCESS,
    INFO,
    OFFLINE
}

@Composable
fun PleyAlertDialog(
    title: String,
    message: String,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier,
    tone: PleyAlertTone = PleyAlertTone.WARNING,
    primaryButtonText: String = "Got It",
    onPrimaryClick: () -> Unit = onDismiss,
    secondaryButtonText: String? = null,
    onSecondaryClick: (() -> Unit)? = null
) {
    val accentColor = when (tone) {
        PleyAlertTone.ERROR -> StatusRed
        PleyAlertTone.WARNING -> Color(0xFFF59E0B)
        PleyAlertTone.SUCCESS -> ElectricLime
        PleyAlertTone.INFO -> Color(0xFF38BDF8)
        PleyAlertTone.OFFLINE -> Color(0xFFFB923C)
    }

    val iconVector: ImageVector = when (tone) {
        PleyAlertTone.ERROR -> Icons.Default.Warning
        PleyAlertTone.WARNING -> Icons.Default.Warning
        PleyAlertTone.SUCCESS -> Icons.Default.CheckCircle
        PleyAlertTone.INFO -> Icons.Default.Info
        PleyAlertTone.OFFLINE -> Icons.Default.WifiOff
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = modifier
                .fillMaxWidth(0.92f)
                .clip(RoundedCornerShape(28.dp))
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            Color(0xFF161C2C),
                            Color(0xFF0E121E)
                        )
                    )
                )
                .border(
                    BorderStroke(1.dp, accentColor.copy(alpha = 0.45f)),
                    RoundedCornerShape(28.dp)
                )
                .padding(24.dp)
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .size(58.dp)
                        .clip(CircleShape)
                        .background(accentColor.copy(alpha = 0.16f))
                        .border(BorderStroke(1.5.dp, accentColor.copy(alpha = 0.55f)), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = iconVector,
                        contentDescription = null,
                        tint = accentColor,
                        modifier = Modifier.size(28.dp)
                    )
                }

                Spacer(modifier = Modifier.height(18.dp))

                Text(
                    text = title,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Black,
                    color = PureWhite,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = message,
                    style = MaterialTheme.typography.bodyMedium,
                    color = PlatinumSilver,
                    textAlign = TextAlign.Center,
                    lineHeight = 21.sp
                )

                Spacer(modifier = Modifier.height(24.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (secondaryButtonText != null && onSecondaryClick != null) {
                        OutlinedButton(
                            onClick = onSecondaryClick,
                            modifier = Modifier
                                .weight(1f)
                                .height(50.dp)
                                .kineticTouchEffect(pressedScale = 0.96f, onClick = onSecondaryClick),
                            shape = RoundedCornerShape(14.dp),
                            border = BorderStroke(1.dp, Color(0x33FFFFFF)),
                            colors = ButtonDefaults.outlinedButtonColors(
                                contentColor = PlatinumSilver
                            )
                        ) {
                            Text(
                                text = secondaryButtonText,
                                style = MaterialTheme.typography.labelLarge,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Button(
                        onClick = onPrimaryClick,
                        modifier = Modifier
                            .weight(1f)
                            .height(50.dp)
                            .kineticTouchEffect(pressedScale = 0.96f, onClick = onPrimaryClick),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = accentColor,
                            contentColor = if (tone == PleyAlertTone.SUCCESS || tone == PleyAlertTone.WARNING) Color(0xFF0F1117) else PureWhite
                        )
                    ) {
                        Text(
                            text = primaryButtonText,
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Black
                        )
                    }
                }
            }
        }
    }
}
