#!/bin/bash

# Upload APK to GitHub Release Script
# Usage: ./upload-to-release.sh [path-to-apk]

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📤 Climapro APK Upload Script${NC}"
echo "=================================="

# Check if APK file is provided
APK_FILE="${1:-climapro-v1.0.0.apk}"

if [ ! -f "$APK_FILE" ]; then
    echo -e "${RED}❌ APK file not found: $APK_FILE${NC}"
    echo ""
    echo "Usage: ./upload-to-release.sh [path-to-apk]"
    echo "Example: ./upload-to-release.sh ./climapro-v1.0.0.apk"
    exit 1
fi

echo -e "${GREEN}✅ Found APK: $APK_FILE${NC}"

# Get file size
FILE_SIZE=$(du -h "$APK_FILE" | cut -f1)
echo -e "${BLUE}📦 File size: $FILE_SIZE${NC}"

# GitHub repository details
REPO_OWNER="Mavdii"
REPO_NAME="Weather-app"
TAG_NAME="v1.0.0"
RELEASE_ID="282762411"

echo ""
echo "Repository: $REPO_OWNER/$REPO_NAME"
echo "Release: $TAG_NAME"
echo ""

# Check if gh CLI is available
if command -v gh &> /dev/null; then
    echo -e "${BLUE}🚀 Uploading via GitHub CLI...${NC}"

    if gh release upload "$TAG_NAME" "$APK_FILE" --repo "$REPO_OWNER/$REPO_NAME"; then
        echo -e "${GREEN}✅ Upload successful!${NC}"
        echo ""
        echo "🎉 APK uploaded to: https://github.com/$REPO_OWNER/$REPO_NAME/releases/tag/$TAG_NAME"
        exit 0
    else
        echo -e "${RED}❌ GitHub CLI upload failed${NC}"
        echo "Trying alternative method..."
    fi
fi

# Alternative: Use cURL with GitHub API
echo -e "${BLUE}🔐 Please enter your GitHub Personal Access Token:${NC}"
echo "(Create one at: https://github.com/settings/tokens)"
echo "(Required scopes: repo)"
read -s -p "Token: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ No token provided${NC}"
    exit 1
fi

echo -e "${BLUE}⬆️  Uploading APK to GitHub Release...${NC}"

UPLOAD_URL="https://uploads.github.com/repos/$REPO_OWNER/$REPO_NAME/releases/$RELEASE_ID/assets?name=$(basename $APK_FILE)"

RESPONSE=$(curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/vnd.android.package-archive" \
  --data-binary @"$APK_FILE" \
  "$UPLOAD_URL" \
  -w "\n%{http_code}" \
  -s)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✅ Upload successful!${NC}"
    echo ""
    echo "🎉 APK uploaded to: https://github.com/$REPO_OWNER/$REPO_NAME/releases/tag/$TAG_NAME"
    echo ""
    echo "Asset URL: $(echo $BODY | grep -o '"browser_download_url": "[^"]*' | cut -d'"' -f4)"
else
    echo -e "${RED}❌ Upload failed${NC}"
    echo "HTTP Status: $HTTP_CODE"
    echo "Response: $BODY"
    exit 1
fi

echo ""
echo "=================================="
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Verify the APK download link works"
echo "2. Test installation on a device"
echo "3. Announce the release!"
echo ""
