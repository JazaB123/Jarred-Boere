import React, { useRef, useState, useCallback } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RetroWindowProps {
  title: string;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
  zIndex: number;
  children: React.ReactNode;
  defaultX?: number;
  defaultY?: number;
  isMobile?: boolean;
  noPadding?: boolean;
}

const RetroWindow: React.FC<RetroWindowProps> = ({
  title,
  onClose,
  onFocus,
  onMinimize,
  isMinimized,
  zIndex,
  children,
  defaultX = 40,
  defaultY = 30,
  isMobile = false,
  noPadding = false,
}) => {
  const [pos, setPos] = useState({ x: defaultX, y: defaultY });
  const [isMaximized, setIsMaximized] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      setPos({
        x: Math.max(0, dragRef.current.origX + dx),
        y: Math.max(0, dragRef.current.origY + dy),
      });
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [isMaximized, onFocus, pos.x, pos.y]);

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          ref={windowRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={onFocus}
          style={{
            position: 'absolute',
            left: isMobile ? 0 : (isMaximized ? 0 : pos.x),
            top: isMobile ? 0 : (isMaximized ? 0 : pos.y),
            width: isMobile ? '100%' : (isMaximized ? '100%' : 'min(700px, calc(100% - 20px))'),
            height: isMobile ? '100%' : (isMaximized ? 'calc(100% - 36px)' : 'auto'),
            zIndex,
          }}
          className="flex flex-col bg-[#c0c0c0] win98-raised overflow-hidden"
        >
          {/* Title Bar */}
          <div
            onMouseDown={handleMouseDown}
            className="flex items-center justify-between px-1.5 py-0.5 bg-gradient-to-r from-[#000080] to-[#1084d0] cursor-move select-none flex-shrink-0"
          >
            <span className="text-white text-xs font-bold truncate mr-2">{title}</span>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => onMinimize()}
                className="win98-btn w-5 h-5 flex items-center justify-center p-0 text-xs"
                title="Minimize"
              >
                <Minus size={8} strokeWidth={3} />
              </button>
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => setIsMaximized(!isMaximized)}
                className="win98-btn w-5 h-5 flex items-center justify-center p-0 text-xs"
                title="Maximize"
              >
                <Square size={8} strokeWidth={2} />
              </button>
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={onClose}
                className="win98-btn w-5 h-5 flex items-center justify-center p-0 text-xs font-bold"
                title="Close"
              >
                <X size={9} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Menu bar */}
          <div className="flex items-center gap-1 px-1 py-0.5 border-b border-[#808080] bg-[#c0c0c0] flex-shrink-0">
            {['File', 'Edit', 'View', 'Help'].map((item) => (
              <button key={item} className="text-xs px-2 py-0.5 hover:bg-[#000080] hover:text-white">
                {item}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className={
            noPadding
              ? 'flex-1 overflow-hidden win98-sunken m-2'
              : `flex-1 overflow-y-auto p-3 win98-sunken m-2 bg-white ${isMobile ? 'min-h-0 max-h-full' : 'min-h-[300px] max-h-[400px]'}`
          }>
            {children}
          </div>

          {/* Status bar */}
          <div className="flex items-center px-2 py-0.5 border-t border-[#808080] text-xs text-[#333] bg-[#c0c0c0] flex-shrink-0">
            <div className="win98-sunken px-2 py-0.5 text-xs">Ready</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RetroWindow;
