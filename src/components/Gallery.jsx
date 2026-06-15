import { useState } from 'react';
import s from './Gallery.module.css';

const PHOTOS = [
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (8).jpeg', alt:'WLL 2026 event moment', cls:['g-tall'] },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (1).jpeg', alt:'WLL 2026 event moment' },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (2).jpeg', alt:'WLL 2026 event moment' },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (3).jpeg', alt:'WLL 2026 event moment', cls:['g-wide'] },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (4).jpeg', alt:'WLL 2026 event moment' },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (5).jpeg', alt:'WLL 2026 event moment', cls:['g-tall'] },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (6).jpeg', alt:'WLL 2026 event moment' },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11 (7).jpeg', alt:'WLL 2026 event moment', cls:['g-wide'] },
  { src:'WhatsApp Image 2026-06-15 at 20.32.11.jpeg',     alt:'WLL 2026 event moment' },
  { src:'teach-green-poster.png',   alt:'Volunteers teaching SDGs', cls:['g-tall'] },
  { src:'hug-green.png',            alt:'Volunteer with student' },
  { src:'full-classroom.png',       alt:'Full classroom WLL lesson', cls:['g-wide'] },
  { src:'wll-tshirt.png',           alt:'WLL volunteer t-shirt' },
  { src:'blackboard-teach.png',     alt:'Volunteer at blackboard' },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className={s.gallery} id="gallery">
      {/* Header */}
      <div className={`shell reveal ${s.head}`}>
        <span className={s.eyebrow}>Moments from WLL</span>
        <h2>Islandwide in Action</h2>
        <p>Real moments from World's Largest Lesson sessions across 
          Sri Lanka — one classroom at a time.</p>
      </div>

      {/* Grid */}
      <div className={`reveal ${s.grid}`}>
        {PHOTOS.map((p, i) => (
          <figure
            key={i}
            className={[s.item, ...(p.cls || []).map(c => s[c])].join(' ')}
            onClick={() => setLightbox(p)}
            style={{ '--i': i }}
          >
            <img src={`/assets/photos/${p.src}`} alt={p.alt} loading="lazy" />
            <div className={s.overlay}>
              <span className={s.overlayIcon}>🔍</span>
            </div>
          </figure>
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

      {/* Lightbox */}
      {lightbox && (
        <div className={s.lightbox} onClick={() => setLightbox(null)}>
          <button className={s.lbClose} onClick={() => setLightbox(null)}>✕</button>
          <img
            src={`/assets/photos/${lightbox.src}`}
            alt={lightbox.alt}
            className={s.lbImg}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
