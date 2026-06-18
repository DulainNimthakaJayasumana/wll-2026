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
      >
        ← Back to Main Site
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
