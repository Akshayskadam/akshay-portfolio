import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  depth: number; // 0..1, higher = closer
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface Orb {
  x: number;
  y: number;
  radius: number;
  color: string;
  phase: number;
  speed: number;
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;
    let particles: Particle[] = [];
    let meteors: Meteor[] = [];
    let orbs: Orb[] = [];
    let gridOffset = 0;
    let frame = 0;

    const colors = ['#00e5ff', '#00e5ff', '#00bcd4', '#9d4edd', '#ffffff', '#00e5ff'];

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
    }

    function initParticles() {
      // 3 depth layers: far (small), mid, near (large)
      particles = [];
      [0.15, 0.5, 0.85].forEach((depth) => {
        const count = depth < 0.3 ? 120 : depth < 0.6 ? 60 : 30;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.08 * (depth + 0.3),
            vy: (Math.random() - 0.5) * 0.08 * (depth + 0.3),
            radius: 0.3 + depth * 1.8,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 0.15 + depth * 0.6,
            depth,
          });
        }
      });
    }

    function initOrbs() {
      orbs = [
        { x: width * 0.15, y: height * 0.3, radius: 180, color: '#9d4edd', phase: 0, speed: 0.0008 },
        { x: width * 0.85, y: height * 0.6, radius: 220, color: '#00e5ff', phase: Math.PI, speed: 0.0006 },
        { x: width * 0.5, y: height * 0.85, radius: 150, color: '#9d4edd', phase: Math.PI / 2, speed: 0.001 },
      ];
    }

    function spawnMeteor() {
      const side = Math.random() > 0.5;
      meteors.push({
        x: side ? Math.random() * width * 0.6 : width * 0.8 + Math.random() * width * 0.2,
        y: -10,
        vx: side ? 3 + Math.random() * 4 : -3 - Math.random() * 4,
        vy: 3 + Math.random() * 5,
        length: 80 + Math.random() * 120,
        opacity: 0.7 + Math.random() * 0.3,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    }

    function drawOrbs(scroll: number) {
      for (const orb of orbs) {
        const t = frame * orb.speed;
        const floatX = orb.x + Math.sin(t + orb.phase) * 40;
        const floatY = orb.y + Math.cos(t * 0.7 + orb.phase) * 30 - scroll * 0.08;

        const grad = ctx!.createRadialGradient(floatX, floatY, 0, floatX, floatY, orb.radius);
        grad.addColorStop(0, orb.color + '22');
        grad.addColorStop(0.4, orb.color + '0f');
        grad.addColorStop(1, 'transparent');
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(floatX, floatY, orb.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawGrid(scroll: number) {
      const LINES = 16;
      const vanishY = height * 0.5 - scroll * 0.05;
      gridOffset += 0.5;

      ctx!.save();

      // Horizontal receding lines
      for (let i = 0; i <= LINES * 2; i++) {
        const t = (i / (LINES * 2) + (gridOffset * 0.003)) % 1;
        const perspective = 600;
        const z = t;
        const scale = perspective / (perspective + z * 1400);
        const y = vanishY + (height - vanishY) * (1 - scale * 0.55);
        const hw = width * 0.9 / scale;
        const alpha = Math.pow(z, 0.6) * 0.2;
        ctx!.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
        ctx!.lineWidth = 0.7;
        ctx!.beginPath();
        ctx!.moveTo(width / 2 - hw, y);
        ctx!.lineTo(width / 2 + hw, y);
        ctx!.stroke();
      }

      // Vertical converging lines
      for (let i = 0; i <= LINES; i++) {
        const t = i / LINES;
        const botX = width * t;
        const dist = Math.abs(t - 0.5);
        const alpha = 0.15 - dist * 0.22;
        ctx!.strokeStyle = `rgba(0, 229, 255, ${Math.max(0, alpha)})`;
        ctx!.lineWidth = 0.7;
        ctx!.beginPath();
        ctx!.moveTo(width / 2, vanishY);
        ctx!.lineTo(botX, height);
        ctx!.stroke();
      }

      ctx!.restore();
    }

    function drawMeteors() {
      meteors = meteors.filter(m => m.life < m.maxLife);
      for (const m of meteors) {
        const progress = m.life / m.maxLife;
        const fade = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
        const grad = ctx!.createLinearGradient(
          m.x, m.y,
          m.x - m.vx * (m.length / 8), m.y - m.vy * (m.length / 8)
        );
        grad.addColorStop(0, `rgba(255,255,255,${m.opacity * fade})`);
        grad.addColorStop(0.3, `rgba(0,229,255,${0.5 * fade})`);
        grad.addColorStop(1, 'rgba(0,229,255,0)');

        ctx!.save();
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.moveTo(m.x, m.y);
        ctx!.lineTo(m.x - m.vx * (m.length / 8), m.y - m.vy * (m.length / 8));
        ctx!.stroke();
        ctx!.restore();

        m.x += m.vx;
        m.y += m.vy;
        m.life++;
      }
    }

    function drawParticles(scroll: number) {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        // Parallax: deeper layers move less on mouse/scroll
        const parallaxX = (mx - width / 2) * 0.015 * p.depth;
        const parallaxY = (my - height / 2) * 0.015 * p.depth - scroll * p.depth * 0.12;

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const px = p.x + parallaxX;
        const py = p.y + parallaxY;

        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        ctx!.fillStyle = p.color;
        ctx!.shadowColor = p.color;
        ctx!.shadowBlur = p.radius * 5 * p.depth;
        ctx!.beginPath();
        ctx!.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
    }

    function drawConnections() {
      const near = particles.filter(p => p.depth > 0.6);
      const maxDist = 130;
      for (let i = 0; i < near.length; i++) {
        for (let j = i + 1; j < near.length; j++) {
          const a = near[i], b = near[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx!.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx!.lineWidth = 0.6;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }
    }

    function draw() {
      const scroll = scrollRef.current;
      frame++;

      // Spawn meteors randomly
      if (frame % 180 === 0 && Math.random() > 0.3) spawnMeteor();

      ctx!.clearRect(0, 0, width, height);

      // Background
      const bg = ctx!.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#03030a');
      bg.addColorStop(0.45, '#06060f');
      bg.addColorStop(1, '#0a0a14');
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, width, height);

      drawOrbs(scroll);
      drawGrid(scroll);
      drawConnections();
      drawParticles(scroll);
      drawMeteors();

      // Vignette
      const vignette = ctx!.createRadialGradient(
        width / 2, height / 2, height * 0.1,
        width / 2, height / 2, height * 0.9
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx!.fillStyle = vignette;
      ctx!.fillRect(0, 0, width, height);

      animRef.current = requestAnimationFrame(draw);
    }

    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onScroll = () => { scrollRef.current = window.scrollY; };
    const onResize = () => { resize(); initParticles(); initOrbs(); };

    resize();
    initParticles();
    initOrbs();
    draw();

    window.addEventListener('mousemove', onMouse);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a14]/20 to-[#0a0a14]" />
    </div>
  );
}
