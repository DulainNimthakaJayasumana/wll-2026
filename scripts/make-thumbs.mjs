import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';

const ROOTS = [
  'public/assets/photos',
  'public/assets/vol',
];

const THUMB_WIDTH = 480;
const QUALITY = 68;

for (const root of ROOTS) {
  const thumbDir = join(root, 'thumb');
  if (!existsSync(thumbDir)) mkdirSync(thumbDir);

  const files = readdirSync(root).filter(f => /\.(webp|jpe?g|png)$/i.test(f));
  for (const file of files) {
    const src = join(root, file);
    const name = basename(file, extname(file)) + '.webp';
    const dest = join(thumbDir, name);
    try {
      await sharp(src)
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(dest);
      console.log('✓', dest);
    } catch (err) {
      console.error('✗', src, err.message);
    }
  }
}
