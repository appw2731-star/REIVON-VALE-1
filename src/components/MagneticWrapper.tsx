import { useRef, useState, type MouseEvent, type ReactNode } from 'react';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Subtle magnetic pull on desktop fine pointers. Respects reduced-motion & touch devices.
 */
export function Magnetic({ children, className = '', strength = 0.22 }: MagneticProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    setOffset({
      x: Math.max(-9, Math.min(9, dx)),
      y: Math.max(-7, Math.min(7, dy)),
    });
  };

  const handleLeave = () => {
    if (offset.x !== 0 || offset.y !== 0) {
      setOffset({ x: 0, y: 0 });
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 && offset.y === 0
          ? 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)'
          : 'transform 90ms linear',
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
}

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
}

/**
 * Interactive 3D perspective card with subtle pointer-tracked specular highlight.
 */
export function TiltCard({
  children,
  className = '',
  glowColor = 'rgba(0, 217, 255, 0.2)',
  maxTilt = 7,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / Math.max(1, rect.width);
    const py = (e.clientY - rect.top) / Math.max(1, rect.height);
    const rotY = (px - 0.5) * maxTilt * 2;
    const rotX = (0.5 - py) * maxTilt * 2;

    setTransform(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-2px)`);
    setSpot({ x: px * 100, y: py * 100, active: true });
  };

  const onLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
    setSpot((prev) => ({ ...prev, active: false }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        transition: spot.active
          ? 'transform 90ms linear'
          : 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`relative will-change-transform ${className}`}
    >
      <div
        aria-hidden="true"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(360px circle at ${spot.x}% ${spot.y}%, ${glowColor}, transparent 72%)`,
          transition: 'opacity 220ms ease',
        }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
      />
      {children}
    </div>
  );
}
