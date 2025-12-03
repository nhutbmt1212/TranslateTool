// Script để tạo icon.ico với nhiều kích thước từ SVG
// Chạy: node scripts/generate-icon.js

import sharp from 'sharp';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [16, 24, 32, 48, 64, 128, 256];

async function generateIco() {
  const svgPath = join(__dirname, '../build/icon.svg');
  const outputPath = join(__dirname, '../release/.icon-ico/icon.ico');
  
  console.log('Generating icon from:', svgPath);
  
  const svgBuffer = readFileSync(svgPath);
  const pngBuffers = [];
  
  for (const size of sizes) {
    console.log(`Creating ${size}x${size} PNG...`);
    const pngBuffer = await sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();
    pngBuffers.push({ size, buffer: pngBuffer });
  }
  
  // Tạo ICO file header
  const icoBuffer = createIco(pngBuffers);
  writeFileSync(outputPath, icoBuffer);
  
  console.log('Icon saved to:', outputPath);
  console.log('Icon size:', icoBuffer.length, 'bytes');
}

function createIco(images) {
  // ICO header: 6 bytes
  // ICO directory entry: 16 bytes per image
  // Image data follows
  
  const headerSize = 6;
  const dirEntrySize = 16;
  const numImages = images.length;
  
  let dataOffset = headerSize + (dirEntrySize * numImages);
  const entries = [];
  
  for (const img of images) {
    entries.push({
      width: img.size === 256 ? 0 : img.size,
      height: img.size === 256 ? 0 : img.size,
      colorCount: 0,
      reserved: 0,
      planes: 1,
      bitCount: 32,
      size: img.buffer.length,
      offset: dataOffset,
      data: img.buffer
    });
    dataOffset += img.buffer.length;
  }
  
  // Calculate total size
  const totalSize = dataOffset;
  const buffer = Buffer.alloc(totalSize);
  
  // Write ICO header
  buffer.writeUInt16LE(0, 0);      // Reserved
  buffer.writeUInt16LE(1, 2);      // Type (1 = ICO)
  buffer.writeUInt16LE(numImages, 4); // Number of images
  
  // Write directory entries
  let offset = headerSize;
  for (const entry of entries) {
    buffer.writeUInt8(entry.width, offset);
    buffer.writeUInt8(entry.height, offset + 1);
    buffer.writeUInt8(entry.colorCount, offset + 2);
    buffer.writeUInt8(entry.reserved, offset + 3);
    buffer.writeUInt16LE(entry.planes, offset + 4);
    buffer.writeUInt16LE(entry.bitCount, offset + 6);
    buffer.writeUInt32LE(entry.size, offset + 8);
    buffer.writeUInt32LE(entry.offset, offset + 12);
    offset += dirEntrySize;
  }
  
  // Write image data
  for (const entry of entries) {
    entry.data.copy(buffer, entry.offset);
  }
  
  return buffer;
}

generateIco().catch(console.error);
