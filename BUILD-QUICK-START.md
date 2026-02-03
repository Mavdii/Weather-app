# 🚀 Climapro - Quick Build & Deploy Guide

**For the complete guide, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## ⚡ Quick Commands

### Build Production APK (Easiest Method)

#### On macOS/Linux:
```bash
./build-production.sh
```

#### On Windows:
```bash
build-production.bat
```

### Manual Build Commands

```bash
# 1. Install EAS CLI (one time)
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Build production APK
eas build --platform android --profile production

# 4. Download the APK
eas build:download --platform android --profile production --output ./climapro-v1.0.0.apk
```

---

## 📦 Creating GitHub Release

### Via GitHub Web Interface:

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Set tag: `v1.0.0`
4. Set title: `Climapro v1.0.0 - Initial Production Release`
5. Add description (see DEPLOYMENT.md for template)
6. Upload `climapro-v1.0.0.apk`
7. Check "Set as the latest release"
8. Click "Publish release"

### Via GitHub CLI:

```bash
# Install GitHub CLI (one time)
# macOS: brew install gh
# Windows: winget install GitHub.cli

# Login
gh auth login

# Create release and upload APK
gh release create v1.0.0 \
  climapro-v1.0.0.apk \
  --title "Climapro v1.0.0 - Initial Production Release" \
  --notes "See DEPLOYMENT.md for full release notes" \
  --latest
```

---

## ✅ Pre-Build Checklist

- [ ] All code changes committed
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Linter passes: `npm run lint`
- [ ] `.env` file configured with API keys
- [ ] `app.json` has correct bundle identifier: `com.umar.climapro`
- [ ] Version numbers updated if needed

---

## 🔐 Required Environment Variables

Create `.env` in project root:

```env
EXPO_PUBLIC_NEWELL_API_KEY=your_newell_api_key_here
EXPO_PUBLIC_NEWELL_API_URL=https://api.newell.ai
```

---

## 📱 Testing the APK

```bash
# Connect Android device via USB
adb devices

# Install APK
adb install climapro-v1.0.0.apk

# View logs
adb logcat | grep Climapro
```

---

## 🐛 Common Issues

### "EAS CLI not found"
**Fix**: Install EAS CLI globally
```bash
npm install -g eas-cli
```

### "Not logged in to EAS"
**Fix**: Login to Expo
```bash
eas login
```

### "Build failed - keystore not found"
**Fix**: Generate new keystore
```bash
eas build --platform android --profile production --clear-cache
```

### TypeScript Errors
**Fix**: Run TypeScript compiler and fix errors
```bash
npx tsc --noEmit
```

---

## 📚 Resources

- **Full Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Project README**: [README.md](./README.md)
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **GitHub Releases**: https://docs.github.com/en/repositories/releasing-projects-on-github

---

## 👨‍💻 Developer Contact

**Umar**
📧 Email: omarelmhdi@gmail.com
💬 Telegram: @dev_umar
📱 WhatsApp: +201550875414

---

## 🎯 Next Steps After Building

1. ✅ Test APK on physical device
2. ✅ Create GitHub release
3. ✅ Upload APK to release
4. ✅ Update README badges with correct GitHub username
5. ✅ Share your app on social media
6. ✅ Add project to portfolio

---

**Climapro v1.0.0** • Made with ❤️ by Umar
