package uz.pley.app.core.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.sp
import coil.compose.SubcomposeAsyncImage
import coil.request.CachePolicy
import coil.request.ImageRequest

@Composable
fun PleyImage(
    imageUrl: String?,
    fallbackText: String,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    contentScale: ContentScale = ContentScale.Crop
) {
    if (imageUrl.isNullOrBlank()) {
        Box(
            modifier = modifier.background(MaterialTheme.colorScheme.surfaceVariant),
            contentAlignment = Alignment.Center
        ) {
            Text(text = fallbackText, fontSize = 24.sp)
        }
    } else {
        val context = LocalContext.current
        val imageRequest = ImageRequest.Builder(context)
            .data(imageUrl)
            .crossfade(true)
            .allowHardware(true)
            .memoryCachePolicy(CachePolicy.ENABLED)
            .diskCachePolicy(CachePolicy.ENABLED)
            .build()

        SubcomposeAsyncImage(
            model = imageRequest,
            contentDescription = contentDescription,
            contentScale = contentScale,
            modifier = modifier,
            loading = {
                Box(modifier = Modifier.fillMaxSize().shimmerEffect())
            },
            error = {
                Box(
                    modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.surfaceVariant),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = fallbackText, fontSize = 24.sp)
                }
            }
        )
    }
}

