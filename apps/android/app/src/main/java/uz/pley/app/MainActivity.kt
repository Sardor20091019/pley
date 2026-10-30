package uz.pley.app

import android.content.Intent
import android.os.Bundle
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import dagger.hilt.android.AndroidEntryPoint
import uz.pley.app.core.security.SecurityIntegrityChecker
import uz.pley.app.core.security.SecurityIntegrityStatus
import uz.pley.app.core.storage.TokenManager
import uz.pley.app.core.ui.theme.PleyTheme
import uz.pley.app.presentation.auth.AuthViewModel
import uz.pley.app.presentation.navigation.AppNavHost
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject
    lateinit var securityChecker: SecurityIntegrityChecker

    @Inject
    lateinit var tokenManager: TokenManager

    private val authViewModel: AuthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (!BuildConfig.DEBUG) {
            window.setFlags(
                WindowManager.LayoutParams.FLAG_SECURE,
                WindowManager.LayoutParams.FLAG_SECURE
            )
        }

        enableEdgeToEdge()

        handleAuthIntent(intent)

        val integrity = securityChecker.evaluateDeviceIntegrity()

        setContent {
            PleyTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    var isCompromised by remember {
                        mutableStateOf(!BuildConfig.DEBUG && integrity.isCompromised)
                    }

                    if (isCompromised) {
                        SecurityBlockedScreen(
                            status = integrity,
                            onClose = { finishAffinity() }
                        )
                    } else {
                        AppNavHost()
                    }
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleAuthIntent(intent)
    }

    private fun handleAuthIntent(intent: Intent?) {
        val uri = intent?.data ?: return
        if (uri.scheme == "uz.pley.app" && uri.host == "auth" && uri.path?.startsWith("/callback") == true) {
            val code = uri.getQueryParameter("code")
            if (!code.isNullOrBlank()) {
                authViewModel.loginWithGoogleCode(code, "uz.pley.app://auth/callback")
            }
        }
    }
}

@Composable
fun SecurityBlockedScreen(
    status: SecurityIntegrityStatus,
    onClose: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Security Violation Detected",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.error
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            text = "This application cannot run on a compromised or rooted environment. The following integrity alerts were triggered: ${status.detections.joinToString(", ")}.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(24.dp))
        Button(onClick = onClose) {
            Text("Exit Application")
        }
    }
}
