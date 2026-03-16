import React, { useState, useCallback, useEffect } from 'react';
import asset from '../../lib/asset';
import BootSplash from '../ui/BootSplash';
import DesktopIcon from './DesktopIcon';
import RetroWindow from './RetroWindow';
import Taskbar from './Taskbar';
import ExperienceWindow from './windows/ExperienceWindow';
import ProjectsWindow from './windows/ProjectsWindow';
import EducationWindow from './windows/EducationWindow';
import AboutWindow from './windows/AboutWindow';
import SnakeWindow from './windows/SnakeWindow';

type WindowId = 'experience' | 'projects' | 'education' | 'about' | 'snake';

interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  defaultX: number;
  defaultY: number;
}

const WINDOW_CONTENT: Record<WindowId, React.ReactNode> = {
  experience: <ExperienceWindow />,
  projects:   <ProjectsWindow />,
  education:  <EducationWindow />,
  about:      <AboutWindow />,
  snake:      <SnakeWindow />,
};

const DESKTOP_ICONS: { id: WindowId | 'cv' | 'github' | 'linkedin'; label: string; src: string; href?: string }[] = [
  { id: 'experience', label: 'Experience', src: asset('computer-4.png')         },
  { id: 'projects',   label: 'Projects',   src: asset('directory_closed-5.png') },
  { id: 'education',  label: 'Education',  src: asset('world-2.png')            },
  { id: 'about',      label: 'About Me',   src: asset('msagent-4.png')          },
  { id: 'snake',      label: 'Snake',      src: asset('joystick.png')           },
  { id: 'cv',         label: 'My CV',      src: asset('file_lines-0.png'),  href: asset('Jarred Boere - CV 2026.pdf')        },
  { id: 'github',     label: 'GitHub',     src: asset('github-icon.png'),   href: 'https://github.com/JazaB123'              },
  { id: 'linkedin',   label: 'LinkedIn',   src: asset('linkedin-icon.png'), href: 'https://www.linkedin.com/in/jarred-boere' },
];

const INITIAL_WINDOWS: WindowState[] = [
  { id: 'experience', title: 'Experience', isOpen: false, isMinimized: false, zIndex: 10, defaultX: 20,  defaultY: 20 },
  { id: 'projects',   title: 'Projects',   isOpen: false, isMinimized: false, zIndex: 10, defaultX: 50,  defaultY: 40 },
  { id: 'education',  title: 'Education',  isOpen: false, isMinimized: false, zIndex: 10, defaultX: 30,  defaultY: 30 },
  { id: 'about',      title: 'About Me',   isOpen: false, isMinimized: false, zIndex: 10, defaultX: 60,  defaultY: 20 },
  { id: 'snake',      title: 'Snake',      isOpen: false, isMinimized: false, zIndex: 10, defaultX: 80,  defaultY: 30 },
];

const RetroDesktop: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [topZ, setTopZ] = useState(20);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const openWindow = useCallback((id: WindowId) => {
    setTopZ((z) => z + 1);
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: topZ + 1 } : w
      )
    );
  }, [topZ]);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isOpen: false, isMinimized: false } : w)));
    setActiveWindowId((cur) => (cur === id ? null : cur));
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    setTopZ((z) => z + 1);
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: topZ + 1 } : w))
    );
  }, [topZ]);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
    setActiveWindowId((cur) => (cur === id ? null : cur));
  }, []);

  const openWindowsList = windows
    .filter((w) => w.isOpen)
    .map((w) => ({ id: w.id, title: w.title }));

  return (
    <div className="w-full h-full relative overflow-hidden select-none flex flex-col">
      {/* Desktop wallpaper area */}
      <div className="flex-1 relative" style={{ background: '#008080' }}>
        {!booted && <BootSplash onComplete={() => setBooted(true)} />}
        {/* Desktop icons — two columns */}
        <div className="absolute top-2 left-2 flex gap-0">
          {/* Column 1: window icons */}
          <div className="flex flex-col gap-1">
            {DESKTOP_ICONS.filter(i => !i.href).map(({ id, label, src }) => (
              <DesktopIcon
                key={id}
                label={label}
                src={src}
                onClick={() => openWindow(id as WindowId)}
                isActive={activeWindowId === id}
              />
            ))}
          </div>
          {/* Column 2: link icons (CV, GitHub, LinkedIn) */}
          <div className="flex flex-col gap-1">
            {DESKTOP_ICONS.filter(i => i.href).map(({ id, label, src, href }) => (
              <DesktopIcon
                key={id}
                label={label}
                src={src}
                onClick={() => window.open(href, '_blank')}
                isActive={false}
              />
            ))}
          </div>
        </div>

        {/* Desktop label */}
        <div className="absolute top-2 right-2 text-right">
          <div className="text-white/40 text-xs font-mono">JARRED.OS v1.0</div>
        </div>

        {/* Windows */}
        {windows.map((win) =>
          win.isOpen ? (
            <RetroWindow
              key={win.id}
              title={win.title}
              onClose={() => closeWindow(win.id)}
              onFocus={() => focusWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              isMinimized={win.isMinimized}
              zIndex={win.zIndex}
              defaultX={win.defaultX}
              defaultY={win.defaultY}
              isMobile={isMobile}
              noPadding={win.id === 'snake' && !isMobile}
            >
              {WINDOW_CONTENT[win.id]}
            </RetroWindow>
          ) : null
        )}
      </div>

      {/* Taskbar — hidden during boot */}
      {booted && <Taskbar
        openWindows={openWindowsList}
        onWindowClick={(id) => focusWindow(id as WindowId)}
        activeWindowId={activeWindowId}
      />}
    </div>
  );
};

export default RetroDesktop;
