import { useRef, useState, useEffect, useCallback } from 'react';
import s from './EFMAudio.module.css';

const CLIPS = [
  { src: '/assets/audio/efm-wll-1.mpeg', label: 'eFM × WLL 2026 — Pt. 1', desc: 'What is the World\'s Largest Lesson?' },
  { src: '/assets/audio/efm-wll-2.mpeg', label: 'eFM × WLL 2026 — Pt. 2', desc: 'How to get involved with WLL 2026' },
];

function fmt(t) {
  if (!t || isNaN(t)) return '0:00';
  const m = Math.floor(t / 60);
  const ss = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${ss}`;
}

/* ── SVG vinyl grooves ─────────────────────────────────────── */
function VinylGrooves() {
  const rings = [82, 90, 98, 106, 115, 124, 133, 142];
  return (
    <svg viewBox="0 0 300 300" className={s.groovesSvg} aria-hidden="true">
      {rings.map(r => (
        <circle key={r} cx="150" cy="150" r={r}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
      ))}
    </svg>
  );
}

export default function EFMAudio() {
  const audioRef    = useRef(null);
  const sectionRef  = useRef(null);
  const diskRef     = useRef(null);
  const dragState   = useRef(null); // { startAngle, startTime, duration }
  const autoPlayed  = useRef(false);

  const [trackIdx,     setTrackIdx]     = useState(0);
  const [playing,      setPlaying]      = useState(false);
  const [progress,     setProgress]     = useState(0);   // 0–1
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [scratching,   setScratching]   = useState(false);
  const [spinDeg,      setSpinDeg]      = useState(0);
  const spinRef = useRef(0); // live degree for animation frame

  /* ── Autoplay when section enters viewport ──────────────── */
  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !autoPlayed.current) {
        autoPlayed.current = true;
        audioRef.current?.play().catch(() => {});
      }
    }, { threshold: 0.5 });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  /* ── Spin animation loop ────────────────────────────────── */
  useEffect(() => {
    let rafId;
    let last = null;
    const tick = ts => {
      if (last !== null && playing && !scratching) {
        const delta = ts - last;
        spinRef.current = (spinRef.current + delta * 0.09) % 360;
        setSpinDeg(spinRef.current);
      }
      last = ts;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [playing, scratching]);

  /* ── Track change ───────────────────────────────────────── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const wasPlaying = playing;
    audio.load();
    if (wasPlaying) audio.play().catch(() => {});
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, [trackIdx]);

  /* ── Audio event handlers ───────────────────────────────── */
  const onPlay    = () => setPlaying(true);
  const onPause   = () => setPlaying(false);
  const onEnded   = () => {
    if (trackIdx < CLIPS.length - 1) {
      setTrackIdx(i => i + 1);
    } else {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  };
  const onLoaded  = e => setDuration(e.target.duration);
  const onTick    = e => {
    const a = e.target;
    setCurrentTime(a.currentTime);
    setProgress(a.duration ? a.currentTime / a.duration : 0);
  };

  /* ── Controls ───────────────────────────────────────────── */
  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    playing ? a.pause() : a.play().catch(() => {});
  };

  const nextTrack = () => setTrackIdx(i => (i + 1) % CLIPS.length);
  const prevTrack = () => setTrackIdx(i => (i - 1 + CLIPS.length) % CLIPS.length);

  /* ── Progress bar click ─────────────────────────────────── */
  const seekBar = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audioRef.current?.duration) {
      audioRef.current.currentTime = ratio * audioRef.current.duration;
    }
  };

  /* ── DJ disk drag (scratch) ─────────────────────────────── */
  const getAngle = useCallback((e, el) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  }, []);

  const onDiskDown = useCallback(e => {
    e.preventDefault();
    const el = diskRef.current;
    if (!el || !audioRef.current?.duration) return;
    setScratching(true);
    const a = audioRef.current;
    if (playing) a.pause();
    dragState.current = {
      startAngle: getAngle(e, el),
      startTime:  a.currentTime,
      duration:   a.duration,
    };
  }, [playing, getAngle]);

  const onDiskMove = useCallback(e => {
    if (!dragState.current || !audioRef.current) return;
    e.preventDefault();
    const el = diskRef.current;
    const angle = getAngle(e, el);
    const delta = angle - dragState.current.startAngle;
    // 1 full rotation (360°) = 4 seconds of audio
    const timeDelta = (delta / 360) * 4;
    const newTime = Math.max(0, Math.min(
      dragState.current.duration,
      dragState.current.startTime + timeDelta
    ));
    audioRef.current.currentTime = newTime;
    // Update visual spin
    spinRef.current = (spinRef.current + delta * 0.5) % 360;
    setSpinDeg(spinRef.current);
    dragState.current.startAngle = angle;
    dragState.current.startTime  = newTime;
  }, [getAngle]);

  const onDiskUp = useCallback(() => {
    if (!dragState.current) return;
    dragState.current = null;
    setScratching(false);
    if (playing) audioRef.current?.play().catch(() => {});
  }, [playing]);

  useEffect(() => {
    window.addEventListener('mousemove', onDiskMove);
    window.addEventListener('mouseup',   onDiskUp);
    window.addEventListener('touchmove', onDiskMove, { passive: false });
    window.addEventListener('touchend',  onDiskUp);
    return () => {
      window.removeEventListener('mousemove', onDiskMove);
      window.removeEventListener('mouseup',   onDiskUp);
      window.removeEventListener('touchmove', onDiskMove);
      window.removeEventListener('touchend',  onDiskUp);
    };
  }, [onDiskMove, onDiskUp]);

  const clip = CLIPS[trackIdx];

  return (
    <section className={s.section} id="on-air" ref={sectionRef}>
      <audio
        ref={audioRef}
        src={clip.src}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onLoadedMetadata={onLoaded}
        onTimeUpdate={onTick}
      />

      <div className={`shell ${s.inner}`}>

        {/* ── Header ──────────────────────────────────────── */}
        <div className={s.head}>
          <span className={s.eyebrow}>📻 AS HEARD ON AIR</span>
          <h2 className={s.title}>eFM × WLL 2026</h2>
          <p className={s.sub}>
            Our official radio partner <strong>eFM</strong> is spreading the word across Sri Lanka's airwaves.
          </p>
        </div>

        {/* ── Turntable ───────────────────────────────────── */}
        <div className={s.turntableWrap}>

          {/* Vinyl disk */}
          <div
            ref={diskRef}
            className={`${s.disk} ${scratching ? s.scratching : ''}`}
            style={{ transform: `rotate(${spinDeg}deg)` }}
            onMouseDown={onDiskDown}
            onTouchStart={onDiskDown}
            aria-label="Drag to scratch"
          >
            {/* Outer vinyl */}
            <div className={s.vinyl} />
            {/* SVG grooves */}
            <VinylGrooves />
            {/* Sheen */}
            <div className={s.sheen} />
          </div>

          {/* eFM logo center — does NOT rotate */}
          <div className={s.centerLabel}>
            <img src="/assets/media-logos/efm.jpeg" alt="eFM" className={s.centerLogo} />
          </div>

          {/* Tonearm — angle driven by progress:
              LIFTED  = arm resting beyond outer rim (paused / no track)
              OUTER   = needle on outer groove (progress = 0)
              INNER   = needle just outside center label (progress = 1) */}
          {(() => {
            const LIFTED = -65;  // arm resting outside the disk rim
            const OUTER  = -56;  // needle at outer grey groove edge
            const INNER  = -22;  // needle just outside yellow ring, doesn't overlap logo
            const angle = (duration > 0 && playing)
              ? OUTER + progress * (INNER - OUTER)   // smoothly track audio
              : duration > 0
                ? OUTER + progress * (INNER - OUTER) // paused — hold position
                : LIFTED;                            // no track yet — lift off
            return (
              <div
                className={s.tonearm}
                style={{
                  transform: `rotate(${angle}deg)`,
                  transition: scratching ? 'none' : 'transform 0.3s ease-out',
                }}
              >
                <div className={s.tonearmPivot} />
                <div className={s.tonearmArm}>
                  <div className={s.tonearmCartridge} />
                </div>
              </div>
            );
          })()}

        </div>

        {/* ── Track info ──────────────────────────────────── */}
        <div className={s.trackInfo}>
          <span className={s.trackLabel}>{clip.label}</span>
          <span className={s.trackDesc}>{clip.desc}</span>
        </div>

        {/* ── Progress bar ────────────────────────────────── */}
        <div className={s.progressWrap}>
          <span className={s.time}>{fmt(currentTime)}</span>
          <div className={s.progressBar} onClick={seekBar} role="slider" aria-label="Seek">
            <div className={s.progressFill} style={{ width: `${progress * 100}%` }} />
            <div className={s.progressThumb} style={{ left: `${progress * 100}%` }} />
          </div>
          <span className={s.time}>{fmt(duration)}</span>
        </div>

        {/* ── Controls ────────────────────────────────────── */}
        <div className={s.controls}>
          {/* Prev */}
          <button className={s.ctrlBtn} onClick={prevTrack} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
            </svg>
          </button>

          {/* Play / Pause */}
          <button className={s.playBtn} onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
            {playing
              ? <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              : <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M8 5v14l11-7z"/></svg>
            }
          </button>

          {/* Next */}
          <button className={s.ctrlBtn} onClick={nextTrack} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/>
            </svg>
          </button>
        </div>

        {/* ── Track dots ──────────────────────────────────── */}
        <div className={s.dots}>
          {CLIPS.map((_, i) => (
            <button
              key={i}
              className={`${s.dot} ${i === trackIdx ? s.dotActive : ''}`}
              onClick={() => setTrackIdx(i)}
              aria-label={`Track ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
