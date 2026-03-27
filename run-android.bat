@echo off
:: Sets correct Java and Android SDK environment for this session,
:: then delegates to Expo CLI. Run this instead of 'npx expo run:android'.
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
set "ANDROID_HOME=C:\Users\curry\AppData\Local\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"

echo [1000 Dev] JAVA_HOME  = %JAVA_HOME%
echo [1000 Dev] ANDROID_HOME = %ANDROID_HOME%
echo.

npx expo run:android %*
