import { useState, useEffect } from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import Nav          from './components/Nav';
import Hero         from './components/Hero';
import About        from './components/About';
import SDGStory     from './components/SDGStory';
import Gallery      from './components/Gallery';
import Competitions from './components/Competitions';
import CoreCommittee from './components/CoreCommittee';
import Footer       from './components/Footer';
import Chatbot      from './components/Chatbot/Chatbot';
import Register     from './pages/Register';
import Run             from './pages/Run';
import RunRegister     from './pages/RunRegister';
import Volunteer       from './pages/Volunteer';

/* Hash-based page router — no extra packages needed */
function getPage() {
  const h = window.location.hash;
  if (h === '#register')    return 'register';
  if (h === '#run')          return 'run';
  if (h === '#run-register') return 'run-register';
  if (h === '#volunteer')    return 'volunteer';
  return 'home';
}

export function goToRegister() {
  window.location.hash = 'register';
}

export function goToRun() {
  window.location.hash = 'run';
}

export function goToVolunteer() {
  window.location.hash = 'volunteer';
}

export function goHome() {
  window.location.hash = '';
}

export default function App() {
  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const onHash = () => setPage(getPage());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  /* Scroll reveal only applies to the main site */
  useScrollReveal();

  if (page === 'register')    return <Register onBack={goHome} />;
  if (page === 'run')          return <Run onBack={goHome} />;
  if (page === 'run-register') return <RunRegister onBack={() => { window.location.hash = 'run'; }} />;
  if (page === 'volunteer')    return <Volunteer onBack={goHome} />;

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <SDGStory />
        <Gallery />
        <Competitions />
        <CoreCommittee />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
