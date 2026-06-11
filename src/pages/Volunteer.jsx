import { useEffect, useRef } from 'react';
import s from './Volunteer.module.css';

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfM5ZWsqod3nyWFJNacBGrPFUH_O-0iK4pwbMUnjgNvjlq5SA/viewform';

/* 17 SDG colours */
const SDG_COLORS = [
  '#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21',
  '#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367',
  '#FD9D24','#BF8B2E','#3F7E44','#0A97D9','#56C02B',
  '#00689D','#19486A',
];

const SDG_ICONS = ['🚫','🌾','💊','📚','♀️','💧','⚡','💼','🏗️','📉','🏙️','♻️','🌡️','🌊','🌿','⚖️','🤝'];
const SDG_NAMES = [
  'No Poverty','Zero Hunger','Good Health','Quality Education','Gender Equality',
  'Clean Water','Clean Energy','Decent Work','Industry','Reduced Inequalities',
  'Sustainable Cities','Responsible Consumption','Climate Action',
  'Life Below Water','Life on Land','Peace & Justice','Partnerships',
];

const STEPS = [
  { num:'01', icon:'📚', title:'Training Workshop', sub:'Learn SDGs, facilitation & session materials' },
  { num:'02', icon:'🗂️', title:'Session Planning', sub:'Full resources & plans provided by our team' },
  { num:'03', icon:'🏫', title:'School Assigned', sub:'Matched to a school based on your availability' },
  { num:'04', icon:'🌍', title:'Deliver the Lesson', sub:'20 July 2026 — teach, inspire, empower' },
];

const EXPECT = [
  { icon:'🎓', text:'One session · One school' },
  { icon:'💬', text:'Good communication & teamwork' },
  { icon:'❤️', text:'Passion for youth & education' },
  { icon:'⏰', text:'Punctual & committed' },
  { icon:'✈️', text:'Willing to travel to assigned school' },
  { icon:'😊', text:'Professional & positive attitude' },
];

const GET = [
  { icon:'🏅', text:'Certificate of participation' },
  { icon:'🌐', text:'Nationwide volunteering experience' },
  { icon:'🎤', text:'Public speaking & leadership' },
  { icon:'🤝', text:'Network with youth leaders' },
  { icon:'📈', text:'Project execution experience' },
  { icon:'💚', text:'Personal growth & social impact' },
];

const POLICIES = [
  { icon:'🎓', label:'Education', value:'Above O/L' },
  { icon:'🎂', label:'Age', value:'18 – 30 years' },
  { icon:'❤️', label:'Spirit', value:'Passionate & driven' },
  { icon:'👥', label:'Interest', value:'Students & communities' },
];

const CONTACTS = [
  { name:'Lahirunie Dulsara',  role:'CCVP Human Resources', phone:'+94 76 698 6042', email:'pasindu.serasinghe5@aiesec.net',  initials:'LD', color:'#E5243B' },
  { name:'Chenuli Ranaweera',  role:'CC Member Human Resources', phone:'+94 71 368 8349', email:'chenuliranaweera@aiesec.net',    initials:'CR', color:'#FD6925' },
  { name:'Sandaru Yahampath',  role:'CC Member Human Resources', phone:'+94 76 199 2137', email:'sandaruyahampath@aiesec.net',    initials:'SY', color:'#4C9F38' },
];

/* Floating SDG orbs canvas */
function SdgCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const orbs = Array.from({ length: 14 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * 500,
      r: 18 + Math.random() * 22,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      color: SDG_COLORS[i % 17],
      alpha: 0.12 + Math.random() * 0.1,
    }));

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = canvas.width + o.r;
        if (o.x > canvas.width + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = canvas.height + o.r;
        if (o.y > canvas.height + o.r) o.y = -o.r;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = o.color + Math.round(o.alpha * 255).toString(16).padStart(2,'0');
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className={s.heroCanvas}/>;
}

export default function Volunteer({ onBack }) {
  /* Scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add(s.revealed); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={s.page}>

      {/* Back */}
      <button className={s.backBtn} onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Home
      </button>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className={s.hero}>
        <SdgCanvas/>

        <div className={s.heroInner}>
          <div className={s.heroBadge}>
            <span className={s.dot}/>
            AIESEC in Sri Lanka · WLL 2026
          </div>

          <h1 className={s.heroTitle}>
            Be the reason<br/>
            <em>a child learns</em><br/>
            about the world.
          </h1>

          <p className={s.heroSub}>
            Volunteer for Sri Lanka's World's Largest Lesson.<br/>
            <strong>One school · One session · Endless impact.</strong>
          </p>

          <div className={s.heroPills}>
            <span style={{borderColor:'#E5243B',color:'#E5243B'}}>📅 20 July 2026</span>
            <span style={{borderColor:'#4C9F38',color:'#4C9F38'}}>🏫 Schools Island-wide</span>
            <span style={{borderColor:'#FD6925',color:'#FD6925'}}>👤 Ages 18–30</span>
            <span style={{borderColor:'#26BDE2',color:'#26BDE2'}}>🆓 Free to join</span>
          </div>

          <a href={FORM_URL} target="_blank" rel="noopener noreferrer" className={s.heroBtn}>
            Register as a Volunteer →
          </a>
        </div>

        {/* SDG wheel strip */}
        <div className={s.sdgStrip}>
          {SDG_COLORS.map((col, i) => (
            <div key={i} className={s.sdgTile} style={{ background: col }} title={`SDG ${i+1}: ${SDG_NAMES[i]}`}>
              <span className={s.sdgIcon}>{SDG_ICONS[i]}</span>
              <span className={s.sdgNum}>{i + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────── */}
      <section className={s.stats} data-reveal>
        <div className={s.container}>
          <div className={s.statsGrid}>
            {[
              { num:'1',   label:'Lesson per volunteer', color:'#E5243B' },
              { num:'1',   label:'School assigned to you', color:'#4C9F38' },
              { num:'17',  label:'SDGs you will teach', color:'#FD6925' },
              { num:'∞',   label:'Impact on young minds', color:'#26BDE2' },
            ].map((s2, i) => (
              <div key={i} className={s.statCard}>
                <div className={s.statNum} style={{ color: s2.color }}>{s2.num}</div>
                <div className={s.statLabel}>{s2.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT HAPPENS AFTER ─────────────────────────── */}
      <section className={s.stepsSection}>
        <div className={s.container}>
          <p className={s.eyebrow} data-reveal>YOUR JOURNEY</p>
          <h2 className={s.sectionTitle} data-reveal>What happens after you register</h2>

          <div className={s.stepsTrack}>
            {STEPS.map((step, i) => (
              <div key={i} className={s.stepWrap} data-reveal style={{ '--delay': `${i * 0.12}s` }}>
                <div className={s.stepCard} style={{ '--accent': SDG_COLORS[i * 4] }}>
                  <div className={s.stepTop}>
                    <span className={s.stepNumLabel}>{step.num}</span>
                    <span className={s.stepEmoji}>{step.icon}</span>
                  </div>
                  <strong className={s.stepTitle}>{step.title}</strong>
                  <p className={s.stepSub}>{step.sub}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={s.stepArrow}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPECT / GET ───────────────────────────────── */}
      <section className={s.xgSection}>
        <div className={s.container}>
          <div className={s.xgGrid}>

            <div className={s.xgPanel} data-reveal>
              <div className={s.xgHeader} style={{ background:'#E5243B' }}>
                <span>📋</span> What we expect
              </div>
              <div className={s.xgBody}>
                {EXPECT.map((item, i) => (
                  <div key={i} className={s.xgRow}>
                    <span className={s.xgIcon}>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={s.xgPanel} data-reveal style={{ '--delay':'.1s' }}>
              <div className={s.xgHeader} style={{ background:'#4C9F38' }}>
                <span>🌟</span> What you get
              </div>
              <div className={s.xgBody}>
                {GET.map((item, i) => (
                  <div key={i} className={s.xgRow}>
                    <span className={s.xgIcon}>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SDG WHEEL ──────────────────────────────────── */}
      <section className={s.sdgSection}>
        <div className={s.container}>
          <p className={s.eyebrow} data-reveal>THE GLOBAL GOALS</p>
          <h2 className={s.sectionTitle} data-reveal>You'll teach all 17 SDGs</h2>
          <div className={s.sdgGrid} data-reveal>
            {SDG_COLORS.map((col, i) => (
              <div key={i} className={s.sdgCard} style={{ '--c': col }}>
                <div className={s.sdgCardInner}>
                  <span className={s.sdgCardIcon}>{SDG_ICONS[i]}</span>
                  <span className={s.sdgCardNum}>SDG {i + 1}</span>
                  <span className={s.sdgCardName}>{SDG_NAMES[i]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ELIGIBILITY ────────────────────────────────── */}
      <section className={s.eligSection}>
        <div className={s.container}>
          <p className={s.eyebrow} data-reveal>WHO CAN JOIN</p>
          <h2 className={s.sectionTitle} data-reveal>We welcome individuals who…</h2>
          <div className={s.policyRow} data-reveal>
            {POLICIES.map((p, i) => (
              <div key={i} className={s.policyCard} style={{ '--accent': SDG_COLORS[i * 4] }}>
                <span className={s.policyIcon}>{p.icon}</span>
                <div className={s.policyLabel}>{p.label}</div>
                <div className={s.policyValue}>{p.value}</div>
              </div>
            ))}
          </div>
          <p className={s.groupNote} data-reveal>
            Register <strong>individually or as a group</strong> — both are welcome!
          </p>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className={s.ctaSection} data-reveal>
        <div className={s.ctaBox}>
          {/* coloured SDG side dots */}
          {SDG_COLORS.slice(0,8).map((c, i) => (
            <span key={i} className={s.ctaDot} style={{ background: c, '--i': i }}/>
          ))}
          <h2>Ready to make an impact?</h2>
          <p>Join volunteers across Sri Lanka on <strong>20 July 2026</strong>.</p>
          <a href={FORM_URL} target="_blank" rel="noopener noreferrer" className={s.ctaBtn}>
            Register Now — It's Free
          </a>
          <p className={s.ctaNote}>Individual &amp; group registrations open</p>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────────── */}
      <section className={s.contactSection}>
        <div className={s.container}>
          <p className={s.eyebrow} data-reveal>REACH US</p>
          <h2 className={s.sectionTitle} data-reveal>Have questions? Talk to us.</h2>
          <div className={s.contactGrid}>
            {CONTACTS.map((c, i) => (
              <div key={i} className={s.contactCard} data-reveal style={{ '--delay': `${i * 0.1}s` }}>
                <div className={s.contactTop} style={{ background: c.color }}>
                  <div className={s.avatarCircle}>{c.initials}</div>
                  <div>
                    <div className={s.contactName}>{c.name}</div>
                    <div className={s.contactRole}>{c.role}</div>
                  </div>
                </div>
                <div className={s.contactBody}>
                  <a href={`tel:${c.phone.replace(/\s/g,'')}`} className={s.contactLine}>
                    <span>📞</span> {c.phone}
                  </a>
                  <a href={`mailto:${c.email}`} className={s.contactLine}>
                    <span>✉️</span> {c.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
