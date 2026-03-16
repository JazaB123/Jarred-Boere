import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';

const experiences = [
  {
    role: 'Werkstudent – Software Engineer',
    company: 'Albatros Coding GmbH — Berlin, Germany',
    period: 'April 2025 – Present',
    bullets: [
      'Built web applications using Python for backend and HTML/JavaScript for frontend.',
      'Used PostgreSQL to manage and store application data.',
      'Developed AI tools with LangGraph and large language models (LLMs).',
    ],
    tech: ['Python', 'PostgreSQL', 'LLMs', 'HTML', 'JavaScript', 'CSS'],
  },
  {
    role: 'Junior Software Engineer',
    company: 'Intx Insurance Software — Johannesburg, South Africa',
    period: 'July 2024 – February 2025',
    bullets: [
      'Front-End Development – Design and implement user interfaces for web applications.',
      'Back-End Development – Build and maintain server-side logic and APIs using server-side languages.',
      'Integration and APIs – Integrate third-party services and APIs to enhance application functionality.',
      'Security – Regularly update and patch software components to mitigate security vulnerabilities.',
    ],
    tech: ['C#', 'ASP.NET', 'SQL', 'Blazor'],
  },
  {
    role: 'Sorbet Front Desk and System Supervisor',
    company: 'Sorbet Dunkeld — Johannesburg, South Africa',
    period: 'November 2023 – June 2024',
    bullets: [
      'System Administration – Managed the reservation and appointment system, performing updates and troubleshooting.',
      'Oversaw Front Desk Operations – Managed check-ins, appointment scheduling, and customer inquiries.',
    ],
    tech: ['System Admin', 'Operations'],
  },
  {
    role: 'Mr Home Repair Web Designer/Developer',
    company: 'Mr Home Repair — Johannesburg, South Africa',
    period: 'February 2022 – February 2023',
    bullets: [
      'Designed and built a full-stack website from scratch for a home renovation business, including a multi-category image gallery with 300+ project photos.',
      'Implemented a contact and quote request system with server-side email delivery, rate limiting, and input validation.',
      'Deployed frontend to shared hosting (Apache) and backend as a cloud service (Railway), with custom domain and transactional email via Resend.',
    ],
    tech: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Express', 'Vite', 'Resend API'],
  },
];

const ExperienceWindow: React.FC = () => {
  return (
    <div className="font-mono text-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#808080]">
        <Briefcase size={16} className="text-[#000080]" />
        <span className="font-bold text-[#000080]">Work Experience</span>
      </div>

      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <div key={i} className="border-l-4 border-[#000080] pl-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-bold text-[#000080]">{exp.role}</div>
                <div className="text-[#333] font-semibold">{exp.company}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#666] whitespace-nowrap">
                <Calendar size={11} />
                {exp.period}
              </div>
            </div>
            <ul className="text-xs text-[#333] mt-1 leading-relaxed list-disc list-inside space-y-0.5">
              {exp.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1 mt-2">
              {exp.tech.map((t) => (
                <span key={t} className="text-xs bg-[#000080] text-white px-1.5 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceWindow;
