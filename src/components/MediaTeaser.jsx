import { goToMedia } from '../App';
import s from './MediaTeaser.module.css';

const PREVIEWS = [
  { img: '/assets/press/daily-news-article.webp', label: 'Daily News' },
  { img: '/assets/press/eduwire-article.webp',    label: 'Eduwire' },
];

export default function MediaTeaser() {
  return (
    <section className={s.section} id="media-teaser">
      <div className={s.overlay} />

      {/* Glowing orbs */}
      <div className={s.orb1}/>
      <div className={s.orb2}/>
      <div className={s.orb3}/>

      <div className={`shell ${s.inner}`}>

        {/* ── Top block: Official Aftermovie ── */}
        <div className={s.aftermovieBlock}>
          <span className={s.eyebrow}>🎬 Official Aftermovie</span>
          <h2 className={s.heading}>World's Largest Lesson<br/>in Sri Lanka</h2>
          <p className={s.sub}>
            Relive the energy, impact, and spirit of WLL Sri Lanka from our last edition —
            and this year, WLL 2026 is making headlines once again.
          </p>
          <button className={s.watchBtn} onClick={goToMedia}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Watch the Aftermovie
          </button>
        </div>

        <div className={s.dividerLine}/>

        {/* ── Bottom block: 2026 Media coverage ── */}
        <div className={s.mediaBlock}>
          <span className={s.eyebrowAlt}>📺 In the Media</span>
          <p className={s.mediaSub}>
            Channel 9, Daily News, eFM Radio, Eduwire and more —<br/>Sri Lanka's media is covering our story.
          </p>

          <div className={s.previewRow}>
            {PREVIEWS.map((p, i) => (
              <button key={i} className={s.previewCard} onClick={goToMedia}>
                <img src={p.img} alt={p.label} className={s.previewImg}/>
                <div className={s.previewLabel}>{p.label}</div>
              </button>
            ))}
          </div>

          <button className={s.cta} onClick={goToMedia}>
            See all coverage — In the Media →
          </button>
        </div>

      </div>
    </section>
  );
}
