import sharp from 'sharp';
import { existsSync } from 'fs';

const DIR = 'public/assets/sdg-icons';

for (let n = 1; n <= 17; n++) {
  const src = `${DIR}/${n}_SDG_MakeEveryDayCount_Gifs_GDU.gif`;
  const dest = `${DIR}/${n}_SDG_anim.webp`;
  if (!existsSync(src)) {
    console.warn('skip (missing):', src);
    continue;
  }
  try {
    const info = await sharp(src, { animated: true })
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 50, effort: 4 })
      .toFile(dest);
    console.log('✓', dest, `${(info.size / 1024).toFixed(0)}KB`);
  } catch (err) {
    console.error('✗', src, err.message);
  }
}
