import { useState, useEffect } from 'react';
import { goToRun, goToVolunteer, goToSDGs } from '../App';
import s from './Nav.module.css';

const LINKS = [
  { id: 'home',    label: 'Home' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Team' },
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  // Signal SDGTeaser to skip its snap while we nav-scroll
  window.__navScrolling = true;
  clearTimeout(window.__navScrollTimer);
  window.__navScrollTimer = setTimeout(() => { window.__navScrolling = false; }, 1200);
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLink = (id) => { setOpen(false); scrollTo(id); };
  const handleRun       = () => { setOpen(false); goToRun(); };
  const handleVolunteer = () => { setOpen(false); goToVolunteer(); };
  const handleSDGs      = () => { setOpen(false); goToSDGs(); };

  return (
    <nav className={`${s.nav} ${scrolled ? s.scrolled : ''}`}>
      <a href="#home" className={s.brand} onClick={(e) => { e.preventDefault(); handleLink('home'); }}>
        <img src="/assets/wll-logo.png" alt="World's Largest Lesson" />
      </a>
      <div className={`${s.links} ${open ? s.open : ''}`}>
        {LINKS.map(l => (
          <a key={l.id} href={`#${l.id}`} onClick={(e) => { e.preventDefault(); handleLink(l.id); }}>
            {l.label}
          </a>
        ))}
        <button className={s.sdgsLink} onClick={handleSDGs}>SDGs</button>
        <button className={s.ctaRun} onClick={handleRun}>🏃 Miles for Lesson</button>
        <button className={s.cta} onClick={handleVolunteer}>Volunteer with us</button>
      </div>
      <button
        className={`${s.burger} ${open ? s.open : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label="Menu"
      >
        <span/><span/><span/>
      </button>
    </nav>
  );
}
