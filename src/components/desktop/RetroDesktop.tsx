import React, { useState, useCallback } from 'react';
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

const DESKTOP_ICONS: { id: WindowId; label: string; src: string }[] = [
  { id: 'experience', label: 'Experience', src: '/computer-4.png'         },
  { id: 'projects',   label: 'Projects',   src: '/directory_closed-5.png' },
  { id: 'education',  label: 'Education',  src: '/world-2.png'            },
  { id: 'about',      label: 'About Me',   src: '/msagent-4.png'          },
  { id: 'snake',      label: 'Snake',      src: '/joystick.png'           },
];

const INITIAL_WINDOWS: WindowState[] = [
  { id: 'experience', title: 'Experience', isOpen: false, zIndex: 10, defaultX: 20,  defaultY: 20 },
  { id: 'projects',   title: 'Projects',   isOpen: false, zIndex: 10, defaultX: 50,  defaultY: 40 },
  { id: 'education',  title: 'Education',  isOpen: false, zIndex: 10, defaultX: 30,  defaultY: 30 },
  { id: 'about',      title: 'About Me',   isOpen: false, zIndex: 10, defaultX: 60,  defaultY: 20 },
  { id: 'snake',      title: 'Snake',      isOpen: false, zIndex: 10, defaultX: 80,  defaultY: 30 },
];

const RetroDesktop: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [topZ, setTopZ] = useState(20);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>(null);

  const openWindow = useCallback((id: WindowId) => {
    setTopZ((z) => z + 1);
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isOpen: true, zIndex: topZ + 1 } : w
      )
    );
  }, [topZ]);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w)));
    setActiveWindowId((cur) => (cur === id ? null : cur));
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    setTopZ((z) => z + 1);
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: topZ + 1 } : w))
    );
  }, [topZ]);

  const openWindowsList = windows
    .filter((w) => w.isOpen)
    .map((w) => ({ id: w.id, title: w.title }));

  return (
    <div className="w-full h-full relative overflow-hidden select-none flex flex-col">
      {/* Desktop wallpaper area */}
      <div className="flex-1 relative" style={{ background: '#008080' }}>
        {!booted && <BootSplash onComplete={() => setBooted(true)} />}
        {/* Desktop icons */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {DESKTOP_ICONS.map(({ id, label, src }) => (
            <DesktopIcon
              key={id}
              label={label}
              src={src}
              onClick={() => openWindow(id)}
              isActive={activeWindowId === id}
            />
          ))}
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
              zIndex={win.zIndex}
              defaultX={win.defaultX}
              defaultY={win.defaultY}
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
