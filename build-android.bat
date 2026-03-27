@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
set "ANDROID_HOME=C:\Users\curry\AppData\Local\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo JAVA_HOME=%JAVA_HOME%
echo Testing java...
"%JAVA_HOME%\bin\java.exe" -version
echo.
echo Building Android app...
cd /d "%~dp0android"
call gradlew.bat app:assembleDebug
echo EXIT CODE: %ERRORLEVEL%
