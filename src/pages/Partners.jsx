import { useEffect } from 'react';
import s from './Partners.module.css';
import Footer from '../components/Footer';

const SDG_COLORS = ['#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21','#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367','#FD9D24','#BF8B2E','#3F7E44','#0A97D9','#56C02B','#00689D','#19486A'];

/* ── Sponsors / Networking partners ─────────────────────────── */
const SPONSOR_TIERS = [
  {
    label: 'Title Sponsor',
    badge: '👑',
    color: '#19486A',
    items: [
      /* Add title sponsor logo here:
         { name: 'Nestomalt', logo: '/assets/media-logos/nestomalt.png', url: 'https://nestomalt.lk' } */
    ],
  },
  {
    label: 'Gold Sponsors',
    badge: '🥇',
    color: '#FCC30B',
    items: [
      /* { name: 'Sponsor', logo: '/assets/...', url: '#' } */
    ],
  },
  {
    label: 'Silver Sponsors',
    badge: '🥈',
    color: '#94a3b8',
    items: [],
  },
];

/* ── Media partners — real logos ─────────────────────────────── */
const MEDIA_PARTNERS = [
  { name: 'Derana',             role: 'National Media Partner',        logo: '/assets/media-logos/derana.jpg',       url: 'https://derana.lk' },
  { name: 'Newswire',           role: 'National Media Partner',        logo: '/assets/media-logos/newswire.png',      url: 'https://newswire.lk' },
  { name: 'Eduwire',            role: 'National Media Partner',        logo: '/assets/media-logos/eduwire.png',       url: 'https://eduwire.lk' },
  { name: 'eFM',                role: 'Official Radio Partner',        logo: '/assets/media-logos/efm.jpeg',          url: '#' },
  { name: 'Channel 9',          role: 'Official Digital Media Partner',logo: null,                                    url: '#' },
  { name: 'SL Webcast',         role: 'National Media Partner',        logo: '/assets/media-logos/sl-webcast-black.png', url: '#' },
  { name: 'Lake House',         role: 'Official News Media Partner',   logo: '/assets/media-logos/lake-house.png',    url: 'https://lakehouse.lk' },
  { name: 'Upali Newspapers',   role: 'Official Print Media Partner',  logo: '/assets/media-logos/upali.jpg',         url: '#' },
  { name: 'UniToday',           role: 'Official Youth Media Partner',  logo: '/assets/media-logos/unitoday.png',      url: 'https://unitoday.lk' },
  { name: 'A R T Magazine',     role: 'Official Magazine Media Partner',logo: '/assets/media-logos/art-magazine.png', url: '#' },
  { name: 'Bizwire',            role: 'Official Business News Partner', logo: '/assets/media-logos/bizwire.png',      url: '#' },
];

/* ── Networking partners ─────────────────────────────────────── */
const NETWORKING_PARTNERS = [
  { name: 'Interact District 3220', role: 'Networking Partner', logo: '/assets/media-logos/interact-3220.png', url: '#' },
  /* Add more networking partners as logos arrive */
];

function LogoCard({ item, accentColor }) {
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer"
       className={s.logoCard} style={{ '--tc': accentColor }}>
      {item.logo
        ? <>
            <div className={s.logoWrap}><img src={item.logo} alt={item.name} className={s.logo} /></div>
            <span className={s.cardLabel}>{item.name}</span>
          </>
        : <div className={s.placeholder}>
            <span className={s.placeholderName}>{item.name}</span>
            <span className={s.placeholderRole}>{item.role}</span>
          </div>
      }
    </a>
  );
}

export default function Partners({ onBack }) {
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

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className={s.hero}>
        <div className={s.heroAccentBar}>
          {SDG_COLORS.map((c, i) => <span key={i} style={{ background: c }} />)}
        </div>
        <div className={s.heroInner}>
          <div className={s.heroBadge}>AIESEC in Sri Lanka · WLL 2026</div>
          <h1 className={s.heroTitle}>Sponsors<br/><em className={s.heroEm}>&amp; Partners</em></h1>
          <p className={s.heroSub}>
            These organisations make the <strong>Islandwide World's Largest Lesson 2026</strong> possible —
            investing in Sri Lanka's youth, education, and the Global Goals.
          </p>
        </div>
        <div className={s.heroWave}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--page-bg)"/>
          </svg>
        </div>
      </section>

      {/* ── SPONSORS ──────────────────────────────────────── */}
      {SPONSOR_TIERS.filter(t => t.items.length > 0).length > 0 && (
        <section className={s.section} data-reveal>
          <div className={s.container}>
            <div className={s.sectionHead}>
              <span className={s.sectionLabel}>💼 SPONSORS</span>
              <h2 className={s.sectionTitle}>Our Sponsors</h2>
            </div>
            {SPONSOR_TIERS.filter(t => t.items.length > 0).map(tier => (
              <div key={tier.label} className={s.tierBlock}>
                <div className={s.tierHeader} style={{ '--tc': tier.color }}>
                  <span>{tier.badge}</span>
                  <span className={s.tierLabel}>{tier.label}</span>
                </div>
                <div className={s.logoGrid}>
                  {tier.items.map((item, i) => <LogoCard key={i} item={item} accentColor={tier.color} />)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── MEDIA PARTNERS ────────────────────────────────── */}
      <section className={s.section} data-reveal>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <span className={s.sectionLabel}>📺 MEDIA</span>
            <h2 className={s.sectionTitle}>Media Partners</h2>
            <p className={s.sectionSub}>
              Our official media partners helping spread the World's Largest Lesson
              message across Sri Lanka.
            </p>
          </div>
          <div className={s.logoGrid}>
            {MEDIA_PARTNERS.map((item, i) => <LogoCard key={i} item={item} accentColor="#19486A" />)}
          </div>
        </div>
      </section>

      <div className={s.sdgDivider}>
        {SDG_COLORS.map((c, i) => <span key={i} style={{ background: c }} />)}
      </div>

      {/* ── NETWORKING PARTNERS ───────────────────────────── */}
      <section className={s.section} data-reveal>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <span className={s.sectionLabel}>🤝 COMMUNITY</span>
            <h2 className={s.sectionTitle}>Networking Partners</h2>
          </div>
          <div className={s.logoGrid}>
            {NETWORKING_PARTNERS.map((item, i) => <LogoCard key={i} item={item} accentColor="#4C9F38" />)}
          </div>
        </div>
      </section>


    </div>
    <Footer />
    </>
  );
}
