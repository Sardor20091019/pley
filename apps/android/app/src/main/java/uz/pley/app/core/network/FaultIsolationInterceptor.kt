package uz.pley.app.core.network

import okhttp3.Interceptor
import okhttp3.Response
import java.io.IOException
import java.net.ConnectException
import java.net.SocketTimeoutException
import java.net.UnknownHostException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FaultIsolationInterceptor @Inject constructor() : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val response = try {
            chain.proceed(request)
        } catch (e: SocketTimeoutException) {
            throw AppError.NetworkTimeout()
        } catch (e: UnknownHostException) {
            throw AppError.NoNetwork()
        } catch (e: ConnectException) {
            throw AppError.NoNetwork()
        } catch (e: AppError) {
            throw e
        } catch (e: IOException) {
            throw AppError.Unknown(message = e.localizedMessage ?: "Network I/O failed", causeThrowable = e)
        } catch (e: Exception) {
            throw AppError.Unknown(message = e.localizedMessage ?: "Unexpected error", causeThrowable = e)
        }

        if (response.code in 500..599) {
            throw AppError.ServerInternal(statusCode = response.code)
        }

        return response
    }
}

