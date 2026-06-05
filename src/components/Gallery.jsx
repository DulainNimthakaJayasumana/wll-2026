import s from './Gallery.module.css';

const PHOTOS = [
  { src:'teach-green-poster.png', alt:'Volunteers teaching SDGs', cls:['g-tall'] },
  { src:'hug-green.png',          alt:'Volunteer with student' },
  { src:'poster-pair.png',        alt:'Volunteers holding SDG poster' },
  { src:'full-classroom.png',     alt:'Full classroom WLL lesson', cls:['g-wide'] },
  { src:'wll-tshirt.png',         alt:'WLL volunteer in branded t-shirt' },
  { src:'volunteer-child.png',    alt:'Volunteer encouraging student' },
  { src:'aerial-group.png',       alt:'Large group of students', cls:['g-wide'] },
  { src:'blackboard-teach.png',   alt:'Volunteer at blackboard' },
];

export default function Gallery() {
  return (
    <section className={s.gallery} id="gallery">
      <div className="shell">
        <div className={`reveal ${s.head}`}>
          <span className={s.eyebrow}>On the Ground</span>
          <h2>Islandwide in action</h2>
          <p>Real moments from World's Largest Lesson sessions across Sri Lanka.</p>
        </div>
      </div>
      <div className={`reveal ${s.grid}`}>
        {PHOTOS.map(p => (
          <figure key={p.src} className={[s.item, ...(p.cls||[]).map(c=>s[c])].join(' ')}>
            <img src={`/assets/photos/${p.src}`} alt={p.alt} loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  );
}
