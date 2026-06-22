import { useState, useRef, useEffect, useMemo } from 'react';
import s from './SphereGallery.module.css';

/* Even point distribution on a sphere (Fibonacci) → per-tile lon/lat */
function spherePositions(n) {
  const golden = Math.PI * (3 - Math.sqrt(5)); // golden angle
  const pts = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;        // 1 → -1
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    pts.push({
      lon: Math.atan2(x, z) * (180 / Math.PI), // rotateY
      lat: Math.asin(y) * (180 / Math.PI),     // rotateX
    });
  }
  return pts;
}

const isIOS = () =>
  typeof DeviceOrientationEvent !== 'undefined' &&
  typeof DeviceOrientationEvent.requestPermission === 'function';

export default function SphereGallery({ photos, onClose }) {
  const globeRef = useRef(null);
  const rot      = useRef({ x: -8, y: 0 });   // current applied rotation
  const target   = useRef({ x: -8, y: 0 });   // where we're easing toward
  const base     = useRef(null);              // gyro baseline
  const drag     = useRef(null);
  const rafRef   = useRef(0);
  const [motionOn, setMotionOn] = useState(false);
  const [needsPerm, setNeedsPerm] = useState(isIOS());

  const positions = useMemo(() => spherePositions(photos.length), [photos.length]);
  const RADIUS = 460;

  /* Lock page scroll while the immersive view is open */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* Animation loop — ease current toward target + gentle idle spin */
  useEffect(() => {
    const tick = () => {
      if (!drag.current && !motionOn) target.current.y += 0.05; // idle drift
      rot.current.x += (target.current.x - rot.current.x) * 0.08;
      rot.current.y += (target.current.y - rot.current.y) * 0.08;
      if (globeRef.current) {
        globeRef.current.style.transform =
          `translateZ(-${RADIUS}px) rotateX(${rot.current.x}deg) rotateY(${rot.current.y}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [motionOn]);

  /* Pointer drag (desktop + touch fallback) */
  useEffect(() => {
    const onDown = (e) => {
      const p = e.touches ? e.touches[0] : e;
      drag.current = { x: p.clientX, y: p.clientY, ry: target.current.y, rx: target.current.x };
    };
    const onMove = (e) => {
      if (!drag.current) return;
      const p = e.touches ? e.touches[0] : e;
      const dx = p.clientX - drag.current.x;
      const dy = p.clientY - drag.current.y;
      target.current.y = drag.current.ry + dx * 0.35;
      target.current.x = Math.max(-85, Math.min(85, drag.current.rx - dy * 0.35));
    };
    const onUp = () => { drag.current = null; };

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  /* Gyroscope */
  useEffect(() => {
    if (!motionOn) return;
    const onOrient = (e) => {
      if (e.beta == null || e.gamma == null) return;
      if (!base.current) base.current = { beta: e.beta, gamma: e.gamma, alpha: e.alpha || 0 };
      // turn the phone left/right → spin globe; tilt up/down → pitch
      const dGamma = (e.gamma - base.current.gamma);
      const dAlpha = ((e.alpha || 0) - base.current.alpha);
      const dBeta  = (e.beta - base.current.beta);
      target.current.y = (dAlpha !== 0 ? -dAlpha : dGamma * 2);
      target.current.x = Math.max(-85, Math.min(85, -8 - dBeta));
    };
    window.addEventListener('deviceorientation', onOrient, true);
    return () => window.removeEventListener('deviceorientation', onOrient, true);
  }, [motionOn]);

  const enableMotion = async () => {
    base.current = null;
    if (isIOS()) {
      try {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res !== 'granted') { setNeedsPerm(false); return; }
      } catch { setNeedsPerm(false); return; }
    }
    setNeedsPerm(false);
    setMotionOn(true);
  };

  return (
    <div className={s.overlay}>
      <button className={s.close} onClick={onClose} aria-label="Close 360 gallery">✕</button>

      <div className={s.hint}>
        {motionOn ? 'Move your phone around to explore' : 'Drag to look around'}
      </div>

      <div className={s.stage}>
        <div ref={globeRef} className={s.globe}>
          {photos.map((p, i) => (
            <div
              key={i}
              className={s.cell}
              style={{
                transform:
                  `rotateY(${positions[i].lon}deg) rotateX(${-positions[i].lat}deg) translateZ(${RADIUS}px)`,
              }}
            >
              <img src={p.thumb} alt="" loading="lazy" draggable={false} />
            </div>
          ))}
        </div>
      </div>

      {needsPerm && (
        <button className={s.motionBtn} onClick={enableMotion}>
          📱 Enable motion control
        </button>
      )}
      {!needsPerm && !motionOn && isIOS() === false && 'ontouchstart' in window && (
        <button className={s.motionBtn} onClick={enableMotion}>
          📱 Move with my phone
        </button>
      )}
    </div>
  );
}
