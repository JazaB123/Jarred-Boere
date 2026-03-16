import React from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { ContainerScroll } from '../components/ui/container-scroll-animation';
import RetroDesktop from '../components/desktop/RetroDesktop';

const HomePage: React.FC = () => {
  return (
    <main className="relative">
      {/* Scanlines overlay — fixed, always on */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)',
        }}
      />

      {/* Single unified scroll section */}
      <ContainerScroll
        titleComponent={
          <div className="space-y-3 pb-4">
            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-none"
            >
              <span className="text-white">JARRED </span>
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #1a6bff, #00f0ff, #ff2d78)' }}
              >
                BOERE
              </span>
            </motion.h1>

            {/* Role strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="h-px w-8 bg-[#1a6bff]" />
              <div className="flex items-center gap-2 text-[#8080a0] font-mono text-xs md:text-sm">
                <Code2 size={13} className="text-[#1a6bff]" />
                <span>Full-Stack Developer</span>
                <span className="text-[#1a6bff]">//</span>
                <span>AI Engineer</span>
              </div>
              <div className="h-px w-8 bg-[#1a6bff]" />
            </motion.div>

            {/* Sub-text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[#505070] text-xs font-mono"
            >
              Berlin, Germany
            </motion.p>
          </div>
        }
      >
        <RetroDesktop />
      </ContainerScroll>

      {/* Footer */}
      <footer className="relative py-8 text-center border-t border-[#1a1a3a]">
        <p className="text-[#303050] font-mono text-xs">
          © 2025 Jarred Boere — Built with React, Three.js &amp; Framer Motion
        </p>
      </footer>
    </main>
  );
};

export default HomePage;
