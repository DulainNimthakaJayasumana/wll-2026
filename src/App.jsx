import { useState, useEffect } from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import LoadingScreen from './components/LoadingScreen';
import Nav          from './components/Nav';
import Hero         from './components/Hero';
import About        from './components/About';
import SDGTeaser    from './components/SDGTeaser';
import Gallery      from './components/Gallery';
import Competitions from './components/Competitions';
import CoreCommittee from './components/CoreCommittee';
import Footer       from './components/Footer';
import Run          from './pages/Run';
import Volunteer    from './pages/Volunteer';
import SDGs         from './pages/SDGs';

/* Hash-based page router — no extra packages needed */
function getPage() {
  const h = window.location.hash;
  if (h === '#run')       return 'run';
  if (h === '#volunteer') return 'volunteer';
  if (h === '#sdgs')      return 'sdgs';
  return 'home';
}


export function goToRun() {
  window.location.hash = 'run';
}

export function goToVolunteer() {
  window.location.hash = 'volunteer';
}

export function goToRegister() {
  goToVolunteer();
}

export function goHome() {
  window.scrollTo(0, 0);
  window.location.hash = '';
}

export function goToSDGs() {
  window.location.hash = 'sdgs';
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const onHash = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setPage(getPage());
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  /* Scroll reveal only applies to the main site */
  useScrollReveal(page);

  if (page === 'run')       return <Run onBack={goHome} />;
  if (page === 'volunteer') return <Volunteer onBack={goHome} />;
  if (page === 'sdgs')      return <SDGs onBack={goHome} />;

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <Nav />
      <main>
        <Hero />
        <About />
        <SDGTeaser />
        <Gallery />
        <Competitions />
        <CoreCommittee />
      </main>
      <Footer />
    </>
  );
}
