package uz.pley.app.core.di

import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import uz.pley.app.core.network.ConnectivityObserver
import uz.pley.app.core.network.NetworkConnectivityObserver
import uz.pley.app.data.repository.AuthRepository
import uz.pley.app.data.repository.AuthRepositoryImpl
import uz.pley.app.data.repository.BookingsRepository
import uz.pley.app.data.repository.BookingsRepositoryImpl
import uz.pley.app.data.repository.ProfileRepository
import uz.pley.app.data.repository.ProfileRepositoryImpl
import uz.pley.app.data.repository.SessionsRepository
import uz.pley.app.data.repository.SessionsRepositoryImpl
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindConnectivityObserver(
        impl: NetworkConnectivityObserver
    ): ConnectivityObserver

    @Binds
    @Singleton
    abstract fun bindAuthRepository(
        impl: AuthRepositoryImpl
    ): AuthRepository

    @Binds
    @Singleton
    abstract fun bindSessionsRepository(
        impl: SessionsRepositoryImpl
    ): SessionsRepository

    @Binds
    @Singleton
    abstract fun bindBookingsRepository(
        impl: BookingsRepositoryImpl
    ): BookingsRepository

    @Binds
    @Singleton
    abstract fun bindProfileRepository(
        impl: ProfileRepositoryImpl
    ): ProfileRepository
}
