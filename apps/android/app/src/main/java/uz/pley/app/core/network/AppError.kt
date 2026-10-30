package uz.pley.app.core.network

import java.io.IOException

sealed class AppError(
    override val message: String,
    cause: Throwable? = null
) : IOException(message, cause) {

    data class NetworkTimeout(
        override val message: String = "Connection timed out. Please check your network connection."
    ) : AppError(message)

    data class NoNetwork(
        override val message: String = "No internet connection detected."
    ) : AppError(message)

    data class ServerInternal(
        val statusCode: Int,
        override val message: String = "Internal server error occurred ($statusCode)."
    ) : AppError(message)

    data class Serialization(
        override val message: String = "Failed to deserialize server response.",
        val causeThrowable: Throwable? = null
    ) : AppError(message, causeThrowable)

    data class Unknown(
        override val message: String = "An unexpected error occurred.",
        val causeThrowable: Throwable? = null
    ) : AppError(message, causeThrowable)
}

fun Throwable.toAppError(): AppError {
    return when (this) {
        is AppError -> this
        is java.net.SocketTimeoutException -> AppError.NetworkTimeout()
        is java.net.UnknownHostException, is java.net.ConnectException -> AppError.NoNetwork()
        is kotlinx.serialization.SerializationException -> AppError.Serialization(
            message = localizedMessage ?: "Serialization failed",
            causeThrowable = this
        )
        else -> AppError.Unknown(
            message = localizedMessage ?: "Unknown error",
            causeThrowable = this
        )
    }
}

