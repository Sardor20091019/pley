package uz.pley.app.core.network

import org.json.JSONArray
import org.json.JSONObject
import retrofit2.Response

fun <T> Response<T>.toAppError(): AppError {
    val statusCode = code()
    val rawBody = runCatching { errorBody()?.string() }.getOrNull()
    val parsedMessage = extractMessageFromJson(rawBody, statusCode)

    return when (statusCode) {
        400 -> AppError.BadRequest(parsedMessage)
        401 -> AppError.Unauthorized(parsedMessage)
        403 -> AppError.Forbidden(parsedMessage)
        404 -> AppError.NotFound(parsedMessage)
        409 -> AppError.Conflict(parsedMessage)
        in 500..599 -> AppError.ServerInternal(statusCode, parsedMessage)
        else -> AppError.Unknown(parsedMessage)
    }
}

fun extractMessageFromJson(raw: String?, statusCode: Int): String {
    if (raw.isNullOrBlank()) {
        return defaultMessageForStatus(statusCode)
    }

    return runCatching {
        val json = JSONObject(raw)
        if (json.has("message")) {
            val msgObj = json.get("message")
            if (msgObj is JSONArray) {
                val list = mutableListOf<String>()
                for (i in 0 until msgObj.length()) {
                    list.add(msgObj.getString(i))
                }
                list.joinToString("\n")
            } else {
                msgObj.toString()
            }
        } else if (json.has("error")) {
            json.getString("error")
        } else {
            defaultMessageForStatus(statusCode)
        }
    }.getOrDefault(defaultMessageForStatus(statusCode))
}

private fun defaultMessageForStatus(statusCode: Int): String {
    return when (statusCode) {
        400 -> "Invalid request. Please check your information."
        401 -> "Session expired. Please sign in again."
        403 -> "You do not have permission to perform this action."
        404 -> "Requested match or resource was not found."
        409 -> "Action conflict. You may already have an active reservation for this game or the session reached maximum capacity."
        in 500..599 -> "Server is temporarily unavailable. Please try again later."
        else -> "Server returned status code $statusCode."
    }
}

