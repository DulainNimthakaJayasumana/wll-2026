import { useState } from 'react';
import s from './Gallery.module.css';

/* Curated collage — visually balanced, works on all screen sizes */
const PHOTOS = [
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (8).webp', span:'tall' },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (1).webp', span:'normal' },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (2).webp', span:'normal' },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (3).webp', span:'wide' },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (4).webp', span:'normal' },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (5).webp', span:'tall' },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (6).webp', span:'normal' },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (7).webp', span:'wide' },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11.webp',     span:'normal' },
  { src:'teach-green-poster.webp',  span:'normal' },
  { src:'full-classroom.webp',      span:'wide'   },
  { src:'wll-tshirt.webp',          span:'normal' },
  { src:'aerial-group.webp',        span:'wide'   },
  { src:'blackboard-teach.webp',    span:'normal' },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className={s.gallery} id="gallery">

      <div className={`shell reveal ${s.head}`}>
        <span className={s.eyebrow}>Moments from WLL</span>
        <h2>Islandwide in Action</h2>
        <p>Real moments from World's Largest Lesson sessions across Sri Lanka.</p>
      </div>

      <div className={`reveal ${s.collage}`}>
        {PHOTOS.map((p, i) => (
          <div
            key={i}
            className={`${s.tile} ${s[p.span]}`}
            style={{ '--i': i }}
            onClick={() => setLightbox(p.src)}
          >
            <img src={`/assets/photos/${p.src}`} alt="" loading="lazy" />
            <div className={s.overlay} />
          </div>
        ))}
      </div>

      {/* Aftermovie */}
      <div className={`shell reveal ${s.aftermovie}`}>
        <div className={s.afterHead}>
          <span className={s.eyebrow}>Official Aftermovie</span>
          <h2>World's Largest Lesson in Sri Lanka</h2>
          <p>Relive the energy, impact, and spirit of WLL Sri Lanka from our last edition.</p>
        </div>
        <div className={s.videoWrap}>
          <iframe
            src="https://www.youtube.com/embed/SkMjKQIZbHc"
            title="World's Largest Lesson Sri Lanka Aftermovie"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={s.video}
          />
        </div>
      </div>

      {lightbox && (
        <div className={s.lightbox} onClick={() => setLightbox(null)}>
          <button className={s.lbClose}>✕</button>
          <img src={`/assets/photos/${lightbox}`} alt="" className={s.lbImg} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
