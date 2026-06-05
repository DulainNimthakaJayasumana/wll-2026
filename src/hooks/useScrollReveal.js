import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const run = () => {
      const io = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        }),
        { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
      );

      document.querySelectorAll('.reveal:not(.in)').forEach(el => {
        // If element is already in the viewport on load (e.g. jumped via hash),
        // mark it visible immediately without waiting for scroll
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('in');
        } else {
          io.observe(el);
        }
      });

      return io;
    };

    // Run once after mount, then again after a short delay to catch
    // elements that load after first paint (images, async data)
    const io1 = run();
    const t   = setTimeout(() => { io1.disconnect(); run(); }, 600);

    return () => { io1.disconnect(); clearTimeout(t); };
  }, []);
}
