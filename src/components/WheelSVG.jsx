import { SDGS } from '../data/sdgs';

export function buildWheelPath(size, i) {
  const cx = size / 2, cy = size / 2;
  const rO = size / 2, rI = size * 0.30;
  const gap = 1.2, seg = 360 / 17;
  const pt = (r, a) => {
    const rad = (a - 90) * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const a0 = i * seg + gap / 2, a1 = (i + 1) * seg - gap / 2;
  const [x0o,y0o]=pt(rO,a0),[x1o,y1o]=pt(rO,a1),[x1i,y1i]=pt(rI,a1),[x0i,y0i]=pt(rI,a0);
  const large = (a1-a0)>180?1:0;
  return `M ${x0o} ${y0o} A ${rO} ${rO} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${rI} ${rI} 0 ${large} 0 ${x0i} ${y0i} Z`;
}

export default function WheelSVG({ size = 400, rotation = 0, activeIdx = 0, onSegmentClick }) {
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      style={{ width: '100%', transform: `rotate(${rotation}deg)`, transition: 'transform 0.05s linear', filter: 'drop-shadow(0 20px 48px rgba(0,0,0,0.28))' }}
      aria-label="SDG Goals Wheel"
    >
      {SDGS.map((g, i) => (
        <path
          key={g.n}
          d={buildWheelPath(size, i)}
          fill={g.c}
          opacity={i === activeIdx ? 1 : 0.28}
          style={{
            transform: i === activeIdx ? 'scale(1.09)' : 'scale(1)',
            transformBox: 'fill-box',
            transformOrigin: 'center',
            transition: 'opacity 0.5s, transform 0.5s',
            cursor: 'pointer',
          }}
          onClick={() => onSegmentClick?.(i)}
        />
      ))}
    </svg>
  );
}
