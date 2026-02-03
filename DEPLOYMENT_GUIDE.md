# Climapro Deployment Guide

This guide will walk you through building and deploying the production APK for Climapro.

---

## 📋 Prerequisites

Before building, ensure you have:

1. **Node.js** (v18 or higher) - `node --version`
2. **npm** - `npm --version`
3. **Expo Account** - Sign up at [expo.dev](https://expo.dev)
4. **EAS CLI** installed - `npm install -g eas-cli` or use `npx eas`

---

## 🔐 Step 1: Authenticate with EAS

```bash
# Login to your Expo account
npx eas login

# Verify authentication
npx eas whoami
```

---

## 🏗️ Step 2: Build the Production APK

### Option A: Use the Build Script (Recommended)

```bash
# Make the script executable (if not already)
chmod +x build-production.sh

# Run the build script
./build-production.sh
```

The script will:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Run TypeScript and linting checks
- ✅ Verify configuration
- ✅ Build the production APK via EAS
- ✅ Download the APK automatically

### Option B: Manual Build

```bash
# Step 1: Install dependencies
npm install

# Step 2: Run quality checks
npx tsc --noEmit
npm run lint

# Step 3: Build production APK
npx eas build --platform android --profile production

# Step 4: Wait for build to complete (10-20 minutes)
# You'll receive a URL to track the build progress

# Step 5: Download the APK when ready
npx eas build:download --platform android --profile production --output ./climapro-v1.0.0.apk
```

---

## 📤 Step 3: Upload APK to GitHub Release

Once the APK is built and downloaded, upload it to the GitHub Release:

### Option A: Using GitHub CLI (if installed)

```bash
# Upload the APK to the v1.0.0 release
gh release upload v1.0.0 climapro-v1.0.0.apk --repo Mavdii/Weather-app
```

### Option B: Using GitHub Web Interface

1. Go to https://github.com/Mavdii/Weather-app/releases/tag/v1.0.0
2. Click **"Edit"** at the top right
3. Scroll to **"Attach binaries"** section
4. Drag and drop `climapro-v1.0.0.apk` or click to browse
5. Wait for upload to complete
6. Click **"Update release"**

### Option C: Using cURL (API)

```bash
# Get the upload URL (already included in release)
UPLOAD_URL="https://uploads.github.com/repos/Mavdii/Weather-app/releases/282762411/assets?name=climapro-v1.0.0.apk"

# Upload the APK
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Content-Type: application/vnd.android.package-archive" \
  --data-binary @climapro-v1.0.0.apk \
  "$UPLOAD_URL"
```

---

## ✅ Step 4: Verify the Release

After uploading, verify:

1. Visit https://github.com/Mavdii/Weather-app/releases/tag/v1.0.0
2. Confirm the APK appears in the **Assets** section
3. Download the APK to test it
4. Install on a test device to ensure it works

---

## 🔍 Build Verification Checklist

Before considering the build complete:

- [ ] APK file size is reasonable (typically 30-80 MB)
- [ ] App installs successfully on Android device
- [ ] App launches without crashes
- [ ] Weather data loads correctly
- [ ] AI summaries work (Newell AI integration)
- [ ] Favorites save and persist after app restart
- [ ] Location permission request appears
- [ ] Maps display correctly
- [ ] Settings changes are saved
- [ ] All animations run smoothly

---

## 🐛 Troubleshooting

### Build Fails: "Not authenticated with EAS"
```bash
npx eas login
```

### Build Fails: TypeScript errors
```bash
npx tsc --noEmit
# Fix the errors reported, then rebuild
```

### Build Fails: Missing dependencies
```bash
rm -rf node_modules
npm install
# Then rebuild
```

### Download Fails
Visit the [EAS Build Dashboard](https://expo.dev/accounts/[your-account]/projects/climapro/builds) and download manually.

### APK Upload Fails
- Ensure APK file is < 100MB
- Check GitHub token permissions
- Try uploading via web interface

---

## 📊 Build Configuration Details

### Version Information
- **App Name:** Climapro
- **Package:** com.umar.climapro
- **Version:** 1.0.0
- **Version Code:** 1
- **Target:** Production

### Build Profile (eas.json)
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    }
  }
}
```

### App Configuration (app.json)
- **Orientation:** Portrait only
- **New Architecture:** Enabled
- **Permissions:** Location (Fine & Coarse), Internet

---

## 🚀 Distribution

### For End Users
Once uploaded to GitHub Release, users can:

1. Visit https://github.com/Mavdii/Weather-app/releases/tag/v1.0.0
2. Download `climapro-v1.0.0.apk`
3. Enable "Install from Unknown Sources"
4. Install the APK
5. Enjoy Climapro!

### Alternative Distribution Methods

#### Play Store (Future)
```bash
# Build AAB for Play Store
npx eas build --platform android --profile production

# Submit to Play Store
npx eas submit --platform android --profile production
```

#### Internal Distribution
```bash
# Build internal preview
npx eas build --platform android --profile preview
```

---

## 📝 Post-Deployment Tasks

After successful deployment:

1. ✅ Test the APK on multiple devices
2. ✅ Monitor crash reports (if analytics enabled)
3. ✅ Gather user feedback
4. ✅ Plan for future updates (v1.0.1, v1.1.0, etc.)
5. ✅ Update social media / announcement channels
6. ✅ Update app listing (if applicable)

---

## 🔄 Future Updates

### For Patch Updates (v1.0.x)
```bash
# Update version in app.json
# Increment versionCode

# Build and release
npx eas build --platform android --profile production
gh release create v1.0.1 --title "Bug Fixes" --notes "..."
gh release upload v1.0.1 climapro-v1.0.1.apk
```

### For Minor Updates (v1.x.0)
```bash
# Update version in app.json
# Add new features
# Build and release with detailed changelog
```

---

## 📞 Support

For build or deployment issues:

- **Developer:** Umar
- **Telegram:** [@dev_umar](https://t.me/dev_umar)
- **WhatsApp:** 01550875414
- **Email:** omarelmhdi@gmail.com

---

## 📚 Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Android Distribution Guide](https://developer.android.com/studio/publish)

---

<div align="center">

**Made with ❤️ by Umar**

Last Updated: February 3, 2026

</div>
