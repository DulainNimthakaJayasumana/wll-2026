import { useState, useEffect } from 'react';

export function useCountdown(target = new Date('2026-09-25T09:00:00')) {
  const calc = () => {
    const diff = Math.max(0, target - new Date());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [val, setVal] = useState(calc);
  useEffect(() => { const t = setInterval(() => setVal(calc()), 1000); return () => clearInterval(t); }, []);
  return val;
}
