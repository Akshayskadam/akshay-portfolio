import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import {
  Github, Linkedin, Mail, Phone, ChevronDown,
  Database, Terminal, Cpu, Layout, FileText,
  Smartphone, Calendar, MapPin, Briefcase, GraduationCap,
} from 'lucide-react';
import { CosmicBackground } from '../components/CosmicBackground';
import { Navbar } from '../components/Navbar';

/* ══════════════════════════════════════════
   SCROLL PARALLAX WRAPPER
══════════════════════════════════════════ */
function ParallaxLayer({
  children, speed = 0.2, className = '',
}: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -60}px`, `${speed * 60}px`]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   HERO PARALLAX
══════════════════════════════════════════ */
function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const yS = useSpring(y,     { stiffness: 80, damping: 20 });
  const sS = useSpring(scale, { stiffness: 80, damping: 20 });
  return (
    <section ref={ref} id="hero" className="relative min-h-[100dvh] flex items-center justify-center pt-20 z-10">
      <motion.div style={{ y: yS, opacity, scale: sS }}
        className="container mx-auto px-6 md:px-12 flex flex-col items-center md:items-start text-center md:text-left w-full">
        {children}
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════
   SECTION WRAPPER — 3D SCROLL REVEAL
══════════════════════════════════════════ */
function Section3D({ id, title, subtitle, children, className = '' }: {
  id: string; title?: string; subtitle?: string; children: React.ReactNode; className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y       = useTransform(scrollYProgress, [0, 0.2, 1], [80, 0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0, 1, 1, 0.5]);

  return (
    <section ref={ref} id={id} className={`py-24 md:py-32 relative z-10 ${className}`}>
      <motion.div style={{ y, opacity }} className="container mx-auto px-6 md:px-12 max-w-6xl">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, rotateX: 20, y: 40 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1000, transformOrigin: 'bottom center' }}
            className="mb-16 md:mb-24"
          >
            {title && (
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-8 bg-primary" />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">{title}</h2>
              </div>
            )}
            {subtitle && (
              <p className="text-muted-foreground font-mono ml-12 text-sm md:text-base">// {subtitle}</p>
            )}
          </motion.div>
        )}
        {children}
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════
   3-D TILT CARD
══════════════════════════════════════════ */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tf, setTf] = useState('');
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const rx = ((e.clientY - top)  / height - 0.5) * -18;
    const ry = ((e.clientX - left) / width  - 0.5) *  18;
    setTf(`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04) translateZ(8px)`);
    setGlow({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
  }, []);
  const onLeave = useCallback(() => setTf('perspective(900px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)'), []);
  return (
    <div ref={cardRef} className={`relative overflow-hidden transition-transform duration-[180ms] ease-out ${className}`}
      style={{ transform: tf || 'perspective(900px)', willChange: 'transform' }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(0,229,255,0.14) 0%, transparent 65%)`, zIndex: 1 }} />
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAGNETIC 3-D TITLE
══════════════════════════════════════════ */
function Magnetic3DTitle() {
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [letterStyles, setLetterStyles] = useState<React.CSSProperties[]>([]);
  const rafRef   = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const firstWord = 'Akshay S. ';
  const lastWord  = 'Kadam';
  const allChars  = (firstWord + lastWord).split('');

  useEffect(() => { setLetterStyles(allChars.map(() => ({}))); }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    function animate() {
      const refs = letterRefs.current;
      if (!refs.length) { rafRef.current = requestAnimationFrame(animate); return; }
      const newStyles: React.CSSProperties[] = refs.map((el) => {
        if (!el) return {};
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
        const dx = mouseRef.current.x - cx, dy = mouseRef.current.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 140);
        if (proximity === 0) return { transform: 'perspective(400px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)', color: '', textShadow: '', transition: 'transform 0.5s ease, color 0.5s ease, text-shadow 0.5s ease' };
        const rotX = (dy / (rect.height / 2)) * -38 * proximity;
        const rotY = (dx / (rect.width  / 2)) *  38 * proximity;
        const g = Math.round(proximity * 28);
        return {
          transform: `perspective(400px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${proximity * 28}px) translateY(${proximity * -14}px)`,
          color: `rgb(${Math.round(255*(1-proximity*.9))},${Math.round(255*(1-proximity*.1))},255)`,
          textShadow: `0 0 ${g}px rgba(0,229,255,${proximity*.9}), 0 0 ${g*2}px rgba(0,229,255,${proximity*.4})`,
          transition: 'transform 0.12s ease-out, color 0.12s ease-out, text-shadow 0.12s ease-out',
          zIndex: 10,
        };
      });
      setLetterStyles(newStyles);
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  const fl = firstWord.length;
  return (
    <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4 drop-shadow-2xl select-none cursor-default"
      style={{ lineHeight: 1.05 }}>
      {firstWord.split('').map((ch, i) => (
        <span key={`f-${i}`} ref={el => { letterRefs.current[i] = el; }}
          style={{ display: ch === ' ' ? 'inline' : 'inline-block', color: 'white', willChange: 'transform', ...letterStyles[i] }}>
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
      {lastWord.split('').map((ch, i) => {
        const gi = fl + i;
        const hasHover = !!letterStyles[gi]?.color;
        return (
          <span key={`l-${i}`} ref={el => { letterRefs.current[gi] = el; }}
            style={{
              display: 'inline-block', willChange: 'transform',
              ...(hasHover ? letterStyles[gi] : {
                background: 'linear-gradient(90deg,#00e5ff,#9d4edd)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', ...letterStyles[gi],
              }),
            }}>
            {ch}
          </span>
        );
      })}
    </motion.h1>
  );
}

/* ══════════════════════════════════════════
   3-D FLIP STAT CARD
══════════════════════════════════════════ */
function StatCard({ label, value, delay = 0 }: { label: string; value: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 90, y: 30 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 600, transformOrigin: 'bottom center' }}
      whileHover={{ scale: 1.08, y: -6, rotateY: 6 }}
      className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center text-center border-t-2 border-t-transparent hover:border-t-primary cursor-default"
    >
      <motion.span
        initial={{ scale: 0.5 }} whileInView={{ scale: 1 }}
        viewport={{ once: true }} transition={{ delay: delay + 0.3, type: 'spring', stiffness: 200 }}
        className="text-3xl md:text-4xl font-black text-primary drop-shadow-md"
      >{value}</motion.span>
      <span className="text-xs md:text-sm text-muted-foreground font-mono mt-2 uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   SKILL BADGE — individual 3-D pop
══════════════════════════════════════════ */
function SkillBadge({ skill, delay }: { skill: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.4, rotateZ: -15, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, rotateZ: 0, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.15, rotateZ: 3, backgroundColor: 'rgba(0,229,255,0.15)', color: '#00e5ff', borderColor: 'rgba(0,229,255,0.5)', y: -3 }}
      className="px-3 py-1 bg-white/5 text-gray-300 text-sm rounded-md border border-white/5 cursor-default inline-block"
      style={{ transformOrigin: 'center center' }}
    >{skill}</motion.span>
  );
}

/* ══════════════════════════════════════════
   SKILL GROUP — rotates in from side
══════════════════════════════════════════ */
function SkillGroup({ icon: Icon, title, skills, index }: { icon: any; title: string; skills: string[]; index: number }) {
  const fromLeft = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: fromLeft ? -35 : 35, x: fromLeft ? -40 : 40, scale: 0.9 }}
      whileInView={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 800, transformOrigin: fromLeft ? 'left center' : 'right center' }}
    >
      <TiltCard className="group glass-panel rounded-xl border border-white/5 hover:border-primary/20 h-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              whileInView={{ rotateY: [0, 360] }}
              viewport={{ once: true }}
              transition={{ delay: (index % 3) * 0.1 + 0.5, duration: 0.6, ease: 'easeOut' }}
              className="p-2 bg-primary/10 rounded-lg text-primary"
            >
              <Icon size={20} />
            </motion.div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, si) => (
              <SkillBadge key={skill} skill={skill} delay={(index % 3) * 0.08 + si * 0.05} />
            ))}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   EXPERIENCE CARD — zooms from depth
══════════════════════════════════════════ */
function ExperienceCard({ company, role, date, bullets, align }: {
  company: string; role: string; date: string; bullets: string[]; align: 'left' | 'right';
}) {
  const isLeft = align === 'left';
  return (
    <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-${align}`}>
      {/* Animated timeline dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 300 }}
        className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow-[0_0_14px_rgba(0,229,255,0.6)] absolute left-0 md:left-1/2 -translate-x-1/2 translate-y-4 md:translate-y-0 z-10 group-hover:scale-125 group-hover:shadow-[0_0_28px_rgba(0,229,255,1)] transition-all duration-300"
      >
        <Briefcase size={16} className="text-primary-foreground" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, z: -120, scale: 0.75, rotateY: isLeft ? -20 : 20 }}
        whileInView={{ opacity: 1, z: 0, scale: 1, rotateY: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 900, transformOrigin: isLeft ? 'left center' : 'right center' }}
        className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-auto md:ml-0"
      >
        <TiltCard className="group glass-panel rounded-xl border border-white/5 hover:border-primary/30">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-1 mb-4">
              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{role}</h3>
              <h4 className="text-lg text-gray-300">{company}</h4>
              <span className="text-sm font-mono text-secondary mt-1 flex items-center gap-2">
                <Calendar size={14} />{date}
              </span>
            </div>
            <ul className="space-y-2 mt-4 text-sm md:text-base text-gray-400">
              {bullets.map((b, i) => (
                <motion.li key={i}
                  initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex gap-3"
                >
                  <span className="text-primary/50 mt-1">▹</span>
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </TiltCard>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PROJECT CARD — full 3-D flip entrance
══════════════════════════════════════════ */
function ProjectCard({ title, type, description, tags, icon: Icon, index }: {
  title: string; type: string; description: string; tags: string[]; icon: any; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: index % 2 === 0 ? -60 : 60, scale: 0.8 }}
      whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1000, transformOrigin: 'center center' }}
    >
      <TiltCard className="group glass-panel rounded-2xl border border-white/5 hover:border-primary/30 h-full">
        <div className="p-8 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Icon size={120} />
          </div>
          {/* Animated top border on hover */}
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true }} transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
            className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-primary to-secondary origin-left"
          />
          <div className="text-primary font-mono text-sm mb-2">{type}</div>
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors z-10">{title}</h3>
          <p className="text-gray-400 mb-8 flex-grow z-10 leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-2 mt-auto z-10">
            {tags.map((tag, ti) => (
              <motion.span key={tag}
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.5 + ti * 0.06, duration: 0.3 }}
                className="text-xs font-mono px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded"
              >{tag}</motion.span>
            ))}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   EDUCATION CARD — drops from above
══════════════════════════════════════════ */
function EducationCard({ degree, year, score, color, delay }: {
  degree: string; year: string; score: string; color: 'primary' | 'secondary'; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -60, rotateX: -30, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 800, transformOrigin: 'top center' }}
    >
      <TiltCard className="group glass-panel rounded-xl h-full">
        <div className={`p-8 border-l-4 ${color === 'primary' ? 'border-l-primary' : 'border-l-secondary'}`}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }} whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }} transition={{ delay: delay + 0.3, type: 'spring', stiffness: 200 }}
          >
            <GraduationCap className={`mb-4 ${color === 'primary' ? 'text-primary' : 'text-secondary'}`} size={32} />
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2">{degree}</h3>
          <p className="text-muted-foreground font-mono text-sm mb-4">CMR University, Bengaluru</p>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 bg-white/5 px-3 py-1 rounded-full flex items-center gap-2">
              <Calendar size={14} /> {year}
            </span>
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: delay + 0.5, type: 'spring' }}
              className={`font-bold text-lg ${color === 'primary' ? 'text-primary' : 'text-secondary'}`}
            >{score}</motion.span>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   SOCIAL LINK
══════════════════════════════════════════ */
function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <motion.a whileHover={{ y: -6, scale: 1.15, rotateZ: -5 }} whileTap={{ scale: 0.92 }}
      href={href} target="_blank" rel="noreferrer"
      className="p-3 bg-white/5 rounded-full text-white hover:bg-white/10 border border-white/5 hover:border-primary/50 transition-colors shadow-lg">
      <Icon size={24} />
    </motion.a>
  );
}

/* ══════════════════════════════════════════
   SCROLL INDICATOR
══════════════════════════════════════════ */
function ScrollIndicator() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
      <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
        <ChevronDown size={20} />
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   FLOATING AVAILABILITY BADGE
══════════════════════════════════════════ */
function FloatingBadge() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs uppercase tracking-widest backdrop-blur-md">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      Exploring Challenges, Delivering Solutions
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function Portfolio() {
  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-primary/30">
      <CosmicBackground />
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <HeroParallax>
          <FloatingBadge />
          <Magnetic3DTitle />

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl md:text-2xl font-mono text-muted-foreground mb-10 max-w-2xl">
            &gt; Data Analyst &amp; Full-Stack Developer
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-16">
            <motion.a whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,229,255,0.45)' }} whileTap={{ scale: 0.97 }}
              href="#contact" className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-md transition-all shadow-lg shadow-primary/20">
              Contact Me
            </motion.a>
            <motion.a whileHover={{ scale: 1.05, borderColor: 'rgba(0,229,255,0.5)' }} whileTap={{ scale: 0.97 }}
              href="#projects" className="px-8 py-4 bg-card border border-white/10 text-white font-semibold rounded-md transition-all">
              View Projects
            </motion.a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }}
            className="flex items-center gap-6">
            <SocialLink href="https://github.com/Akshayskadam" icon={Github} />
            <SocialLink href="https://www.linkedin.com/in/akshaysk15" icon={Linkedin} />
            <SocialLink href="mailto:akshayskadamba@gmail.com" icon={Mail} />
          </motion.div>
          <ScrollIndicator />
        </HeroParallax>

        {/* ── ABOUT ── */}
        <Section3D id="about" title="About" subtitle="sys.whoami()">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Bio — slides from left + rotates in */}
            <motion.div
              initial={{ opacity: 0, x: -60, rotateY: -25 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 900, transformOrigin: 'left center' }}
            >
              <TiltCard className="group glass-panel rounded-2xl">
                <div className="p-8 relative overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary origin-left"
                  />
                  <p className="text-lg md:text-xl leading-relaxed text-gray-300 font-light">
                    "Seeking an opportunity to apply my analytical and programming skills, contribute to
                    innovative projects, and continuously learn emerging technologies while growing professionally."
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-muted-foreground font-mono text-sm">
                    <MapPin size={16} className="text-primary" />
                    <span>Bangalore, Karnataka, India</span>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Stat cards — flip up in sequence */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Years Experience" value="1+" delay={0} />
              <StatCard label="MCA Score" value="84.25%" delay={0.1} />
              <StatCard label="Projects" value="2+" delay={0.2} />
              <StatCard label="Publications" value="1" delay={0.3} />
            </div>
          </div>
        </Section3D>

        {/* ── SKILLS ── */}
        <Section3D id="skills" title="Skills" subtitle="capabilities.list()">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Database,   title: 'Data & Analytics', skills: ['SQL','Databricks','ETL Workflows','Data Mapping','Data Extraction','Reporting & Analytics','Schema Migration','Business Intelligence'] },
              { icon: Terminal,   title: 'Languages',         skills: ['C','Java','Python'] },
              { icon: Layout,     title: 'Web & Front-End',   skills: ['HTML','CSS','Angular','JavaScript','Node.js'] },
              { icon: Cpu,        title: 'Embedded & IoT',    skills: ['Raspberry Pi','Embedded Systems','IoT Prototyping'] },
              { icon: Smartphone, title: 'Mobile',            skills: ['Java','XML'] },
              { icon: Layout,     title: 'Tools & IDEs',      skills: ['Visual Studio Code','Android Studio','Eclipse'] },
            ].map((g, i) => (
              <SkillGroup key={g.title} icon={g.icon} title={g.title} skills={g.skills} index={i} />
            ))}
          </div>
        </Section3D>

        {/* ── EXPERIENCE ── */}
        <Section3D id="experience" title="Experience" subtitle="career.history()">
          {/* Animated timeline line */}
          <div className="relative">
            <motion.div
              initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
              viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute left-5 md:left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-primary/70 via-white/10 to-transparent origin-top -translate-x-px"
            />
            <div className="space-y-8">
              <ExperienceCard
                company="" role="Data Analyst"
                date="Feb 9, 2026 – Present" align="left"
                bullets={[
                  'Write and optimize SQL queries for data extraction, reporting, and analytics workflows',
                  'Support schema migration activities and maintain ETL process documentation',
                  'Perform data analysis to generate business insights and support cross-functional decision making',
                  'Collaborate with QC and workflow teams to identify process gaps and improve operational efficiency',
                  'Worked on Databricks-based data workflows and documented data mappings, joins, and integrations for logistics and analytics systems',
                ]}
              />
              <ExperienceCard
                company="Blugate Software Technologies Pvt. Ltd." role="Software Development Intern"
                date="Dec 2, 2024 – Jan 31, 2025" align="right"
                bullets={[
                  'Utilized Angular, JavaScript, XML, and CSS to build and enhance responsive front-end components',
                  'Integrated RESTful APIs using POST and GET methods to enable seamless data exchange between client and server',
                ]}
              />
            </div>
          </div>
        </Section3D>

        {/* ── PROJECTS ── */}
        <Section3D id="projects" title="Projects" subtitle="workspace.build()">
          <div className="grid md:grid-cols-2 gap-8">
            <ProjectCard index={0}
              title="AgroVision: Smart Agriculture Monitoring"
              type="Capstone Project"
              description="A full-stack IoT system for live monitoring of environmental parameters in real time. Features RESTful APIs and a live dashboard for data visualization."
              tags={['Angular','Node.js','Raspberry Pi','IoT','RESTful API']}
              icon={Cpu}
            />
            <ProjectCard index={1}
              title="IoT-based Smart Doorbell"
              type="Research Paper — WJARR Vol.27 Issue 1"
              description="Smart Doorbell system with Face Recognition and Remote Alerts capabilities. Published in World Journal of Advanced Research and Reviews (July 2025)."
              tags={['IoT','Face Recognition','Research','Security']}
              icon={FileText}
            />
          </div>
        </Section3D>

        {/* ── EDUCATION ── */}
        <Section3D id="education" title="Education" subtitle="academic.records()">
          <div className="grid md:grid-cols-2 gap-6">
            <EducationCard degree="Masters of Computer Application (MCA)" year="2025" score="84.25%" color="primary"  delay={0}   />
            <EducationCard degree="Bachelors of Computer Applications (BCA)" year="2022" score="87.57%" color="secondary" delay={0.18} />
          </div>
        </Section3D>

        {/* ── CONTACT ── */}
        <Section3D id="contact" title="Contact" subtitle="net.connect()">
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotateX: 20, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1000, transformOrigin: 'bottom center' }}
          >
            <TiltCard className="group glass-panel rounded-2xl border border-white/10 max-w-3xl mx-auto">
              <div className="p-8 md:p-12 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl font-bold text-white mb-6"
                >Let's Build Something Together</motion.h2>
                <motion.p
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.5 }}
                  className="text-muted-foreground mb-10 max-w-xl mx-auto"
                >Whether you have a question about data workflows, need a full-stack IoT solution, or just want to connect — my inbox is open.</motion.p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  {[
                    { href: 'mailto:akshayskadamba@gmail.com', label: 'akshayskadamba@gmail.com', Icon: Mail, primary: true },
                    { href: 'tel:+918277390087',               label: '+91 8277390087',           Icon: Phone, primary: false },
                  ].map(({ href, label, Icon, primary }, i) => (
                    <motion.a key={href}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
                      whileHover={{ scale: 1.05, ...(primary ? { boxShadow: '0 0 30px rgba(0,229,255,0.4)' } : {}) }}
                      href={href}
                      className={`w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 font-bold rounded-lg transition-all ${primary ? 'bg-primary text-primary-foreground' : 'bg-white/5 border border-white/10 text-white'}`}
                    >
                      <Icon size={20} /> {label}
                    </motion.a>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.7 }}
                  className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-6"
                >
                  <SocialLink href="https://github.com/Akshayskadam"       icon={Github}   />
                  <SocialLink href="https://www.linkedin.com/in/akshaysk15" icon={Linkedin} />
                </motion.div>
              </div>
            </TiltCard>
          </motion.div>
        </Section3D>
      </main>

      <footer className="py-8 border-t border-white/5 text-center text-sm font-mono text-muted-foreground z-10 relative bg-background">
        <p>Built with React, Canvas &amp; Framer Motion</p>
        <p className="mt-2 text-xs opacity-50">&copy; {new Date().getFullYear()} Akshay S. Kadam</p>
      </footer>
    </div>
  );
}
