@echo off
git add .
git commit -m "release: v1.0.0 Android widgets integration"
git remote add origin https://github.com/BRONX-09/1000.git
git fetch origin main
git merge origin/main --allow-unrelated-histories -X theirs -m "Merge remote init"
git push -u origin main
echo Git pipeline completed. Moving to Android Release Build...
cd android
call .\gradlew.bat assembleRelease
echo Release build finished!
