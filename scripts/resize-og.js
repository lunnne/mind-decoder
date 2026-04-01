/**
 * OG 이미지를 카카오톡 권장 사이즈(1200x630)로 리사이즈.
 * 실행: npm run resize-og
 */
import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');

const targets = [
  { file: 'canyoudecode.png' },
  { file: 'canyouguess.png' },
];

for (const { file } of targets) {
  const filePath = resolve(publicDir, file);
  await sharp(filePath)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .toBuffer()
    .then(buf => sharp(buf).toFile(filePath))
    .then(() => console.log(`✓ ${file} → 1200x630`))
    .catch(e => console.warn(`✗ ${file}: ${e.message}`));
}
