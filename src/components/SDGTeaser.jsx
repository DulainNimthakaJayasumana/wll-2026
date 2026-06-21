import { goToSDGs } from '../App';
import s from './SDGTeaser.module.css';

function goToSDG(index) {
  sessionStorage.setItem('sdg-start', index);
  goToSDGs();
}

export default function SDGTeaser() {
  return (
    <section className={s.section} id="sdgs-teaser">
      <div className={s.videoBg}>
        <video
          className={s.video}
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/sdg-icons/sdg-01.webp"
        >
          <source src="/assets/sdgs.mp4" type="video/mp4" />
        </video>
        <div className={s.overlay} />
      </div>

      <div className={`shell ${s.inner}`}>
        <span className={s.eyebrow}>The Blueprint</span>
        <h2 className={s.heading}>
          17 Goals.<br />One shared future.
        </h2>
        <p className={s.sub}>
          Discover all 17 UN Sustainable Development Goals — the framework
          behind the World's Largest Lesson.
        </p>

        <div className={s.sdgStrip}>
          {Array.from({ length: 17 }, (_, i) => i + 1).map(n => (
            <img
              key={n}
              src={`/assets/sdg-icons/sdg-${String(n).padStart(2, '0')}.webp`}
              alt={`SDG ${n}`}
              className={s.sdgThumb}
              onClick={() => goToSDG(n - 1)}
            />
          ))}
        </div>

        <button className={s.cta} onClick={goToSDGs}>
          Explore all 17 Goals →
        </button>
      </div>
    </section>
  );
}
