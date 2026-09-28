const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Sleek, Luxury Flazo Favicon SVG
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Radiant 24K Acoustic Gold Gradient -->
    <linearGradient id="flazoGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="30%" stop-color="#fbbf24"/>
      <stop offset="65%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>

    <!-- Luxury Metallic Bevel Border -->
    <linearGradient id="goldBorder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.65"/>
      <stop offset="45%" stop-color="#fde047" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#78350f" stop-opacity="0.55"/>
    </linearGradient>

    <!-- Inner Earcup Glow -->
    <linearGradient id="earcupAccent" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>

  <!-- Golden Squircle Background -->
  <rect x="28" y="28" width="456" height="456" rx="116" fill="url(#flazoGold)"/>
  <rect x="28" y="28" width="456" height="456" rx="116" fill="none" stroke="url(#goldBorder)" stroke-width="12"/>

  <!-- Bold Obsidian Headphones Silhouette -->
  <!-- Headband Arc -->
  <path d="M 136 280 A 120 120 0 0 1 376 280" 
        fill="none" 
        stroke="#09090b" 
        stroke-width="44" 
        stroke-linecap="round"/>

  <!-- Left Earcup -->
  <rect x="98" y="240" width="76" height="136" rx="38" fill="#09090b"/>
  <!-- Right Earcup -->
  <rect x="338" y="240" width="76" height="136" rx="38" fill="#09090b"/>

  <!-- Golden Earcup Accent Rings / Insets -->
  <rect x="127" y="270" width="16" height="76" rx="8" fill="url(#earcupAccent)"/>
  <rect x="369" y="270" width="16" height="76" rx="8" fill="url(#earcupAccent)"/>

  <!-- Central Acoustic Soundwave / Equalizer Bars -->
  <rect x="249" y="224" width="14" height="92" rx="7" fill="#09090b"/>
  <rect x="221" y="246" width="12" height="48" rx="6" fill="#09090b"/>
  <rect x="279" y="246" width="12" height="48" rx="6" fill="#09090b"/>
  <rect x="195" y="260" width="10" height="24" rx="5" fill="#09090b"/>
  <rect x="307" y="260" width="10" height="24" rx="5" fill="#09090b"/>
</svg>`;

// 2. High-Res Flazo Logo (SVG with Icon + Wordmark)
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 320" width="1024" height="320">
  <defs>
    <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="30%" stop-color="#fbbf24"/>
      <stop offset="70%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="logoBorder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#78350f" stop-opacity="0.5"/>
    </linearGradient>
    <linearGradient id="earcupAccent" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <linearGradient id="textGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b45309"/>
      <stop offset="30%" stop-color="#d97706"/>
      <stop offset="70%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#fbbf24"/>
    </linearGradient>
  </defs>

  <!-- Left Icon: 220x220 Emblem at x=50, y=50 -->
  <g transform="translate(50, 50)">
    <rect x="0" y="0" width="220" height="220" rx="56" fill="url(#logoGold)"/>
    <rect x="0" y="0" width="220" height="220" rx="56" fill="none" stroke="url(#logoBorder)" stroke-width="6"/>

    <!-- Headband -->
    <path d="M 52 120 A 58 58 0 0 1 168 120" 
          fill="none" 
          stroke="#09090b" 
          stroke-width="20" 
          stroke-linecap="round"/>

    <!-- Left Earcup -->
    <rect x="34" y="100" width="36" height="66" rx="18" fill="#09090b"/>
    <!-- Right Earcup -->
    <rect x="150" y="100" width="36" height="66" rx="18" fill="#09090b"/>

    <!-- Gold Accent Lines -->
    <rect x="48" y="115" width="8" height="36" rx="4" fill="url(#earcupAccent)"/>
    <rect x="164" y="115" width="8" height="36" rx="4" fill="url(#earcupAccent)"/>

    <!-- Soundwave -->
    <rect x="106" y="93" width="7" height="44" rx="3.5" fill="#09090b"/>
    <rect x="92" y="104" width="6" height="24" rx="3" fill="#09090b"/>
    <rect x="121" y="104" width="6" height="24" rx="3" fill="#09090b"/>
    <rect x="79" y="111" width="5" height="12" rx="2.5" fill="#09090b"/>
    <rect x="135" y="111" width="5" height="12" rx="2.5" fill="#09090b"/>
  </g>

  <!-- Right Typography -->
  <!-- "FLAZO" -->
  <text x="310" y="180" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        font-size="115" 
        font-weight="900" 
        letter-spacing="8" 
        fill="#09090b">FLAZO<tspan fill="#f59e0b">.</tspan></text>

  <!-- Subtitle: "ACOUSTIC GOLD" -->
  <text x="316" y="235" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        font-size="26" 
        font-weight="700" 
        letter-spacing="14" 
        fill="#b45309">ACOUSTIC GOLD</text>
</svg>`;

// Helper: Build an ICO file from an array of PNG buffers
function createIco(images) {
  const numImages = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(numImages, 4);

  let currentOffset = headerSize + numImages * dirEntrySize;
  const dirEntries = [];

  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bit count
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(currentOffset, 12); // offset
    dirEntries.push(entry);
    currentOffset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...images.map(img => img.buffer)]);
}

async function run() {
  const publicDir = path.join(__dirname, '..', 'public');
  const appDir = path.join(__dirname, '..', 'app');

  console.log('Writing public/favicon.svg...');
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf8');

  console.log('Writing app/icon.svg...');
  fs.writeFileSync(path.join(appDir, 'icon.svg'), faviconSvg, 'utf8');

  console.log('Generating PNG variants...');
  const svgBuffer = Buffer.from(faviconSvg);

  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();

  console.log('Writing apple-touch-icon.png (180x180)...');
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);

  console.log('Building multi-resolution ICO file...');
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 },
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  console.log('Wrote public/favicon.ico and app/favicon.ico');

  console.log('Generating public/logo.png from logoSvg...');
  const logoBuffer = Buffer.from(logoSvg);
  await sharp(logoBuffer).resize(1024, 320).png().toFile(path.join(publicDir, 'logo.png'));
  console.log('Successfully updated public/logo.png with Flazo branding!');

  console.log('Done! All assets generated successfully.');
}

run().catch(err => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});
