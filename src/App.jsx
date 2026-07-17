import { useState, useEffect, lazy, Suspense } from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import LoadingScreen from './components/LoadingScreen';
import Nav          from './components/Nav';
import Hero         from './components/Hero';
import About        from './components/About';
import SDGTeaser    from './components/SDGTeaser';

/* Below-fold components — lazy loaded after initial paint */
const Gallery           = lazy(() => import('./components/Gallery'));
const CoreCommittee     = lazy(() => import('./components/CoreCommittee'));
const BrandAmbassadors  = lazy(() => import('./components/BrandAmbassadors'));
const EFMAudio          = lazy(() => import('./components/EFMAudio'));
const Sponsors          = lazy(() => import('./components/Sponsors'));
const Footer            = lazy(() => import('./components/Footer'));

/* Route pages — only loaded when user navigates there */
const Run         = lazy(() => import('./pages/Run'));
const Volunteer   = lazy(() => import('./pages/Volunteer'));
const SDGs        = lazy(() => import('./pages/SDGs'));
const Ambassadors = lazy(() => import('./pages/Ambassadors'));
const Partners    = lazy(() => import('./pages/Partners'));

/* Hash-based page router — no extra packages needed */
function getPage() {
  const h = window.location.hash;
  if (h === '#run')          return 'run';
  if (h === '#volunteer')    return 'volunteer';
  if (h === '#sdgs')         return 'sdgs';
  if (h === '#ambassadors')  return 'ambassadors';
  if (h === '#partners')     return 'partners';
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

export function goToAmbassadors() {
  window.location.hash = 'ambassadors';
}

export function goToPartners() {
  window.location.hash = 'partners';
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const PAGE_HASHES = new Set(['#run', '#volunteer', '#sdgs', '#ambassadors', '#partners', '', '#']);
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

  /* Background prefetch: SDG animations + route chunks after main content loads.
     Skipped on slow/metered connections so we don't compete for bandwidth with
     content the user actually needs right now. */
  useEffect(() => {
    if (!loaded) return;

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlow = conn && (conn.saveData || ['slow-2g', '2g', '3g'].includes(conn.effectiveType));

    // Route chunks are tiny (a few KB of JS) — always worth prefetching for instant nav
    import('./pages/SDGs');
    import('./pages/Run');
    import('./pages/Volunteer');
    import('./pages/Ambassadors');
    import('./components/Gallery');
    import('./components/CoreCommittee');

    if (isSlow) return; // don't also pull ~9MB of SDG animations on a slow/metered link

    // Prefetch SDG animations silently in the background (only on decent connections)
    Array.from({ length: 17 }, (_, i) => {
      const img = new Image();
      img.src = `/assets/sdg-icons/${i + 1}_SDG_anim.webp`;
    });
  }, [loaded]);

  if (page === 'run')          return <Suspense fallback={null}><Run onBack={goHome} /></Suspense>;
  if (page === 'volunteer')    return <Suspense fallback={null}><Volunteer onBack={goHome} /></Suspense>;
  if (page === 'sdgs')         return <Suspense fallback={null}><SDGs onBack={goHome} /></Suspense>;
  if (page === 'ambassadors')  return <Suspense fallback={null}><Ambassadors onBack={goHome} /></Suspense>;
  if (page === 'partners')     return <Suspense fallback={null}><Partners onBack={goHome} /></Suspense>;

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
          <BrandAmbassadors />
          <EFMAudio />
          <CoreCommittee />
        </Suspense>
      </main>
      <Suspense fallback={null}><Footer /></Suspense>
    </>
  );
}
