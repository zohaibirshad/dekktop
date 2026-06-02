#!/bin/bash
# Icon generation script for Smart File Organizer
# Requires: ImageMagick (convert command)

SVG_FILE="icon.svg"

if [ ! -f "$SVG_FILE" ]; then
    echo "Error: icon.svg not found!"
    exit 1
fi

echo "Generating icons from SVG..."

# PNG icons for Tauri
convert -background none -resize 32x32 "$SVG_FILE" "32x32.png"
convert -background none -resize 128x128 "$SVG_FILE" "128x128.png"
convert -background none -resize 256x256 "$SVG_FILE" "128x128@2x.png"

# macOS ICNS (requires png2icns or similar)
# convert -background none -resize 512x512 "$SVG_FILE" "icon_512.png"
# png2icns icon.icns icon_512.png

# Windows ICO (multiple sizes in one file)
convert -background none "$SVG_FILE" -define icon:auto-resize=256,128,96,64,48,32,16 "icon.ico"

echo "Icons generated successfully!"
ls -la *.png *.ico 2>/dev/null || echo "Note: Some icons may require manual generation"
