import { useState, useEffect, useRef } from 'react';
import { goHome } from '../App';

function goToRunRegister() { window.location.hash = 'run-register'; }
import s from './Run.module.css';

/* ── Countdown to July 4 2026 09:00 ─────────────────────── */
function useRunCountdown() {
  const target = new Date('2026-07-11T16:30:00');
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

/* ── Checkpoints — Race Course Grounds loop, ~4.8 km ── */
const CHECKPOINTS = [
  {
    num: 'S',
    label: 'Start / Finish',
    place: 'Race Course Vehicle Park',
    street: 'Philip Gunawardena Mawatha, Colombo 07',
    desc: 'Race begins and ends here at Race Course Vehicle Park. Collect your bib, warm up and line up at 4:30 PM!',
    color: '#19486A',
    icon: '🏁',
    km: '0 / 4.8 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Race+Course+Vehicle+Park,+Philip+Gunawardena+Mawatha,+Colombo',
    mapsLabel: 'Race Course Vehicle Park, Colombo',
  },
  {
    num: 1,
    label: 'Checkpoint 1',
    place: 'Bloomfield Cricket & Athletic Club',
    street: 'Maitland Place, Colombo 07',
    desc: 'First water station at Bloomfield Cricket and Athletic Club. Hydrate and keep your stride!',
    color: '#E5243B',
    icon: '💧',
    km: '~1 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bloomfield+Cricket+and+Athletic+Club,+Colombo',
    mapsLabel: 'Bloomfield Cricket Club, Colombo',
  },
  {
    num: 2,
    label: 'Checkpoint 2',
    place: 'SLAF Circle',
    street: 'SLAF Cir, Colombo 00500',
    desc: 'Midway energy station at SLAF Circle. Electrolytes and an SDG fact board — you\'re halfway there!',
    color: '#FCC30B',
    icon: '⚡',
    km: '~1.8 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=SLAF+Circle,+Colombo',
    mapsLabel: 'SLAF Circle, Colombo',
  },
  {
    num: 3,
    label: 'Checkpoint 3',
    place: 'BMICH',
    street: 'Bandaranaike Memorial International Conference Hall, Colombo 07',
    desc: 'Energy boost at BMICH. Turn north towards Horton Place — the finish is close!',
    color: '#FD6925',
    icon: '🏃',
    km: '~2.8 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=BMICH,+Colombo',
    mapsLabel: 'BMICH, Colombo 07',
  },
  {
    num: 4,
    label: 'Checkpoint 4',
    place: 'Horton Place',
    street: 'Horton Pl, Colombo 00700',
    desc: 'Final stretch! Head along Maitland Crescent back to the Race Course finish line. Sprint it out!',
    color: '#4C9F38',
    icon: '💪',
    km: '~3.8 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Horton+Place,+Colombo+7',
    mapsLabel: 'Horton Place, Colombo 07',
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
            <span className={s.titleRun2}>for Lesson</span>
            <span className={s.titleYear}>2026</span>
          </h1>

          <p className={s.heroSub}>
            Run for the Global Goals · Race Course Grounds, Colombo 07
          </p>

          <div className={s.heroCols}>
            <div className={s.heroStat}>
              <span className={s.heroStatIcon}>📅</span>
              <span className={s.heroStatVal}>July 11, 2026</span>
              <span className={s.heroStatLabel}>Race Day · 4:30 PM</span>
            </div>
            <div className={s.heroStatDivider} />
            <div className={s.heroStat}>
              <span className={s.heroStatIcon}>📍</span>
              <span className={s.heroStatVal}>Race Course Grounds</span>
              <span className={s.heroStatLabel}>Start &amp; Finish · Colombo 07</span>
            </div>
            <div className={s.heroStatDivider} />
            <div className={s.heroStat}>
              <span className={s.heroStatIcon}>🎯</span>
              <span className={s.heroStatVal}>4.8 km Loop</span>
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
            <div className={s.cdDate}>Saturday, 11 July 2026 · 4:30 PM</div>
          </div>

          <div className={s.heroCtas}>
            <button onClick={goToRunRegister} className={s.ctaPrimary}>Register for the Run</button>
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
            <h2>Race Course Loop — 4.8 km</h2>
            <p>Start and finish at Race Course Vehicle Park. The loop takes you past Bloomfield, SLAF Circle, BMICH and Horton Place through the heart of Colombo 07. <strong>Click any checkpoint to open in Google Maps.</strong></p>
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
              { icon:'🗓️', label:'Date',       val:'Saturday, 11 July 2026' },
              { icon:'⏰', label:'Start Time',  val:'4:30 PM sharp' },
              { icon:'📍', label:'Start & Finish', val:'Race Course Grounds' },
              { icon:'🔄', label:'Route',         val:'Bloomfield · SLAF · BMICH · Horton Pl' },
              { icon:'📏', label:'Distance',      val:'4.8 km loop · 4 checkpoints' },
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

      {/* ── T-SHIRT BANNER ────────────────────────────────── */}
      <section className={s.tshirtSection}>
        <div className={s.tshirtInner}>
          <div className={s.tshirtIcon}>🎽</div>
          <div className={s.tshirtText}>
            <h3>Free T-Shirt for Every Registered Participant!</h3>
            <p>Every runner who registers for Miles for Lesson 2026 receives an <strong>exclusive event T-shirt</strong> featuring the SDG-inspired design — a wearable reminder of your commitment to the Global Goals. T-shirts are available for collection at race registration on the day.</p>
            <ul className={s.tshirtPoints}>
              <li>✅ 100% free — included with registration</li>
              <li>✅ Exclusive SDG-themed design</li>
              <li>✅ Collect on race day at Race Course Grounds</li>
              <li>✅ Limited sizes — register early!</li>
            </ul>
            <button onClick={goToRunRegister} className={s.tshirtCta}>Register Now to Claim Yours →</button>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className={s.faqSection}>
        <div className={s.faqInner}>
          <div className={s.sectionHead}>
            <span className={s.eyebrow}>❓ FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className={s.faqGrid}>
            {[
              { q:'Who can participate in Miles for Lesson?',
                a:'Miles for Lesson is open to everyone — students, parents, teachers and community members of all ages and fitness levels. It\'s a fun run, not a race!' },
              { q:'Is there a registration fee?',
                a:'No! Registration is completely free. Every registered participant also receives a free exclusive SDG-themed T-shirt.' },
              { q:'Where does the run start and end?',
                a:'The run starts and finishes at Race Course Vehicle Park, Philip Gunawardena Mawatha, Colombo 07. The route is a 4.8 km loop through Bloomfield, SLAF Circle, BMICH and Horton Place.' },
              { q:'What time does the run start?',
                a:'The run begins at 4:30 PM on Saturday, 11 July 2026. Please arrive by 4:00 PM to collect your bib and T-shirt.' },
              { q:'How do I get my free T-shirt?',
                a:'T-shirts are collected at the registration desk on race day at Race Course Grounds. Please bring a copy of your registration confirmation.' },
              { q:'What should I wear and bring?',
                a:'Wear comfortable running shoes and sports attire. Bring your registration confirmation, a water bottle and lots of energy! Water stations are available at each checkpoint.' },
              { q:'Is the route safe?',
                a:'Yes — the route is marshalled by AIESEC volunteers at every checkpoint and along the course. First aid will be on standby throughout.' },
              { q:'What is the World\'s Largest Lesson?',
                a:'The World\'s Largest Lesson is a global initiative that teaches children and youth about the UN Sustainable Development Goals (SDGs). Miles for Lesson is Sri Lanka\'s 2026 run event organised by AIESEC.' },
            ].map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────── */}
      <section className={s.contactSection}>
        <div className={s.contactInner}>
          <div className={s.sectionHead} style={{ color:'#fff' }}>
            <span className={s.eyebrow} style={{ color:'rgba(255,255,255,0.6)' }}>📞 Contact Us</span>
            <h2 style={{ color:'#fff' }}>Get in Touch</h2>
            <p style={{ color:'rgba(255,255,255,0.6)' }}>Have questions about Miles for Lesson 2026? Reach out to our team.</p>
          </div>
          <div className={s.contactGrid}>
            {[
              { name:'Pasindu',  role:'CCP — Event Lead',          email:'pasindu@wll2026.lk',   phone:'',  image:'/assets/team/Pasindu.jpeg' },
              { name:'Tanuri',   role:'CCVP — National Membership', email:'tanuri@wll2026.lk',    phone:'',  image:'/assets/team/Tanuri Dissanayaka.JPG' },
              { name:'Minindi',  role:'National Membership',        email:'minindi@wll2026.lk',   phone:'',  image:'/assets/team/Minindi_Fonseka - Minindi Fonseka.JPG' },
            ].map(p => (
              <ContactCard key={p.name} person={p} />
            ))}
          </div>
          <div className={s.contactSocial}>
            <a href="https://instagram.com/wll.srilanka" target="_blank" rel="noopener" className={s.socialBtn}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              @wll.srilanka
            </a>
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
          <h2>Ready to Run Miles for Lesson?</h2>
          <p>Join Sri Lankan youth running for a better world on 11 July 2026 · Race Course Grounds, Colombo 07.</p>
          <div className={s.ctaBtns}>
            <button onClick={goToRunRegister} className={s.ctaPrimary}>Register Now — It's Free</button>
            <button onClick={onBack || goHome} className={s.ctaOutline}>← Back to Main Site</button>
          </div>
          <div className={s.ctaMeta}>
            Questions? DM us on Instagram <a href="https://instagram.com/wll.srilanka" target="_blank" rel="noopener">@wll.srilanka</a>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ── FAQ accordion item ──────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${s.faqItem} ${open ? s.faqOpen : ''}`} onClick={() => setOpen(v => !v)}>
      <div className={s.faqQ}>
        <span>{q}</span>
        <svg className={s.faqArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
      {open && <div className={s.faqA}>{a}</div>}
    </div>
  );
}

/* ── Contact card ────────────────────────────────────────── */
function ContactCard({ person }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div className={s.contactCard}>
      <div className={s.contactAvatar}>
        {!imgFailed ? (
          <img src={person.image} alt={person.name} onError={() => setImgFailed(true)} />
        ) : (
          <span>{person.name[0]}</span>
        )}
      </div>
      <div className={s.contactName}>{person.name}</div>
      <div className={s.contactRole}>{person.role}</div>
      <div className={s.contactDetails}>
        {person.phone && (
          <a href={`tel:${person.phone}`} className={s.contactLink}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            {person.phone}
          </a>
        )}
        {!person.phone && <span className={s.contactPhoneSlot}>📞 Phone coming soon</span>}
        {person.email && (
          <a href={`mailto:${person.email}`} className={s.contactLink}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            {person.email}
          </a>
        )}
      </div>
    </div>
  );
}
