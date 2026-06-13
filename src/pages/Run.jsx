import { useState, useEffect, useRef } from 'react';
import { goHome, goToRegister } from '../App';
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
    km: '0 / 5 km',
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

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${s.faqItem} ${open ? s.faqOpen : ''}`}>
      <button className={s.faqQ} onClick={() => setOpen(v => !v)}>
        <span>{q}</span>
        <svg className={s.faqChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && <div className={s.faqA}>{a}</div>}
    </div>
  );
}

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
              <span className={s.heroStatVal}>5 km Loop</span>
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
            <h2>Race Course Loop — 5 km</h2>
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

      {/* ── FREE MERCH BANNER ────────────────────────────── */}
      <section className={s.merchBanner}>
        <div className={s.merchInner}>
          <div className={s.merchEmoji}>🎁</div>
          <div className={s.merchText}>
            <h2>Free Merch for Every Runner</h2>
            <p>Every registered participant gets a <strong>race bib</strong>, an <strong>exclusive WLL 2026 t-shirt</strong>, and an <strong>SDG wristband</strong> — completely free. Limited stock, first come first served!</p>
          </div>
          <div className={s.merchItems}>
            {[
              { icon:'👕', label:'WLL T-Shirt' },
              { icon:'🪪', label:'Race Bib' },
              { icon:'📿', label:'SDG Wristband' },
              { icon:'🏅', label:'Finisher Medal' },
            ].map(m => (
              <div key={m.label} className={s.merchItem}>
                <span className={s.merchItemIcon}>{m.icon}</span>
                <span className={s.merchItemLabel}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className={s.faqSection} id="run-faq">
        <div className={s.faqInner}>
          <div className={s.sectionHead}>
            <span className={s.eyebrow}>❓ FAQ</span>
            <h2>Common Questions</h2>
          </div>
          <div className={s.faqList}>
            {[
              {
                q: 'What is Miles for Lessons?',
                a: 'Miles for Lessons is a purpose-driven CSR fundraising run organized under the World’s Largest Lesson (WLL) initiative. It brings together individuals passionate about fitness, community impact, and creating positive change, while raising funds to support the Island Wide World’s Largest Lesson 2026 Sri Lanka initiative (Check the website for more info).',
              },
              {
                q: 'How do I register?',
                a: 'Click the Register button on the website and complete the Google Form. Please upload the registration fee payment slip as part of the form. You may register individually or as a group using the links provided on the website. Registration fee: Rs. 1,800 per individual🎽 Includes a complimentary event T-shirt',
              },
              {
                q: 'Will I receive a T-shirt?',
                a: 'Yes! Every registered participant will receive a free official event T-shirt.',
              },
              {
                q: 'Who can participate?',
                a: 'The run is open to everyone — all ages and fitness levels are welcome. Whether you choose to walk, jog, or sprint the 4.8 km loop, you’re encouraged to join.',
              },
              {
                q: 'Where does the race start?',
                a: '📍 Race Course Car Park',
              },
              {
                q: 'When will I receive my T-shirt?',
                a: 'T-shirts will be distributed prior to the run. The organizing committee will share detailed instructions closer to the event date.',
              },
              {
                q: 'How can my company partner or sponsor the event?',
                a: `We'd love to collaborate! Please reach out to us via:\n\n📧 pasindu.serasinghe5@aiesec.net\n📧 poohbalarajavarun@aiesec.net\n\n📞 +94 77 786 7058\n\nWhether you're here to promote your event, join as a corporate team, or help out with resources and logistics.`,
              },
            ].map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────── */}
      <section className={s.contactSection} id="run-contact">
        <div className={s.contactInner}>
          <div className={s.sectionHead}>
            <span className={s.eyebrow}>📞 Contact Us</span>
            <h2>Get in Touch</h2>
            <p>Have a question not covered above? Reach out to the Miles for Lessons organising team directly.</p>
          </div>
          <div className={s.contactGrid}>
            <a href="tel:+94701506924" className={s.contactCard}>
              <span className={s.contactIcon}>📱</span>
              <span className={s.contactLabel}>Call / WhatsApp</span>
              <span className={s.contactVal}>070 150 6924</span>
            </a>
            <a href="https://instagram.com/wll.srilanka" target="_blank" rel="noopener noreferrer" className={s.contactCard}>
              <span className={s.contactIcon}>📸</span>
              <span className={s.contactLabel}>Instagram</span>
              <span className={s.contactVal}>@wll.srilanka</span>
            </a>
            <a href="mailto:wll.srilanka@aiesec.net" className={s.contactCard}>
              <span className={s.contactIcon}>✉️</span>
              <span className={s.contactLabel}>Email</span>
              <span className={s.contactVal}>wll.srilanka@aiesec.net</span>
            </a>
          </div>

          <div className={s.sectionHead} style={{ marginTop: '56px' }}>
            <p>For run day queries, reach out to our organising team directly:</p>
          </div>
          <div className={s.contactGrid}>
            {[
              { name: 'Pasindu', role: 'CCVP HR', phone: '+94766986042', phoneDisplay: '+94 76 698 6042', email: 'pasindu.serasinghe5@aiesec.net' },
              { name: 'Thanuri', role: 'CC Member HR', phone: '+94713688349', phoneDisplay: '+94 71 368 8349', email: 'chenuliranaweera@aiesec.net' },
              { name: 'Sandaru Yahampath', role: 'CC Member HR', phone: '+94761992137', phoneDisplay: '+94 76 199 2137', email: 'sandaruyahampath@aiesec.net' },
            ].map(p => (
              <div key={p.name} className={s.personContactCard}>
                <div className={s.personAvatar}>{p.name.split(' ').map(w => w[0]).join('').slice(0,2)}</div>
                <div className={s.personName}>{p.name}</div>
                <div className={s.personRole}>{p.role}</div>
                <div className={s.personLinks}>
                  <a href={`tel:${p.phone}`} className={s.personLink}>📱 {p.phoneDisplay}</a>
                  <a href={`mailto:${p.email}`} className={s.personLink}>✉️ {p.email}</a>
                </div>
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
            <button onClick={goToRegister} className={s.ctaPrimary}>Register Now</button>
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
