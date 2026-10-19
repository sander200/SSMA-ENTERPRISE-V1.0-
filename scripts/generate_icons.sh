#!/usr/bin/env bash
set -e

mkdir -p public

# 512x512 standard & maskable icon
convert -size 512x512 xc:"#090d16" \
  -fill "#0f172a" -draw "roundrectangle 24,24 488,488 96,96" \
  -stroke "#14b8a6" -strokewidth 6 -fill "#0d9488" -draw "path 'M 256,70 L 400,125 C 400,280 340,380 256,430 C 172,380 112,280 112,125 Z'" \
  -stroke none -fill "#042f2e" -draw "path 'M 256,86 L 382,135 C 382,270 330,360 256,410 C 182,360 130,270 130,135 Z'" \
  -fill "#f59e0b" -draw "path 'M 170,250 C 170,175 210,145 256,145 C 302,145 342,175 342,250 Z'" \
  -fill "#d97706" -draw "roundrectangle 146,242 366,264 12,12" \
  -fill "#ffffff" -draw "circle 256,200 256,176" \
  -fill "#059669" -draw "rectangle 252,184 260,216" \
  -fill "#059669" -draw "rectangle 240,196 272,204" \
  -stroke "#2dd4bf" -strokewidth 7 -fill none -draw "polyline 190,310 220,310 234,290 248,335 264,285 278,320 292,310 322,310" \
  public/pwa-512x512.png

# Maskable 512x512 (with 15% safe padding for circular clipping on Android)
convert -size 512x512 xc:"#090d16" \
  -fill "#0f172a" -draw "roundrectangle 32,32 480,480 80,80" \
  -stroke "#14b8a6" -strokewidth 5 -fill "#0d9488" -draw "path 'M 256,90 L 380,135 C 380,260 330,350 256,395 C 182,350 132,260 132,135 Z'" \
  -stroke none -fill "#042f2e" -draw "path 'M 256,105 L 365,145 C 365,250 320,335 256,380 C 192,335 147,250 147,145 Z'" \
  -fill "#f59e0b" -draw "path 'M 180,240 C 180,180 215,152 256,152 C 297,152 332,180 332,240 Z'" \
  -fill "#d97706" -draw "roundrectangle 160,235 352,255 10,10" \
  -fill "#ffffff" -draw "circle 256,198 256,178" \
  -fill "#059669" -draw "rectangle 252,184 260,212" \
  -fill "#059669" -draw "rectangle 242,194 270,202" \
  -stroke "#2dd4bf" -strokewidth 6 -fill none -draw "polyline 200,295 225,295 237,278 249,318 263,275 275,305 287,295 312,295" \
  public/pwa-maskable-512x512.png

# 192x192 icon
convert public/pwa-512x512.png -resize 192x192 public/pwa-192x192.png

# 180x180 Apple touch icon
convert public/pwa-512x512.png -resize 180x180 public/apple-touch-icon.png

# 48x48 Favicon
convert public/pwa-192x192.png -resize 48x48 public/favicon.ico

echo "All PWA & APK icons generated successfully!"
