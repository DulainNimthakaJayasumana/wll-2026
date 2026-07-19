import { lazy, Suspense, useEffect, useRef } from 'react';
import s from './HomeMedia.module.css';

const EFMAudio = lazy(() => import('./EFMAudio'));

const SDG_COLORS = ['#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21','#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367','#FD9D24','#BF8B2E','#3F7E44','#0A97D9','#56C02B','#00689D','#19486A'];

const ARTICLES = [
  {
    outlet: 'Daily News',
    outletTagline: "Sri Lanka's National English Newspaper",
    outletColor: '#C5192D',
    outletBg: '#1a0005',
    category: 'Business',
    title: "Sri Lanka Set to Relaunch World's Largest Lesson After Six Years, AIESEC to Lead National Awareness Run Ahead of Flagship Event",
    date: 'July 17, 2026',
    dateline: 'Colombo — July 4, 2026',
    excerpt: "Sri Lanka is set to once again take part in the World's Largest Lesson (WLL), a global education initiative launched by Project Everyone in partnership with UNICEF. This year, the initiative will be spearheaded by AIESEC in Sri Lanka, with the main event scheduled for August 3rd.",
    url: 'https://dailynews.lk/2026/07/17/business/1028648/sri-lanka-set-to-relaunch-worlds-largest-lesson-after-six-years-aiesec-to-lead-national-awareness-run-ahead-of-flagship-event/',
    domain: 'dailynews.lk',
    preview: '/assets/press/eduwire-article.webp',
  },
  {
    outlet: 'Eduwire',
    outletTagline: "Sri Lanka's No.1 Educational Platform",
    outletColor: '#0A97D9',
    outletBg: '#00263d',
    outletLogo: '/assets/media-logos/eduwire.png',
    category: 'Education',
    title: "AIESEC in Sri Lanka to Conduct Islandwide World's Largest Lesson 2026",
    date: 'July 2026',
    dateline: 'Colombo, Sri Lanka',
    excerpt: "AIESEC in Sri Lanka is bringing back the World's Largest Lesson (WLL) — a global initiative by Project Everyone in partnership with UNICEF — to empower Sri Lankan youth with knowledge of the UN Sustainable Development Goals across 40+ schools islandwide.",
    url: 'https://www.eduwire.lk/sri-lanka-set-to-relaunch-worlds-largest-lesson-after-six-years-aiesec-to-lead-national-awareness-run-ahead-of-flagship-event/',
    domain: 'eduwire.lk',
    preview: '/assets/press/daily-news-article.webp',
  },
];

const SOCIAL = [
  {
    platform: 'Facebook', outlet: 'Daily Mirror',
    outletColor: '#c8102e', platformColor: '#1877F2', type: 'Reel',
    title: 'Daily Mirror covers the Miles for Lesson 5K awareness run ahead of WLL 2026',
    url: 'https://www.facebook.com/reel/2035861517130248',
    domain: 'facebook.com/dailymirror',
    platformSvg: <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>,
    cta: '▶ Watch Reel', bg: 'linear-gradient(135deg,#1a2a4a 0%,#0d1b2e 100%)',
  },
  {
    platform: 'Instagram', outlet: 'Eduwire',
    outletColor: '#0A97D9', platformColor: '#E1306C', type: 'Post',
    title: 'Eduwire Instagram coverage of the WLL 2026 launch event and awareness campaign',
    url: 'https://www.instagram.com/p/Daup9Tfkw2a/?igsh=ZGh5ZzkxdHRkMTR2',
    domain: 'instagram.com/eduwire',
    platformSvg: <svg viewBox="0 0 24 24" width="18" height="18"><defs><linearGradient id="ig3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#F58529"/><stop offset="50%" stopColor="#DD2A7B"/><stop offset="100%" stopColor="#8134AF"/></linearGradient></defs><path fill="url(#ig3)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
    cta: '📸 View Post', bg: 'linear-gradient(135deg,#2d0a1e 0%,#1a0d2e 100%)',
  },
];

export default function HomeMedia() {
  const ref = useRef(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll('[data-reveal]') ?? [];
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add(s.revealed); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} id="media" className={s.wrap}>

      {/* ── Section header ────────────────────────────────── */}
      <div className={s.header} data-reveal>
        <div className={s.sdgBar}>{SDG_COLORS.map((c,i)=><span key={i} style={{background:c}}/>)}</div>
        <div className={s.headerInner}>
          <span className={s.eyebrow}>📺 In the Media</span>
          <h2 className={s.heading}>WLL 2026 is making<br/><em className={s.headingEm}>headlines.</em></h2>
          <p className={s.sub}>Channel 9, Daily News, eFM Radio, Eduwire and more — Sri Lanka's media is covering our story.</p>
        </div>
      </div>

      {/* ── eFM Radio ─────────────────────────────────────── */}
      <section className={s.section} data-reveal>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <span className={s.label}>📻 EFM RADIO · ANNOUNCEMENT</span>
            <h3 className={s.sectionTitle}>Hear it on Air</h3>
            <p className={s.sectionSub}>eFM Radio broadcast our WLL 2026 announcement to the nation.</p>
          </div>
          <Suspense fallback={null}><EFMAudio /></Suspense>
        </div>
      </section>

      <div className={s.sdgDivider}>{SDG_COLORS.map((c,i)=><span key={i} style={{background:c}}/>)}</div>

      {/* ── Channel 9 Video ───────────────────────────────── */}
      <section className={s.section} data-reveal>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <span className={s.label}>📺 CHANNEL 9 · OFFICIAL COVERAGE</span>
            <h3 className={s.sectionTitle}>WLL 2026 Launch — Full Video</h3>
            <p className={s.sectionSub}>Our official digital media partner <strong>Channel 9</strong> recorded the full WLL 2026 launch event.</p>
          </div>
          <div className={s.videoWrap}>
            <iframe className={s.videoFrame}
              src="https://www.youtube.com/embed/SQhFArEWRgc"
              title="WLL 2026 Launch Event — Channel 9"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen/>
          </div>
        </div>
      </section>

      <div className={s.sdgDivider}>{SDG_COLORS.map((c,i)=><span key={i} style={{background:c}}/>)}</div>

      {/* ── Press Articles ────────────────────────────────── */}
      <section className={s.section} data-reveal>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <span className={s.label}>📰 PRESS COVERAGE</span>
            <h3 className={s.sectionTitle}>News Articles</h3>
          </div>
          <div className={s.articleGrid}>
            {ARTICLES.map((a, i) => (
              <a key={i} className={s.articleCard} href={a.url} target="_blank" rel="noopener noreferrer">
                {a.preview && <img src={a.preview} alt={`${a.outlet} article`} className={s.articlePreview}/>}
                <div className={s.articleRight}>
                  <div className={s.masthead} style={{background: a.outletBg}}>
                    <div className={s.mastheadLeft}>
                      {a.outletLogo
                        ? <img src={a.outletLogo} alt={a.outlet} className={s.mastheadLogo}/>
                        : <span className={s.mastheadName} style={{color: a.outletColor}}>{a.outlet}</span>}
                      <span className={s.mastheadTagline}>{a.outletTagline}</span>
                    </div>
                    <span className={s.mastheadCategory} style={{background: a.outletColor}}>{a.category}</span>
                  </div>
                  <div className={s.articleBody}>
                    <p className={s.articleDateline}>{a.dateline} · {a.date}</p>
                    <h4 className={s.articleHeadline}>{a.title}</h4>
                    <div className={s.articleDivider} style={{background: a.outletColor}}/>
                    <p className={s.articleExcerpt}>{a.excerpt}</p>
                    <div className={s.articleFooter}>
                      <span className={s.articleDomain}>🔗 {a.domain}</span>
                      <span className={s.articleCta} style={{'--ac': a.outletColor}}>Read Full Article →</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className={s.sdgDivider}>{SDG_COLORS.map((c,i)=><span key={i} style={{background:c}}/>)}</div>

      {/* ── Social Coverage ───────────────────────────────── */}
      <section className={s.section} data-reveal>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <span className={s.label}>📱 SOCIAL MEDIA</span>
            <h3 className={s.sectionTitle}>Reels &amp; Posts</h3>
          </div>
          <div className={s.socialGrid}>
            {SOCIAL.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                 className={s.socialCard} style={{background: item.bg}}>
                <div className={s.socialBar}>
                  <div className={s.socialPlatformRow}>
                    {item.platformSvg}
                    <span className={s.socialPlatformName} style={{color: item.platformColor}}>{item.platform}</span>
                    <span className={s.socialType}>{item.type}</span>
                  </div>
                  <span className={s.socialOutletBadge} style={{background: item.outletColor}}>{item.outlet}</span>
                </div>
                <p className={s.socialTitle}>{item.title}</p>
                <div className={s.socialCardFooter}>
                  <span className={s.socialDomain}>🔗 {item.domain}</span>
                  <span className={s.socialCta} style={{color: item.platformColor}}>{item.cta}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
