import React, { useState, useEffect } from 'react';
import { User, Code2, Coffee, MapPin, Mail, Linkedin, GitBranch } from 'lucide-react';

const skills = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'REST APIs'] },
  { category: 'Tools', items: ['Git', 'Docker', 'Figma', 'VS Code', 'Linux'] },
];

const AboutWindow: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="font-mono text-sm">
      {/* Header — links wrap below title on mobile */}
      <div className={`flex mb-3 pb-2 border-b border-[#808080] ${isMobile ? 'flex-col gap-2' : 'items-center justify-between'}`}>
        <div className="flex items-center gap-2">
          <User size={16} className="text-[#000080]" />
          <span className="font-bold text-[#000080]">About Me</span>
        </div>
        <div className="flex gap-3">
          <a href="mailto:jboere01@gmail.com" className="flex items-center gap-1 text-xs text-[#000080] hover:underline">
            <Mail size={11} /> Email
          </a>
          <a href="https://github.com/JazaB123" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#000080] hover:underline">
            <GitBranch size={11} /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/jarred-boere" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#000080] hover:underline">
            <Linkedin size={11} /> LinkedIn
          </a>
        </div>
      </div>

      {/* Profile — stack vertically on mobile */}
      <div className={`flex mb-4 ${isMobile ? 'flex-col items-center text-center gap-2' : 'gap-4'}`}>
        <img
          src="/GradPhoto.jpg"
          alt="Jarred Boere"
          className={`object-cover border-2 border-[#808080] flex-shrink-0 ${isMobile ? 'w-24 h-24' : 'w-28 h-28'}`}
        />
        <div>
          <div className="font-bold text-[#000080] text-base">Jarred Boere</div>
          <div className={`flex items-center gap-1 text-xs text-[#333] mt-0.5 ${isMobile ? 'justify-center' : ''}`}>
            <Code2 size={11} /> Full-Stack Developer
          </div>
          <div className={`flex items-center gap-1 text-xs text-[#555] mt-0.5 ${isMobile ? 'justify-center' : ''}`}>
            <MapPin size={11} /> Berlin, Germany
          </div>
          <div className={`flex items-center gap-1 text-xs text-[#555] mt-0.5 ${isMobile ? 'justify-center' : ''}`}>
            <Coffee size={11} /> Powered by coffee &amp; curiosity
          </div>
        </div>
      </div>

      <p className="text-xs text-[#333] leading-relaxed mb-3 border-l-2 border-[#000080] pl-2">
        Passionate full-stack developer with 3+ years of experience building scalable web applications.
        Currently pursuing my masters degree studying an M.Sc Cognitive Systems at the University of Potsdam.
        I love turning complex problems into elegant, intuitive interfaces. When not coding, I'm exploring
        new technologies, contributing to open source, or bouldering.
      </p>

      <div className="mb-3">
        <div className="font-bold text-xs text-[#000080] mb-2">Technical Skills</div>
        <div className="space-y-2">
          {skills.map((group) => (
            <div key={group.category}>
              <div className="text-xs font-semibold text-[#333] mb-1">{group.category}</div>
              <div className="flex flex-wrap gap-1">
                {group.items.map((skill) => (
                  <span key={skill} className="text-xs bg-[#000080] text-white px-1.5 py-0.5">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AboutWindow;
