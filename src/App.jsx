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

/* Hash-based page router — no extra packages needed */
function getPage() {
  return window.location.hash === '#register' ? 'register' : 'home';
}

export function goToRegister() {
  window.location.hash = 'register';
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

  if (page === 'register') {
    return <Register onBack={goHome} />;
  }

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
