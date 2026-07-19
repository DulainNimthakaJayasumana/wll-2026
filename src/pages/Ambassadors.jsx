import { useEffect } from 'react';
import s from './Ambassadors.module.css';
import Footer from '../components/Footer';

const AMBASSADORS = [
  { name: 'Udani Senanayake',     title: 'Miss Sri Lanka Earth 2022 · Miss Supermodel Worldwide 2026',                    initials: 'US', color: '#E5243B', photo: '/assets/ambassadors/udani.jpeg',     pos: '50% 8%'  },
  { name: 'Sade Greenwood',       title: 'Miss World Sri Lanka 2021 · Radio Presenter · Model',                           initials: 'SG', color: '#FD6925', photo: '/assets/ambassadors/sade.jpeg',      pos: '50% 5%' ,scale: 1.5 },
  { name: 'Subhashi Tania',       title: 'Climate Journalist',                                                            initials: 'ST', color: '#FCC30B', photo: '/assets/ambassadors/subhashi.jpeg',  pos: '50% 8%'  },
  { name: 'Senuri Rupasinghe',    title: 'Volunteer · Advocate · Hybrid Athlete',                                         initials: 'SR', color: '#4C9F38', photo: '/assets/ambassadors/senuri.jpeg',    pos: '40% -200%', scale: 2 },
  { name: 'Dr. Anoka Abeyrathne', title: 'Social Entrepreneur · Regional Coordinator, Royal Commonwealth Society',        initials: 'DA', color: '#26BDE2', photo: '/assets/ambassadors/dr-anoka.jpeg',  pos: '50% 12%' },
  { name: 'Yuneth Wijenayake',    title: 'Co-Founder & Director of Technology, The Climate Intelligence Network',         initials: 'YW', color: '#19486A', photo: '/assets/ambassadors/yuneth.jpeg',    pos: '50% 8%'  },
  { name: 'Kyle Abeysinghe',      title: '2024 Olympian · Swimmer · Mental Health Advocate',                              initials: 'KA', color: '#A21942', photo: '/assets/ambassadors/kyle.webp',       pos: '50% 20%' },
  { name: 'Chamanthi Bandara',    title: 'Marketer · Miss Universe Sri Lanka 4th Runner-Up 2024',                         initials: 'CB', color: '#DD1367', photo: '/assets/ambassadors/chamanthi.jpeg',  pos: '50% -150%'  ,scale: 2},
  { name: 'Belinda Seneviratne',  title: 'Humanitarian · Model',                                                          initials: 'BS', color: '#0A97D9', photo: '/assets/ambassadors/belinda.jpeg',   pos: '50% 10%' },
];

const RUN_AMBASSADORS = [
  { name: 'Nuvira De Silva',     title: 'Recreational Runner & Entrepreneur',          initials: 'ND', color: '#E5243B', photo: '/assets/run-ambassadors/nuvira.jpeg',   pos: '50% 15%' },
  { name: 'Kavishka Wijesinghe', title: 'Marathoner & Director',                       initials: 'KW', color: '#4C9F38', photo: '/assets/run-ambassadors/kavishka.jpeg', pos: '50% 15%' },
  { name: 'Neesh',               title: 'Athlete · Youth Leader · Public Personality', initials: 'NE', color: '#FCC30B', photo: '/assets/run-ambassadors/neesh.jpeg',  pos: '50% 10%', scale: 1.2 },
  { name: 'Tharindu Wickramasekera', initials: 'TW', color: '#26BDE2', title: 'Founding Member, Colombo Night Run · Marathoner · Running Coach', photo: '/assets/run-ambassadors/tharindu.jpeg', pos: '50% 0%', scale: 1.5 }
];

const SDG_COLORS = ['#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21','#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367','#FD9D24','#BF8B2E','#3F7E44','#0A97D9','#56C02B','#00689D','#19486A'];

function AmbCard({ a }) {
  return (
    <div className={s.card} style={{ '--ac': a.color }}>
      {a.photo
        ? <img className={s.photo} src={a.photo} alt={a.name} style={{ objectPosition: a.pos, transform: `scale(${a.scale || 1})`, transformOrigin: 'center center' }} />
        : <div className={s.initials}>{a.initials}</div>
      }
      <div className={s.overlay}>
        <span className={s.name}>{a.name}</span>
        <span className={s.role}>{a.title}</span>
      </div>
      <div className={s.bar} />
    </div>
  );
}

export default function Ambassadors({ onBack }) {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add(s.revealed); io.unobserve(e.target); } });
    }, { threshold: 0.10 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
    <div className={s.page}>

      <button className={s.backBtn} onClick={onBack} aria-label="Back to main site">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        <span>Back to Main Site</span>
      </button>

      <section className={s.hero}>
        <div className={s.heroAccentBar}>
          {SDG_COLORS.map((c, i) => <span key={i} style={{ background: c }} />)}
        </div>
        <div className={s.heroInner}>
          <div className={s.heroBadge}>AIESEC in Sri Lanka · WLL 2026</div>
          <h1 className={s.heroTitle}>Brand<br/><em className={s.heroEm}>Ambassadors</em></h1>
          <p className={s.heroSub}>
            Meet the inspiring leaders championing the <strong>World's Largest Lesson 2026</strong> —
            spreading the message of the UN Sustainable Development Goals across Sri Lanka.
          </p>
        </div>
        <div className={s.heroWave}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--page-bg)"/>
          </svg>
        </div>
      </section>

      <section className={s.section} data-reveal>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <span className={s.sectionLabel}>🌟 WLL 2026</span>
            <h2 className={s.sectionTitle}>Brand Ambassadors</h2>
            <p className={s.sectionSub}>
              These changemakers are the face of the World's Largest Lesson 2026 —
              inspiring Sri Lankan youth to learn about and act on the Global Goals.
            </p>
          </div>
          <div className={s.grid}>
            {AMBASSADORS.map((a, i) => <AmbCard key={i} a={a} />)}
          </div>
        </div>
      </section>

      <div className={s.sdgDivider}>
        {SDG_COLORS.map((c, i) => <span key={i} style={{ background: c }} />)}
      </div>

      <section className={s.section} data-reveal>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <span className={s.sectionLabel}>🏃 MILES FOR LESSON 2026</span>
            <h2 className={s.sectionTitle}>Run Ambassadors</h2>
            <p className={s.sectionSub}>
              These athletes and community leaders are running with us on 25 July 2026
              to champion education and the Global Goals.
            </p>
          </div>
          <div className={s.grid}>
            {RUN_AMBASSADORS.map((a, i) => <AmbCard key={i} a={a} />)}
          </div>
        </div>
      </section>

    </div>
    <Footer />
    </>
  );
}
