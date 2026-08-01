import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, subtitle, children, className = '' }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // Section slides up and fades in from below as it enters viewport
  const y = useTransform(scrollYProgress, [0, 0.2, 1], [60, 0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.6]);

  return (
    <section ref={ref} id={id} className={`py-24 md:py-32 relative z-10 ${className}`}>
      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-6 md:px-12 max-w-6xl"
      >
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 12 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 900, transformOrigin: 'bottom center' }}
            className="mb-16 md:mb-24"
          >
            {title && (
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-8 bg-primary" />
                <h2 className="text-3xl md:text-5xl font-bold font-sans tracking-tight text-white">
                  {title}
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-muted-foreground font-mono ml-12 text-sm md:text-base">
                // {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </motion.div>
    </section>
  );
}
