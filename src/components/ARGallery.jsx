import { useState, useRef, useEffect, useMemo } from 'react';
import s from './ARGallery.module.css';

/* Lay photos out as a curved wall across a 180° arc in front of the viewer.
   A tidy grid: longitude spans −90°…+90°, latitude spans a gentle band. */
function arcPositions(n) {
  const LON_SPAN = 180;   // total horizontal sweep (degrees)
  const LAT_SPAN = 70;    // total vertical sweep (degrees)
  const cols = Math.ceil(Math.sqrt(n * 1.8));
  const rows = Math.ceil(n / cols);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const colsInRow = Math.min(cols, n - r * cols);
    // center each row's columns
    const lon = colsInRow === 1
      ? 0
      : -LON_SPAN / 2 + (c / (cols - 1)) * LON_SPAN;
    const lat = rows === 1
      ? 0
      : LAT_SPAN / 2 - (r / (rows - 1)) * LAT_SPAN;
    pts.push({ lon, lat });
  }
  return pts;
}

const isIOS = () =>
  typeof DeviceOrientationEvent !== 'undefined' &&
  typeof DeviceOrientationEvent.requestPermission === 'function';

/* How much the view turns per degree of physical phone rotation.
   <1 makes it calmer (the full 180° of photos needs less body turning). */
const SENSITIVITY = 0.6;

export default function ARGallery({ photos, onClose }) {
  const videoRef  = useRef(null);
  const worldRef  = useRef(null);
  const streamRef = useRef(null);
  const heading   = useRef({ value: 0, prev: null }); // unwrapped compass heading
  const orient    = useRef({ beta: 90 });
  const smooth    = useRef({ x: 0, y: 0 });
  const rafRef    = useRef(0);

  const [phase, setPhase] = useState('intro'); // intro | starting | live | error
  const [errMsg, setErrMsg] = useState('');

  const positions = useMemo(() => arcPositions(photos.length), [photos.length]);
  const RADIUS = 760;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* Render loop — map device orientation to a world rotation so photos stay
     anchored in space as you physically turn the phone. */
  useEffect(() => {
    if (phase !== 'live') return;
    const tick = () => {
      // target rotations (degrees), scaled down so it feels calm
      const ty = -heading.current.value * SENSITIVITY;          // turn left/right
      const tx = Math.max(-50, Math.min(50, (orient.current.beta - 90) * SENSITIVITY)); // look up/down
      // smoothing for stability (lower = smoother / less twitchy)
      smooth.current.x += (tx - smooth.current.x) * 0.1;
      smooth.current.y += (ty - smooth.current.y) * 0.1;
      if (worldRef.current) {
        worldRef.current.style.transform =
          `rotateX(${smooth.current.x}deg) rotateY(${smooth.current.y}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  /* Device orientation listener — unwrap the compass heading so it never
     jumps when crossing the 0°/360° boundary (that was the fast spin). */
  useEffect(() => {
    if (phase !== 'live') return;
    const onOrient = (e) => {
      if (e.alpha == null) return;
      const a = e.alpha;
      if (heading.current.prev != null) {
        let d = a - heading.current.prev;
        if (d > 180) d -= 360;
        if (d < -180) d += 360;
        heading.current.value += d;
      }
      heading.current.prev = a;
      orient.current.beta = e.beta ?? 90;
    };
    window.addEventListener('deviceorientation', onOrient, true);
    return () => window.removeEventListener('deviceorientation', onOrient, true);
  }, [phase]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };
  useEffect(() => stopCamera, []);

  const close = () => { stopCamera(); onClose(); };

  const start = async () => {
    setPhase('starting');
    // 1) Motion permission (iOS 13+)
    if (isIOS()) {
      try {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res !== 'granted') {
          setErrMsg('Motion access was blocked. Enable it in Settings to look around.');
          setPhase('error');
          return;
        }
      } catch {
        setErrMsg('This device blocked motion access.');
        setPhase('error');
        return;
      }
    }
    // 2) Camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setPhase('live');
    } catch (err) {
      setErrMsg(
        err && err.name === 'NotAllowedError'
          ? 'Camera access was blocked. Allow the camera to enter AR.'
          : 'Could not start the camera on this device.'
      );
      setPhase('error');
    }
  };

  return (
    <div className={s.overlay}>
      <video ref={videoRef} className={s.camera} muted playsInline />
      <div className={s.scrim} />

      <button className={s.close} onClick={close} aria-label="Exit AR">✕</button>

      {/* 3D photo sphere — viewer sits at the center */}
      {phase === 'live' && (
        <div className={s.stage}>
          <div ref={worldRef} className={s.world}>
            {photos.map((p, i) => (
              <div
                key={i}
                className={s.cell}
                style={{
                  transform:
                    `rotateY(${positions[i].lon}deg) rotateX(${-positions[i].lat}deg) translateZ(-${RADIUS}px) rotateY(180deg)`,
                }}
              >
                <img src={p.thumb} alt="" draggable={false} />
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'live' && (
        <div className={s.hint}>Turn around to explore the moments near you 🌍</div>
      )}

      {/* Intro / permission card */}
      {(phase === 'intro' || phase === 'starting' || phase === 'error') && (
        <div className={s.card}>
          <div className={s.cardIcon}>📷</div>
          <h3>View in AR</h3>
          <p>
            Step inside a sphere of WLL moments. Allow your camera and motion,
            then turn your phone in any direction to look around you.
          </p>
          {phase === 'error' && <p className={s.err}>{errMsg}</p>}
          <button
            className={s.startBtn}
            onClick={start}
            disabled={phase === 'starting'}
          >
            {phase === 'starting' ? 'Starting…' : phase === 'error' ? 'Try again' : 'Enter AR'}
          </button>
          <p className={s.note}>Best on a phone · needs camera &amp; motion access</p>
        </div>
      )}
    </div>
  );
}
