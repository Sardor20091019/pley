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
        override val message: String = "No internet connection. Please check your Wi-Fi or mobile data."
    ) : AppError(message)

    data class BadRequest(
        override val message: String
    ) : AppError(message)

    data class Unauthorized(
        override val message: String = "Session expired or authentication required. Please sign in."
    ) : AppError(message)

    data class Forbidden(
        override val message: String = "You do not have permission to perform this action."
    ) : AppError(message)

    data class NotFound(
        override val message: String = "Requested match or resource was not found."
    ) : AppError(message)

    data class Conflict(
        override val message: String
    ) : AppError(message)

    data class ServerInternal(
        val statusCode: Int,
        override val message: String = "Server is temporarily unavailable ($statusCode). Please try again later."
    ) : AppError(message)

    data class Serialization(
        override val message: String = "Failed to deserialize server response.",
        val causeThrowable: Throwable? = null
    ) : AppError(message, causeThrowable)

    data class Unknown(
        override val message: String = "An unexpected error occurred. Please try again.",
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

fun Throwable.toUserFriendlyMessage(): String {
    return when (this) {
        is AppError.NoNetwork -> "No internet connection. Please check your network and try again."
        is AppError.NetworkTimeout -> "Connection timed out. Please verify your connection."
        is AppError.Conflict -> message
        is AppError.BadRequest -> message
        is AppError.Unauthorized -> message
        is AppError.Forbidden -> message
        is AppError.NotFound -> message
        is AppError.ServerInternal -> message
        is AppError.Serialization -> "Received invalid response from server."
        is AppError.Unknown -> message
        is java.net.UnknownHostException, is java.net.ConnectException -> "Cannot connect to server. Please check your internet connection."
        is java.net.SocketTimeoutException -> "Connection timed out. Please try again."
        else -> localizedMessage?.takeIf { it.isNotBlank() } ?: "An unexpected error occurred. Please try again."
    }
}
