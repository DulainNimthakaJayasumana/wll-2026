import { useEffect, useState } from 'react';
import s from './Volunteer.module.css';

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfM5ZWsqod3nyWFJNacBGrPFUH_O-0iK4pwbMUnjgNvjlq5SA/viewform';

const STEPS = [
  { num:'01', icon:'📚', title:'Training Workshop', sub:'You will participate in a training workshop designed to familiarize you with the World’s Largest Lesson, the SDGs, facilitation techniques, and the session materials.', color:'#E5243B' },
  { num:'02', icon:'🗂️', title:'Session Planning', sub:'Our team will guide you through the session plans and provide all the resources you need to confidently conduct a lesson.', color:'#FD6925' },
  { num:'03', icon:'🏫', title:'School Assigned', sub:'Based on your preferences and availability, you will be assigned to a school where you will represent the initiative.', color:'#FCC30B' },
  { num:'04', icon:'🌍', title:'Deliver the Lesson', sub:'On 20th July 2026, you will deliver a World’s Largest Lesson session to students, helping them understand global challenges and empowering them to become changemakers.', color:'#4C9F38' },
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
  { icon:'🎓', label:'Education', value:'Above O/L', color:'#E5243B' },
  { icon:'🎂', label:'Age', value:'18 – 30 years', color:'#FD6925' },
  { icon:'❤️', label:'Spirit', value:'Passionate & driven', color:'#C5192D' },
  { icon:'👥', label:'Interest', value:'Students & communities', color:'#26BDE2' },
];

const CONTACTS = [
  { name:'Lahirunie Dulsara', role:'CCVP Human Resources · WLL 2026', phone:'+94 76 698 6042', email:'pasindu.serasinghe5@aiesec.net', initials:'LD', color:'#E5243B' },
  { name:'Chenuli Ranaweera', role:'CC Member Human Resources · WLL 2026', phone:'+94 71 368 8349', email:'chenuliranaweera@aiesec.net', initials:'CR', color:'#FD6925' },
  { name:'Sandaru Yahampath', role:'CC Member Human Resources · WLL 2026', phone:'+94 76 199 2137', email:'sandaruyahampath@aiesec.net', initials:'SY', color:'#4C9F38' },
];

/* ── Origami SVG pieces ─────────────────────────────────── */

/* Large faceted origami dove — inspired by the poster artwork */
function OrigamiBird({ className }) {
  return (
    <svg className={className} viewBox="0 0 520 440" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* tail */}
      <polygon points="40,260 130,215 150,275" fill="#2EBD85"/>
      <polygon points="40,260 150,275 120,300" fill="#56C6A9"/>
      {/* body back */}
      <polygon points="120,300 150,275 250,330 215,365" fill="#0A97D9"/>
      <polygon points="150,275 130,215 250,330" fill="#1B6FD0"/>
      {/* belly */}
      <polygon points="130,215 235,170 250,330" fill="#2B3A9F"/>
      {/* chest / neck */}
      <polygon points="235,170 305,95 320,225 250,330" fill="#6C2BD9"/>
      <polygon points="235,170 195,130 305,95" fill="#A52BB8"/>
      {/* wing upper (raised) */}
      <polygon points="305,95 280,18 388,60" fill="#F2542D"/>
      <polygon points="388,60 280,18 360,8" fill="#FBB03B"/>
      <polygon points="305,95 388,60 430,130" fill="#ED1C58"/>
      <polygon points="388,60 470,55 430,130" fill="#F7931E"/>
      {/* head + beak */}
      <polygon points="305,95 430,130 320,225" fill="#E5243B"/>
      <polygon points="430,130 480,150 415,175 320,225" fill="#FD6925"/>
      <polygon points="480,150 510,162 415,175" fill="#FCC30B"/>
      {/* lower wing */}
      <polygon points="250,330 320,225 350,320 290,400" fill="#1BA9E8"/>
      <polygon points="290,400 350,320 330,420" fill="#0A75C9"/>
    </svg>
  );
}

/* Small flat origami shapes — butterflies / fish / cranes for floating */
function MiniShape({ kind, color }) {
  if (kind === 'butterfly') return (
    <svg viewBox="0 0 40 32" aria-hidden="true">
      <polygon points="20,16 2,2 10,24" fill={color}/>
      <polygon points="20,16 38,2 30,24" fill={color} opacity=".75"/>
      <polygon points="20,16 14,30 26,30" fill={color} opacity=".55"/>
    </svg>
  );
  if (kind === 'fish') return (
    <svg viewBox="0 0 44 28" aria-hidden="true">
      <polygon points="4,14 26,2 26,26" fill={color}/>
      <polygon points="26,14 40,4 40,24" fill={color} opacity=".7"/>
    </svg>
  );
  /* crane */
  return (
    <svg viewBox="0 0 44 36" aria-hidden="true">
      <polygon points="6,30 22,6 26,22" fill={color}/>
      <polygon points="26,22 22,6 40,14" fill={color} opacity=".7"/>
      <polygon points="6,30 26,22 32,34" fill={color} opacity=".5"/>
    </svg>
  );
}

const FLOATERS = [
  { kind:'butterfly', color:'#E5243B', top:'12%', left:'6%',  size:34, dur:'7s',  delay:'0s'   },
  { kind:'fish',      color:'#FCC30B', top:'24%', left:'88%', size:40, dur:'9s',  delay:'.8s'  },
  { kind:'crane',     color:'#26BDE2', top:'58%', left:'4%',  size:38, dur:'8s',  delay:'1.4s' },
  { kind:'butterfly', color:'#DD1367', top:'70%', left:'92%', size:30, dur:'6.5s',delay:'.4s'  },
  { kind:'fish',      color:'#4C9F38', top:'42%', left:'94%', size:32, dur:'7.5s',delay:'2s'   },
  { kind:'crane',     color:'#FD6925', top:'80%', left:'10%', size:34, dur:'8.5s',delay:'1s'   },
  { kind:'butterfly', color:'#0A97D9', top:'8%',  left:'78%', size:28, dur:'7s',  delay:'1.8s' },
  { kind:'fish',      color:'#A21942', top:'88%', left:'80%', size:30, dur:'9s',  delay:'.2s'  },
];

/* Hero artwork — real bird image, SVG fallback until the file exists */
function HeroBird() {
  const [imgOk, setImgOk] = useState(true);
  if (!imgOk) return <OrigamiBird className={s.bird}/>;
  return (
    <img
      src="/assets/origami-bird.png"
      alt="Origami bird"
      className={s.bird}
      onError={() => setImgOk(false)}
    />
  );
}

export default function Volunteer({ onBack }) {
  /* scroll reveal */
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

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className={s.hero}>
        {/* floating mini origami */}
        {FLOATERS.map((f, i) => (
          <span key={i} className={s.floater} style={{ top:f.top, left:f.left, width:f.size, animationDuration:f.dur, animationDelay:f.delay }}>
            <MiniShape kind={f.kind} color={f.color}/>
          </span>
        ))}

        <div className={s.heroGrid}>
          <div className={s.heroText}>
            <div className={s.heroBadge}>
              <span className={s.dot}/>
              AIESEC in Sri Lanka · WLL 2026
            </div>

            <h1 className={s.heroTitle}>
              Unfold<br/>
              <em>your impact.</em>
            </h1>

            <p className={s.heroSub}>
              Volunteer for Sri Lanka's <strong>World's Largest Lesson</strong> — like a thousand
              paper cranes, every volunteer carries a lesson to a classroom.<br/>
              <strong>Facilitate one session . Create endless impact </strong>
            </p>

            <div className={s.heroPills}>
              <span style={{'--pc':'#E5243B'}}>📅 20 July 2026</span>
              <span style={{'--pc':'#4C9F38'}}>🏫 Island-wide</span>
              <span style={{'--pc':'#FD6925'}}>👤 Ages 18–30</span>
              <span style={{'--pc':'#26BDE2'}}>🆓 Free to join</span>
            </div>

            <a href={FORM_URL} target="_blank" rel="noopener noreferrer" className={s.heroBtn}>
              Register as a Volunteer →
            </a>
          </div>

          <div className={s.heroArt}>
            <HeroBird/>
          </div>
        </div>

        {/* folded paper edge */}
        <div className={s.foldEdge}/>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className={s.stats} data-reveal>
        <div className={s.container}>
          <div className={s.statsGrid}>
            {[
              { num:'1',  label:'Lesson per volunteer',   color:'#E5243B' },
              { num:'1',  label:'School assigned to you', color:'#FD6925' },
              { num:'17', label:'SDGs you will teach',    color:'#4C9F38' },
              { num:'∞',  label:'Impact on young minds',  color:'#0A97D9' },
            ].map((st, i) => (
              <div key={i} className={s.statCard} style={{'--c': st.color}}>
                <span className={s.statFold}/>
                <div className={s.statNum}>{st.num}</div>
                <div className={s.statLabel}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENT SCOPE ──────────────────────────────────── */}
      <section className={s.scopeSection} data-reveal>
        <div className={s.container}>
          <p className={s.eyebrow}>EVENT SCOPE</p>
          <h2 className={s.sectionTitle}>Reaching every corner of Sri Lanka</h2>
          <div className={s.scopeLayout}>
            {/* Stats */}
            <div className={s.scopeStats}>
              {[
                { num:'10+', label:'Districts',            color:'#FD6925' },
                { num:'40+', label:'Schools',              color:'#DD1367' },
                { num:'30,000+', label:'Students Island Wide', color:'#4C9F38' },
              ].map((st, i) => (
                <div key={i} className={s.scopeStatCard} style={{'--c': st.color}}>
                  <div className={s.scopeNum}>{st.num}</div>
                  <div className={s.scopeLabel}>{st.label}</div>
                </div>
              ))}
            </div>
            {/* District list */}
            <div className={s.districtBox}>
              <div className={s.districtTitle}>Districts</div>
              <div className={s.districtGrid}>
                {['Colombo','Gampaha','Kalutara','Kurunegala','Galle','Matara','Ratnapura','Kandy','Matale','Kegalle','Jaffna'].map(d => (
                  <div key={d} className={s.districtChip}>{d}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section className={s.about}>
        <div className={s.container}>
          <div className={s.aboutGrid}>
            <div data-reveal>
              <p className={s.eyebrow}>VOLUNTEERS AT WLL</p>
              <h2 className={s.sectionTitle}>Every fold counts</h2>
              <p className={s.aboutText}>
                As a volunteer for the <strong>World's Largest Lesson</strong>, you play an important role
                in delivering this nationwide initiative after 5 years — educating and inspiring school
                students about the Sustainable Development Goals through engaging and interactive sessions.
              </p>
              <div className={s.highlightBox}>
                Each volunteer contributes to <strong>one lesson in one school.</strong>
              </div>
            </div>
            <div className={s.aboutArt} data-reveal>
              <MiniShape kind="crane" color="#E5243B"/>
              <MiniShape kind="butterfly" color="#FCC30B"/>
              <MiniShape kind="fish" color="#26BDE2"/>
              <MiniShape kind="butterfly" color="#4C9F38"/>
              <MiniShape kind="crane" color="#FD6925"/>
              <MiniShape kind="fish" color="#DD1367"/>
              <MiniShape kind="butterfly" color="#0A97D9"/>
              <MiniShape kind="crane" color="#A21942"/>
              <MiniShape kind="fish" color="#56C02B"/>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 STEPS ──────────────────────────────────────── */}
      <section className={s.stepsSection}>
        <div className={s.container}>
          <p className={s.eyebrow} data-reveal>YOUR JOURNEY</p>
          <h2 className={s.sectionTitle} data-reveal>What happens after you register</h2>
          <div className={s.stepsGrid}>
            {STEPS.map((step, i) => (
              <div key={i} className={s.stepCard} data-reveal style={{ '--c': step.color, '--delay': `${i * .1}s` }}>
                <span className={s.stepFold}/>
                <div className={s.stepHead}>
                  <span className={s.stepNum}>{step.num}</span>
                  <span className={s.stepIcon}>{step.icon}</span>
                </div>
                <strong className={s.stepTitle}>{step.title}</strong>
                <p className={s.stepSub}>{step.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPECT / GET ─────────────────────────────────── */}
      <section className={s.xgSection}>
        <div className={s.container}>
          <div className={s.xgGrid}>
            <div className={s.xgPanel} data-reveal>
              <div className={s.xgHeader} style={{'--c':'#E5243B'}}>
                <span>📋</span> What we expect
              </div>
              <div className={s.xgBody}>
                {EXPECT.map((item, i) => (
                  <div key={i} className={s.xgRow}>
                    <span>{item.icon}</span><p>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={s.xgPanel} data-reveal style={{'--delay':'.12s'}}>
              <div className={s.xgHeader} style={{'--c':'#4C9F38'}}>
                <span>🌟</span> What you get
              </div>
              <div className={s.xgBody}>
                {GET.map((item, i) => (
                  <div key={i} className={s.xgRow}>
                    <span>{item.icon}</span><p>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WORKSHOPS ────────────────────────────────────── */}
      <section className={s.workshopSection}>
        <div className={s.container}>
          <div className={s.workshopBox} data-reveal>
            <span className={s.workshopIcon}>🛠️</span>
            <div>
              <h3>Event Preparation Workshops</h3>
              <p>All selected volunteers receive the necessary training and guidance prior to the event to confidently carry out their roles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ELIGIBILITY ──────────────────────────────────── */}
      <section className={s.eligSection}>
        <div className={s.container}>
          <p className={s.eyebrow} data-reveal>WHO CAN JOIN</p>
          <h2 className={s.sectionTitle} data-reveal>We welcome individuals who…</h2>
          <div className={s.policyGrid}>
            {POLICIES.map((p, i) => (
              <div key={i} className={s.policyCard} data-reveal style={{'--c': p.color, '--delay': `${i * .08}s`}}>
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

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className={s.ctaSection} data-reveal>
        <div className={s.ctaBox}>
          <span className={`${s.ctaShape} ${s.ctaShape1}`}><MiniShape kind="butterfly" color="#FCC30B"/></span>
          <span className={`${s.ctaShape} ${s.ctaShape2}`}><MiniShape kind="crane" color="#26BDE2"/></span>
          <span className={`${s.ctaShape} ${s.ctaShape3}`}><MiniShape kind="fish" color="#FD6925"/></span>
          <span className={`${s.ctaShape} ${s.ctaShape4}`}><MiniShape kind="butterfly" color="#56C02B"/></span>
          <h2>Ready to unfold your impact?</h2>
          <p>Join volunteers across Sri Lanka on <strong>20th of July 2026</strong>.</p>
          <a href={FORM_URL} target="_blank" rel="noopener noreferrer" className={s.ctaBtn}>
            Register Now — It's Free
          </a>
          <p className={s.ctaNote}>Individual &amp; group registrations open</p>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section className={s.contactSection}>
        <div className={s.container}>
          <p className={s.eyebrow} data-reveal>REACH US</p>
          <h2 className={s.sectionTitle} data-reveal>Have questions? Talk to us.</h2>
          <div className={s.contactGrid}>
            {CONTACTS.map((c, i) => (
              <div key={i} className={s.contactCard} data-reveal style={{'--c': c.color, '--delay': `${i * .1}s`}}>
                <span className={s.contactFold}/>
                <div className={s.contactTop}>
                  <div className={s.avatar}>{c.initials}</div>
                  <div>
                    <div className={s.contactName}>{c.name}</div>
                    <div className={s.contactRole}>{c.role}</div>
                  </div>
                </div>
                <div className={s.contactLinks}>
                  <a href={`tel:${c.phone.replace(/\s/g,'')}`} className={s.contactLink}>📞 {c.phone}</a>
                  <a href={`mailto:${c.email}`} className={s.contactLink}>✉️ {c.email}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
