import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, ChevronDown, Database, Terminal, Cpu, Layout, FileText, Smartphone, ExternalLink, Calendar, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { CosmicBackground } from '../components/CosmicBackground';
import { Navbar } from '../components/Navbar';
import { Section } from '../components/Section';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-primary/30">
      <CosmicBackground />
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section id="hero" className="relative min-h-[100dvh] flex items-center justify-center pt-20 z-10">
          <div className="container mx-auto px-6 md:px-12 flex flex-col items-center md:items-start text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs uppercase tracking-widest backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Available for new opportunities
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white mb-4 drop-shadow-2xl"
            >
              Akshay S. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Kadam</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl md:text-2xl font-mono text-muted-foreground mb-10 max-w-2xl"
            >
              &gt; Data Analyst & Full-Stack Developer
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-16"
            >
              <a href="#contact" className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all hover-elevate shadow-lg shadow-primary/20">
                Contact Me
              </a>
              <a href="#projects" className="px-8 py-4 bg-card border border-white/10 text-white font-semibold rounded-md hover:bg-card/80 transition-all hover-elevate">
                View Projects
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex items-center gap-6"
            >
              <SocialLink href="https://github.com/Akshayskadam" icon={Github} />
              <SocialLink href="https://www.linkedin.com/in/akshaysk15" icon={Linkedin} />
              <SocialLink href="mailto:akshayskadamba@gmail.com" icon={Mail} />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
            <ChevronDown className="animate-bounce" size={20} />
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <Section id="about" title="About" subtitle="sys.whoami()">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8 rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
              <p className="text-lg md:text-xl leading-relaxed text-gray-300 font-light">
                "Seeking an opportunity to apply my analytical and programming skills, contribute to innovative projects, and continuously learn emerging technologies while growing professionally."
              </p>
              <div className="mt-8 flex items-center gap-2 text-muted-foreground font-mono text-sm">
                <MapPin size={16} className="text-primary" />
                <span>Bangalore, Karnataka, India</span>
              </div>
            </motion.div>
            
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

        {/* SKILLS SECTION */}
        <Section id="skills" title="Skills" subtitle="capabilities.list()">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkillGroup 
              icon={Database} 
              title="Data & Analytics" 
              skills={['SQL', 'Databricks', 'ETL Workflows', 'Data Mapping', 'Data Extraction', 'Reporting & Analytics', 'Schema Migration', 'Business Intelligence']} 
            />
            <SkillGroup 
              icon={Terminal} 
              title="Languages" 
              skills={['C', 'Java', 'Python']} 
            />
            <SkillGroup 
              icon={Layout} 
              title="Web & Front-End" 
              skills={['HTML', 'CSS', 'Angular', 'JavaScript', 'Node.js']} 
            />
            <SkillGroup 
              icon={Cpu} 
              title="Embedded & IoT" 
              skills={['Raspberry Pi', 'Embedded Systems', 'IoT Prototyping']} 
            />
            <SkillGroup 
              icon={Smartphone} 
              title="Mobile Development" 
              skills={['Java', 'XML']} 
            />
            <SkillGroup 
              icon={Layout} 
              title="Tools & IDEs" 
              skills={['Visual Studio Code', 'Android Studio', 'Eclipse']} 
            />
          </div>
        </Section>

        {/* EXPERIENCE SECTION */}
        <Section id="experience" title="Experience" subtitle="career.history()">
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-white/10 before:to-transparent">
            
            <ExperienceCard 
              company="Bewakoof Brands Pvt. Ltd."
              role="Data Analyst"
              date="Feb 9, 2026 – Present"
              bullets={[
                "Write and optimize SQL queries for data extraction, reporting, and analytics workflows",
                "Support schema migration activities and maintain ETL process documentation",
                "Perform data analysis to generate business insights and support cross-functional decision making",
                "Collaborate with QC and workflow teams to identify process gaps and improve operational efficiency",
                "Worked on Databricks-based data workflows and documented data mappings, joins, and integrations for logistics and analytics systems"
              ]}
              align="left"
            />
            
            <ExperienceCard 
              company="Blugate Software Technologies Pvt. Ltd."
              role="Software Development Intern"
              date="Dec 2, 2024 – Jan 31, 2025"
              bullets={[
                "Utilized Angular, JavaScript, XML, and CSS to build and enhance responsive front-end components",
                "Integrated RESTful APIs using POST and GET methods to enable seamless data exchange between client and server"
              ]}
              align="right"
            />

          </div>
        </Section>

        {/* PROJECTS SECTION */}
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
              type="Research Paper Publication"
              description="Smart Doorbell system with Face Recognition and Remote Alerts capabilities. Published in World Journal of Advanced Research and Reviews (WJARR), Vol. 27, Issue 1 (July 2025)."
              tags={['IoT', 'Face Recognition', 'Research', 'Security']}
              icon={FileText}
            />
          </div>
        </Section>

        {/* EDUCATION SECTION */}
        <Section id="education" title="Education" subtitle="academic.records()">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8 rounded-xl border-l-4 border-l-primary"
            >
              <GraduationCap className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Masters of Computer Application (MCA)</h3>
              <p className="text-muted-foreground font-mono text-sm mb-4">CMR University, Bengaluru</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 bg-white/5 px-3 py-1 rounded-full flex items-center gap-2"><Calendar size={14}/> 2025</span>
                <span className="text-secondary font-bold text-lg">84.25%</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-8 rounded-xl border-l-4 border-l-secondary"
            >
              <GraduationCap className="text-secondary mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Bachelors of Computer Applications (BCA)</h3>
              <p className="text-muted-foreground font-mono text-sm mb-4">CMR University, Bengaluru</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 bg-white/5 px-3 py-1 rounded-full flex items-center gap-2"><Calendar size={14}/> 2022</span>
                <span className="text-primary font-bold text-lg">87.57%</span>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* CONTACT SECTION */}
        <Section id="contact" title="Contact" subtitle="net.connect()">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto border-white/10"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Let's Build Something Together</h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Whether you have a question about data workflows, need a full-stack IoT solution, or just want to connect, my inbox is open.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a href="mailto:akshayskadamba@gmail.com" className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                <Mail size={20} />
                akshayskadamba@gmail.com
              </a>
              <a href="tel:+918277390087" className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-all">
                <Phone size={20} />
                +91 8277390087
              </a>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-6">
              <a href="https://github.com/Akshayskadam" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-white transition-colors p-3 hover:bg-white/5 rounded-full">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/akshaysk15" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#0a66c2] transition-colors p-3 hover:bg-white/5 rounded-full">
                <Linkedin size={24} />
              </a>
            </div>
          </motion.div>
        </Section>
      </main>

      <footer className="py-8 border-t border-white/5 text-center text-sm font-mono text-muted-foreground z-10 relative bg-background">
        <p>Built with React, Three.js & Framer Motion</p>
        <p className="mt-2 text-xs opacity-50">&copy; {new Date().getFullYear()} Akshay S. Kadam</p>
      </footer>
    </div>
  );
}

// Subcomponents

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <motion.a 
      whileHover={{ y: -5, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className="p-3 bg-white/5 rounded-full text-white hover:bg-white/10 border border-white/5 hover:border-primary/50 transition-colors shadow-lg"
    >
      <Icon size={24} />
    </motion.a>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center text-center border-t-2 border-t-transparent hover:border-t-primary transition-colors group">
      <span className="text-3xl md:text-4xl font-black text-white group-hover:text-primary transition-colors drop-shadow-md">{value}</span>
      <span className="text-xs md:text-sm text-muted-foreground font-mono mt-2 uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}

function SkillGroup({ icon: Icon, title, skills }: { icon: any; title: string; skills: string[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass-panel p-6 rounded-xl border border-white/5 hover:border-white/10 transition-all"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Icon size={20} />
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-md border border-white/5 cursor-default transition-colors">
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function ExperienceCard({ company, role, date, bullets, align }: { company: string; role: string; date: string; bullets: string[]; align: 'left' | 'right' }) {
  const isLeft = align === 'left';
  return (
    <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-${align}`}>
      
      {/* Timeline dot */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow-[0_0_10px_rgba(0,229,255,0.5)] absolute left-0 md:left-1/2 -translate-x-1/2 translate-y-4 md:translate-y-0 z-10 group-hover:scale-125 transition-transform">
        <Briefcase size={16} className="text-primary-foreground" />
      </div>

      {/* Card Content */}
      <motion.div 
        initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-auto md:ml-0 glass-panel p-6 md:p-8 rounded-xl border border-white/5 hover:border-primary/30 transition-colors"
      >
        <div className="flex flex-col gap-1 mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{role}</h3>
          <h4 className="text-lg text-gray-300">{company}</h4>
          <span className="text-sm font-mono text-secondary mt-1 flex items-center gap-2">
            <Calendar size={14} />
            {date}
          </span>
        </div>
        <ul className="space-y-2 mt-4 text-sm md:text-base text-gray-400">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-primary/50 mt-1">▹</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

function ProjectCard({ title, type, description, tags, icon: Icon }: { title: string; type: string; description: string; tags: string[]; icon: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="glass-panel p-8 rounded-2xl flex flex-col h-full group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={120} />
      </div>
      
      <div className="text-primary font-mono text-sm mb-2">{type}</div>
      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors relative z-10">{title}</h3>
      <p className="text-gray-400 mb-8 flex-grow relative z-10 leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-auto relative z-10">
        {tags.map(tag => (
          <span key={tag} className="text-xs font-mono px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
