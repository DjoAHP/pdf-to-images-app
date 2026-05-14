const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC = path.resolve(__dirname, '..', 'public');
const OUT = path.join(PUBLIC, 'icons');
const SVG = path.join(PUBLIC, 'favicon.svg');

const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 256, 384, 512];

async function main() {
  if (!fs.existsSync(SVG)) {
    throw new Error('SVG introuvable : ' + SVG);
  }
  if (!fs.existsSync(OUT)) {
    fs.mkdirSync(OUT, { recursive: true });
  }

  const svg = fs.readFileSync(SVG);

  for (const sz of sizes) {
    const dst = path.join(OUT, `icon-${sz}x${sz}.png`);
    await sharp(svg).resize(sz, sz).png().toFile(dst);
    console.log(`  ✅ icons/icon-${sz}x${sz}.png`);
  }

  // Apple touch
  await sharp(svg).resize(180, 180).png().toFile(path.join(OUT, 'apple-touch-icon.png'));
  console.log('  ✅ icons/apple-touch-icon.png');

  // Classic favicons at root
  await sharp(svg).resize(32, 32).png().toFile(path.join(PUBLIC, 'favicon-32x32.png'));
  await sharp(svg).resize(16, 16).png().toFile(path.join(PUBLIC, 'favicon-16x16.png'));
  console.log('  ✅ favicon-16x16.png, favicon-32x32.png');

  console.log('\n🎉 Toutes les icônes ont été générées !');
}

main().catch((e) => {
  console.error('❌', e.message || e);
  process.exit(1);
});