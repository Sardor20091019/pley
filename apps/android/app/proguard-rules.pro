-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
}

-keepclassmembers class * {
    @kotlinx.serialization.SerialName <fields>;
}

-keepclassmembers class * {
    @kotlinx.serialization.Serializable <fields>;
}

-keepclassmembers class * extends kotlinx.serialization.internal.GeneratedSerializer {
    <fields>;
    <methods>;
}

-keep class * extends androidx.room.RoomDatabase {
    <fields>;
    <methods>;
}

-keep class uz.pley.app.core.database.** { *; }

-keep @androidx.room.Entity class * { *; }

-keep @androidx.room.Dao interface * { *; }

-keep class uz.pley.app.presentation.navigation.** { *; }

-keep class com.google.android.gms.maps.** { *; }
-keep interface com.google.android.gms.maps.** { *; }
-keep class com.google.maps.android.** { *; }

-keepclassmembers class * {
    @dagger.hilt.* <methods>;
    @javax.inject.* <methods>;
}

-keep,allowobfuscation interface uz.pley.app.core.network.PleyApiService {
    <methods>;
}

-keepclassmembers,allowobfuscation class uz.pley.app.core.network.model.** {
    <fields>;
}

-dontwarn okhttp3.**
-dontwarn retrofit2.**
-dontwarn kotlinx.serialization.**
-dontwarn androidx.security.crypto.**
-dontwarn com.google.android.gms.**
-dontwarn androidx.room.paging.**
