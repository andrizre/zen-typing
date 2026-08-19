import { useEffect, useRef, useImperativeHandle, forwardRef, memo } from 'react';

export type ParticleType = 'stardust' | 'sakura' | 'sparkles' | 'ripple';

export interface ParticleCanvasHandle {
  spawn: (x: number, y: number, char: string, isError?: boolean, streak?: number) => void;
}

interface ParticleCanvasProps {
  particleType?: ParticleType;
  accentColor?: string;
}

// Particle structure optimized for object pooling
interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: ParticleType;
  shape: 'circle' | 'petal' | 'star' | 'ring';
  maxLife: number;
  life: number;
}

const POOL_SIZE = 150;

export const ParticleCanvas = memo(
  forwardRef<ParticleCanvasHandle, ParticleCanvasProps>(
    ({ particleType = 'stardust', accentColor = '#5eead4' }, ref) => {
      const canvasRef = useRef<HTMLCanvasElement | null>(null);
      // Pre-allocated object pool to prevent Garbage Collection pauses
      const poolRef = useRef<Particle[]>([]);
      const animFrameRef = useRef<number | null>(null);
      const activeCountRef = useRef<number>(0);

      // Initialize object pool once
      if (poolRef.current.length === 0) {
        for (let i = 0; i < POOL_SIZE; i++) {
          poolRef.current.push({
            active: false,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            size: 0,
            alpha: 0,
            color: '#fff',
            rotation: 0,
            rotationSpeed: 0,
            type: 'stardust',
            shape: 'circle',
            maxLife: 30,
            life: 0,
          });
        }
      }

      // Handle Resize with Device Pixel Ratio for crisp retina rendering
      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const width = window.innerWidth;
          const height = window.innerHeight;

          canvas.width = width * dpr;
          canvas.height = height * dpr;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.scale(dpr, dpr);
          }
        };

        handleResize();
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
      }, []);

      // 60FPS RAF Loop using object pool
      const runLoop = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        ctx.clearRect(0, 0, width, height);

        const pool = poolRef.current;
        let livingCount = 0;

        for (let i = 0; i < POOL_SIZE; i++) {
          const p = pool[i];
          if (!p.active) continue;

          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);

          // Physics per type
          if (p.type === 'sakura') {
            p.vy += 0.035;
            p.x += Math.sin(p.life * 0.08) * 0.6;
          } else if (p.type === 'stardust') {
            p.vy -= 0.02;
            p.vx *= 0.98;
          } else if (p.type === 'sparkles') {
            p.vx *= 0.94;
            p.vy *= 0.94;
          }

          // Draw shapes
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.strokeStyle = p.color;

          if (p.shape === 'ring') {
            ctx.beginPath();
            const currentRadius = p.size * (1 + (p.life / p.maxLife) * 2.2);
            ctx.lineWidth = Math.max(1, 2 * (1 - p.life / p.maxLife));
            ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
            ctx.stroke();
          } else if (p.shape === 'petal') {
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.8, 0, p.size);
            ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.8, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
            ctx.fill();
          } else if (p.shape === 'star') {
            ctx.beginPath();
            const spikes = 4;
            const outerRadius = p.size;
            const innerRadius = p.size * 0.35;
            for (let s = 0; s < spikes * 2; s++) {
              const r = s % 2 === 0 ? outerRadius : innerRadius;
              const angle = (s * Math.PI) / spikes;
              const sx = Math.cos(angle) * r;
              const sy = Math.sin(angle) * r;
              if (s === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            }
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();

          if (p.life >= p.maxLife || p.alpha <= 0) {
            p.active = false;
          } else {
            livingCount++;
          }
        }

        activeCountRef.current = livingCount;

        if (livingCount > 0) {
          animFrameRef.current = requestAnimationFrame(runLoop);
        } else {
          animFrameRef.current = null;
        }
      };

      useImperativeHandle(ref, () => ({
        spawn: (x: number, y: number, _char: string, isError = false, streak = 0) => {
          const count = isError ? 4 : Math.min(12, 4 + Math.floor(streak / 18));
          const color = isError ? '#f87171' : accentColor;
          const pool = poolRef.current;

          let spawned = 0;
          for (let i = 0; i < POOL_SIZE && spawned < count; i++) {
            const p = pool[i];
            if (p.active) continue;

            const angle = Math.random() * Math.PI * 2;
            const speed = 1.2 + Math.random() * (isError ? 2.2 : 3.5);

            let shape: 'circle' | 'petal' | 'star' | 'ring' = 'circle';
            if (particleType === 'sakura') shape = 'petal';
            else if (particleType === 'sparkles') shape = Math.random() > 0.4 ? 'star' : 'circle';
            else if (particleType === 'ripple') shape = spawned === 0 ? 'ring' : 'circle';

            p.active = true;
            p.x = x + (Math.random() * 6 - 3);
            p.y = y + (Math.random() * 6 - 3);
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed - (particleType === 'stardust' ? 1.2 : 0);
            p.size = shape === 'petal' ? 5 + Math.random() * 3 : 2.5 + Math.random() * 3;
            p.alpha = 1;
            p.color = isError ? '#f87171' : Math.random() > 0.35 ? color : '#ffffff';
            p.rotation = Math.random() * Math.PI * 2;
            p.rotationSpeed = (Math.random() - 0.5) * 0.12;
            p.type = particleType;
            p.shape = shape;
            p.maxLife = 22 + Math.floor(Math.random() * 20);
            p.life = 0;

            spawned++;
          }

          if (!animFrameRef.current) {
            animFrameRef.current = requestAnimationFrame(runLoop);
          }
        },
      }));

      return (
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 z-20 will-change-transform"
        />
      );
    }
  )
);
