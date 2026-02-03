@echo off
REM Climapro Production Build Script for Windows
REM This script builds a production-ready APK for Android

echo ========================================
echo 🚀 Starting Climapro Production Build
echo ========================================
echo.

REM Step 1: Check prerequisites
echo 📋 Checking prerequisites...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js v18 or higher.
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm not found. Please install npm.
    exit /b 1
)

where eas >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ EAS CLI not found. Installing...
    call npm install -g eas-cli
)

echo ✅ Prerequisites check passed
echo.

REM Step 2: Install dependencies
echo 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo ✅ Dependencies installed
echo.

REM Step 3: Run quality checks
echo 🔍 Running code quality checks...

echo   → Running TypeScript compiler...
call npx tsc --noEmit
if %ERRORLEVEL% NEQ 0 (
    echo ❌ TypeScript errors found. Please fix them before building.
    exit /b 1
)
echo   ✅ TypeScript check passed

echo   → Running linter...
call npm run lint
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Linting warnings found. Consider fixing them.
)
echo.

REM Step 4: Verify configuration
echo ⚙️  Verifying configuration...

if not exist "app.json" (
    echo ❌ app.json not found
    exit /b 1
)

if not exist "eas.json" (
    echo ❌ eas.json not found
    exit /b 1
)

echo ✅ Configuration verified
echo.

REM Step 5: Check environment variables
echo 🔐 Checking environment variables...

if not exist ".env" (
    echo ⚠️  .env file not found. Make sure to set up environment variables.
) else (
    echo ✅ .env file found
)
echo.

REM Step 6: Login to EAS
echo 🔑 Checking EAS authentication...
call eas whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Not logged in to EAS. Please login:
    call eas login
)
echo ✅ Logged in to EAS
echo.

REM Step 7: Build production APK
echo 🏗️  Building production APK...
echo This may take 10-20 minutes. Please be patient...
echo.

call eas build --platform android --profile production --non-interactive
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed. Check the error messages above.
    exit /b 1
)
echo ✅ Build completed successfully!
echo.

REM Step 8: Download the APK
echo ⬇️  Downloading APK...
call eas build:download --platform android --profile production --output ./climapro-v1.0.0.apk
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Download failed. You can manually download from the EAS dashboard.
)
echo ✅ APK downloaded: climapro-v1.0.0.apk
echo.

REM Success message
echo ========================================
echo 🎉 Build Complete!
echo ========================================
echo.
echo 📱 Your production APK is ready!
echo 📦 Location: ./climapro-v1.0.0.apk
echo.
echo Next steps:
echo 1. Test the APK on a physical device
echo 2. Create a GitHub release (see DEPLOYMENT.md)
echo 3. Upload the APK to the release
echo.
echo For detailed deployment instructions, see:
echo 📄 DEPLOYMENT.md
echo.
echo ========================================

pause
