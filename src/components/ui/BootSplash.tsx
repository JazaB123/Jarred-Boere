import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINES = [
  { text: 'JARRED.OS BIOS v1.0 — Copyright © 2025 Jarred Boere', dim: false },
  { text: 'CPU: FULL-STACK PROCESSOR @ 4.20GHz ........... OK', dim: true },
  { text: 'RAM: 16384MB DDR5 — Testing ................... OK', dim: true },
  { text: '', dim: true },
  { text: 'Scanning filesystem...', dim: false },
  { text: '> EXPERIENCE.DAT ............... [FOUND]', dim: false },
  { text: '> PROJECTS.DAT ................. [FOUND]', dim: false },
  { text: '> EDUCATION.DAT ................ [FOUND]', dim: false },
  { text: '> ABOUT.DAT .................... [FOUND]', dim: false },
  { text: '', dim: true },
  { text: 'Loading portfolio modules...', dim: true },
  { text: 'Initializing cybernetic interface...', dim: true },
  { text: 'Mounting JARRED.OS desktop...', dim: true },
  { text: '', dim: true },
  { text: '>> ALL SYSTEMS NOMINAL — WELCOME TO JARRED.OS <<', dim: false },
];

const LINE_DELAY = 200;

const BootSplash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scroll the log container itself, not the page
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visibleCount]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    const showNext = (i: number) => {
      if (i >= LINES.length) {
        t = setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 900);
        }, 1400);
        return;
      }
      t = setTimeout(() => {
        setVisibleCount(i + 1);
        showNext(i + 1);
      }, LINE_DELAY);
    };

    t = setTimeout(() => showNext(0), 500);
    return () => clearTimeout(t);
  }, [onComplete]);

  const progress = Math.round((visibleCount / LINES.length) * 100);
  const filled = Math.round(progress / 5);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className={`absolute inset-0 z-50 bg-black flex flex-col items-center justify-center ${isMobile ? 'p-4' : 'p-8'}`}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        >
          {/* ASCII header box */}
          <div className={`text-center ${isMobile ? 'mb-4' : 'mb-8'}`}>
            <div
              className={`font-mono text-xs mb-4 uppercase ${isMobile ? 'tracking-[0.15em]' : 'tracking-[0.4em]'}`}
              style={{ color: '#00f0ff99' }}
            >
              ▸ system boot sequence
            </div>
            <pre
              className="font-mono leading-snug select-none"
              style={{
                color: '#00f0ff',
                textShadow: '0 0 12px #00f0ff, 0 0 30px #00f0ff55',
                fontSize: isMobile ? '0.6rem' : 'clamp(1rem, 3.5vw, 2rem)',
              }}
            >
              {isMobile
? `╔═══════════════════╗
║                   ║
║  J A R R E D . O S║
║                   ║
╚═══════════════════╝`
: `╔══════════════════════════════════════╗
║                                      ║
║     J  A  R  R  E  D  . O  S        ║
║                                      ║
╚══════════════════════════════════════╝`}
            </pre>
            <div
              className={`font-mono text-xs mt-3 ${isMobile ? 'tracking-[0.1em]' : 'tracking-[0.3em]'}`}
              style={{ color: '#ffffff33' }}
            >
              FULL-STACK DEVELOPER  //  Berlin
            </div>
          </div>

          {/* Boot log */}
          <div ref={logRef} className="w-full max-w-lg font-mono text-xs mb-6 space-y-0.5 overflow-y-auto max-h-[10rem]">
            {LINES.slice(0, visibleCount).map((line, i) => (
              <div key={i} style={{ color: line.dim ? '#ffffff55' : '#00f0ff' }}>
                {line.text || '\u00a0'}
              </div>
            ))}
            {visibleCount < LINES.length && (
              <span
                className="inline-block w-[7px] h-[13px] animate-pulse"
                style={{ background: '#00f0ff' }}
              />
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-lg">
            <div
              className="flex justify-between font-mono text-[10px] mb-1"
              style={{ color: '#00f0ff66' }}
            >
              <span>LOADING PORTFOLIO</span>
              <span>{progress}%</span>
            </div>
            <div className="font-mono text-base" style={{ color: '#00f0ff', textShadow: '0 0 6px #00f0ff' }}>
              {'█'.repeat(filled)}
              <span style={{ color: '#00f0ff33' }}>{'░'.repeat(20 - filled)}</span>
            </div>
          </div>

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootSplash;
