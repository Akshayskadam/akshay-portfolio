import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Github, Linkedin, Mail, Phone, ChevronDown,
  Database, Terminal, Cpu, Layout, FileText,
  Smartphone, Calendar, MapPin, Briefcase, GraduationCap,
} from 'lucide-react';
import { CosmicBackground } from '../components/CosmicBackground';
import { Navbar } from '../components/Navbar';
import { Section } from '../components/Section';

/* ─── Scroll-based hero parallax ─── */
function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y      = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const ySpring  = useSpring(y,  { stiffness: 80, damping: 20 });
  const sSpring  = useSpring(scale, { stiffness: 80, damping: 20 });
  return (
    <section ref={ref} id="hero" className="relative min-h-[100dvh] flex items-center justify-center pt-20 z-10">
      <motion.div style={{ y: ySpring, opacity, scale: sSpring }} className="container mx-auto px-6 md:px-12 flex flex-col items-center md:items-start text-center md:text-left w-full">
        {children}
      </motion.div>
    </section>
  );
}

/* ─── 3-D tilt card ─── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const rx = ((e.clientY - top)  / height - 0.5) * -16;
    const ry = ((e.clientX - left) / width  - 0.5) *  16;
    const gx = ((e.clientX - left) / width)  * 100;
    const gy = ((e.clientY - top)  / height) * 100;
    setTransform(`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`);
    setGlowPos({ x: gx, y: gy });
  }, []);

  const onMouseLeave = useCallback(() => {
    setTransform('perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)');
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden transition-transform duration-200 ease-out ${className}`}
      style={{ transform: transform || 'perspective(900px)', willChange: 'transform' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Specular glow that follows the cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-inherit"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(0,229,255,0.12) 0%, transparent 65%)`,
          zIndex: 1,
        }}
      />
      {children}
    </div>
  );
}

/* ─── Floating badge ─── */
function FloatingBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs uppercase tracking-widest backdrop-blur-md"
    >
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      Available for new opportunities
    </motion.div>
  );
}

/* ─── Animated counter ─── */
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ scale: 1.06, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center text-center border-t-2 border-t-transparent hover:border-t-primary cursor-default"
    >
      <span className="text-3xl md:text-4xl font-black text-primary drop-shadow-md">{value}</span>
      <span className="text-xs md:text-sm text-muted-foreground font-mono mt-2 uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}

/* ─── Skill group card ─── */
function SkillGroup({ icon: Icon, title, skills }: { icon: any; title: string; skills: string[] }) {
  return (
    <TiltCard className="group glass-panel rounded-xl border border-white/5 hover:border-white/15">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Icon size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <motion.span
              key={skill}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,229,255,0.12)' }}
              className="px-3 py-1 bg-white/5 text-gray-300 text-sm rounded-md border border-white/5 cursor-default transition-colors"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}

/* ─── Experience card ─── */
function ExperienceCard({ company, role, date, bullets, align }: {
  company: string; role: string; date: string; bullets: string[]; align: 'left' | 'right';
}) {
  const isLeft = align === 'left';
  return (
    <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-${align}`}>
      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow-[0_0_14px_rgba(0,229,255,0.6)] absolute left-0 md:left-1/2 -translate-x-1/2 translate-y-4 md:translate-y-0 z-10 group-hover:scale-125 group-hover:shadow-[0_0_24px_rgba(0,229,255,0.9)] transition-all duration-300">
        <Briefcase size={16} className="text-primary-foreground" />
      </div>
      <TiltCard className="group w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-auto md:ml-0 glass-panel rounded-xl border border-white/5 hover:border-primary/30">
        <motion.div
          initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="p-6 md:p-8"
        >
          <div className="flex flex-col gap-1 mb-4">
            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{role}</h3>
            <h4 className="text-lg text-gray-300">{company}</h4>
            <span className="text-sm font-mono text-secondary mt-1 flex items-center gap-2">
              <Calendar size={14} />{date}
            </span>
          </div>
          <ul className="space-y-2 mt-4 text-sm md:text-base text-gray-400">
            {bullets.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="flex gap-3"
              >
                <span className="text-primary/50 mt-1">▹</span>
                <span>{b}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </TiltCard>
    </div>
  );
}

/* ─── Project card ─── */
function ProjectCard({ title, type, description, tags, icon: Icon }: {
  title: string; type: string; description: string; tags: string[]; icon: any;
}) {
  return (
    <TiltCard className="group glass-panel rounded-2xl border border-white/5 hover:border-primary/25 h-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="p-8 flex flex-col h-full relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-[0.08] transition-opacity pointer-events-none">
          <Icon size={120} />
        </div>
        <div className="text-primary font-mono text-sm mb-2">{type}</div>
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors z-10">{title}</h3>
        <p className="text-gray-400 mb-8 flex-grow z-10 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2 mt-auto z-10">
          {tags.map((tag) => (
            <span key={tag} className="text-xs font-mono px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </TiltCard>
  );
}

/* ─── Social link ─── */
function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <motion.a
      whileHover={{ y: -6, scale: 1.15 }}
      whileTap={{ scale: 0.92 }}
      href={href}
      target="_blank"
      rel="noreferrer"
      className="p-3 bg-white/5 rounded-full text-white hover:bg-white/10 border border-white/5 hover:border-primary/50 transition-colors shadow-lg"
    >
      <Icon size={24} />
    </motion.a>
  );
}

/* ─── Per-letter 3D magnetic title ─── */
function Magnetic3DTitle() {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [letterStyles, setLetterStyles] = useState<React.CSSProperties[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  // "Akshay S. Kadam" split into parts: first word normal, last word gradient
  const firstWord = 'Akshay S. ';
  const lastWord  = 'Kadam';
  const allChars  = (firstWord + lastWord).split('');

  useEffect(() => {
    setLetterStyles(allChars.map(() => ({})));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    function animate() {
      const refs = letterRefs.current;
      if (!refs.length) { rafRef.current = requestAnimationFrame(animate); return; }

      const newStyles: React.CSSProperties[] = refs.map((el) => {
        if (!el) return {};
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = mouseRef.current.x - cx;
        const dy = mouseRef.current.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 140;
        const proximity = Math.max(0, 1 - dist / maxDist); // 0..1

        if (proximity === 0) {
          return {
            transform: 'perspective(400px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)',
            color: '',
            textShadow: '',
            transition: 'transform 0.5s ease, color 0.5s ease, text-shadow 0.5s ease',
          };
        }

        // Tilt toward cursor
        const maxTilt = 38;
        const rotX =  (dy / (rect.height / 2)) * -maxTilt * proximity;
        const rotY =  (dx / (rect.width  / 2)) *  maxTilt * proximity;
        const pushZ = proximity * 28;
        const liftY = proximity * -14;

        // Color: interpolate white → cyan based on proximity
        const r = Math.round(255 * (1 - proximity * 0.9));
        const g = Math.round(255 * (1 - proximity * 0.1));
        const b = 255;
        const glow = Math.round(proximity * 28);

        return {
          transform: `perspective(400px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${pushZ}px) translateY(${liftY}px)`,
          color: `rgb(${r},${g},${b})`,
          textShadow: `0 0 ${glow}px rgba(0,229,255,${proximity * 0.9}), 0 0 ${glow * 2}px rgba(0,229,255,${proximity * 0.4})`,
          transition: 'transform 0.12s ease-out, color 0.12s ease-out, text-shadow 0.12s ease-out',
          zIndex: 10,
        };
      });

      setLetterStyles(newStyles);
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const firstLen = firstWord.length;

  return (
    <motion.h1
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4 drop-shadow-2xl select-none cursor-default"
      style={{ lineHeight: 1.05 }}
    >
      {/* First part: "Akshay S. " */}
      {firstWord.split('').map((char, i) => (
        <span
          key={`f-${i}`}
          ref={(el) => { letterRefs.current[i] = el; }}
          style={{
            display: char === ' ' ? 'inline' : 'inline-block',
            color: 'white',
            willChange: 'transform',
            ...letterStyles[i],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      {/* Last word: "Kadam" — gradient base, overridden by hover color */}
      {lastWord.split('').map((char, i) => {
        const gi = firstLen + i;
        const hasHover = letterStyles[gi]?.color;
        return (
          <span
            key={`l-${i}`}
            ref={(el) => { letterRefs.current[gi] = el; }}
            style={{
              display: 'inline-block',
              willChange: 'transform',
              // Use gradient only when not hovered
              ...(hasHover
                ? letterStyles[gi]
                : {
                    background: 'linear-gradient(90deg, #00e5ff, #9d4edd)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    ...letterStyles[gi],
                  }),
            }}
          >
            {char}
          </span>
        );
      })}
    </motion.h1>
  );
}

/* ─── Scroll indicator ─── */
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
    >
      <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
        <ChevronDown size={20} />
      </motion.div>
    </motion.div>
  );
}

/* ═══ PAGE ═══ */
export default function Portfolio() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-primary/30">
      <CosmicBackground />
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <HeroParallax>
          <FloatingBadge />

          <Magnetic3DTitle />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl md:text-2xl font-mono text-muted-foreground mb-10 max-w-2xl"
          >
            &gt; Data Analyst &amp; Full-Stack Developer
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-16"
          >
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,229,255,0.45)' }}
              whileTap={{ scale: 0.97 }}
              href="#contact"
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-md transition-all shadow-lg shadow-primary/20"
            >
              Contact Me
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, borderColor: 'rgba(0,229,255,0.5)' }}
              whileTap={{ scale: 0.97 }}
              href="#projects"
              className="px-8 py-4 bg-card border border-white/10 text-white font-semibold rounded-md transition-all"
            >
              View Projects
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex items-center gap-6"
          >
            <SocialLink href="https://github.com/Akshayskadam" icon={Github} />
            <SocialLink href="https://www.linkedin.com/in/akshaysk15" icon={Linkedin} />
            <SocialLink href="mailto:akshayskadamba@gmail.com" icon={Mail} />
          </motion.div>

          <ScrollIndicator />
        </HeroParallax>

        {/* ── ABOUT ── */}
        <Section id="about" title="About" subtitle="sys.whoami()">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <TiltCard className="group glass-panel rounded-2xl">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
                <p className="text-lg md:text-xl leading-relaxed text-gray-300 font-light">
                  "Seeking an opportunity to apply my analytical and programming skills, contribute to
                  innovative projects, and continuously learn emerging technologies while growing
                  professionally."
                </p>
                <div className="mt-8 flex items-center gap-2 text-muted-foreground font-mono text-sm">
                  <MapPin size={16} className="text-primary" />
                  <span>Bangalore, Karnataka, India</span>
                </div>
              </motion.div>
            </TiltCard>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <StatCard label="Years Experience" value="1+" />
              <StatCard label="MCA Score" value="84.25%" />
              <StatCard label="Projects" value="2+" />
              <StatCard label="Publications" value="1" />
            </motion.div>
          </div>
        </Section>

        {/* ── SKILLS ── */}
        <Section id="skills" title="Skills" subtitle="capabilities.list()">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Database, title: 'Data & Analytics', skills: ['SQL', 'Databricks', 'ETL Workflows', 'Data Mapping', 'Data Extraction', 'Reporting & Analytics', 'Schema Migration', 'Business Intelligence'] },
              { icon: Terminal, title: 'Languages',         skills: ['C', 'Java', 'Python'] },
              { icon: Layout,   title: 'Web & Front-End',  skills: ['HTML', 'CSS', 'Angular', 'JavaScript', 'Node.js'] },
              { icon: Cpu,      title: 'Embedded & IoT',   skills: ['Raspberry Pi', 'Embedded Systems', 'IoT Prototyping'] },
              { icon: Smartphone, title: 'Mobile',         skills: ['Java', 'XML'] },
              { icon: Layout,   title: 'Tools & IDEs',     skills: ['Visual Studio Code', 'Android Studio', 'Eclipse'] },
            ].map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <SkillGroup icon={g.icon} title={g.title} skills={g.skills} />
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── EXPERIENCE ── */}
        <Section id="experience" title="Experience" subtitle="career.history()">
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/60 before:via-white/10 before:to-transparent">
            <ExperienceCard
              company="Bewakoof Brands Pvt. Ltd."
              role="Data Analyst"
              date="Feb 9, 2026 – Present"
              align="left"
              bullets={[
                'Write and optimize SQL queries for data extraction, reporting, and analytics workflows',
                'Support schema migration activities and maintain ETL process documentation',
                'Perform data analysis to generate business insights and support cross-functional decision making',
                'Collaborate with QC and workflow teams to identify process gaps and improve operational efficiency',
                'Worked on Databricks-based data workflows and documented data mappings, joins, and integrations for logistics and analytics systems',
              ]}
            />
            <ExperienceCard
              company="Blugate Software Technologies Pvt. Ltd."
              role="Software Development Intern"
              date="Dec 2, 2024 – Jan 31, 2025"
              align="right"
              bullets={[
                'Utilized Angular, JavaScript, XML, and CSS to build and enhance responsive front-end components',
                'Integrated RESTful APIs using POST and GET methods to enable seamless data exchange between client and server',
              ]}
            />
          </div>
        </Section>

        {/* ── PROJECTS ── */}
        <Section id="projects" title="Projects" subtitle="workspace.build()">
          <div className="grid md:grid-cols-2 gap-8">
            <ProjectCard
              title="AgroVision: Smart Agriculture Monitoring"
              type="Capstone Project"
              description="A full-stack IoT system for live monitoring of environmental parameters in real time. Features RESTful APIs and a live dashboard for data visualization."
              tags={['Angular', 'Node.js', 'Raspberry Pi', 'IoT', 'RESTful API']}
              icon={Cpu}
            />
            <ProjectCard
              title="IoT-based Smart Doorbell"
              type="Research Paper — WJARR Vol.27 Issue 1"
              description="Smart Doorbell system with Face Recognition and Remote Alerts capabilities. Published in World Journal of Advanced Research and Reviews (July 2025)."
              tags={['IoT', 'Face Recognition', 'Research', 'Security']}
              icon={FileText}
            />
          </div>
        </Section>

        {/* ── EDUCATION ── */}
        <Section id="education" title="Education" subtitle="academic.records()">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { degree: 'Masters of Computer Application (MCA)', year: '2025', score: '84.25%', color: 'primary' },
              { degree: 'Bachelors of Computer Applications (BCA)', year: '2022', score: '87.57%', color: 'secondary' },
            ].map((edu, i) => (
              <TiltCard key={edu.degree} className="group glass-panel rounded-xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`p-8 border-l-4 ${edu.color === 'primary' ? 'border-l-primary' : 'border-l-secondary'}`}
                >
                  <GraduationCap
                    className={`mb-4 ${edu.color === 'primary' ? 'text-primary' : 'text-secondary'}`}
                    size={32}
                  />
                  <h3 className="text-xl font-bold text-white mb-2">{edu.degree}</h3>
                  <p className="text-muted-foreground font-mono text-sm mb-4">CMR University, Bengaluru</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 bg-white/5 px-3 py-1 rounded-full flex items-center gap-2">
                      <Calendar size={14} /> {edu.year}
                    </span>
                    <span className={`font-bold text-lg ${edu.color === 'primary' ? 'text-primary' : 'text-secondary'}`}>
                      {edu.score}
                    </span>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </Section>

        {/* ── CONTACT ── */}
        <Section id="contact" title="Contact" subtitle="net.connect()">
          <TiltCard className="group glass-panel rounded-2xl border border-white/10 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 md:p-12 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Let's Build Something Together</h2>
              <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
                Whether you have a question about data workflows, need a full-stack IoT solution, or just
                want to connect — my inbox is open.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <motion.a
                  whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(0,229,255,0.4)' }}
                  href="mailto:akshayskadamba@gmail.com"
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg transition-all"
                >
                  <Mail size={20} /> akshayskadamba@gmail.com
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  href="tel:+918277390087"
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-lg transition-all"
                >
                  <Phone size={20} /> +91 8277390087
                </motion.a>
              </div>
              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-6">
                <motion.a whileHover={{ scale: 1.2, color: '#ffffff' }} href="https://github.com/Akshayskadam" target="_blank" rel="noreferrer" className="text-muted-foreground p-3 hover:bg-white/5 rounded-full transition-colors">
                  <Github size={24} />
                </motion.a>
                <motion.a whileHover={{ scale: 1.2, color: '#0a66c2' }} href="https://www.linkedin.com/in/akshaysk15" target="_blank" rel="noreferrer" className="text-muted-foreground p-3 hover:bg-white/5 rounded-full transition-colors">
                  <Linkedin size={24} />
                </motion.a>
              </div>
            </motion.div>
          </TiltCard>
        </Section>
      </main>

      <footer className="py-8 border-t border-white/5 text-center text-sm font-mono text-muted-foreground z-10 relative bg-background">
        <p>Built with React, Canvas &amp; Framer Motion</p>
        <p className="mt-2 text-xs opacity-50">&copy; {new Date().getFullYear()} Akshay S. Kadam</p>
      </footer>
    </div>
  );
}
