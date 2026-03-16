import React, { useState } from 'react';
import { ExternalLink, GitBranch, Folder, FileText, ChevronRight, Monitor } from 'lucide-react';
import {
  SiReact, SiNodedotjs, SiTypescript, SiTailwindcss, SiExpress, SiVuedotjs,
  SiD3, SiPython, SiFlask, SiPostgresql, SiFramer, SiThreedotjs,
  SiVite, SiResend, SiSharp, SiDotnet, SiAngular, SiSass,
} from 'react-icons/si';
import { IconType } from 'react-icons';

const techIcons: Record<string, IconType> = {
  'React':         SiReact,
  'Node.js':       SiNodedotjs,
  'TypeScript':    SiTypescript,
  'Tailwind CSS':  SiTailwindcss,
  'Express':       SiExpress,
  'Vue.js':        SiVuedotjs,
  'D3.js':         SiD3,
  'Python':        SiPython,
  'Flask':         SiFlask,
  'PostgreSQL':    SiPostgresql,
  'Framer Motion': SiFramer,
  'Three.js':      SiThreedotjs,
  'Vite':          SiVite,
  'Resend':        SiResend,
  'C#':            SiSharp,
  'ASP.NET Core':  SiDotnet,
  'Angular':       SiAngular,
  'SCSS':          SiSass,
};

const statusColors: Record<string, string> = {
  LIVE:     'bg-[#008000] text-white',
  WIP:      'bg-[#808000] text-white',
  ACADEMIC: 'bg-[#800080] text-white',
};

const projects = [
  {
    id: '001',
    filename: 'MR_HOME_REPAIR',
    name: 'Mr Home Repair',
    tagline: 'Full-stack renovation business website',
    description:
      'Built from scratch for a home renovation business. Features a multi-category image gallery with 300+ project photos, a contact/quote request system with server-side email delivery, rate limiting, and input validation.',
    tech: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Express', 'Vite', 'Resend'],
    github: 'https://github.com/JazaB123/mr-home-repair',
    live: 'https://mrhomerepair.co.za/',
    status: 'LIVE',
  },
  {
    id: '002',
    filename: 'CLEM_PHYSICS_GAME',
    name: 'Clem Physics Game',
    tagline: 'Physics-based agent benchmark environment',
    description:
      'A 2D puzzle game where AI agents solve physics-based challenges. Built to test and score how well different AI models reason about the physical world.',
    tech: ['Python', 'Pymunk', 'Matplotlib', 'ClemCore'],
    github: 'https://github.com/JazaB123/PuzzleCrew',
    live: '#',
    status: 'ACADEMIC',
  },
  {
    id: '003',
    filename: 'LETS_GET_PERSONAL',
    name: "Let's Get Personal",
    tagline: 'Custom gift store — bachelor thesis project',
    description:
      "An online gift store where customers upload their own designs and have them printed on products like mugs and t-shirts. Includes a real-time design preview so customers can see exactly what they'll receive before ordering.",
    tech: ['C#', 'ASP.NET Core', 'Angular', 'TypeScript', 'SCSS'],
    github: 'https://github.com/Informatics-370/370development-team-18-let-s-get-personal/tree/developer',
    live: '#',
    status: 'ACADEMIC',
  },
  {
    id: '004',
    filename: 'THIS_PORTFOLIO',
    name: 'This Portfolio',
    tagline: 'Win98 desktop meets cyberpunk',
    description:
      'A retro Windows 98 desktop experience built with React, Three.js WebGL shader background, Framer Motion scroll animations, and fully draggable/resizable windows.',
    tech: ['React', 'Three.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    github: 'https://github.com/JazaB123/Jarred-Boere',
    live: '#',
    status: 'LIVE',
  },
];

const ProjectDetail = ({ proj, onBack }: { proj: typeof projects[0]; onBack?: () => void }) => (
  <div className="flex flex-col h-full overflow-y-auto">
    {/* Title bar style header */}
    <div
      className="flex items-center justify-between px-2 py-1 mb-2 flex-shrink-0"
      style={{ background: 'linear-gradient(90deg, #000080, #1084d0)' }}
    >
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} className="win98-btn text-xs px-1 py-px mr-1">← Back</button>
        )}
        <Monitor size={12} className="text-white" />
        <span className="text-white text-xs font-bold tracking-wider">PROJECT_{proj.id}</span>
      </div>
      <span className={`text-xs font-bold px-1.5 py-px ${statusColors[proj.status]}`}>
        ● {proj.status}
      </span>
    </div>

    <div className="font-bold text-[#000080] text-base mb-0.5">{proj.name}</div>
    <div className="text-xs text-[#1a6bff] uppercase tracking-wide mb-2">{proj.tagline}</div>
    <p className="text-xs text-[#444] leading-relaxed mb-3">{proj.description}</p>

    <div className="flex flex-wrap gap-1 mb-3">
      {proj.tech.map((t) => {
        const Icon = techIcons[t];
        return (
          <span key={t} className="flex items-center gap-1 text-xs bg-[#000080] text-white px-1.5 py-px">
            {Icon && <Icon size={11} />}
            {t}
          </span>
        );
      })}
    </div>

    <div className="border-t border-[#c0c0c0] pt-2 flex gap-1.5">
      {proj.github !== '#' && (
        <a href={proj.github} target="_blank" rel="noreferrer"
          className="win98-btn flex items-center gap-1 text-xs no-underline">
          <GitBranch size={11} /> Code
        </a>
      )}
      {proj.live !== '#' && (
        <a href={proj.live} target="_blank" rel="noreferrer"
          className="win98-btn flex items-center gap-1 text-xs no-underline">
          <ExternalLink size={11} /> Live Site
        </a>
      )}
    </div>
  </div>
);

const ProjectsWindow: React.FC = () => {
  const [selected, setSelected] = useState<number>(0);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const proj = projects[selected];

  // ── Mobile: single-panel drill-down ────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="font-mono text-sm flex flex-col h-full">
        <div className="flex items-center gap-1 px-1 pb-1 border-b border-[#808080] mb-1 flex-shrink-0">
          <span className="text-[#333] text-xs mr-1">Address:</span>
          <div className="win98-sunken flex-1 px-1 py-px text-xs bg-white text-[#000080] truncate">
            C:\JARRED\PROJECTS{mobileView === 'detail' ? `\\${proj.filename}` : ''}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {mobileView === 'list' ? (
            <div>
              <div className="flex items-center gap-1 text-[#333] mb-2 font-bold text-xs px-1">
                <Folder size={13} className="text-[#808000]" />
                <span>PROJECTS</span>
              </div>
              <div className="space-y-px">
                {projects.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelected(i); setMobileView('detail'); }}
                    className="w-full text-left flex items-center gap-2 px-2 py-2 text-xs text-[#333] hover:bg-[#000080] hover:text-white border-b border-[#e0e0e0]"
                  >
                    <FileText size={12} className="shrink-0" />
                    <span className="flex-1 truncate">{p.filename}</span>
                    <ChevronRight size={11} className="shrink-0 text-[#808080]" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ProjectDetail proj={proj} onBack={() => setMobileView('list')} />
          )}
        </div>

        <div className="border-t border-[#808080] mt-1 pt-0.5 flex gap-3 text-xs text-[#333] flex-shrink-0">
          <div className="win98-sunken px-2 py-px">{projects.length} objects</div>
          {mobileView === 'detail' && (
            <div className="win98-sunken px-2 py-px flex items-center gap-1">
              <ChevronRight size={10} /> {proj.filename}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Desktop: two-panel explorer ────────────────────────────────────────────
  return (
    <div className="font-mono text-sm flex flex-col h-full">
      {/* Explorer toolbar */}
      <div className="flex items-center gap-1 px-1 pb-1 border-b border-[#808080] mb-1">
        <span className="text-[#333] text-xs mr-1">Address:</span>
        <div className="win98-sunken flex-1 px-1 py-px text-xs bg-white text-[#000080]">
          C:\JARRED\PROJECTS\{proj.filename}
        </div>
      </div>

      {/* Explorer body */}
      <div className="flex flex-1 gap-0 overflow-hidden min-h-0">

        {/* Left panel — folder tree */}
        <div className="w-44 flex-shrink-0 border-r border-[#808080] overflow-y-auto pr-1">
          <div className="flex items-center gap-1 text-[#333] mb-1 font-bold text-xs">
            <Folder size={13} className="text-[#808000]" />
            <span>PROJECTS</span>
          </div>
          <div className="pl-2 space-y-px">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setSelected(i)}
                className={`w-full text-left flex items-center gap-1 px-1 py-0.5 text-xs ${
                  selected === i
                    ? 'bg-[#000080] text-white'
                    : 'text-[#333] hover:bg-[#000080] hover:text-white'
                }`}
              >
                <FileText size={11} className="shrink-0" />
                <span className="truncate">{p.filename}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right panel — project details */}
        <div className="flex-1 pl-3 overflow-y-auto">
          <ProjectDetail proj={proj} />
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t border-[#808080] mt-1 pt-0.5 flex gap-3 text-xs text-[#333]">
        <div className="win98-sunken px-2 py-px">{projects.length} objects</div>
        <div className="win98-sunken px-2 py-px flex items-center gap-1">
          <ChevronRight size={10} /> {proj.filename}
        </div>
      </div>
    </div>
  );
};

export default ProjectsWindow;
