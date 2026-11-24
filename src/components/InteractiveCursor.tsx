import { useEffect, useRef } from 'react';

/**
 * Lightweight desktop-only custom animated cursor.
 * Uses direct DOM transform3d updates in rAF (zero React re-renders per pointer event).
 * Automatically disabled on touch devices and when prefers-reduced-motion is enabled.
 */
export function InteractiveCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let visible = false;
    let interactive = false;
    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let frameId = 0;

    const updateVisibility = (show: boolean) => {
      if (visible === show) return;
      visible = show;
      const op = show ? '1' : '0';
      dot.style.opacity = op;
      ring.style.opacity = op;
    };

    const setInteractiveState = (active: boolean) => {
      if (interactive === active) return;
      interactive = active;
      if (active) {
        ring.style.width = '46px';
        ring.style.height = '46px';
        ring.style.borderColor = 'rgba(0, 217, 255, 0.78)';
        ring.style.backgroundColor = 'rgba(116, 27, 255, 0.12)';
      } else {
        ring.style.width = '30px';
        ring.style.height = '30px';
        ring.style.borderColor = 'rgba(200, 200, 216, 0.42)';
        ring.style.backgroundColor = 'transparent';
      }
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      updateVisibility(true);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isInteractiveTarget = Boolean(
        el && el.closest('a, button, [role="tab"], input, textarea, select, label')
      );
      setInteractiveState(isInteractiveTarget);
    };

    const onLeave = () => updateVisibility(false);

    const tick = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;

      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      frameId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave, { passive: true });
    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] hidden lg:block">
      <div
        ref={ringRef}
        style={{
          width: '30px',
          height: '30px',
          opacity: 0,
          borderColor: 'rgba(200, 200, 216, 0.42)',
          transition: 'width 180ms cubic-bezier(0.16, 1, 0.3, 1), height 180ms cubic-bezier(0.16, 1, 0.3, 1), border-color 180ms ease, background-color 180ms ease, opacity 180ms ease',
        }}
        className="fixed top-0 left-0 rounded-full border will-change-transform"
      />
      <div
        ref={dotRef}
        style={{ opacity: 0, transition: 'opacity 180ms ease' }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#00D9FF] shadow-[0_0_10px_#00D9FF] will-change-transform"
      />
    </div>
  );
}
