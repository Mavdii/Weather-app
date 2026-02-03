<div align="center">

# ☀️ Climapro - Premium Weather Experience

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Mavdii/Weather-app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)](https://github.com/Mavdii/Weather-app/releases)
[![GitHub Stars](https://img.shields.io/github/stars/Mavdii/Weather-app?style=social)](https://github.com/Mavdii/Weather-app)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-lightgrey.svg)](https://github.com/Mavdii/Weather-app)

*A modern, feature-rich weather application with dynamic themes, AI-powered insights, and stunning visualizations*

[Download APK](https://github.com/Mavdii/Weather-app/releases/download/v1.0.0/climapro-v1.0.0.apk) • [Report Bug](https://github.com/Mavdii/Weather-app/issues) • [Request Feature](https://github.com/Mavdii/Weather-app/issues)

</div>

---

## 📱 Introduction

**Climapro** is a next-generation weather application that transforms how you experience weather information. Built with cutting-edge technologies, it delivers accurate forecasts wrapped in a beautiful, intuitive interface that adapts dynamically to weather conditions.

Experience weather like never before with:
- **Dynamic Themes** that change based on real-time weather conditions
- **AI-Powered Summaries** providing intelligent weather insights
- **Interactive Maps** with real-time weather overlay
- **Glassmorphism UI** with smooth animations and stunning visuals
- **Persistent Favorites** to track multiple cities effortlessly

---

## ✨ Features

### 🌤️ **Dynamic Weather Themes**
- Adaptive color schemes that change based on weather conditions (sunny, rainy, cloudy, etc.)
- Smooth transitions between day/night modes
- System-aware dark/light theme support

### 🤖 **AI-Powered Weather Insights**
- Intelligent weather summaries using Newell AI
- Personalized recommendations based on weather conditions
- Natural language weather descriptions

### 🗺️ **Interactive Weather Maps**
- Real-time weather visualization
- Location-based weather tracking
- GPS-enabled current location weather

### ⭐ **Smart Favorites System**
- Save unlimited favorite cities
- Persistent storage across app restarts (AsyncStorage)
- Quick access to saved locations
- Long-press to remove favorites

### 📊 **Advanced Weather Data**
- Hourly and 7-day forecasts
- Temperature, humidity, wind speed, and UV index
- Beautiful chart visualizations using Victory Native
- Customizable temperature units (°C / °F)
- Customizable speed units (km/h / mph)

### 🎨 **Premium UI/UX**
- Glassmorphism design with blur effects
- Lottie animations for weather icons
- Smooth Reanimated transitions
- Haptic feedback for interactions
- Safe area support for modern devices

### 🔔 **Weather Notifications**
- Push notifications for weather updates
- Severe weather alerts
- Customizable notification settings

### 🔍 **Smart City Search**
- Fast, intuitive city search
- Recent search history
- Worldwide city coverage

---

## 🛠️ Technologies Used

<table>
<tr>
<td align="center"><strong>Category</strong></td>
<td align="center"><strong>Technology</strong></td>
<td align="center"><strong>Purpose</strong></td>
</tr>
<tr>
<td>Framework</td>
<td>React Native (0.81) / Expo (54)</td>
<td>Cross-platform mobile development</td>
</tr>
<tr>
<td>Navigation</td>
<td>Expo Router (6.0)</td>
<td>File-based routing system</td>
</tr>
<tr>
<td>Animation</td>
<td>React Native Reanimated (4.1)</td>
<td>Smooth 60fps animations</td>
</tr>
<tr>
<td>UI Components</td>
<td>Lottie, Expo Blur, Linear Gradient</td>
<td>Rich visual effects</td>
</tr>
<tr>
<td>Maps</td>
<td>React Native Maps</td>
<td>Interactive weather maps</td>
</tr>
<tr>
<td>Charts</td>
<td>Victory Native (41.20)</td>
<td>Beautiful data visualizations</td>
</tr>
<tr>
<td>AI</td>
<td>Newell AI (@fastshot/ai)</td>
<td>Weather insights & summaries</td>
</tr>
<tr>
<td>Storage</td>
<td>AsyncStorage</td>
<td>Persistent data management</td>
</tr>
<tr>
<td>Gestures</td>
<td>React Native Gesture Handler</td>
<td>Touch interactions</td>
</tr>
<tr>
<td>Language</td>
<td>TypeScript (5.9)</td>
<td>Type-safe development</td>
</tr>
</table>

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android)

### For End Users

**Download the APK directly:**

1. Go to [Releases](https://github.com/Mavdii/Weather-app/releases)
2. Download `climapro-v1.0.0.apk`
3. Install on your Android device
4. Allow installation from unknown sources if prompted
5. Enjoy Climapro! ☀️

### For Developers

**Clone and run the project:**

```bash
# Clone the repository
git clone https://github.com/Mavdii/Weather-app.git
cd Weather-app

# Install dependencies
npm install

# Start the development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on Web
npx expo start --web
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Newell AI Configuration (for AI weather insights)
EXPO_PUBLIC_NEWELL_API_KEY=your_newell_api_key_here
EXPO_PUBLIC_NEWELL_API_URL=https://api.newell.ai

# Weather API Configuration
EXPO_PUBLIC_WEATHER_API_KEY=your_weather_api_key_here

# Optional: Analytics, Sentry, etc.
```

### Building for Production

```bash
# Build APK for Android
npx eas build --platform android --profile production

# Build for iOS
npx eas build --platform ios --profile production

# Build for both platforms
npx eas build --platform all --profile production
```

---

## 📖 Usage Guide

### Basic Operations

1. **View Current Weather**: Launch app to see weather for your location
2. **Search Cities**: Tap the search icon to find cities worldwide
3. **Add Favorites**: Tap the heart icon to save a city
4. **View Maps**: Access interactive weather maps from the bottom tab
5. **Customize Settings**: Change temperature units, themes, and notifications

### Settings Customization

- **Theme**: Choose Light, Dark, or Auto (follows system)
- **Temperature Unit**: Toggle between Celsius (°C) and Fahrenheit (°F)
- **Wind Speed Unit**: Toggle between km/h and mph
- **Notifications**: Enable/disable weather alerts

---

## 📸 Screenshots

<div align="center">

| Home Screen | Favorites | Settings | Weather Map |
|:-----------:|:---------:|:--------:|:-----------:|
| ![Home](docs/screenshots/home.png) | ![Favorites](docs/screenshots/favorites.png) | ![Settings](docs/screenshots/settings.png) | ![Map](docs/screenshots/map.png) |

*Dynamic themes adapting to weather conditions*

</div>

---

## 🎯 Key Highlights

- ✅ **Production Ready**: Fully tested and optimized for production
- ✅ **Persistent Storage**: All favorites and settings saved locally
- ✅ **AI Integration**: Smart weather insights powered by Newell AI
- ✅ **Modern Architecture**: Clean code with TypeScript and Context API
- ✅ **Smooth Performance**: 60fps animations with Reanimated
- ✅ **Cross-Platform**: Runs on iOS, Android, and Web
- ✅ **Accessibility**: Proper contrast, touch targets, and screen reader support

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Weather data provided by various weather APIs
- AI insights powered by [Newell AI](https://newell.ai)
- Icon animations from [LottieFiles](https://lottiefiles.com)
- Maps provided by React Native Maps

---

<div align="center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; margin: 20px 0;">

## 👨‍💻 Contact Developer

<table>
<tr>
<td align="center" style="border: none;">

### Umar

**Full-Stack Mobile Developer**

[![Telegram](https://img.shields.io/badge/Telegram-@dev__umar-0088cc?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/dev_umar)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-01550875414-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/201550875414)
[![Email](https://img.shields.io/badge/Email-omarelmhdi@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:omarelmhdi@gmail.com)

**Available for freelance projects and consultations**

*Specialized in React Native, Expo, and modern mobile app development*

</td>
</tr>
</table>

</div>

---

<div align="center">

### ⭐ If you found this project helpful, please give it a star!

**Made with ❤️ by Umar**

**Climapro v1.0.0** • Built with React Native & Expo

[⬆ Back to Top](#️-climapro---premium-weather-experience)

</div>
