import { useState, useEffect, lazy, Suspense } from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import LoadingScreen from './components/LoadingScreen';
import Nav          from './components/Nav';
import Hero         from './components/Hero';
import About        from './components/About';
import SDGTeaser    from './components/SDGTeaser';

/* Below-fold components — lazy loaded after initial paint */
const Gallery      = lazy(() => import('./components/Gallery'));
const Competitions = lazy(() => import('./components/Competitions'));
const CoreCommittee = lazy(() => import('./components/CoreCommittee'));
const Footer       = lazy(() => import('./components/Footer'));

/* Route pages — only loaded when user navigates there */
const Run       = lazy(() => import('./pages/Run'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const SDGs      = lazy(() => import('./pages/SDGs'));

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
    const PAGE_HASHES = new Set(['#run', '#volunteer', '#sdgs', '', '#']);
    const onHash = () => {
      const h = window.location.hash;
      const newPage = getPage();
      if (PAGE_HASHES.has(h) || newPage !== page) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      setPage(newPage);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [page]);

  useScrollReveal(page);

  /* After navigating home from another page, scroll to stored section target */
  useEffect(() => {
    if (page !== 'home') return;
    const target = sessionStorage.getItem('scroll-to');
    if (!target) return;
    sessionStorage.removeItem('scroll-to');
    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempts++ < 30) {
        setTimeout(tryScroll, 100);
      }
    };
    setTimeout(tryScroll, 200);
  }, [page]);

  /* Background prefetch: SDG GIFs + route chunks after main content loads */
  useEffect(() => {
    if (!loaded) return;
    const PAD = n => String(n).padStart(2, '0');
    // Prefetch SDG GIFs silently in the background
    Array.from({ length: 17 }, (_, i) => {
      const img = new Image();
      img.src = `/assets/sdg-icons/${i + 1}_SDG_MakeEveryDayCount_Gifs_GDU.gif`;
    });
    // Prefetch route chunks so navigation is instant
    import('./pages/SDGs');
    import('./pages/Run');
    import('./pages/Volunteer');
    import('./components/Gallery');
    import('./components/CoreCommittee');
  }, [loaded]);

  if (page === 'run')       return <Suspense fallback={null}><Run onBack={goHome} /></Suspense>;
  if (page === 'volunteer') return <Suspense fallback={null}><Volunteer onBack={goHome} /></Suspense>;
  if (page === 'sdgs')      return <Suspense fallback={null}><SDGs onBack={goHome} /></Suspense>;

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <Nav />
      <main>
        <Hero />
        <About />
        <SDGTeaser />
        <Suspense fallback={null}>
          <Gallery />
          <Competitions />
          <CoreCommittee />
        </Suspense>
      </main>
      <Suspense fallback={null}><Footer /></Suspense>
    </>
  );
}
