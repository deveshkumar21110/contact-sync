@echo off
echo Starting ContactSync Application...
echo.
echo Step 1: Compiling project to ensure MapStruct classes are generated...
mvn compile -q
if %errorlevel% neq 0 (
    echo Compilation failed!
    pause
    exit /b 1
)
echo Compilation successful!
echo.
echo Step 2: Starting Spring Boot application...
echo.
mvn spring-boot:run
pause 