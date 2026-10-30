package uz.pley.app.core.network.model

import kotlinx.serialization.Serializable

@Serializable
enum class SkillLevel {
    ALL_LEVELS,
    BEGINNER,
    CASUAL,
    INTERMEDIATE,
    ADVANCED
}

@Serializable
enum class SessionVibe {
    FRIENDLY,
    COMPETITIVE,
    LEARNING,
    SOCIAL
}

@Serializable
enum class SessionStatus {
    DRAFT,
    PUBLISHED,
    CANCELLED,
    COMPLETED
}

@Serializable
enum class BookingStatus {
    PENDING_PAYMENT,
    CONFIRMED,
    CANCELLED,
    REFUND_PENDING,
    REFUNDED,
    COMPLETED,
    NO_SHOW
}

@Serializable
enum class UserRole {
    USER,
    ADMIN
}

@Serializable
enum class UserStatus {
    ACTIVE,
    SUSPENDED
}

