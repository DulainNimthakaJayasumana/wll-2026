import s from './Sponsors.module.css';

/* ── Replace logo: null with your imported image, e.g.:
     import nestomaltLogo from '../assets/sponsors/nestomalt.png';
     then set  logo: nestomaltLogo
   ── */

const TIERS = [
  {
    key: 'title',
    badge: '👑',
    label: 'Title Sponsor',
    color: '#19486A',
    sponsors: [
      { name: 'Title Sponsor', logo: null, url: '#' },
    ],
  },
  {
    key: 'gold',
    badge: '🥇',
    label: 'Gold Sponsors',
    color: '#FCC30B',
    sponsors: [
      { name: 'Gold Sponsor', logo: null, url: '#' },
      { name: 'Gold Sponsor', logo: null, url: '#' },
    ],
  },
  {
    key: 'silver',
    badge: '🥈',
    label: 'Silver Sponsors',
    color: '#94a3b8',
    sponsors: [
      { name: 'Silver Sponsor', logo: null, url: '#' },
      { name: 'Silver Sponsor', logo: null, url: '#' },
      { name: 'Silver Sponsor', logo: null, url: '#' },
    ],
  },
  {
    key: 'partners',
    badge: '🤝',
    label: 'Partners',
    color: '#4C9F38',
    sponsors: [
      { name: 'Media Partner',     logo: null, url: '#' },
      { name: 'Knowledge Partner', logo: null, url: '#' },
    ],
  },
];

export default function Sponsors() {
  return (
    <section className={s.section} id="sponsors">
      <div className={`shell ${s.inner}`}>
        <div className={s.head}>
          <span className={s.eyebrow}>💼 PROUDLY SUPPORTED BY</span>
          <h2 className={s.title}>Our Sponsors &amp; Partners</h2>
          <p className={s.sub}>
            These organisations make the Islandwide World's Largest Lesson possible —
            investing in Sri Lanka's youth and the Global Goals.
          </p>
        </div>

        {TIERS.map(tier => (
          <div key={tier.key} className={s.tierBlock}>
            <div className={s.tierHeader} style={{ '--tc': tier.color }}>
              <span>{tier.badge}</span>
              <span className={s.tierLabel}>{tier.label}</span>
            </div>
            <div className={`${s.grid} ${s[tier.key + 'Grid']}`}>
              {tier.sponsors.map((sp, i) => (
                <a key={i} href={sp.url} target="_blank" rel="noopener noreferrer"
                   className={s.card} style={{ '--tc': tier.color }}>
                  {sp.logo
                    ? <img src={sp.logo} alt={sp.name} className={s.logo} />
                    : <div className={s.placeholder}>
                        <span className={s.placeholderIcon}>🏢</span>
                        <span className={s.placeholderName}>{sp.name}</span>
                      </div>
                  }
                </a>
              ))}
            </div>
          </div>
        ))}

        <a href="mailto:wll26coreteam@aiesec.net" className={s.ctaBtn}>
          Become a Sponsor →
        </a>
      </div>
    </section>
  );
}
