import { useState, useEffect } from 'react';
import { goToRegister, goToRun, goToVolunteer } from '../App';
import s from './Nav.module.css';

const LINKS = [
  { href: '#home',         label: 'Home' },
  { href: '#about',        label: 'About' },
  { href: '#sdgs',         label: 'SDGs' },
  { href: '#gallery',      label: 'Gallery' },
  { href: '#competitions', label: 'Competitions' },
  { href: '#contact',      label: 'Team' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleRegister  = () => { setOpen(false); goToRegister(); };
  const handleRun       = () => { setOpen(false); goToRun(); };
  const handleVolunteer = () => { setOpen(false); goToVolunteer(); };

  return (
    <nav className={`${s.nav} ${scrolled ? s.scrolled : ''}`}>
      <a href="#home" className={s.brand}>
        <img src="/assets/wll-logo.png" alt="World's Largest Lesson" />
      </a>
      <div className={`${s.links} ${open ? s.open : ''}`}>
        {LINKS.map(l => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <button className={s.ctaRun} onClick={handleRun}>🏃 Miles for Lesson</button>
        <button className={s.ctaVolunteer} onClick={handleVolunteer}>Volunteer</button>
        <button className={s.cta} onClick={handleRegister}>Register</button>
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
