import React, { useState, useEffect } from 'react';
import asset from '../../lib/asset';

interface TaskbarProps {
  openWindows: { id: string; title: string }[];
  onWindowClick: (id: string) => void;
  activeWindowId: string | null;
}

const Taskbar: React.FC<TaskbarProps> = ({ openWindows, onWindowClick, activeWindowId }) => {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-9 bg-[#c0c0c0] flex items-center px-1 gap-1 z-50 flex-shrink-0"
      style={{ borderTop: '2px solid #ffffff' }}
    >
      {/* Start Button */}
      <button className="win98-btn flex items-center gap-1.5 px-2 py-0.5 font-bold text-sm h-7">
        <img
          src={asset('windows-0.png')}
          alt="Start"
          width={16}
          height={16}
          style={{ imageRendering: 'pixelated' }}
          draggable={false}
        />
        <span>Start</span>
      </button>

      {/* Separator */}
      <div className="w-px h-6 bg-[#808080] mx-1" style={{ borderRight: '1px solid #ffffff' }} />

      {/* Open windows */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto">
        {openWindows.map((win) => (
          <button
            key={win.id}
            onClick={() => onWindowClick(win.id)}
            className={`
              win98-btn h-7 min-w-[80px] max-w-[160px] text-xs truncate text-left px-2
              ${activeWindowId === win.id ? 'win98-sunken' : ''}
            `}
          >
            {win.title}
          </button>
        ))}
      </div>

      {/* System tray */}
      <div
        className="flex items-center px-2 h-6 text-xs font-mono text-black"
        style={{
          borderTop: '1px solid #808080',
          borderLeft: '1px solid #808080',
          borderRight: '1px solid #ffffff',
          borderBottom: '1px solid #ffffff',
        }}
      >
        {time}
      </div>
    </div>
  );
};

export default Taskbar;
