import { useEffect, useState } from 'react';
import s from './LoadingScreen.module.css';

const SDG_COLORS = [
  '#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21',
  '#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367',
  '#FD9D24','#BF8B2E','#3F7E44','#0A97D9','#56C02B',
  '#00689D','#19486A',
];

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [leaving,  setLeaving]  = useState(false);

  useEffect(() => {
    /* Simulate smooth progress, complete when page is ready */
    let p = 0;
    const tick = setInterval(() => {
      p += Math.random() * 14 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(tick);
        setProgress(100);
        setTimeout(() => {
          setLeaving(true);
          setTimeout(onDone, 600);
        }, 350);
      } else {
        setProgress(Math.min(p, 95));
      }
    }, 120);

    /* Also finish early if window already loaded */
    if (document.readyState === 'complete') {
      clearInterval(tick);
      setProgress(100);
      setTimeout(() => { setLeaving(true); setTimeout(onDone, 600); }, 400);
    } else {
      window.addEventListener('load', () => {
        clearInterval(tick);
        setProgress(100);
        setTimeout(() => { setLeaving(true); setTimeout(onDone, 600); }, 400);
      }, { once: true });
    }
    return () => clearInterval(tick);
  }, []);

  return (
    <div className={`${s.screen} ${leaving ? s.leaving : ''}`}>

      {/* SDG colour bar strips at top */}
      <div className={s.strips}>
        {SDG_COLORS.map((c, i) => (
          <div key={i} className={s.strip} style={{ background: c, animationDelay: `${i * 40}ms` }} />
        ))}
      </div>

      <div className={s.center}>
        {/* Logo */}
        <img
          src="/assets/wll-logo.png"
          alt="World's Largest Lesson"
          className={s.logo}
        />

        {/* Tagline */}
        <p className={s.tagline}>Islandwide · Sri Lanka 2026</p>

        {/* Progress bar */}
        <div className={s.barWrap}>
          <div className={s.bar} style={{ width: `${progress}%` }} />
        </div>
        <div className={s.pct}>{Math.round(progress)}%</div>
      </div>

      {/* SDG colour bar strips at bottom */}
      <div className={`${s.strips} ${s.stripsBottom}`}>
        {SDG_COLORS.map((c, i) => (
          <div key={i} className={s.strip} style={{ background: c, animationDelay: `${i * 40}ms` }} />
        ))}
      </div>
    </div>
  );
}
