-optimizationpasses 5
-allowaccessmodification
-repackageclasses ''
-overloadaggressively

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

-keepclassmembers class * {
    @androidx.room.* <methods>;
}

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
