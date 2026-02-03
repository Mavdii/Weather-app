#!/bin/bash

# Climapro Production Build Script
# This script builds a production-ready APK for Android

set -e  # Exit on error

echo "🚀 Starting Climapro Production Build"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js v18 or higher.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install npm.${NC}"
    exit 1
fi

if ! command -v eas &> /dev/null; then
    echo -e "${RED}❌ EAS CLI not found. Installing...${NC}"
    npm install -g eas-cli
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Step 2: Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 3: Run quality checks
echo -e "${BLUE}🔍 Running code quality checks...${NC}"

echo "  → Running TypeScript compiler..."
if npx tsc --noEmit; then
    echo -e "${GREEN}  ✅ TypeScript check passed${NC}"
else
    echo -e "${RED}  ❌ TypeScript errors found. Please fix them before building.${NC}"
    exit 1
fi

echo "  → Running linter..."
if npm run lint; then
    echo -e "${GREEN}  ✅ Linting passed${NC}"
else
    echo -e "${RED}  ⚠️  Linting warnings found. Consider fixing them.${NC}"
fi

# Step 4: Verify configuration
echo -e "${BLUE}⚙️  Verifying configuration...${NC}"

if [ ! -f "app.json" ]; then
    echo -e "${RED}❌ app.json not found${NC}"
    exit 1
fi

if [ ! -f "eas.json" ]; then
    echo -e "${RED}❌ eas.json not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuration verified${NC}"

# Step 5: Check environment variables
echo -e "${BLUE}🔐 Checking environment variables...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${RED}⚠️  .env file not found. Make sure to set up environment variables.${NC}"
else
    echo -e "${GREEN}✅ .env file found${NC}"
fi

# Step 6: Login to EAS
echo -e "${BLUE}🔑 Checking EAS authentication...${NC}"
if eas whoami &> /dev/null; then
    echo -e "${GREEN}✅ Already logged in to EAS${NC}"
else
    echo -e "${RED}❌ Not logged in to EAS. Please login:${NC}"
    eas login
fi

# Step 7: Build production APK
echo -e "${BLUE}🏗️  Building production APK...${NC}"
echo "This may take 10-20 minutes. Please be patient..."

if eas build --platform android --profile production --non-interactive; then
    echo -e "${GREEN}✅ Build completed successfully!${NC}"
else
    echo -e "${RED}❌ Build failed. Check the error messages above.${NC}"
    exit 1
fi

# Step 8: Download the APK
echo -e "${BLUE}⬇️  Downloading APK...${NC}"
if eas build:download --platform android --profile production --output ./climapro-v1.0.0.apk; then
    echo -e "${GREEN}✅ APK downloaded: climapro-v1.0.0.apk${NC}"
else
    echo -e "${RED}⚠️  Download failed. You can manually download from the EAS dashboard.${NC}"
fi

# Success message
echo ""
echo "=================================="
echo -e "${GREEN}🎉 Build Complete!${NC}"
echo ""
echo "📱 Your production APK is ready!"
echo "📦 Location: ./climapro-v1.0.0.apk"
echo ""
echo "Next steps:"
echo "1. Test the APK on a physical device"
echo "2. Create a GitHub release (see DEPLOYMENT.md)"
echo "3. Upload the APK to the release"
echo ""
echo "For detailed deployment instructions, see:"
echo "📄 DEPLOYMENT.md"
echo ""
echo "=================================="
