import { useEffect, useState } from 'react';
import s from './LoadingScreen.module.css';

const SDG_COLORS = [
  '#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21',
  '#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367',
  '#FD9D24','#BF8B2E','#3F7E44','#0A97D9','#56C02B',
  '#00689D','#19486A',
];

/* All images/GIFs to preload */
const PAD = n => String(n).padStart(2, '0');
const PRELOAD_LIST = [
  '/assets/wll-logo.png',
  '/assets/origami-bird.png',
  '/assets/aiesec-logo.png',
  '/assets/run-map.jpeg',
  ...Array.from({ length: 17 }, (_, i) => `/assets/sdg-icons/sdg-${PAD(i + 1)}.webp`),
  ...Array.from({ length: 17 }, (_, i) => `/assets/sdg-icons/${i + 1}_SDG_MakeEveryDayCount_Gifs_GDU.gif`),
  'WhatsApp Image 2026-06-15 at 20.32.11.webp',
  'WhatsApp Image 2026-06-15 at 20.32.11 (1).webp',
  'WhatsApp Image 2026-06-15 at 20.32.11 (2).webp',
  'WhatsApp Image 2026-06-15 at 20.32.11 (3).webp',
  'WhatsApp Image 2026-06-15 at 20.32.11 (4).webp',
  'WhatsApp Image 2026-06-15 at 20.32.11 (5).webp',
  'WhatsApp Image 2026-06-15 at 20.32.11 (6).webp',
  'WhatsApp Image 2026-06-15 at 20.32.11 (7).webp',
  'WhatsApp Image 2026-06-15 at 20.32.11 (8).webp',
].map(p => p.startsWith('/') ? p : `/assets/photos/${p}`);

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [leaving,  setLeaving]  = useState(false);

  useEffect(() => {
    let loaded = 0;
    const total = PRELOAD_LIST.length;

    const finish = () => {
      setProgress(100);
      setTimeout(() => {
        setLeaving(true);
        setTimeout(onDone, 900);
      }, 400);
    };

    const onOne = () => {
      loaded++;
      setProgress(Math.round((loaded / total) * 100));
      if (loaded >= total) finish();
    };

    PRELOAD_LIST.forEach(src => {
      const img = new Image();
      img.onload  = onOne;
      img.onerror = onOne; // count errors too so we don't stall
      img.src     = src;
    });
  }, []);

  return (
    <div className={`${s.screen} ${leaving ? s.leaving : ''}`}>

      {/* SDG strips — top */}
      <div className={s.strips}>
        {SDG_COLORS.map((c, i) => (
          <div key={i} className={s.strip} style={{ background: c, animationDelay: `${i * 35}ms` }} />
        ))}
      </div>

      <div className={s.center}>
        {/* Origami bird — flies right on leave */}
        <div className={`${s.birdWrap} ${leaving ? s.birdFly : ''}`}>
          <img src="/assets/origami-bird.png" alt="" className={s.bird} />
        </div>

        {/* Progress bar directly under bird */}
        <div className={s.barWrap}>
          <div className={s.bar} style={{ width: `${progress}%` }} />
        </div>
        <div className={s.pct}>{progress}%</div>

        <p className={s.tagline}>Islandwide · Sri Lanka 2026</p>
      </div>

      {/* SDG strips — bottom */}
      <div className={`${s.strips} ${s.stripsBottom}`}>
        {SDG_COLORS.map((c, i) => (
          <div key={i} className={s.strip} style={{ background: c, animationDelay: `${i * 35}ms` }} />
        ))}
      </div>
    </div>
  );
}
