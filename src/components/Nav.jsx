import { useState, useEffect } from 'react';
import { goToVolunteer, goToSDGs, goHome } from '../App';
import s from './Nav.module.css';

const LINKS = [
  { id: 'home',    label: 'Home' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Team' },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    // Element exists on this page — scroll directly
    window.__navScrolling = true;
    clearTimeout(window.__navScrollTimer);
    window.__navScrollTimer = setTimeout(() => { window.__navScrolling = false; }, 1200);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // Element not on this page (e.g. on SDGs page) — go home then scroll
    if (id === 'home') {
      goHome();
    } else {
      sessionStorage.setItem('scroll-to', id);
      goHome();
    }
  }
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLink = (id) => { scrollToSection(id); };
  const handleVolunteer = () => { goToVolunteer(); };
  const handleSDGs      = () => {
    if (window.location.hash === '#sdgs') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      goToSDGs();
    }
  };

  return (
    <nav className={`${s.nav} ${scrolled ? s.scrolled : ''}`}>
      <a href="#home" className={s.brand} onClick={(e) => { e.preventDefault(); handleLink('home'); }}>
        <img src="/assets/wll-logo.png" alt="World's Largest Lesson" />
      </a>
      <div className={s.links}>
        {LINKS.map(l => (
          <a key={l.id} className={s.pageLink} href={`#${l.id}`} onClick={(e) => { e.preventDefault(); handleLink(l.id); }}>
            {l.label}
          </a>
        ))}
        <button className={s.sdgsLink} onClick={handleSDGs}>
          <span className={s.full}>SDGs</span><span className={s.short}>SDGs</span>
        </button>
        <button className={s.cta} onClick={handleVolunteer}>
          <span className={s.full}>Volunteer with us</span><span className={s.short}>Volunteer</span>
        </button>
      </div>
    </nav>
  );
}
