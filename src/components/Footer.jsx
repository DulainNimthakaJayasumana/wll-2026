import { SDGS } from '../data/sdgs';
import { goToSDGs, goHome } from '../App';
import s from './Footer.module.css';

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    window.__navScrolling = true;
    clearTimeout(window.__navScrollTimer);
    window.__navScrollTimer = setTimeout(() => { window.__navScrolling = false; }, 1200);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // On another page — go home then scroll
    if (id === 'home') {
      goHome();
    } else {
      sessionStorage.setItem('scroll-to', id);
      goHome();
    }
  }
}

const EXPLORE = [
  { id: 'home',         label: 'Home' },
  { id: 'about',        label: 'About' },
  { id: 'sdgs-teaser',  label: 'The 17 SDGs', action: () => goToSDGs() },
  { id: 'gallery',      label: 'Gallery' },
  { id: 'contact',      label: 'Team' },
];

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className="shell">
        <div className={s.top}>
          <div className={s.brand}>
            <div className={s.logos}>
              <img src="/assets/wll-logo.png" alt="World's Largest Lesson" className={s.wllLogo} />
              <img src="/assets/aiesec-logo.png" alt="AIESEC" className={s.aiesecLogo} />
            </div>
            <p>Islandwide World's Largest Lesson 2026 — empowering Sri Lankan youth to learn about and act on the UN Sustainable Development Goals, organised by AIESEC in Sri Lanka.</p>
          </div>
          <div className={s.cols}>
            <div className={s.col}>
              <h5>Explore</h5>
              {EXPLORE.map(l => (
                <a
                  key={l.id}
                  href="#"
                  onClick={e => { e.preventDefault(); l.action ? l.action() : scrollToSection(l.id); }}
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className={s.col}>
              <h5>Connect</h5>
              <a href="https://instagram.com/wll.srilanka" target="_blank" rel="noopener">Instagram</a>
              <a href="https://worldslargestlesson.globalgoals.org/" target="_blank" rel="noopener">Global WLL</a>
              <a href="https://aiesec.lk" target="_blank" rel="noopener">AIESEC Sri Lanka</a>
            </div>
          </div>
        </div>
        <div className={s.sdgBar}>
          {SDGS.map(g => <span key={g.n} style={{ background: g.c }} title={`SDG ${g.n}: ${g.t}`} />)}
        </div>
        <div className={s.bottom}>
          <span>© 2026 World's Largest Lesson · Sri Lanka · AIESEC</span>
          <span>For the Global Goals · #TeachSDGs · #WLL2026</span>
        </div>
        <div className={s.credits}>
          Developed by Dulain Jayasumana &amp; the Marketing Team · World's Largest Lesson 2026
        </div>
      </div>
    </footer>
  );
}
