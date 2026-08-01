import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, subtitle, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`py-24 md:py-32 relative z-10 ${className}`}>
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        {(title || subtitle) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
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
      </div>
    </section>
  );
}
