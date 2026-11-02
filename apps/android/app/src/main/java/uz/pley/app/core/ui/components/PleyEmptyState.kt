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
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import uz.pley.app.core.ui.theme.DarkCard
import uz.pley.app.core.ui.theme.ElectricLime
import uz.pley.app.core.ui.theme.PlatinumSilver
import uz.pley.app.core.ui.theme.PureWhite
import uz.pley.app.core.ui.theme.SlateMuted

@Composable
fun PleyEmptyState(
    title: String,
    description: String,
    modifier: Modifier = Modifier,
    iconEmoji: String? = "⚡",
    iconVector: ImageVector? = null,
    actionLabel: String? = null,
    onActionClick: (() -> Unit)? = null
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(DarkCard)
            .border(
                BorderStroke(1.dp, Color(0x22FFFFFF)),
                RoundedCornerShape(24.dp)
            )
            .padding(horizontal = 24.dp, vertical = 32.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(CircleShape)
                    .background(Color(0x1AD4FF00))
                    .border(
                        BorderStroke(1.dp, Color(0x40D4FF00)),
                        CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                if (iconVector != null) {
                    Icon(
                        imageVector = iconVector,
                        contentDescription = null,
                        tint = ElectricLime,
                        modifier = Modifier.size(28.dp)
                    )
                } else if (iconEmoji != null) {
                    Text(
                        text = iconEmoji,
                        fontSize = 28.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            Text(
                text = title,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = PureWhite,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = SlateMuted,
                textAlign = TextAlign.Center,
                lineHeight = 20.sp,
                modifier = Modifier.padding(horizontal = 12.dp)
            )

            if (!actionLabel.isNullOrBlank() && onActionClick != null) {
                Spacer(modifier = Modifier.height(22.dp))

                Button(
                    onClick = onActionClick,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = ElectricLime,
                        contentColor = Color(0xFF0A0C05)
                    ),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier
                        .height(48.dp)
                        .minimumInteractiveComponentSize()
                ) {
                    Text(
                        text = actionLabel,
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Black
                    )
                }
            }
        }
    }
}

