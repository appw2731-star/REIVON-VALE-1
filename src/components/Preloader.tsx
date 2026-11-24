import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkipForward } from 'lucide-react';

interface PreloaderProps {
  brandName: string;
  skipLabel: string;
  subtitle: string;
}

export function Preloader({ brandName, skipLabel, subtitle }: PreloaderProps) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return true;
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-transition smoothly into homepage (short, cinematic ~2.35s)
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setVisible(false), 2350);
    return () => window.clearTimeout(timer);
  }, [visible]);

  // Lightweight 2D radial particle convergence field (no WebGL context clash with HeroCanvas3D)
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    const palette = ['#741BFF', '#00D9FF', '#C8C8D8', '#FFFFFF'];
    const particles = Array.from({ length: 56 }, (_, idx) => {
      const angle = (idx / 56) * Math.PI * 2 + (idx % 5) * 0.2;
      const dist = 140 + ((idx * 47) % 340);
      return {
        angle,
        dist,
        speed: 0.9 + ((idx * 17) % 10) * 0.14,
        size: 1.2 + ((idx * 13) % 4) * 0.45,
        color: palette[idx % palette.length],
      };
    });

    let rafId = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Central atmospheric lighting halo
      const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.min(width, height) * 0.42);
      halo.addColorStop(0, 'rgba(116, 27, 255, 0.24)');
      halo.addColorStop(0.5, 'rgba(0, 217, 255, 0.09)');
      halo.addColorStop(1, 'rgba(8, 8, 16, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        const radius = Math.max(18, p.dist - t * p.speed * 78);
        const theta = p.angle + t * 0.45;
        const x = cx + Math.cos(theta) * radius;
        const y = cy + Math.sin(theta) * radius;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(0.85, 0.25 + (1 - radius / 480) * 0.65);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      rafId = window.requestAnimationFrame(draw);
    };

    rafId = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(rafId);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="cinematic-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#080810] overflow-hidden px-4"
        >
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full"
          />

          {/* Metallic 3D Emblem & Wordmark Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: 16 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 900 }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            {/* 3D Metallic RV Crest */}
            <div className="relative w-20 h-20 rounded-2xl p-[1px] bg-gradient-to-br from-[#00D9FF] via-[#C8C8D8] to-[#741BFF] shadow-[0_0_50px_-6px_rgba(116,27,255,0.85)] mb-6 overflow-hidden">
              <div className="w-full h-full rounded-[15px] bg-[#0B0B17] flex items-center justify-center relative overflow-hidden">
                <span className="font-display text-3xl font-extrabold tracking-tight text-chrome">
                  RV
                </span>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-chrome-sweep"
                />
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[0.26em] hero-3d-title pl-[0.26em]">
              {brandName}
            </h1>

            <p className="mt-3 text-xs sm:text-sm font-medium tracking-[0.3em] text-[#C8C8D8]/85 uppercase">
              {subtitle}
            </p>

            {/* Electric Loading Progress Beam */}
            <div className="mt-8 w-56 sm:w-64 h-[2px] bg-white/10 overflow-hidden rounded-full">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full bg-gradient-to-r from-[#741BFF] via-[#C8C8D8] to-[#00D9FF]"
              />
            </div>
          </motion.div>

          {/* Accessible Skip Intro Action */}
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="relative z-20 mt-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider text-[#C8C8D8] hover:text-white btn-chrome focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
          >
            <span>{skipLabel}</span>
            <SkipForward className="w-3.5 h-3.5 text-[#00D9FF]" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
