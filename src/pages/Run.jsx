import { useState, useEffect, useRef } from 'react';
import { goHome, goToRegister } from '../App';
import s from './Run.module.css';

/* ── Countdown to July 4 2026 09:00 ─────────────────────── */
function useRunCountdown() {
  const target = new Date('2026-07-04T09:00:00');
  const calc = () => {
    const diff = Math.max(0, target - new Date());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [val, setVal] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setVal(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return val;
}

const PAD = n => String(n).padStart(2, '0');

/* ── Checkpoints — coordinates from https://maps.app.goo.gl/s4MfGzNUwXJxv3RW9 ── */
const CHECKPOINTS = [
  {
    num: 'S',
    label: 'Start',
    place: 'Marine Drive, Colombo',
    street: 'Galle Face · Marine Drive',
    desc: 'Race begins here at Marine Drive. Collect your bib, warm up and line up at the starting arch!',
    color: '#19486A',
    icon: '🏁',
    km: '0 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=6.9295339,79.8427048',
    mapsLabel: 'Start — Marine Drive, Colombo',
  },
  {
    num: 1,
    label: 'Checkpoint 1',
    place: 'Galle Road South',
    street: 'Kollupitiya, Galle Road',
    desc: 'First water station. Head south along Galle Road — hydrate and keep your pace!',
    color: '#E5243B',
    icon: '💧',
    km: '~2 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=6.911725,79.8497629',
    mapsLabel: 'Checkpoint 1 — Galle Road South',
  },
  {
    num: 2,
    label: 'Checkpoint 2',
    place: 'Galle Road Mid',
    street: 'Galle Road, Colombo 03',
    desc: 'Midway checkpoint on the return leg. Electrolytes, SDG fact board and a cheer squad waiting!',
    color: '#FCC30B',
    icon: '⚡',
    km: '~4 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=6.9185754,79.8493959',
    mapsLabel: 'Checkpoint 2 — Galle Road Mid',
  },
  {
    num: 3,
    label: 'Checkpoint 3',
    place: 'Near Galle Face',
    street: 'Galle Face approach, Colombo 03',
    desc: 'Final push! You can see the finish from here — sprint to the Galle Face finish line!',
    color: '#4C9F38',
    icon: '🏃',
    km: '~5.5 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=6.926469,79.8465784',
    mapsLabel: 'Checkpoint 3 — Near Galle Face',
  },
  {
    num: 'F',
    label: 'Finish Line',
    place: 'Ministry of Defence, Colombo',
    street: 'Galle Road, Colombo 03',
    desc: 'Cross the finish line! Medals, photos and the closing celebration await all finishers.',
    color: '#DD1367',
    icon: '🏆',
    km: '~7 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=6.9296939,79.842734',
    mapsLabel: 'Finish — Ministry of Defence, Colombo',
  },
];

/* ── SDG colours for particle bg ────────────────────────── */
const SDG_COLORS = [
  '#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21',
  '#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367',
];

export default function Run({ onBack }) {
  const cd = useRunCountdown();
  const canvasRef = useRef(null);
  const heroRef   = useRef(null);
  const [activeCP, setActiveCP] = useState(null);

  /* Particle canvas */
  useEffect(() => {
    const hero   = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles, raf, t = 0;

    const resize = () => {
      const r = hero.getBoundingClientRect();
      W = canvas.width  = r.width;
      H = canvas.height = r.height;
      initP();
    };

    const initP = () => {
      particles = [];
      const cols = 10, rows = 6;
      const cw = W / cols, ch = H / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.55) continue;
          particles.push({
            x: c * cw + Math.random() * cw,
            y: r * ch + Math.random() * ch,
            r: 3 + Math.random() * 9,
            col: SDG_COLORS[Math.floor(Math.random() * SDG_COLORS.length)],
            a: 0.1 + Math.random() * 0.18,
            phase: Math.random() * Math.PI * 2,
            freq:  0.004 + Math.random() * 0.007,
            amp:   10 + Math.random() * 18,
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t++;
      particles.forEach(p => {
        const bx = p.x + Math.sin(t * p.freq + p.phase) * p.amp;
        const by = p.y + Math.cos(t * p.freq * 0.7 + p.phase) * (p.amp * 0.5);
        ctx.beginPath();
        ctx.arc(bx, by, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col;
        ctx.globalAlpha = p.a;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      raf = requestAnimationFrame(draw);
    };

    requestAnimationFrame(() => { resize(); draw(); });
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className={s.page}>

      {/* ── Back nav ──────────────────────────────────────── */}
      <button className={s.backBtn} onClick={onBack || goHome}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back to Main Site
      </button>

      {/* ── HERO ──────────────────────────────────────────── */}
      <header className={s.hero} ref={heroRef}>
        <canvas ref={canvasRef} className={s.canvas} />

        {/* Animated running track lines */}
        <div className={s.track}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={s.trackLine} style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
        </div>

        <div className={s.heroInner}>
          <div className={s.eventBadge}>
            <span className={s.pulseDot} />
            <span>AIESEC in Sri Lanka · WLL 2026</span>
          </div>

          <div className={s.runIcon}>
            <span>🏃</span>
          </div>

          <h1 className={s.heroTitle}>
            <span className={s.titleRun}>Miles</span>
            <span className={s.titleRun2}>for Lessons</span>
            <span className={s.titleYear}>2026</span>
          </h1>

          <p className={s.heroSub}>
            Run for the Global Goals · Kollupitiya → Galle Face, Colombo
          </p>

          <div className={s.heroCols}>
            <div className={s.heroStat}>
              <span className={s.heroStatIcon}>📅</span>
              <span className={s.heroStatVal}>July 4, 2026</span>
              <span className={s.heroStatLabel}>Race Day</span>
            </div>
            <div className={s.heroStatDivider} />
            <div className={s.heroStat}>
              <span className={s.heroStatIcon}>📍</span>
              <span className={s.heroStatVal}>Galle Face Green</span>
              <span className={s.heroStatLabel}>Start &amp; Finish Point</span>
            </div>
            <div className={s.heroStatDivider} />
            <div className={s.heroStat}>
              <span className={s.heroStatIcon}>🎯</span>
              <span className={s.heroStatVal}>7 km Loop</span>
              <span className={s.heroStatLabel}>4 Checkpoints</span>
            </div>
          </div>

          {/* ── Marathon Countdown ────────────────────────── */}
          <div className={s.cdWrap}>
            <div className={s.cdLabel}>Race starts in</div>
            <div className={s.cd}>
              {[
                { val: cd.d, label: 'Days',    col: '#E5243B' },
                { val: cd.h, label: 'Hours',   col: '#FCC30B' },
                { val: cd.m, label: 'Minutes', col: '#26BDE2' },
                { val: cd.s, label: 'Seconds', col: '#4C9F38' },
              ].map(c => (
                <div key={c.label} className={s.cdCell} style={{ '--accent': c.col }}>
                  <div className={s.cdFlip}>
                    <span className={s.cdNum}>{PAD(c.val)}</span>
                  </div>
                  <span className={s.cdUnit}>{c.label}</span>
                </div>
              ))}
            </div>
            <div className={s.cdDate}>Saturday, 4 July 2026 · 09:00 AM</div>
          </div>

          <div className={s.heroCtas}>
            <button onClick={goToRegister} className={s.ctaPrimary}>Register for the Run</button>
          </div>
        </div>

        <div className={s.scrollHint}>
          <span>Scroll</span>
          <div className={s.scrollLine} />
        </div>
      </header>

      {/* ── ROUTE MAP ─────────────────────────────────────── */}
      <section className={s.mapSection} id="run-route">
        <div className={s.mapInner}>
          <div className={s.sectionHead}>
            <span className={s.eyebrow}>📍 Race Route</span>
            <h2>Galle Face Loop — 7 km</h2>
            <p>Start at Galle Face Green, run south along Galle Road, turn at Kollupitiya (SLIIT), return north on Sri Uttarananda Mawatha &amp; New Baladaksha Mawatha back to Galle Face. <strong>Click any checkpoint to open in Google Maps.</strong></p>
          </div>

          <div className={s.mapLayout}>
            {/* Fixed route map image + accurate pins */}
            <div className={s.mapContainer}>
              <div className={s.mapBadge}>Route Map</div>

              {/* Static route map image — save to public/assets/run-map.jpeg */}
              <img
                src="/assets/run-map.jpeg"
                alt="Miles for Lessons 2026 route map"
                className={s.mapImg}
                draggable="false"
              />

              {/* Full route button */}
              <a
                className={s.fullRouteBtn}
                href="https://maps.app.goo.gl/s4MfGzNUwXJxv3RW9"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                View Full Route on Google Maps
              </a>
            </div>

            {/* Checkpoint cards — click to open Google Maps */}
            <div className={s.checkpoints}>
              {CHECKPOINTS.map((cp, i) => (
                <a
                  key={cp.num}
                  className={`${s.cpCard} ${activeCP === cp.num ? s.cpCardActive : ''}`}
                  style={{ '--cp-color': cp.color, animationDelay: `${i * 0.1}s` }}
                  href={cp.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setActiveCP(cp.num)}
                  title={`Open ${cp.mapsLabel} in Google Maps`}
                >
                  <div className={s.cpLeft}>
                    <div className={s.cpNumCircle}>{cp.num}</div>
                    {i < CHECKPOINTS.length - 1 && <div className={s.cpLine} />}
                  </div>
                  <div className={s.cpRight}>
                    <div className={s.cpKm}>{cp.km}</div>
                    <div className={s.cpIcon}>{cp.icon}</div>
                    <div className={s.cpLabel}>{cp.label}</div>
                    <div className={s.cpPlace}>{cp.place}</div>
                    <div className={s.cpStreet}>{cp.street}</div>
                    <p className={s.cpDesc}>{cp.desc}</p>
                    <div className={s.cpMapsBtn}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                      View on Google Maps ↗
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENT DETAILS ─────────────────────────────────── */}
      <section className={s.details}>
        <div className={s.detailsInner}>
          <div className={s.sectionHead}>
            <span className={s.eyebrow}>📋 Event Details</span>
            <h2>Everything You Need to Know</h2>
          </div>

          <div className={s.detailGrid}>
            {[
              { icon:'🗓️', label:'Date',       val:'Saturday, 4 July 2026' },
              { icon:'⏰', label:'Start Time',  val:'9:00 AM sharp' },
              { icon:'📍', label:'Start & Finish', val:'Galle Face Green' },
              { icon:'🔄', label:'Turnaround',  val:'SLIIT, Kollupitiya' },
              { icon:'📏', label:'Distance',    val:'7 km loop · 4 checkpoints' },
              { icon:'👟', label:'Category',    val:'Open to all ages' },
              { icon:'🎽', label:'Race Kit',    val:'Bib + SDG wristband' },
              { icon:'🏅', label:'Finisher',    val:'Medal for all finishers' },
            ].map(d => (
              <div key={d.label} className={s.detailCard}>
                <span className={s.detailIcon}>{d.icon}</span>
                <span className={s.detailLabel}>{d.label}</span>
                <span className={s.detailVal}>{d.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SDG STRIP ─────────────────────────────────────── */}
      <div className={s.sdgStrip}>
        {['#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21','#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367','#FD9D24','#BF8B2E','#3F7E44','#0A97D9','#56C02B','#00689D','#19486A'].map(c => (
          <span key={c} style={{ background: c }} />
        ))}
      </div>

      {/* ── CTA FOOTER ────────────────────────────────────── */}
      <section className={s.ctaSection}>
        <div className={s.ctaInner}>
          <h2>Ready to Run Miles for Lessons?</h2>
          <p>Join hundreds of Sri Lankan youth running for a better world on July 4th along the Colombo coast.</p>
          <div className={s.ctaBtns}>
            <button onClick={goToRegister} className={s.ctaPrimary}>Register Now — It's Free</button>
            <button onClick={onBack || goHome} className={s.ctaOutline}>← Back to Main Site</button>
          </div>
          <div className={s.ctaMeta}>
            Questions? DM us on Instagram <a href="https://instagram.com/wll.srilanka" target="_blank" rel="noopener">@wll.srilanka</a>
            &nbsp;· Call <a href="tel:+94701506924">070 150 6924</a>
          </div>
        </div>
      </section>

    </div>
  );
}
