package uz.pley.app.presentation.auth

import android.app.Activity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import kotlinx.coroutines.launch
import uz.pley.app.BuildConfig
import uz.pley.app.core.ui.theme.NeonCyan

private val BrandPrimary = NeonCyan

@Composable
fun AuthDialog(
    onDismiss: () -> Unit,
    onSuccess: () -> Unit,
    viewModel: AuthViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current

    val gso = remember {
        GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(BuildConfig.GOOGLE_CLIENT_ID)
            .requestEmail()
            .requestProfile()
            .build()
    }

    val googleSignInClient = remember(context) {
        GoogleSignIn.getClient(context, gso)
    }

    val googleSignInLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
        try {
            val account = task.getResult(ApiException::class.java)
            val idToken = account?.idToken
            if (!idToken.isNullOrBlank()) {
                viewModel.loginWithGoogleCredential(idToken)
            } else {
                viewModel.setAuthError("Failed to obtain Google ID token. Please check Google Cloud Console configuration.")
            }
        } catch (e: ApiException) {
            if (e.statusCode == 12501) {
                return@rememberLauncherForActivityResult
            }
            val explanation = when (e.statusCode) {
                10 -> "Configuration Error 10 (DEVELOPER_ERROR): Package 'uz.pley.app' and your debug SHA-1 fingerprint must be registered in Google Cloud Console."
                12500 -> "Sign-In Error 12500: Check Google Cloud OAuth Consent Screen and SHA-1 registration."
                7 -> "Network error 7: Cannot connect to Google servers. Please check your internet connection."
                else -> "Google Sign-In failed (code ${e.statusCode}: ${e.statusMessage ?: e.message ?: "Unknown"})."
            }
            viewModel.setAuthError(explanation)
        }
    }

    LaunchedEffect(uiState) {
        if (uiState is AuthUiState.Success) {
            viewModel.resetState()
            onSuccess()
        }
    }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .padding(4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    GoogleLogo(modifier = Modifier.size(36.dp))
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = "Sign In with Google",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = "Connect your Google account to book matches, reserve spots, and join community sports in Tashkent.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(24.dp))

                if (uiState is AuthUiState.Error) {
                    Surface(
                        color = MaterialTheme.colorScheme.errorContainer,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = (uiState as AuthUiState.Error).message,
                            color = MaterialTheme.colorScheme.onErrorContainer,
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.padding(12.dp),
                            textAlign = TextAlign.Center
                        )
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                }

                Button(
                    onClick = {
                        googleSignInLauncher.launch(googleSignInClient.signInIntent)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .minimumInteractiveComponentSize(),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color.White,
                        contentColor = Color(0xFF1F1F1F)
                    ),
                    elevation = ButtonDefaults.buttonElevation(defaultElevation = 2.dp),
                    enabled = uiState !is AuthUiState.Loading
                ) {
                    if (uiState is AuthUiState.Loading) {
                        CircularProgressIndicator(
                            color = Color.Black,
                            modifier = Modifier.size(20.dp),
                            strokeWidth = 2.5.dp
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "Connecting to Google...",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = Color.Black
                        )
                    } else {
                        GoogleLogo(modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = "Continue with Google",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = Color(0xFF1F1F1F)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                TextButton(
                    onClick = onDismiss,
                    modifier = Modifier
                        .fillMaxWidth()
                        .minimumInteractiveComponentSize()
                ) {
                    Text("Cancel", color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }
    }
}

@Composable
fun GoogleLogo(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val stroke = size.width * 0.18f
        val cx = size.width / 2f
        val cy = size.height / 2f

        drawArc(
            color = Color(0xFFEA4335),
            startAngle = 180f,
            sweepAngle = 110f,
            useCenter = false,
            style = Stroke(width = stroke)
        )
        drawArc(
            color = Color(0xFF4285F4),
            startAngle = 290f,
            sweepAngle = 110f,
            useCenter = false,
            style = Stroke(width = stroke)
        )
        drawArc(
            color = Color(0xFF34A853),
            startAngle = 40f,
            sweepAngle = 100f,
            useCenter = false,
            style = Stroke(width = stroke)
        )
        drawArc(
            color = Color(0xFFFBBC05),
            startAngle = 140f,
            sweepAngle = 40f,
            useCenter = false,
            style = Stroke(width = stroke)
        )
        drawLine(
            color = Color(0xFF4285F4),
            start = Offset(cx, cy),
            end = Offset(size.width - stroke / 2f, cy),
            strokeWidth = stroke
        )
    }
}
