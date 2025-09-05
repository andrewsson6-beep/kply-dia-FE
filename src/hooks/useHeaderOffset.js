import { useEffect, useState } from 'react';

/**
 * Returns a top padding value (in px) large enough to clear the fixed header.
 * Recomputes on resize and when window is focused (simple heuristic).
 */
export default function useHeaderOffset(extra = 8) {
  // extra small breathing room
  const [offset, setOffset] = useState(120); // sensible default

  useEffect(() => {
    const compute = () => {
      const el = document.getElementById('app-header');
      if (el) {
        const h = el.getBoundingClientRect().height;
        // Ensure minimum 88px on very small devices
        setOffset(h + extra + (h < 80 ? 16 : 0));
      }
    };
    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('focus', compute);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('focus', compute);
    };
  }, [extra]);

  return offset;
}
