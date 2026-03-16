import React from 'react';

interface DesktopIconProps {
  label: string;
  src: string;
  onClick: () => void;
  isActive?: boolean;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ label, src, onClick, isActive }) => {
  return (
    <button
      onDoubleClick={onClick}
      onClick={(e) => { if (e.detail === 2) return; }}
      onTouchEnd={(e) => { e.preventDefault(); onClick(); }}
      className={`
        flex flex-col items-center gap-1 p-2 w-20 cursor-default select-none focus:outline-none
        ${isActive ? 'bg-[#000080]/40' : 'hover:bg-white/20'}
      `}
      title={`Double-click to open ${label}`}
    >
      <img
        src={src}
        alt={label}
        width={48}
        height={48}
        style={{ imageRendering: 'pixelated', filter: isActive ? 'brightness(0.7) sepia(1) hue-rotate(180deg)' : 'none' }}
        draggable={false}
      />
      <span className={`
        text-xs text-center leading-tight px-0.5
        ${isActive ? 'bg-[#000080] text-white' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'}
      `}>
        {label}
      </span>
    </button>
  );
};

export default DesktopIcon;
