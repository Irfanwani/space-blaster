const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SVG_PATH = path.join(__dirname, 'assets', 'logo.svg');
const svgBuffer = fs.readFileSync(SVG_PATH);

async function generate() {
  console.log('Generating app icons and splash from logo.svg...\n');

  // App icon (Play Store needs 512x512, we generate 1024 for retina)
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(__dirname, 'assets', 'icon.png'));
  console.log('  [OK] assets/icon.png (1024x1024) — app icon');

  // Adaptive icon background (no rounded corners — Android adds them)
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(__dirname, 'assets', 'adaptive-icon.png'));
  console.log('  [OK] assets/adaptive-icon.png (1024x1024) — Android adaptive icon');

  // Favicon for web
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(__dirname, 'assets', 'favicon.png'));
  console.log('  [OK] assets/favicon.png (48x48) — web favicon');

  // Splash screen (1284x2778 for iPhone 14 Pro Max, centered logo on dark bg)
  const splashWidth = 1284;
  const splashHeight = 2778;
  const logoSize = 400;

  const logoBuffer = await sharp(svgBuffer)
    .resize(logoSize, logoSize)
    .png()
    .toBuffer();

  // Create splash with dark background
  const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${splashWidth}" height="${splashHeight}">
    <rect width="${splashWidth}" height="${splashHeight}" fill="#0a0a1a"/>
  </svg>`;

  const splashBg = await sharp(Buffer.from(splashSvg))
    .png()
    .toBuffer();

  await sharp(splashBg)
    .composite([{
      input: logoBuffer,
      left: Math.floor((splashWidth - logoSize) / 2),
      top: Math.floor((splashHeight - logoSize) / 2) - 100,
    }])
    .png()
    .toFile(path.join(__dirname, 'assets', 'splash.png'));
  console.log('  [OK] assets/splash.png (1284x2778) — splash screen');

  // Play Store feature graphic (1024x500)
  const featureWidth = 1024;
  const featureHeight = 500;
  const featureLogoSize = 300;

  const featureLogoBuffer = await sharp(svgBuffer)
    .resize(featureLogoSize, featureLogoSize)
    .png()
    .toBuffer();

  const featureSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${featureWidth}" height="${featureHeight}">
    <defs>
      <linearGradient id="fbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0a2e"/>
        <stop offset="100%" stop-color="#0a0a1a"/>
      </linearGradient>
    </defs>
    <rect width="${featureWidth}" height="${featureHeight}" fill="url(#fbg)"/>
  </svg>`;

  const featureBg = await sharp(Buffer.from(featureSvg))
    .png()
    .toBuffer();

  await sharp(featureBg)
    .composite([{
      input: featureLogoBuffer,
      left: Math.floor((featureWidth - featureLogoSize) / 2),
      top: Math.floor((featureHeight - featureLogoSize) / 2),
    }])
    .png()
    .toFile(path.join(__dirname, 'assets', 'feature-graphic.png'));
  console.log('  [OK] assets/feature-graphic.png (1024x500) — Play Store feature graphic');

  // iOS icon (no alpha, 1024x1024)
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(__dirname, 'assets', 'ios-icon.png'));
  console.log('  [OK] assets/ios-icon.png (1024x1024) — iOS App Store icon');

  console.log('\nAll assets generated successfully!');
}

generate().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
