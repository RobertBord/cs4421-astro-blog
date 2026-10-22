import { copyFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

await copyFile('public/brand/icon.svg', 'public/favicon.svg');
await sharp('public/brand/social.svg').png().toFile('public/brand/social.png');
await sharp('public/brand/icon.svg').resize(180, 180).png().toFile('public/brand/apple-touch-icon.png');
const png = await sharp('public/brand/icon.svg').resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([header, png]));