# 🚀 Climapro Deployment Guide

This guide provides step-by-step instructions for building and deploying Climapro v1.0.0 to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Build Checklist](#pre-build-checklist)
3. [Building Production APK](#building-production-apk)
4. [Testing the Build](#testing-the-build)
5. [Creating GitHub Release](#creating-github-release)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **Expo CLI**: Latest version
- **EAS CLI**: For building production builds
- **Git**: For version control
- **GitHub Account**: For hosting releases

### Install EAS CLI

```bash
npm install -g eas-cli
```

### Login to Expo

```bash
eas login
```

---

## Pre-Build Checklist

Before building for production, ensure the following:

### 1. Code Quality Checks

```bash
# Run TypeScript compiler
npx tsc

# Run linter
npm run lint

# Fix any errors that appear
```

### 2. Verify app.json Configuration

Ensure `app.json` contains correct production values:

```json
{
  "expo": {
    "name": "Climapro",
    "slug": "climapro",
    "version": "1.0.0",
    "android": {
      "package": "com.umar.climapro",
      "versionCode": 1
    },
    "ios": {
      "bundleIdentifier": "com.umar.climapro",
      "buildNumber": "1"
    }
  }
}
```

### 3. Environment Variables

Ensure all required environment variables are set in `.env`:

```env
EXPO_PUBLIC_NEWELL_API_KEY=your_actual_api_key
EXPO_PUBLIC_NEWELL_API_URL=https://api.newell.ai
```

### 4. Update Version Numbers

If needed, update version numbers in:
- `app.json` → `version`, `android.versionCode`, `ios.buildNumber`
- `package.json` → `version`

---

## Building Production APK

### Option 1: Using EAS Build (Recommended)

EAS Build is the modern way to build Expo apps for production.

#### Step 1: Create eas.json

Create `eas.json` in the root directory:

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### Step 2: Configure Expo Project

```bash
# Initialize EAS project
eas build:configure
```

#### Step 3: Build Production APK

```bash
# Build production APK for Android
eas build --platform android --profile production

# Follow the prompts:
# - Select "Generate new keystore"
# - Wait for build to complete (5-20 minutes)
```

#### Step 4: Download the APK

After the build completes, EAS will provide a download link. Download the APK:

```bash
# The APK will be available at:
# https://expo.dev/accounts/[your-account]/projects/climapro/builds/[build-id]
```

Or download directly using:

```bash
eas build:download --platform android --profile production
```

### Option 2: Using Expo Export (Local Build)

For local development or testing:

```bash
# Install expo-dev-client if not installed
npx expo install expo-dev-client

# Build locally
npx expo run:android --variant release
```

Note: This requires Android Studio and SDK setup.

---

## Testing the Build

### 1. Install on Physical Device

```bash
# Connect Android device via USB
adb devices

# Install the APK
adb install climapro-v1.0.0.apk
```

### 2. Test Checklist

- [ ] App launches without crashes
- [ ] All tabs are accessible
- [ ] Weather data loads correctly
- [ ] Favorites persist after app restart
- [ ] Theme switching works (Light/Dark/System)
- [ ] Temperature unit toggle works (°C/°F)
- [ ] Speed unit toggle works (km/h/mph)
- [ ] Search functionality works
- [ ] Maps display correctly
- [ ] AI weather insights load
- [ ] Location permission works
- [ ] No console errors or warnings

### 3. Performance Testing

- Test app startup time
- Check for memory leaks
- Verify smooth animations
- Test on low-end devices

---

## Creating GitHub Release

### Step 1: Prepare Release Assets

Rename your APK to a descriptive name:

```bash
mv app-release.apk climapro-v1.0.0.apk
```

### Step 2: Create Git Tag

```bash
# Commit all changes
git add .
git commit -m "Release v1.0.0 - Production ready"

# Create and push tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main
git push origin v1.0.0
```

### Step 3: Create GitHub Release via Web UI

1. Go to your GitHub repository
2. Click on "Releases" in the right sidebar
3. Click "Create a new release"
4. Fill in the release details:

**Tag version**: `v1.0.0`

**Release title**: `Climapro v1.0.0 - Initial Production Release`

**Description**:

```markdown
# 🎉 Climapro v1.0.0 - Initial Release

## What's New

This is the first production release of Climapro, a premium weather application featuring:

### ✨ Features
- 🌤️ **Dynamic Weather Themes** - Adaptive UI based on weather conditions
- 🤖 **AI-Powered Insights** - Intelligent weather summaries using Newell AI
- 🗺️ **Interactive Maps** - Real-time weather visualization
- ⭐ **Smart Favorites** - Save and manage favorite cities with persistent storage
- 📊 **Advanced Data** - Hourly & 7-day forecasts with beautiful charts
- 🎨 **Premium UI/UX** - Glassmorphism design with smooth animations
- ⚙️ **Customizable Settings** - Temperature units (°C/°F), Speed units (km/h/mph), Theme modes
- 🔔 **Weather Notifications** - Push notifications and severe weather alerts

### 🛠️ Technical Stack
- React Native 0.81 / Expo 54
- TypeScript 5.9
- Expo Router 6.0
- React Native Reanimated 4.1
- Victory Native for charts
- AsyncStorage for persistence
- Newell AI integration

### 📱 Installation

**For Android Users:**
1. Download `climapro-v1.0.0.apk` below
2. Enable "Install from Unknown Sources" in Settings
3. Install the APK
4. Enjoy! ☀️

**For Developers:**
```bash
git clone https://github.com/yourusername/climapro.git
cd climapro
npm install
npx expo start
```

### 📝 Release Notes

#### New Features
- Complete weather forecast system
- AI-powered weather summaries
- Persistent favorites with AsyncStorage
- Multi-unit support (Celsius/Fahrenheit, km/h/mph)
- Dynamic theme engine with 8+ weather themes
- Interactive weather maps
- Comprehensive settings panel

#### Technical Improvements
- Production-ready build configuration
- Optimized performance with Reanimated
- Type-safe codebase with TypeScript
- Clean architecture with Context API
- Comprehensive error handling

### 🐛 Known Issues
None at this time

### 📱 System Requirements
- Android 6.0 (API 23) or higher
- iOS 13.0 or higher
- ~50MB storage space

### 📧 Support

For issues, questions, or feature requests:
- Open an issue: https://github.com/yourusername/climapro/issues
- Contact developer: omarelmhdi@gmail.com
- Telegram: @dev_umar
- WhatsApp: +201550875414

---

**Full Changelog**: https://github.com/yourusername/climapro/commits/v1.0.0
```

5. **Attach the APK file**: Drag and drop `climapro-v1.0.0.apk` into the release assets area

6. Check "Set as the latest release"

7. Click "Publish release"

### Step 4: Create Release via CLI (Alternative)

If you prefer using the GitHub CLI:

```bash
# Install GitHub CLI
# macOS: brew install gh
# Windows: winget install GitHub.cli

# Login to GitHub
gh auth login

# Create release with APK
gh release create v1.0.0 \
  climapro-v1.0.0.apk \
  --title "Climapro v1.0.0 - Initial Production Release" \
  --notes-file RELEASE_NOTES.md \
  --latest
```

---

## Post-Deployment

### 1. Verify Release

1. Go to: `https://github.com/yourusername/climapro/releases/tag/v1.0.0`
2. Verify APK is downloadable
3. Test download link in README.md

### 2. Update README Links

Replace `yourusername` with your actual GitHub username in:
- Download APK link
- All badge links
- Repository links

### 3. Share the Release

Share your release on:
- LinkedIn
- Twitter
- Reddit (r/reactnative, r/expo)
- Dev.to
- Your portfolio

### 4. Monitor Analytics

Set up analytics to track:
- Downloads
- Active users
- Crash reports
- User feedback

---

## Troubleshooting

### Build Fails with "Keystore not found"

**Solution**: Generate a new keystore:

```bash
eas build --platform android --profile production --clear-cache
```

### APK Size Too Large

**Solution**: Enable Hermes and optimize:

```json
// app.json
{
  "expo": {
    "android": {
      "enableProguardInReleaseBuilds": true,
      "enableShrinkResourcesInReleaseBuilds": true
    }
  }
}
```

### App Crashes on Startup

**Solution**: Check logs:

```bash
adb logcat | grep -i climapro
```

### Environment Variables Not Working

**Solution**: Use `app.config.js` instead of `app.json`:

```javascript
// app.config.js
export default {
  expo: {
    extra: {
      newellApiKey: process.env.EXPO_PUBLIC_NEWELL_API_KEY,
    },
  },
};
```

### Build Timeout

**Solution**: Use a higher resource class in `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "resourceClass": "large"
      }
    }
  }
}
```

---

## Version Management

### For Future Releases

When releasing new versions, update:

1. **app.json**:
   - `version`: "1.0.1"
   - `android.versionCode`: 2
   - `ios.buildNumber`: "2"

2. **package.json**:
   - `version`: "1.0.1"

3. **Create new tag**:
   ```bash
   git tag -a v1.0.1 -m "Release version 1.0.1"
   git push origin v1.0.1
   ```

4. **Build and release** following the same steps

---

## Production Best Practices

### Security

- ✅ Never commit API keys to Git
- ✅ Use environment variables for secrets
- ✅ Enable ProGuard/R8 for code obfuscation
- ✅ Use HTTPS for all API calls
- ✅ Validate user inputs

### Performance

- ✅ Use Hermes JavaScript engine
- ✅ Enable native code stripping
- ✅ Optimize images and assets
- ✅ Implement proper caching
- ✅ Use lazy loading for heavy components

### Monitoring

- ✅ Set up Sentry for crash reporting
- ✅ Use Firebase Analytics
- ✅ Monitor API rate limits
- ✅ Track user engagement metrics

---

## Support & Contact

**Developer**: Umar
**Email**: omarelmhdi@gmail.com
**Telegram**: @dev_umar
**WhatsApp**: +201550875414

---

## License

MIT License - See LICENSE file for details

---

**Last Updated**: February 2024
**Climapro Version**: 1.0.0
