# 1000 — The Ultimate Habit Tracker

Welcome to **1000**, your minimal, native Android habit tracker designed to help you break bad habits and build atomic routines entirely offline, directly from your Home Screen.

## 🚀 Features
- **Native Android Home Screen Widgets**: Monitor your streaks and log your urges without even opening the app.
- **Urge Button Widget**: A vibrant red quick-access pill to actively resist and log your addictions in real-time.
- **Dashboard Widget**: A quick overview of your daily check-in habits.
- **100% Offline Architecture**: Your data never leaves your device and runs instantly using `AsyncStorage` and Native background threads.
- **Dynamic Streak Tracking**: Automatically calculates your clean days and daily completions.

## 📥 Get the Application
The standalone Android Production APK for Version 1.0.0 is available!
You can find the `1000-v1.0.0.apk` file included locally in the root of this project (if cloned) or attached directly to our GitHub Releases.

**To Install the APK:**
1. Download `1000-v1.0.0.apk` to your Android device.
2. Tap the file to install (you may need to allow "Install from Unknown Sources" in your settings).
3. Open "1000" from your App Drawer!
4. Long-press your home screen to deploy the Widgets!

## 💻 Technical Architecture
- Expo SDK 52 & React Compiler
- React Native 0.81
- Native Android `RemoteViews` integration via `react-native-android-widget`
- Synchronous `AsyncStorage` 
