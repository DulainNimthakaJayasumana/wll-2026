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

/* ── Checkpoints ─────────────────────────────────────────── */
const CHECKPOINTS = [
  {
    num: 1,
    label: 'Start / Checkpoint 1',
    place: 'Marine Drive',
    desc: 'The race begins at Marine Drive. Gather at the starting arch, collect your bib and warm up with the team.',
    color: '#E5243B',
    icon: '🏁',
    km: '0 km',
  },
  {
    num: 2,
    label: 'Checkpoint 2',
    place: 'Galle Road Junction',
    desc: 'Midway energy station. Water, electrolytes and an SDG fact board to keep you motivated.',
    color: '#FCC30B',
    icon: '⚡',
    km: '2.5 km',
  },
  {
    num: 3,
    label: 'Finish Line',
    place: 'Galle Face Green',
    desc: 'Cross the finish line at iconic Galle Face Green. Medals, photos and the closing celebration await!',
    color: '#4C9F38',
    icon: '🏆',
    km: '5 km',
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
            <span className={s.titleRun}>WLL</span>
            <span className={s.titleRun2}>Run</span>
            <span className={s.titleYear}>2026</span>
          </h1>

          <p className={s.heroSub}>
            Run for the Global Goals · Marine Drive, Colombo
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
              <span className={s.heroStatVal}>Marine Drive</span>
              <span className={s.heroStatLabel}>Start Point · Colombo</span>
            </div>
            <div className={s.heroStatDivider} />
            <div className={s.heroStat}>
              <span className={s.heroStatIcon}>🎯</span>
              <span className={s.heroStatVal}>5 km</span>
              <span className={s.heroStatLabel}>Course Distance</span>
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
            <a href="#run-route" className={s.ctaGlass}>View Route ↓</a>
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
            <h2>Marine Drive to Galle Face</h2>
            <p>A scenic coastal run through the heart of Colombo — championing the UN Sustainable Development Goals every step of the way.</p>
          </div>

          <div className={s.mapLayout}>
            {/* Map embed */}
            <div className={s.mapContainer}>
              <div className={s.mapBadge}>Live Route Map</div>
              <iframe
                title="WLL Run 2026 Route"
                className={s.mapIframe}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7921.432!2d79.8475!3d6.9100!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2591614a35523%3A0x200d6d9c42af5c7f!2sMarine%20Drive%2C%20Colombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Checkpoint overlay pins */}
              <div className={s.mapOverlay}>
                {CHECKPOINTS.map(cp => (
                  <div
                    key={cp.num}
                    className={`${s.mapPin} ${activeCP === cp.num ? s.mapPinActive : ''}`}
                    style={{
                      '--pin-color': cp.color,
                      '--pin-top':  cp.num === 1 ? '72%' : cp.num === 2 ? '44%' : '18%',
                      '--pin-left': cp.num === 1 ? '35%' : cp.num === 2 ? '42%' : '30%',
                    }}
                    onClick={() => setActiveCP(activeCP === cp.num ? null : cp.num)}
                  >
                    <span className={s.pinNum}>{cp.num}</span>
                    <div className={s.pinPop}>
                      <strong>{cp.label}</strong>
                      <span>{cp.place}</span>
                      <span>{cp.km}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkpoint cards */}
            <div className={s.checkpoints}>
              {CHECKPOINTS.map((cp, i) => (
                <div
                  key={cp.num}
                  className={`${s.cpCard} ${activeCP === cp.num ? s.cpCardActive : ''}`}
                  style={{ '--cp-color': cp.color, animationDelay: `${i * 0.1}s` }}
                  onClick={() => setActiveCP(activeCP === cp.num ? null : cp.num)}
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
                    <p className={s.cpDesc}>{cp.desc}</p>
                  </div>
                </div>
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
              { icon:'📍', label:'Start Point', val:'Marine Drive, Colombo' },
              { icon:'🏁', label:'Finish',      val:'Galle Face Green' },
              { icon:'📏', label:'Distance',    val:'5 km fun run' },
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
          <h2>Ready to Run for the Goals?</h2>
          <p>Join hundreds of Sri Lankan youth running for a better world on July 4th.</p>
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
