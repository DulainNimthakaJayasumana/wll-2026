import { goToMedia } from '../App';
import s from './MediaTeaser.module.css';

const PREVIEWS = [
  { img: '/assets/press/daily-news-article.webp', label: 'Daily News' },
  { img: '/assets/press/eduwire-article.webp',    label: 'Eduwire' },
];

const LOGOS = [
  { src: '/assets/media-logos/channel9.png',     alt: 'Channel 9'  },
  { src: '/assets/media-logos/efm.png',           alt: 'eFM Radio'  },
  { src: '/assets/media-logos/daily-news.png',    alt: 'Daily News' },
  { src: '/assets/media-logos/sl-webcast-black.png', alt: 'SL Webcast' },
];

const SDG_COLORS = ['#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21','#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367','#FD9D24','#BF8B2E','#3F7E44','#0A97D9','#56C02B','#00689D','#19486A'];

export default function MediaTeaser() {
  return (
    <section className={s.section} id="media-teaser">
      {/* Animated SDG top bar */}
      <div className={s.topBar}>{SDG_COLORS.map((c,i)=><span key={i} style={{background:c}}/>)}</div>

      {/* Glowing orbs */}
      <div className={s.orb1}/>
      <div className={s.orb2}/>
      <div className={s.orb3}/>

      <div className={`shell ${s.inner}`}>
        <span className={s.eyebrow}>📺 In the Media</span>
        <h2 className={s.heading}>WLL 2026 is<br/>making headlines.</h2>
        <p className={s.sub}>
          Channel 9, Daily News, eFM Radio, Eduwire and more — Sri Lanka's media is covering our story.
        </p>

        {/* Article preview cards */}
        <div className={s.previewRow}>
          {PREVIEWS.map((p, i) => (
            <button key={i} className={s.previewCard} onClick={goToMedia}>
              <img src={p.img} alt={p.label} className={s.previewImg}/>
              <div className={s.previewLabel}>{p.label}</div>
            </button>
          ))}

          {/* Channel 9 video card */}
          <button className={s.previewCard} onClick={goToMedia}>
            <div className={s.videoCard}>
              <div className={s.playBtn}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <div className={s.videoLabel}>
                <span className={s.videoOutlet}>Channel 9</span>
                <span className={s.videoTitle}>WLL 2026 Launch — Full Video</span>
              </div>
            </div>
            <div className={s.previewLabel}>Channel 9 · YouTube</div>
          </button>
        </div>

        <button className={s.cta} onClick={goToMedia}>
          See all coverage — In the Media →
        </button>
      </div>

      <div className={s.bottomBar}>{SDG_COLORS.map((c,i)=><span key={i} style={{background:c}}/>)}</div>
    </section>
  );
}
