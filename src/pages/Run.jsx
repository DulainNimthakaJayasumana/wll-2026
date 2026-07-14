import { useState, useEffect, useRef } from 'react';
import { goHome, goToRegister } from '../App';
import s from './Run.module.css';

const RUN_FORM_URL = 'https://forms.gle/FhED7mmarNr6Yu2Z8';
import pasinduPhoto from '../assets/team/Pasindu.webp';
import tanuriPhoto from '../assets/team/Tanuri Dissanayaka.webp';

/* ── Countdown to July 25 2026 07:00 ──────────────────────── */
function useRunCountdown() {
  const target = new Date('2026-07-25T07:00:00');
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

/* ── Checkpoints — Independence Square loop, ~5 km ── */
const CHECKPOINTS = [
  {
    num: 'S',
    label: 'Start / Finish',
    place: 'Independence Square',
    street: 'Independence Ave, Colombo 07',
    desc: 'Race begins and ends at Independence Square. Collect your bib, warm up and line up at 7:00 AM!',
    color: '#19486A',
    icon: '🏁',
    km: '0 / 5 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Independence+Square,+Colombo+07',
    mapsLabel: 'Independence Square, Colombo 07',
  },
  {
    num: 1,
    label: 'Checkpoint 1',
    place: 'Nelum Pokuna Flag Area',
    street: 'Nelum Pokuna Mawatha, Colombo 07',
    desc: 'First water station at Nelum Pokuna Flag Area. Hydrate and push north towards Vihara Maha Devi Park!',
    color: '#E5243B',
    icon: '💧',
    km: '~1 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Nelum+Pokuna+Mawatha,+Colombo+07',
    mapsLabel: 'Nelum Pokuna, Colombo 07',
  },
  {
    num: 2,
    label: 'Checkpoint 2',
    place: 'Vihara Maha Devi Park',
    street: 'Srimath Anagarika Dharmapala Mawatha, Colombo 07',
    desc: 'Energy station at the north end of Vihara Maha Devi Park, near Buddhist Ladies College. Loop around the park — halfway there!',
    color: '#FCC30B',
    icon: '⚡',
    km: '~2 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vihara+Maha+Devi+Park,+Colombo',
    mapsLabel: 'Vihara Maha Devi Park, Colombo 07',
  },
  {
    num: 3,
    label: 'Checkpoint 3',
    place: 'Ladies College',
    street: 'Dharmapala Mawatha, Colombo 07',
    desc: 'Refreshment stop near Ladies College and Colombo Public Library. Head south — you\'re over halfway!',
    color: '#FD6925',
    icon: '🏃',
    km: '~3 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ladies+College,+Colombo+07',
    mapsLabel: 'Ladies College, Colombo 07',
  },
  {
    num: 4,
    label: 'Checkpoint 4',
    place: 'Faculty of Arts',
    street: 'University of Colombo, Cumaratunga Munidasa Mawatha, Colombo 03',
    desc: 'Final water stop near the Faculty of Arts, University of Colombo. Turn east towards BMICH — almost there!',
    color: '#4C9F38',
    icon: '💪',
    km: '~4 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Faculty+of+Arts+University+of+Colombo',
    mapsLabel: 'Faculty of Arts, University of Colombo',
  },
  {
    num: 5,
    label: 'Checkpoint 5',
    place: 'BMICH Park',
    street: 'Bauddhaloka Mawatha, Colombo 07',
    desc: 'Last push past BMICH Park and Adventure Golf. Head back west to Independence Square and cross the finish line!',
    color: '#26BDE2',
    icon: '🏅',
    km: '~4.8 km',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=BMICH+Park,+Bauddhaloka+Mawatha,+Colombo',
    mapsLabel: 'BMICH Park, Colombo 07',
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
      <button className={s.backBtn} onClick={onBack || goHome} aria-label="Back to main site">
        <svg className={s.backIconDesktop} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        <svg className={s.backIconMobile} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11.5 12 4l9 7.5"/>
          <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9"/>
        </svg>
        <span className={s.backLabel}>Back to Main Site</span>
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

          <img src="/assets/miles4lessons_logo.webp" alt="Nestomalt Miles for Lessons 2026" className={s.heroLogo} />

          <p className={s.heroSub}>
            Run for the Global Goals · Independence Square, Colombo 07
          </p>

          <div className={s.heroCols}>
            <div className={s.heroStat}>
              <span className={s.heroStatIcon}>📅</span>
              <span className={s.heroStatVal}>July 25, 2026</span>
              <span className={s.heroStatLabel}>Race Day · 7:00 AM</span>
            </div>
            <div className={s.heroStatDivider} />
            <div className={s.heroStat}>
              <span className={s.heroStatIcon}>📍</span>
              <span className={s.heroStatVal}>Independence Square</span>
              <span className={s.heroStatLabel}>Start &amp; Finish · Colombo 07</span>
            </div>
            <div className={s.heroStatDivider} />
            <div className={s.heroStat}>
              <span className={s.heroStatIcon}>🎯</span>
              <span className={s.heroStatVal}>5 km Loop</span>
              <span className={s.heroStatLabel}>5 Checkpoints</span>
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
            <div className={s.cdDate}>Saturday, 25 July 2026 · 7:00 AM</div>
          </div>

          <div className={s.heroCtas}>
            <a href={RUN_FORM_URL} target="_blank" rel="noopener noreferrer" className={s.ctaPrimary}>Register Now</a>
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
            <h2>Independence Square Loop — 5 km</h2>
            <p>Start and finish at Independence Square. The loop takes you past Nelum Pokuna, around Vihara Maha Devi Park, south through Ladies College, past the Faculty of Arts and BMICH Park — through the heart of Cinnamon Gardens. <strong>Click any checkpoint for directions.</strong></p>
          </div>

          <div className={s.mapLayout}>
            {/* Fixed route map image + accurate pins */}
            <div className={s.mapContainer}>
              <div className={s.mapBadge}>Route Map</div>

              <iframe
                id="mapmyfitness_route"
                src="https://www.mapmyrun.com/routes/view/embedded/6739130676?width=600&height=401&elevation=true&line_color=E61900DC&rgbhex=DC0019&distance_markers=1&unit_type=metric&map_mode=ROADMAP&show_marker_every=1&last_updated=2026-06-29T09:04:21+00:00"
                height="679px"
                width="100%"
                frameBorder="0"
                className={s.mapIframe}
                allowFullScreen
                allow="fullscreen"
                title="Miles for Lessons 2026 route map"
              />

              {/* Full route button */}
              <a
                className={s.fullRouteBtn}
                href="https://www.mapmyrun.com/routes/view/6739130676"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                View Full Route on MapMyRun
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
              { icon:'🗓️', label:'Date',       val:'Saturday, 25 July 2026' },
              { icon:'⏰', label:'Start Time',  val:'7:00 AM sharp' },
              { icon:'📍', label:'Start & Finish', val:'Independence Square, Colombo 07' },
              { icon:'🔄', label:'Route',         val:'Nelum Pokuna · Vihara Maha Devi Park · Ladies College · Faculty of Arts · BMICH Park' },
              { icon:'📏', label:'Distance',      val:'5 km loop · 5 checkpoints' },
              { icon:'👟', label:'Category',    val:'Open to all ages & fitness levels' },
              { icon:'🎽', label:'Race Kit',    val:'Bib + T-Shirt (free)' },
              { icon:'🏅', label:'Finisher',    val:'Certificates for all finishers' },
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
            <p>Every registered participant gets a <strong>race bib</strong>, an <strong>exclusive WLL 2026 t-shirt</strong>- completely free. Limited stock, first come first served!</p>
          </div>
          <div className={s.merchItems}>
            {[
              { icon:'👕', label:'WLL T-Shirt' },
              { icon:'🪪', label:'Race Bib' },
              { icon:'🏅', label:'Finisher Certificate' },
            ].map(m => (
              <div key={m.label} className={s.merchItem}>
                <span className={s.merchItemIcon}>{m.icon}</span>
                <span className={s.merchItemLabel}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MILES FOR LESSON AMBASSADORS ──────────────────── */}
      <section className={s.runAmbSection}>
        <div className={s.sectionHead}>
          <span className={s.eyebrow}>🏃 MILES FOR LESSON 2026</span>
          <h2 className={s.sectionTitle}>Run Ambassadors</h2>
          <p className={s.sectionSub}>
            These athletes and community leaders are running with us to champion
            education and the Global Goals across Sri Lanka.
          </p>
        </div>
        <div className={s.runAmbGrid}>
          {[
            { name: 'Nuvira De Silva',     initials: 'ND', color: '#E5243B', title: 'Recreational Runner & Entrepreneur',          photo: '/assets/run-ambassadors/nuvira.jpeg',   pos: '50% 15%' },
            { name: 'Kavishka Wijesinghe', initials: 'KW', color: '#4C9F38', title: 'Marathoner & Director',                        photo: '/assets/run-ambassadors/kavishka.jpeg', pos: '50% 15%' },
            { name: 'Neesh',              initials: 'NE', color: '#FCC30B', title: 'Athlete · Youth Leader · Public Personality',   photo: '/assets/run-ambassadors/neesh-c.jpeg',  pos: '50% 20%' },
          ].map((a, i) => (
            <div key={i} className={s.runAmbCard} style={{ '--ac': a.color }}>
              <div className={s.runAmbAvatar}>
                {a.photo
                  ? <img src={a.photo} alt={a.name} style={{ objectPosition: a.pos || '50% 20%' }} />
                  : <span>{a.initials}</span>
                }
              </div>
              <span className={s.runAmbName}>{a.name}</span>
              <span className={s.runAmbRole}>{a.title}</span>
              <div className={s.runAmbBar} />
            </div>
          ))}
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
                q: "What is Miles for Lessons?",
                a: "Miles for Lessons is a purpose-driven CSR fundraising run organized under the World’s Largest Lesson (WLL) initiative. It brings together individuals passionate about fitness, community impact, and creating positive change, while raising funds to support the Islandwide World’s Largest Lesson 2026 Sri Lanka initiative.",
              },
              {
                q: "When and where is the race?",
                a: "📅 Saturday, 25 July 2026 at 7:00 AM sharp. 📍 Start & Finish: Independence Square, Independence Ave, Colombo 07.",
              },
              {
                q: "What is the race route?",
                a: "The 5 km Independence Square Loop starts and finishes at Independence Square. Head north to Nelum Pokuna (CP 1), loop around Vihara Maha Devi Park (CP 2), south past Ladies College (CP 3), past the Faculty of Arts (CP 4), east to BMICH Park (CP 5), and back to the finish!",
              },
              {
                q: "Who can participate?",
                a: "The run is open to everyone — all ages and fitness levels are welcome. Whether you choose to walk, jog, or sprint the 5 km loop through Cinnamon Gardens, you’re encouraged to join!",
              },
              {
                q: "How do I register?",
                a: "Click the Register button on the website and complete the Google Form. Please upload the registration fee payment slip as part of the form. You may register individually or as a group. Registration fee: Rs. 1,800 per individual 🎽 — includes a complimentary event T-shirt.",
              },
              {
                q: "Will I receive a T-shirt?",
                a: "Yes! Every registered participant will receive a free official event T-shirt along with a race bib and a finisher certificate.",
              },
              {
                q: "When will I receive my race kit?",
                a: "Race kits (bib + T-shirt) will be distributed prior to the event. The organizing committee will share detailed collection instructions closer to the event date.",
              },
              {
                q: "How can my company partner or sponsor the event?",
                a: (
                  <>
                    <p>We&apos;d love to collaborate! Please reach out to us via:</p>
                    <div className={s.faqContactList}>
                      <a href="mailto:pasindu.serasinghe5@aiesec.net" className={s.faqContactItem}>📧 pasindu.serasinghe5@aiesec.net</a>
                      <a href="mailto:poohbalarajavarun@aiesec.net" className={s.faqContactItem}>📧 poohbalarajavarun@aiesec.net</a>
                      <a href="tel:+94777867058" className={s.faqContactItem}>📞 +94 77 786 7058</a>
                    </div>
                    <p>Whether you&apos;re here to promote your brand, join as a corporate team, or help with resources and logistics — let&apos;s make it happen!</p>
                  </>
                ),
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
          <div className={s.contactGridTwo}>
            <a href="https://instagram.com/wll.srilanka" target="_blank" rel="noopener noreferrer" className={s.contactCard}>
              <span className={s.contactIcon}>📸</span>
              <span className={s.contactLabel}>Instagram — WLL Sri Lanka</span>
              <span className={s.contactVal}>@wll.srilanka</span>
            </a>
            <a href="https://www.instagram.com/nestomalt.lk/" target="_blank" rel="noopener noreferrer" className={`${s.contactCard} ${s.contactCardPartner}`}>
              <span className={s.contactIcon}>📸</span>
              <span className={s.contactLabel}>Instagram — Title Partner</span>
              <span className={s.contactVal}>@nestomalt.lk</span>
            </a>
            <a href="mailto:wll26coreteam@aiesec.net" className={s.contactCard}>
              <span className={s.contactIcon}>✉️</span>
              <span className={s.contactLabel}>Email</span>
              <span className={s.contactVal}>wll26coreteam@aiesec.net</span>
            </a>
          </div>

          <div className={s.sectionHead} style={{ marginTop: '56px' }}>
            <p>For run day queries, reach out to our organising team directly:</p>
          </div>
          <div className={s.contactGridPeople}>
            {[
              { name: 'Pasindu Serasinghe', role: 'Core Committee President', phone: '+94766365700', phoneDisplay: '+94 76 636 5700', email: 'pasindu.serasinghe5@aiesec.net', photo: pasinduPhoto, pos:'50% 35%', zoom:1.35 },
              { name: 'Tanuri Dissanayaka', role: 'Core Committee Vice President Network Management', phone: '+94776202028', phoneDisplay: '+94 77 620 2028', email: 'tanuri.dissanayaka@aiesec.net', photo: tanuriPhoto },
            ].map(p => (
              <div key={p.name} className={s.personContactCard}>
                <div className={s.personAvatar}>
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt={p.name}
                      style={{
                        ...(p.pos ? { objectPosition: p.pos } : {}),
                        ...(p.zoom ? { transform: `scale(${p.zoom})` } : {}),
                      }}
                    />
                  ) : p.name.split(' ').map(w => w[0]).join('').slice(0,2)}
                </div>
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
          <p>Join hundreds of Sri Lankan youth running for a better world on 25 July 2026 </p>
          <div className={s.ctaBtns}>
            <a href={RUN_FORM_URL} target="_blank" rel="noopener noreferrer" className={s.ctaPrimary}>Register Now</a>
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
