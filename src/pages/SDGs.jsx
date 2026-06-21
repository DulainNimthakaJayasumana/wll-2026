import { useState, useEffect, useRef } from 'react';
import SDGStory from '../components/SDGStory';
import Footer from '../components/Footer';
import { goHome } from '../App';
import s from './SDGs.module.css';

export default function SDGs({ onBack }) {
  const [onLight, setOnLight] = useState(true);
  const introRef = useRef(null);

  useEffect(() => {
    // Watch the SDGStory intro section (cream background)
    const intro = document.querySelector('#sdgs .sdgIntroSentinel') || document.querySelector('#sdgs > div:first-child');
    if (!intro) return;
    const obs = new IntersectionObserver(
      ([e]) => setOnLight(e.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(intro);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <button
        className={`${s.backBtn} ${onLight ? s.backBtnDark : ''}`}
        onClick={onBack || goHome}
        aria-label="Back to main site"
      >
        <svg className={s.backIcon} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11.5 12 4l9 7.5"/>
          <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9"/>
        </svg>
        <span className={s.backLabel}>Back to Main Site</span>
      </button>

      <SDGStory />
      <Footer />

      <div className={s.scrollNav}>
        <button className={s.scrollBtn} onClick={() => window.dispatchEvent(new CustomEvent('sdg-nav', { detail: 'prev' }))} title="Previous SDG">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </button>
        <button className={s.scrollBtn} onClick={() => window.dispatchEvent(new CustomEvent('sdg-nav', { detail: 'next' }))} title="Next SDG">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </div>
    </>
  );
}
