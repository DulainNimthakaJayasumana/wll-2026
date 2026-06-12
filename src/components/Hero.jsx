import { useEffect, useRef } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { goToRegister } from '../App';
import WheelSVG from './WheelSVG';
import s from './Hero.module.css';

const PAD = n => String(n).padStart(2,'0');
const CD_CELLS = [
  { key:'d', label:'Days',    accent:'#E5243B' },
  { key:'h', label:'Hours',   accent:'#FCC30B' },
  { key:'m', label:'Minutes', accent:'#26BDE2' },
  { key:'s', label:'Seconds', accent:'#4C9F38' },
];

const SDG_COLORS = [
  '#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21',
  '#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367',
  '#FD9D24','#BF8B2E','#3F7E44','#0A97D9','#56C02B',
  '#00689D','#19486A',
];



export default function Hero() {
  const cd      = useCountdown();
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const hero   = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles, raf;

    /* Use the hero element's actual bounding box — always correct */
    const resize = () => {
      const rect = hero.getBoundingClientRect();
      W = canvas.width  = rect.width;
      H = canvas.height = rect.height;
      initParticles();
    };

    const initParticles = () => {
      /* Divide the hero into a grid so particles are spread evenly */
      const cols = 8, rows = 5;
      const cellW = W / cols, cellH = H / rows;
      particles = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Only include ~60% of cells so it's not too dense
          if (Math.random() > 0.6) continue;
          const color = SDG_COLORS[Math.floor(Math.random() * SDG_COLORS.length)];
          particles.push({
            x:  c * cellW + Math.random() * cellW,
            y:  r * cellH + Math.random() * cellH,
            r:  4 + Math.random() * 10,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            c:  color,
            a:  0.12 + Math.random() * 0.20,
            // each particle bobs on its own sine wave
            phase: Math.random() * Math.PI * 2,
            freq:  0.005 + Math.random() * 0.008,
            amp:   8 + Math.random() * 16,
          });
        }
      }
    };

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t++;
      particles.forEach(p => {
        /* Smooth sine-wave float instead of straight drift */
        const bx = p.x + Math.sin(t * p.freq + p.phase) * p.amp;
        const by = p.y + Math.cos(t * p.freq * 0.7 + p.phase) * (p.amp * 0.5);

        ctx.beginPath();
        ctx.arc(bx, by, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      raf = requestAnimationFrame(draw);
    };

    /* Delay one frame so layout is complete before reading size */
    requestAnimationFrame(() => {
      resize();
      draw();
    });

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <header className={s.hero} id="home" ref={heroRef}>
      <div className={s.bgWheel}><WheelSVG size={820} rotation={0} activeIdx={-1} /></div>
      <canvas ref={canvasRef} className={s.canvas} />

      {/* Origami birds — launch banner style */}
      <img src="/assets/origami-bird.png" alt="" aria-hidden="true" className={s.birdLeft} />
      <img src="/assets/origami-bird.png" alt="" aria-hidden="true" className={s.birdRight} />


      <div className={`shell ${s.inner}`}>
        <div className={s.badge}>
          <span className={s.dot}>SL</span>
          <span>Islandwide · Sri Lanka 2026</span>
        </div>
        <h1>
          Islandwide<br/>
          <em className={s.accent}>World's Largest</em><br/>
          <span className={s.outline}>Lesson 2026</span>
        </h1>
        <p className={s.sub}>
          Empowering Sri Lankan youth to understand and act on the United Nations Sustainable Development Goals — one classroom, one creative idea at a time.
        </p>
        <div className={s.ctas}>
          <button onClick={goToRegister} className={`${s.btn} ${s.primary}`}>Volunteer with us</button>
          <a href="#run" className={`${s.btn} ${s.glass}`}>Register for the Run</a>
        </div>
        <div className={s.countdown}>
          {CD_CELLS.map(c => (
            <div key={c.key} className={s.cdCell} style={{'--accent': c.accent}}>
              <span className={s.cdNum}>{PAD(cd[c.key])}</span>
              <span className={s.cdLabel}>{c.label}</span>
            </div>
          ))}
          <span className={s.cdCaption}>Counting down to 28 July 2026</span>
        </div>
      </div>
      <div className={s.scrollHint}>
        <span>Scroll</span>
        <div className={s.scrollLine}/>
      </div>
    </header>
  );
}
