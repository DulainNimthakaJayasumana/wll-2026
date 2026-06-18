import { useEffect, useRef } from 'react';
import { goToSDGs } from '../App';
import s from './SDGTeaser.module.css';

function goToSDG(index) {
  sessionStorage.setItem('sdg-start', index);
  goToSDGs();
}

export default function SDGTeaser() {
  const sectionRef = useRef(null);
  const lockedRef  = useRef(false);
  const cooldownRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // After deliberate scroll-away, block re-snap for 2s so animation doesn't fight user
    const exitingRef = { current: false };
    let exitTimer = null;

    const markExiting = () => {
      exitingRef.current = true;
      clearTimeout(exitTimer);
      exitTimer = setTimeout(() => { exitingRef.current = false; }, 2000);
    };

    const scrollToNext = () => {
      markExiting();
      const next = el.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    };
    const scrollToPrev = () => {
      markExiting();
      const prev = el.previousElementSibling;
      if (prev) prev.scrollIntoView({ behavior: 'smooth' });
    };

    const onWheel = (e) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      if (cooldownRef.current) return;
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, 900);
      if (e.deltaY > 0) scrollToNext();
      else scrollToPrev();
    };

    // Touch support
    let touchStartY = 0;
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      if (!lockedRef.current) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 30) return;
      if (cooldownRef.current) return;
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, 900);
      if (dy > 0) scrollToNext();
      else scrollToPrev();
    };

    const snappedRef = { current: false };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        if (ratio >= 0.3 && !snappedRef.current && !window.__navScrolling && !exitingRef.current) {
          snappedRef.current = true;
          // Freeze scroll momentum, snap to section, then release
          document.documentElement.style.overflow = 'hidden';
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => { document.documentElement.style.overflow = ''; }, 900);
        }
        if (ratio >= 0.92) {
          lockedRef.current = true;
        } else {
          lockedRef.current = false;
          if (ratio < 0.1) snappedRef.current = false;
        }
      },
      { threshold: [0.1, 0.3, 0.5, 0.92] }
    );

    observer.observe(el);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      observer.disconnect();
      clearTimeout(exitTimer);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <section ref={sectionRef} className={s.section} id="sdgs-teaser">
      <div className={s.videoBg}>
        <video
          className={s.video}
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/sdg-icons/sdg-01.webp"
        >
          <source src="/assets/sdgs.mp4" type="video/mp4" />
        </video>
        <div className={s.overlay} />
      </div>

      <div className={`shell ${s.inner}`}>
        <span className={s.eyebrow}>The Blueprint</span>
        <h2 className={s.heading}>
          17 Goals.<br />One shared future.
        </h2>
        <p className={s.sub}>
          Discover all 17 UN Sustainable Development Goals — the framework
          behind the World's Largest Lesson.
        </p>

        <div className={s.sdgStrip}>
          {Array.from({ length: 17 }, (_, i) => i + 1).map(n => (
            <img
              key={n}
              src={`/assets/sdg-icons/sdg-${String(n).padStart(2, '0')}.webp`}
              alt={`SDG ${n}`}
              className={s.sdgThumb}
              onClick={() => goToSDG(n - 1)}
            />
          ))}
        </div>

        <button className={s.cta} onClick={goToSDGs}>
          Explore all 17 Goals →
        </button>
      </div>
    </section>
  );
}
