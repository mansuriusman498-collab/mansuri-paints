import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPngBuffer(width, height, isRound = false) {
  // Color palette: primary color #0284c7 (R:2, G:132, B:199), background transparent or solid
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  const cx = width / 2;
  const cy = height / 2;
  const radius = width / 2 - 2;

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0
    for (let x = 0; x < width; x++) {
      const dx = x - cx + 0.5;
      const dy = y - cy + 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (isRound && dist > radius) {
        // Transparent outside circle
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
      } else {
        // Gradient / Blue fill #0284C7
        const r = Math.min(255, Math.max(0, Math.floor(2 + (x / width) * 40)));
        const g = Math.min(255, Math.max(0, Math.floor(132 + (y / height) * 40)));
        const b = 199;
        
        // Inner logo shape / mark
        const innerDist = Math.sqrt((x - cx)*(x - cx) + (y - cy)*(y - cy));
        if (innerDist < radius * 0.45 && innerDist > radius * 0.25) {
          // White ring/logo accent
          rawData[offset++] = 255;
          rawData[offset++] = 255;
          rawData[offset++] = 255;
          rawData[offset++] = 255;
        } else {
          rawData[offset++] = r;
          rawData[offset++] = g;
          rawData[offset++] = b;
          rawData[offset++] = 255;
        }
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdrLength = Buffer.alloc(4);
  ihdrLength.writeUInt32BE(13, 0);
  const ihdrType = Buffer.from('IHDR');
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrCrc = Buffer.alloc(4);
  ihdrCrc.writeUInt32BE(crc32(Buffer.concat([ihdrType, ihdrData])), 0);
  const ihdrChunk = Buffer.concat([ihdrLength, ihdrType, ihdrData, ihdrCrc]);

  // IDAT Chunk
  const idatLength = Buffer.alloc(4);
  idatLength.writeUInt32BE(compressedData.length, 0);
  const idatType = Buffer.from('IDAT');
  const idatCrc = Buffer.alloc(4);
  idatCrc.writeUInt32BE(crc32(Buffer.concat([idatType, compressedData])), 0);
  const idatChunk = Buffer.concat([idatLength, idatType, compressedData, idatCrc]);

  // IEND Chunk
  const iendLength = Buffer.alloc(4); // 0
  const iendType = Buffer.from('IEND');
  const iendCrc = Buffer.alloc(4);
  iendCrc.writeUInt32BE(crc32(iendType), 0);
  const iendChunk = Buffer.concat([iendLength, iendType, iendCrc]);

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Simple CRC32 implementation
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    crc = crc ^ byte;
    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ -1) >>> 0;
}

const densities = [
  { name: 'mipmap-mdpi', size: 48 },
  { name: 'mipmap-hdpi', size: 72 },
  { name: 'mipmap-xhdpi', size: 96 },
  { name: 'mipmap-xxhdpi', size: 144 },
  { name: 'mipmap-xxxhdpi', size: 192 },
];

const resDir = path.resolve(process.cwd(), 'android/app/src/main/res');

densities.forEach(({ name, size }) => {
  const dirPath = path.join(resDir, name);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const squareBuf = createPngBuffer(size, size, false);
  fs.writeFileSync(path.join(dirPath, 'ic_launcher.png'), squareBuf);

  const roundBuf = createPngBuffer(size, size, true);
  fs.writeFileSync(path.join(dirPath, 'ic_launcher_round.png'), roundBuf);

  const foregroundBuf = createPngBuffer(size, size, true);
  fs.writeFileSync(path.join(dirPath, 'ic_launcher_foreground.png'), foregroundBuf);

  console.log(`Generated icons in ${name} (${size}x${size})`);
});

// Generate adaptive icons v26
const anyDpiDir = path.join(resDir, 'mipmap-anydpi-v26');
if (!fs.existsSync(anyDpiDir)) {
  fs.mkdirSync(anyDpiDir, { recursive: true });
}

const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`;

fs.writeFileSync(path.join(anyDpiDir, 'ic_launcher.xml'), adaptiveXml);
fs.writeFileSync(path.join(anyDpiDir, 'ic_launcher_round.xml'), adaptiveXml);

// Add background color to values/ic_launcher_background.xml
const valuesDir = path.join(resDir, 'values');
if (!fs.existsSync(valuesDir)) {
  fs.mkdirSync(valuesDir, { recursive: true });
}

const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#0284C7</color>
</resources>
`;

fs.writeFileSync(path.join(valuesDir, 'ic_launcher_background.xml'), colorsXml);

console.log('Successfully generated all Android launcher icons!');
