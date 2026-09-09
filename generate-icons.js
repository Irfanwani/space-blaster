const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS = path.join(__dirname, 'assets');
const LOGO = fs.readFileSync(path.join(ASSETS, 'logo.svg'));
const SHIP = fs.readFileSync(path.join(ASSETS, 'logo-ship.svg'));

async function generate() {
  console.log('Generating 3D app icons and splash...\n');

  // ---- App icon (full logo w/ rounded bg) 1024 ----
  await sharp(LOGO).resize(1024, 1024).png().toFile(path.join(ASSETS, 'icon.png'));
  console.log('  [OK] assets/icon.png (1024x1024)');

  // ---- iOS icon: opaque, no alpha ----
  await sharp(LOGO)
    .resize(1024, 1024)
    .flatten({ background: '#050510' })
    .png()
    .toFile(path.join(ASSETS, 'ios-icon.png'));
  console.log('  [OK] assets/ios-icon.png (1024x1024, opaque)');

  // ---- Adaptive icon foreground (transparent ship) ----
  await sharp(SHIP)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS, 'adaptive-icon.png'));
  console.log('  [OK] assets/adaptive-icon.png (transparent foreground)');

  // ---- Android adaptive background ----
  const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
    <defs>
      <radialGradient id="g" cx="50%" cy="40%" r="80%">
        <stop offset="0%" stop-color="#14144f"/>
        <stop offset="55%" stop-color="#0a0a2e"/>
        <stop offset="100%" stop-color="#050510"/>
      </radialGradient>
    </defs>
    <rect width="1024" height="1024" fill="url(#g)"/>
  </svg>`;
  await sharp(Buffer.from(bgSvg)).resize(1024, 1024).png().toFile(path.join(ASSETS, 'android-icon-background.png'));
  await sharp(SHIP).resize(1024, 1024).png().toFile(path.join(ASSETS, 'android-icon-foreground.png'));
  console.log('  [OK] assets/android-icon-background/foreground.png');

  // ---- Android monochrome (single-tone ship on dark bg) ----
  await sharp(SHIP).resize(1024, 1024).png().toFile(path.join(ASSETS, 'android-icon-monochrome.png'));
  console.log('  [OK] assets/android-icon-monochrome.png');

  // ---- Splash icon (transparent ship only) ----
  await sharp(SHIP).resize(1024, 1024).png().toFile(path.join(ASSETS, 'splash-icon.png'));
  console.log('  [OK] assets/splash-icon.png');

  // ---- Splash screen (1284x2778), centered ship + title text ----
  const splashWidth = 1284;
  const splashHeight = 2778;
  const logoSize = 560;
  const shipBuffer = await sharp(SHIP).resize(logoSize, logoSize).png().toBuffer();

  const splashBase = `<svg xmlns="http://www.w3.org/2000/svg" width="${splashWidth}" height="${splashHeight}">
    <defs>
      <radialGradient id="sbg" cx="50%" cy="42%" r="75%">
        <stop offset="0%" stop-color="#101044"/>
        <stop offset="45%" stop-color="#0a0a2e"/>
        <stop offset="100%" stop-color="#050510"/>
      </radialGradient>
      <radialGradient id="sc" cx="30%" cy="25%" r="60%">
        <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.30"/>
        <stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="sm" cx="75%" cy="75%" r="65%">
        <stop offset="0%" stop-color="#ff2d78" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#ff2d78" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="txt" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00e5ff"/>
        <stop offset="100%" stop-color="#ff2d78"/>
      </linearGradient>
    </defs>
    <rect width="${splashWidth}" height="${splashHeight}" fill="url(#sbg)"/>
    <ellipse cx="${splashWidth*0.3}" cy="${splashHeight*0.28}" rx="600" ry="480" fill="url(#sc)"/>
    <ellipse cx="${splashWidth*0.72}" cy="${splashHeight*0.75}" rx="560" ry="500" fill="url(#sm)"/>
  </svg>`;
  const base = await sharp(Buffer.from(splashBase)).png().toBuffer();

  const titleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${splashWidth}" height="400">
    <defs>
      <linearGradient id="t2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#9ff2ff"/>
        <stop offset="50%" stop-color="#00e5ff"/>
        <stop offset="100%" stop-color="#ff2d78"/>
      </linearGradient>
      <filter id="tg" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <g filter="url(#tg)">
      <text x="642" y="200" text-anchor="middle" font-family="'Arial Black','Helvetica Neue',Arial,sans-serif" font-size="110" font-weight="900" letter-spacing="14" fill="url(#t2)">SPACE BLASTER</text>
    </g>
  </svg>`;
  const title = await sharp(Buffer.from(titleSvg)).png().toBuffer();

  const sTop = Math.floor((splashHeight - logoSize) / 2) - 90;
  const tTop = sTop + logoSize + 40;

  await sharp(base)
    .composite([
      { input: shipBuffer, left: Math.floor((splashWidth - logoSize) / 2), top: sTop },
      { input: title, left: 0, top: tTop },
    ])
    .png()
    .toFile(path.join(ASSETS, 'splash.png'));
  console.log('  [OK] assets/splash.png (1284x2778)');

  // ---- Play Store feature graphic (1024x500) ----
  const featureWidth = 1024;
  const featureHeight = 500;
  const fShipSize = 340;
  const fShip = await sharp(SHIP).resize(fShipSize, fShipSize).png().toBuffer();

  const featureBase = `<svg xmlns="http://www.w3.org/2000/svg" width="${featureWidth}" height="${featureHeight}">
    <defs>
      <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#12124a"/>
        <stop offset="60%" stop-color="#0a0a2e"/>
        <stop offset="100%" stop-color="#050510"/>
      </linearGradient>
      <radialGradient id="fglow" cx="80%" cy="45%" r="55%">
        <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${featureWidth}" height="${featureHeight}" fill="url(#fg)"/>
    <ellipse cx="820" cy="250" rx="420" ry="300" fill="url(#fglow)"/>
  </svg>`;
  const featureBaseImg = await sharp(Buffer.from(featureBase)).png().toBuffer();

  const featureText = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="400">
    <defs>
      <linearGradient id="ft" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#9ff2ff"/>
        <stop offset="100%" stop-color="#00e5ff"/>
      </linearGradient>
    </defs>
    <text x="20" y="180" font-family="'Arial Black','Helvetica Neue',Arial,sans-serif" font-size="64" font-weight="900" fill="url(#ft)">SPACE BLASTER</text>
    <text x="22" y="250" font-family="'Helvetica Neue',Arial,sans-serif" font-size="30" letter-spacing="1" fill="#8aa0c0">Dodge. Collect. Survive.</text>
    <text x="22" y="300" font-family="'Helvetica Neue',Arial,sans-serif" font-size="24" fill="#5a6a8a">The arcade space shooter of your dreams</text>
  </svg>`;
  const featureTextImg = await sharp(Buffer.from(featureText)).png().toBuffer();

  await sharp(featureBaseImg)
    .composite([
      { input: featureTextImg, left: 40, top: 50 },
      { input: fShip, left: 620, top: Math.floor((featureHeight - fShipSize) / 2) },
    ])
    .png()
    .toFile(path.join(ASSETS, 'feature-graphic.png'));
  console.log('  [OK] assets/feature-graphic.png (1024x500)');

  // ---- Favicon ----
  await sharp(LOGO).resize(64, 64).png().toFile(path.join(ASSETS, 'favicon.png'));
  console.log('  [OK] assets/favicon.png (64x64)');

  console.log('\nAll 3D assets generated successfully!');
}

generate().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
