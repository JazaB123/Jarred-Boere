"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rotate    = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale     = useTransform(scrollYProgress, [0, 1], isMobile ? [0.85, 1.0] : [1.05, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div className="py-10 md:py-40 w-full relative" style={{ perspective: "1000px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale} isMobile={isMobile}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => (
  <motion.div style={{ translateY: translate }} className="max-w-5xl mx-auto text-center">
    {titleComponent}
  </motion.div>
);

export const Card = ({
  rotate,
  scale,
  children,
  isMobile,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
  isMobile?: boolean;
}) => {
  if (isMobile) {
    return (
      <motion.div
        style={{ rotateX: rotate, scale }}
        className="-mt-12 mx-auto w-full flex justify-center"
      >
        <div
          className="relative"
          style={{
            width: 'min(320px, calc(100vw - 48px))',
            background: '#1a1a1a',
            borderRadius: 44,
            padding: '12px 6px',
            boxShadow: '0 0 0 2px #3a3a3a, 0 0 0 4px #1a1a1a, 0 30px 80px rgba(0,0,0,0.8), inset 0 0 0 1px #444',
          }}
        >
          {/* Side buttons */}
          <div className="absolute left-0 top-20 w-[3px] h-8 bg-[#2a2a2a] rounded-l-sm -translate-x-[3px]" />
          <div className="absolute left-0 top-32 w-[3px] h-8 bg-[#2a2a2a] rounded-l-sm -translate-x-[3px]" />
          <div className="absolute right-0 top-24 w-[3px] h-12 bg-[#2a2a2a] rounded-r-sm translate-x-[3px]" />

          {/* Screen */}
          <div
            style={{
              background: '#000',
              borderRadius: 36,
              overflow: 'hidden',
              height: 'min(580px, 75vh)',
              position: 'relative',
            }}
          >
            {/* Content */}
            <div className="h-full w-full overflow-hidden">
              {children}
            </div>
            {/* Home bar */}
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2"
              style={{ width: 120, height: 5, background: '#ffffff44', borderRadius: 10 }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Desktop: Retro CRT monitor ─────────────────────────────────────────────
  return (
    <motion.div
      style={{ rotateX: rotate, scale }}
      className="max-w-5xl -mt-12 mx-auto"
    >
      {/* Monitor outer casing */}
      <div
        style={{
          background: 'linear-gradient(160deg, #c8c0b0 0%, #b0a898 40%, #a09888 100%)',
          borderRadius: '12px 12px 6px 6px',
          padding: '18px 22px 10px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 6px rgba(0,0,0,0.3), 0 20px 60px rgba(0,0,0,0.7)',
          position: 'relative',
        }}
      >
        {/* Top brand strip */}
        <div className="flex items-center justify-between mb-2 px-1">
          <span style={{ fontFamily: 'Arial', fontSize: 9, color: '#888', letterSpacing: 2, textTransform: 'uppercase' }}>
            JARRED-OS™
          </span>
          <span style={{ fontFamily: 'Arial', fontSize: 8, color: '#aaa' }}>Model JB-98</span>
        </div>

        {/* Screen bezel (inner dark frame) */}
        <div
          style={{
            background: '#1a1812',
            borderRadius: 6,
            padding: '8px',
            boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.9), inset 0 -2px 8px rgba(0,0,0,0.6)',
          }}
        >
          {/* The actual screen */}
          <div
            style={{
              borderRadius: 4,
              overflow: 'hidden',
              height: '38rem',
              position: 'relative',
              boxShadow: 'inset 0 0 30px rgba(0,240,255,0.06)',
            }}
          >
            {children}

          </div>
        </div>

        {/* Bottom control panel */}
        <div
          className="flex items-center justify-between mt-3 px-2"
          style={{ minHeight: 28 }}
        >
          {/* Power + buttons */}
          <div className="flex items-center gap-2">
            {/* Power button */}
            <div
              style={{
                width: 14, height: 14,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #888, #444)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 1px rgba(255,255,255,0.3)',
              }}
            />
            {/* Indicator LED */}
            <div
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#00ff88',
                boxShadow: '0 0 6px #00ff88',
              }}
            />
            {/* Adjustment knobs */}
            {[0, 1].map(i => (
              <div
                key={i}
                style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #999, #555)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
                }}
              />
            ))}
          </div>
          {/* Brand */}
          <span style={{ fontFamily: 'Arial', fontSize: 8, color: '#999', letterSpacing: 3, textTransform: 'uppercase' }}>
            RETRO PRO
          </span>
        </div>
      </div>

      {/* Monitor neck */}
      <div className="mx-auto" style={{
        width: 90, height: 20,
        background: 'linear-gradient(180deg, #a09888 0%, #988878 100%)',
        clipPath: 'polygon(20% 0%, 80% 0%, 90% 100%, 10% 100%)',
      }} />

      {/* Monitor base */}
      <div className="mx-auto" style={{
        width: 280, height: 16,
        background: 'linear-gradient(180deg, #b0a898 0%, #988878 100%)',
        borderRadius: '0 0 8px 8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      }} />
    </motion.div>
  );
};
