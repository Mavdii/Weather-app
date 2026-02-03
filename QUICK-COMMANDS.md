# 🚀 Climapro - Quick Command Reference

**For immediate deployment** - Copy and paste these commands

---

## 📦 Build Production APK

### Automated Build (Easiest)

**macOS/Linux:**
```bash
chmod +x build-production.sh
./build-production.sh
```

**Windows:**
```cmd
build-production.bat
```

### Manual Build

```bash
# Install EAS CLI (once)
npm install -g eas-cli

# Login
eas login

# Build
eas build --platform android --profile production

# Download APK
eas build:download --platform android --profile production --output ./climapro-v1.0.0.apk
```

---

## 🏷️ Create GitHub Release

### Prepare Git

```bash
# Add all changes
git add .

# Commit
git commit -m "Release v1.0.0 - Production ready"

# Create tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push everything
git push origin main
git push origin v1.0.0
```

### Create Release on GitHub

1. Go to: `https://github.com/YOUR_USERNAME/climapro`
2. Click: **Releases** → **Create a new release**
3. Fill in:
   - **Tag**: `v1.0.0`
   - **Title**: `Climapro v1.0.0 - Initial Production Release`
   - **Description**: See DEPLOYMENT.md for template
4. **Upload**: Drag `climapro-v1.0.0.apk`
5. Check: **Set as the latest release**
6. Click: **Publish release**

### Or Use GitHub CLI

```bash
# Install GitHub CLI (once)
# macOS:   brew install gh
# Windows: winget install GitHub.cli
# Linux:   See https://cli.github.com/

# Login
gh auth login

# Create release with APK
gh release create v1.0.0 \
  climapro-v1.0.0.apk \
  --title "Climapro v1.0.0 - Initial Production Release" \
  --notes "See DEPLOYMENT.md for complete release notes" \
  --latest
```

---

## 🧪 Test APK on Device

```bash
# List connected devices
adb devices

# Install APK
adb install climapro-v1.0.0.apk

# View logs (if needed)
adb logcat | grep Climapro
```

---

## ✅ Pre-Build Quality Checks

```bash
# TypeScript check
npx tsc --noEmit

# Lint
npm run lint

# View configuration
cat app.json | grep -E "name|version|package"
```

---

## 🔗 Your Download Link

After creating the release, your APK will be available at:

```
https://github.com/YOUR_USERNAME/climapro/releases/download/v1.0.0/climapro-v1.0.0.apk
```

**Remember to replace `YOUR_USERNAME` with your actual GitHub username!**

---

## 📝 Update README Links

After creating the release, update these in README.md:

1. Replace all `yourusername` with your GitHub username
2. Update badge links
3. Update download link
4. Verify all links work

---

## 🎯 Post-Release Checklist

- [ ] APK built successfully
- [ ] APK tested on device
- [ ] GitHub release created
- [ ] APK uploaded to release
- [ ] README links updated
- [ ] Download link tested
- [ ] Shared on social media
- [ ] Added to portfolio

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [FINALIZATION-COMPLETE.md](FINALIZATION-COMPLETE.md) | Complete summary |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Detailed deployment guide |
| [BUILD-QUICK-START.md](BUILD-QUICK-START.md) | Quick reference |
| [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) | Project overview |
| [README.md](README.md) | Main documentation |

---

## 🐛 Common Issues

**"EAS CLI not found"**
```bash
npm install -g eas-cli
```

**"Not logged in to EAS"**
```bash
eas login
```

**"Build failed"**
```bash
eas build --platform android --profile production --clear-cache
```

**"APK won't install"**
- Enable "Install from Unknown Sources" in Android settings
- Check minimum Android version (6.0+)

---

## 👨‍💻 Developer Contact

**Umar**
- 📧 Email: omarelmhdi@gmail.com
- 💬 Telegram: @dev_umar
- 📱 WhatsApp: +201550875414

---

**Climapro v1.0.0** • Made with ❤️ by Umar
