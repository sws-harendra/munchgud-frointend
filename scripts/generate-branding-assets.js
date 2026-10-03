const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Sleek, Luxury Flazo Favicon SVG (Gold 3D Monogram on obsidian squircle)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Radiant 24K Metallic Gold Gradient -->
    <linearGradient id="goldFace" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff9d2"/>
      <stop offset="15%" stop-color="#fde68a"/>
      <stop offset="38%" stop-color="#d9a844"/>
      <stop offset="55%" stop-color="#fdf0ae"/>
      <stop offset="75%" stop-color="#c69231"/>
      <stop offset="90%" stop-color="#9e6b18"/>
      <stop offset="100%" stop-color="#6e4405"/>
    </linearGradient>

    <!-- Luxury Metallic Bevel Border -->
    <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="40%" stop-color="#fde68a" stop-opacity="0.4"/>
      <stop offset="70%" stop-color="#b47d1c" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#452702" stop-opacity="0.9"/>
    </linearGradient>

    <linearGradient id="darkBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>

    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.6"/>
      <feDropShadow dx="0" dy="2" stdDeviation="1" flood-color="#3d2504" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Obsidian Squircle Background -->
  <rect x="28" y="28" width="456" height="456" rx="116" fill="url(#darkBg)"/>
  <rect x="28" y="28" width="456" height="456" rx="116" fill="none" stroke="url(#goldBorder)" stroke-width="12"/>

  <!-- Golden 3D Monogram: "F" -->
  <g filter="url(#goldGlow)">
    <text x="256" y="348" 
          text-anchor="middle" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="310" 
          font-weight="900" 
          fill="url(#goldFace)"
          stroke="url(#goldBorder)"
          stroke-width="3">F</text>
  </g>
</svg>`;

// 2. High-Res Flazo Logo (Pure Metallic 3D Gold "FLAZO AUDIO" exactly as requested)
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 360" width="1000" height="360">
  <defs>
    <!-- Metallic 3D Gold Gradient for Face -->
    <linearGradient id="flazoMetallicGold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff9d2"/>
      <stop offset="14%" stop-color="#fde68a"/>
      <stop offset="38%" stop-color="#d9a844"/>
      <stop offset="52%" stop-color="#fdf0ae"/>
      <stop offset="72%" stop-color="#c69231"/>
      <stop offset="88%" stop-color="#9e6b18"/>
      <stop offset="100%" stop-color="#6e4405"/>
    </linearGradient>

    <!-- Metallic Stroke Bevel -->
    <linearGradient id="flazoMetallicStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="35%" stop-color="#fde68a" stop-opacity="0.5"/>
      <stop offset="70%" stop-color="#b47d1c" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#452702" stop-opacity="0.95"/>
    </linearGradient>

    <!-- 3D Bevel & Drop Shadow Filter -->
    <filter id="flazo3DDepth" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2.5" stdDeviation="1" flood-color="#3d2504" flood-opacity="0.8"/>
      <feDropShadow dx="0" dy="5.5" stdDeviation="3.5" flood-color="#231401" flood-opacity="0.5"/>
      <feDropShadow dx="0" dy="12" stdDeviation="8" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <g filter="url(#flazo3DDepth)">
    <!-- FLAZO Wordmark -->
    <text x="500" y="210" 
          text-anchor="middle" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Outfit', 'Montserrat', sans-serif" 
          font-size="220" 
          font-weight="900" 
          letter-spacing="16" 
          fill="url(#flazoMetallicGold)"
          stroke="url(#flazoMetallicStroke)"
          stroke-width="3.5"
          paint-order="stroke fill">FLAZO</text>

    <!-- AUDIO Subtitle -->
    <text x="500" y="315" 
          text-anchor="middle" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Outfit', 'Montserrat', sans-serif" 
          font-size="68" 
          font-weight="800" 
          letter-spacing="34" 
          fill="url(#flazoMetallicGold)"
          stroke="url(#flazoMetallicStroke)"
          stroke-width="1.2"
          paint-order="stroke fill">AUDIO</text>
  </g>
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

  console.log('Writing public/logo.svg...');
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), logoSvg, 'utf8');

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
  await sharp(logoBuffer).resize(1000, 360).png().toFile(path.join(publicDir, 'logo.png'));
  console.log('Successfully updated public/logo.png with new Flazo Audio branding!');

  console.log('Done! All assets generated successfully.');
}

run().catch(err => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});
