import React from 'react';
import { GraduationCap } from 'lucide-react';

const education = [
  {
    degree: 'M.Sc Cognitive Systems',
    institution: 'University of Potsdam',
    period: '2024 – Present',
    details: 'Interdisciplinary program spanning Natural Language Processing, machine learning, and AI systems. Focused on building intelligent systems and modelling human cognitive processes through hands-on research.',
    logo: '/UniversityOfPotsdam.png',
  },
  {
    degree: 'BIT Information Systems',
    institution: 'University of Pretoria',
    period: '2020 – 2023',
    details: 'Trained in the application of computer and information systems in organisations. Covers systems design, mobile development, data manipulation, and business analysis — bridging technical programming with real-world problem solving.',
    logo: '/UniversityOfPretoria.png',
  },
];

const EducationWindow: React.FC = () => {
  return (
    <div className="font-mono text-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#808080]">
        <GraduationCap size={16} className="text-[#000080]" />
        <span className="font-bold text-[#000080]">Education</span>
      </div>

      <div className="space-y-3">
        {education.map((edu, i) => (
          <div key={i} className="border border-[#808080] p-2 bg-[#f0f0f0] flex gap-3">
            <img
              src={edu.logo}
              alt={edu.institution}
              className="w-12 h-12 object-contain flex-shrink-0 bg-white border border-[#c0c0c0] p-1"
            />
            <div>
              <div className="font-bold text-[#000080]">{edu.degree}</div>
              <div className="text-[#333] font-semibold">{edu.institution}</div>
              <div className="text-xs text-[#666]">{edu.period}</div>
              <p className="text-xs text-[#555] mt-1">{edu.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationWindow;
