import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PARTICLE_COUNT = 180;
    const GRID_LINES = 14;
    const colors = ['#00e5ff', '#00e5ff', '#00e5ff', '#9d4edd', '#ffffff'];

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let gridOffset = 0;

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
    }

    function initParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.8 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.7 + 0.2,
      }));
    }

    function drawGrid() {
      if (!ctx) return;
      const spacing = width / GRID_LINES;
      const perspective = 600;
      const vanishY = height * 0.55;

      ctx.save();
      // Horizontal lines (receding into distance)
      for (let i = 0; i <= GRID_LINES * 2; i++) {
        const t = (i / (GRID_LINES * 2) + gridOffset * 0.0008) % 1;
        const z = t;
        const scale = perspective / (perspective + z * 1200);
        const y = vanishY + (height - vanishY) * (1 - scale * 0.6);
        const lineWidth = height - vanishY;
        const x0 = width / 2 - lineWidth * 0.8 / scale;
        const x1 = width / 2 + lineWidth * 0.8 / scale;
        const alpha = z * 0.18;
        ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x1, y);
        ctx.stroke();
      }

      // Vertical lines (converging to vanishing point)
      for (let i = 0; i <= GRID_LINES; i++) {
        const t = i / GRID_LINES;
        const botX = width * t;
        const alpha = 0.12 - Math.abs(t - 0.5) * 0.15;
        ctx.strokeStyle = `rgba(0, 229, 255, ${Math.max(0, alpha)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(width / 2, vanishY);
        ctx.lineTo(botX, height);
        ctx.stroke();
      }
      ctx.restore();
      gridOffset++;
    }

    function drawParticles() {
      if (!ctx) return;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        // Subtle mouse parallax
        const dx = (mx - width / 2) * 0.012 * p.z;
        const dy = (my - height / 2) * 0.012 * p.z;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.opacity * (0.4 + p.z * 0.6);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.radius * 4;
        ctx.beginPath();
        ctx.arc(p.x + dx, p.y + dy, p.radius * (0.5 + p.z * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function drawConnections() {
      if (!ctx) return;
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.08;
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Deep space background
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#050508');
      bg.addColorStop(0.5, '#080812');
      bg.addColorStop(1, '#0a0a10');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Subtle radial glow at center
      const glow = ctx.createRadialGradient(width / 2, height * 0.4, 0, width / 2, height * 0.4, width * 0.6);
      glow.addColorStop(0, 'rgba(157, 78, 221, 0.06)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      drawGrid();
      drawConnections();
      drawParticles();

      animRef.current = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    resize();
    initParticles();
    draw();

    window.addEventListener('resize', () => { resize(); initParticles(); });
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', () => { resize(); initParticles(); });
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a10]/30 to-[#0a0a10]" />
    </div>
  );
}
