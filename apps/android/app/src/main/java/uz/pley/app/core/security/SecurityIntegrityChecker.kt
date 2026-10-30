package uz.pley.app.core.security

import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Debug
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import javax.inject.Inject
import javax.inject.Singleton

data class SecurityIntegrityStatus(
    val isCompromised: Boolean,
    val detections: List<String>
)

@Singleton
class SecurityIntegrityChecker @Inject constructor(
    @ApplicationContext private val context: Context
) {

    fun evaluateDeviceIntegrity(): SecurityIntegrityStatus {
        return runCatching {
            val detections = mutableListOf<String>()

            if (isDebuggerAttached()) {
                detections.add("DEBUGGER_ATTACHED")
            }

            if (hasTestKeys()) {
                detections.add("TEST_KEYS_BUILD")
            }

            if (hasSuBinary()) {
                detections.add("SU_BINARY_PRESENT")
            }

            if (hasRootPackages()) {
                detections.add("ROOT_MANAGEMENT_APP")
            }

            if (hasTamperingHooks()) {
                detections.add("DYNAMIC_HOOKING_FRAMEWORK")
            }

            SecurityIntegrityStatus(
                isCompromised = detections.isNotEmpty(),
                detections = detections
            )
        }.getOrDefault(SecurityIntegrityStatus(isCompromised = false, detections = emptyList()))
    }

    private fun isDebuggerAttached(): Boolean {
        return runCatching {
            Debug.isDebuggerConnected() || Debug.waitingForDebugger()
        }.getOrDefault(false)
    }

    private fun hasTestKeys(): Boolean {
        return runCatching {
            val buildTags = Build.TAGS
            buildTags != null && buildTags.contains("test-keys")
        }.getOrDefault(false)
    }

    private fun hasSuBinary(): Boolean {
        val paths = arrayOf(
            "/system/app/Superuser.apk",
            "/sbin/su",
            "/system/bin/su",
            "/system/xbin/su",
            "/data/local/xbin/su",
            "/data/local/bin/su",
            "/system/sd/xbin/su",
            "/system/bin/failsafe/su",
            "/data/local/su",
            "/su/bin/su"
        )
        return paths.any { path ->
            runCatching { File(path).exists() }.getOrDefault(false)
        }
    }

    private fun hasRootPackages(): Boolean {
        val rootPackages = listOf(
            "com.noshufou.android.su",
            "com.noshufou.android.su.elite",
            "eu.chainfire.supersu",
            "com.koushikdutta.superuser",
            "com.thirdparty.superuser",
            "com.yellowes.su",
            "com.topjohnwu.magisk",
            "de.robv.android.xposed.installer"
        )

        val pm = context.packageManager
        return rootPackages.any { pkg ->
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    pm.getPackageInfo(pkg, PackageManager.PackageInfoFlags.of(0))
                } else {
                    pm.getPackageInfo(pkg, 0)
                }
                true
            } catch (_: Exception) {
                false
            }
        }
    }

    private fun hasTamperingHooks(): Boolean {
        return try {
            val process = Runtime.getRuntime().exec(arrayOf("sh", "-c", "cat /proc/self/maps"))
            val reader = BufferedReader(InputStreamReader(process.inputStream))
            var line: String?
            var found = false
            while (reader.readLine().also { line = it } != null) {
                val current = line.orEmpty().lowercase()
                if (current.contains("frida") || current.contains("xposed") || current.contains("substrate")) {
                    found = true
                    break
                }
            }
            reader.close()
            process.destroy()
            found
        } catch (_: Exception) {
            false
        }
    }
}
