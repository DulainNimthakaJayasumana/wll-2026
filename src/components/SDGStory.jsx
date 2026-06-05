import { useEffect, useRef, useState } from 'react';
import { SDGS } from '../data/sdgs';
import s from './SDGStory.module.css';

/* Each SDG = exactly 1/17 of total scroll range */
function idxFromP(p) {
  return Math.min(SDGS.length - 1, Math.max(0, Math.floor(p * SDGS.length)));
}

const STEP_PX = 900; // px of scroll dedicated to each SDG

export default function SDGStory() {
  const trackRef = useRef(null);
  const rafRef   = useRef(null);

  const [idx,  setIdx]  = useState(0);
  const [prog, setProg] = useState(0);
  const prevIdxRef = useRef(-1); // -1 forces first render to always set

  /* Track height */
  useEffect(() => {
    const set = () => {
      if (trackRef.current)
        trackRef.current.style.height =
          SDGS.length * STEP_PX + window.innerHeight + 'px';
    };
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  /* Scroll → idx */
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const t = trackRef.current;
        if (!t) return;
        // raw = how many px we have scrolled INTO the track
        const raw = -t.getBoundingClientRect().top;
        const scrollable = t.offsetHeight - window.innerHeight;
        const p = Math.min(1, Math.max(0, raw / scrollable));
        const i = idxFromP(p);
        setProg(p * 100);
        if (i !== prevIdxRef.current) {
          prevIdxRef.current = i;
          setIdx(i);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const g   = SDGS[idx];
  const pad = n => String(n).padStart(2, '0');

  const jumpTo = i => {
    const t = trackRef.current;
    if (!t) return;
    const absTop = t.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: absTop + i * STEP_PX + 10, behavior: 'smooth' });
  };

  return (
    <section className={s.section} id="sdgs">

      {/* ── Intro ─────────────────────────────────────────── */}
      <div className={s.intro}>
        <div className={`shell reveal ${s.introInner}`}>
          <span className={s.eyebrow}>The Blueprint</span>
          <h2>17 Goals.<br/>One shared future.</h2>
          <p>Scroll through every Sustainable Development Goal — one cinematic moment at a time.</p>
          <div className={s.scrollCue}>
            <span>Scroll to explore</span>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M12 5v14M5 12l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Scroll track ──────────────────────────────────── */}
      <div ref={trackRef} className={s.track}>
        <div className={s.stage} style={{ backgroundColor: g.c }}>

          {/* Number strip across top */}
          <div className={s.strip}>
            {SDGS.map((sg, i) => (
              <button
                key={sg.n}
                className={`${s.stripItem} ${i === idx ? s.stripActive : ''}`}
                style={i === idx ? { background: 'rgba(255,255,255,0.92)', color: g.c } : {}}
                onClick={() => jumpTo(i)}
                title={sg.t}
              >
                {pad(sg.n)}
              </button>
            ))}
          </div>

          {/* Icon — key=idx causes remount → CSS entrance animation fires */}
          <div key={`icon-${idx}`} className={s.iconSide}>
            <div className={s.iconRing}>
              <div className={s.iconCircle}>
                <img
                  src={`/assets/sdg-icons/sdg-${pad(g.n)}.png`}
                  alt={`SDG ${g.n}: ${g.t}`}
                  className={s.icon}
                />
              </div>
            </div>
          </div>

          {/* Text — key=idx causes remount → CSS entrance animation fires */}
          <div key={`text-${idx}`} className={s.textSide}>
            <div className={s.goalTag}>
              <span className={s.goalTagNum}>{pad(g.n)}</span>
              <span className={s.goalTagOf}>of 17</span>
            </div>
            <h2 className={s.title}>{g.t}</h2>
            <p className={s.desc}>{g.d}</p>
            <div className={s.facts}>
              {g.facts.map(f => (
                <span key={f} className={s.fact}>{f}</span>
              ))}
            </div>
            <a
              className={s.cta}
              href="https://worldslargestlesson.globalgoals.org/"
              target="_blank"
              rel="noopener"
            >
              Explore this Goal →
            </a>
          </div>

          {/* Big background number */}
          <div className={s.bgNum} aria-hidden="true">{pad(g.n)}</div>

          {/* Nav dots */}
          <div className={s.dots} aria-hidden="true">
            {SDGS.map((_, i) => (
              <button
                key={i}
                className={`${s.dot} ${i === idx ? s.dotActive : ''}`}
                onClick={() => jumpTo(i)}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className={s.progressBar}>
            <span style={{ width: `${prog}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
