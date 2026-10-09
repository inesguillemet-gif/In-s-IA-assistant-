import React, { useState } from 'react';
import { INES_PROFILE_DATA, Experience, EducationItem } from '../data/inesProfile';
import {
  Award,
  Building,
  GraduationCap,
  Briefcase,
  Globe2,
  CheckCircle2,
  Mic,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface ResumeDossierProps {
  onAskAboutExperience: (promptText: string, lang: 'fr' | 'en' | 'ja') => void;
}

export const ResumeDossier: React.FC<ResumeDossierProps> = ({
  onAskAboutExperience,
}) => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'projects' | 'competencies'>(
    'experience'
  );

  return (
    <div className="space-y-12">
      {/* Editorial Profile Header & Key Metrics */}
      <section className="bg-[#FAF7F2] border border-[#E8DFD1] rounded-3xl p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#E8DEC9]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE7D8] text-[11px] font-sans font-medium tracking-widest uppercase text-[#695B4C] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Available for 6-Month Internship • Jan 2027</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1A17] font-semibold tracking-tight leading-tight">
              Inès Guillemet
            </h1>
            <p className="text-base sm:text-lg text-[#635547] font-serif italic mt-2">
              Marketing & Public Relations in Luxury Hospitality & Palaces
            </p>

            <p className="text-xs sm:text-sm text-[#4A4036] font-sans leading-relaxed mt-4">
              Master's student with immersive international experience spanning Parisian Left Bank Palaces (Le Lutetia Mandarin Oriental), luxury beachfront resorts (Sofitel Bali Nusa Dua), and renowned Asian academic institutions (Yonsei University, Seoul). Proven track record in data analysis, Leading Quality Assurance (LQA) audits, VIP guest relations, and high-prestige brand storytelling.
            </p>
          </div>

          {/* Quick info sheet */}
          <div className="bg-[#F3EBE0] border border-[#DFD3BE] rounded-2xl p-5 lg:min-w-[300px] space-y-3">
            <div className="text-[11px] uppercase tracking-wider text-[#8A7969] font-medium pb-2 border-b border-[#E2D5BF]">
              Candidate Summary
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6B5E50]">Academic Level</span>
              <span className="font-medium text-[#1C1A17]">Master 1 / 2 (Grad. 2027)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6B5E50]">Location</span>
              <span className="font-medium text-[#1C1A17]">Paris, France</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6B5E50]">MBTI Profile</span>
              <span className="font-medium text-[#1C1A17]">ENFJ (Protagonist)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6B5E50]">Languages</span>
              <span className="font-medium text-[#1C1A17]">FR (Native) • EN (C1) • JA • KR</span>
            </div>
          </div>
        </div>

        {/* Audits & Key Metrics Strip */}
        <div className="pt-8">
          <div className="text-xs uppercase tracking-widest text-[#8A7969] font-medium font-sans mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C5A880]" />
            <span>Audited Performance Benchmarks & Quality Indicators</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INES_PROFILE_DATA.metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-[#F6EFE4] border border-[#E2D5BF] rounded-2xl p-4 sm:p-5 flex flex-col justify-between"
              >
                <div className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1A17] tracking-tight">
                  {m.value}
                </div>
                <div className="mt-2">
                  <div className="text-xs font-semibold text-[#382F26]">
                    {m.label}
                  </div>
                  <div className="text-[11px] text-[#7A6B5C] font-sans mt-0.5 leading-snug">
                    {m.context}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-[#E8DEC9] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wide uppercase transition-all whitespace-nowrap ${
            activeTab === 'experience'
              ? 'bg-[#1C1A17] text-[#FAF7F2]'
              : 'text-[#695B4C] hover:bg-[#EFE7D8]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Palaces & Professional Experience</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wide uppercase transition-all whitespace-nowrap ${
            activeTab === 'education'
              ? 'bg-[#1C1A17] text-[#FAF7F2]'
              : 'text-[#695B4C] hover:bg-[#EFE7D8]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Education & Global Mobility</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wide uppercase transition-all whitespace-nowrap ${
            activeTab === 'projects'
              ? 'bg-[#1C1A17] text-[#FAF7F2]'
              : 'text-[#695B4C] hover:bg-[#EFE7D8]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Strategic & Luxury Projects</span>
        </button>

        <button
          onClick={() => setActiveTab('competencies')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wide uppercase transition-all whitespace-nowrap ${
            activeTab === 'competencies'
              ? 'bg-[#1C1A17] text-[#FAF7F2]'
              : 'text-[#695B4C] hover:bg-[#EFE7D8]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Competencies & Soft Skills</span>
        </button>
      </div>

      {/* Tab: Professional Experience */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          {INES_PROFILE_DATA.experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-[#FAF7F2] border border-[#E4D9C7] rounded-3xl p-6 sm:p-8 hover:border-[#C5A880] transition-all shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EBE1CF]">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1C1A17]">
                      {exp.role}
                    </h3>
                    {exp.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-sans font-medium tracking-wider bg-[#EDE4D4] text-[#695A4A] border border-[#DDD0BC]">
                        {exp.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-[#7D6B58] mt-1 font-serif italic">
                    {exp.company} — <span className="font-sans not-italic text-xs text-[#8A7969]">{exp.location}</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-[#8A7969] self-start sm:self-auto bg-[#F4EDE0] px-3 py-1 rounded-full border border-[#E0D4BF]">
                  {exp.period}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#473D33] mt-4 leading-relaxed font-sans">
                {exp.description}
              </p>

              <div className="mt-4 space-y-2">
                {exp.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#3D342B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>

              {/* Ask Inès about this experience button */}
              <div className="mt-6 pt-4 border-t border-[#EBE1CF] flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] uppercase tracking-wider text-[#8A7969] font-medium font-sans">
                  Voice inquiry shortcut:
                </span>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => onAskAboutExperience(exp.suggestedPrompt.fr, 'fr')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2EAE0] hover:bg-[#E6DBCE] border border-[#DDD0BD] text-xs text-[#2A241E] transition-colors"
                  >
                    <Mic className="w-3 h-3 text-[#A8947C]" />
                    <span>🇫🇷 Demander en français</span>
                  </button>

                  <button
                    onClick={() => onAskAboutExperience(exp.suggestedPrompt.en, 'en')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2EAE0] hover:bg-[#E6DBCE] border border-[#DDD0BD] text-xs text-[#2A241E] transition-colors"
                  >
                    <Mic className="w-3 h-3 text-[#A8947C]" />
                    <span>🇬🇧 Ask in British English</span>
                  </button>

                  <button
                    onClick={() => onAskAboutExperience(exp.suggestedPrompt.ja, 'ja')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2EAE0] hover:bg-[#E6DBCE] border border-[#DDD0BD] text-xs text-[#2A241E] transition-colors"
                  >
                    <Mic className="w-3 h-3 text-[#A8947C]" />
                    <span>🇯🇵 日本語で聞く</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Education */}
      {activeTab === 'education' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INES_PROFILE_DATA.education.map((edu) => (
            <div
              key={edu.id}
              className="bg-[#FAF7F2] border border-[#E4D9C7] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EAE0CF]">
                  <span className="text-xs font-mono text-[#8C7A6B] bg-[#F3ECE0] px-2.5 py-0.5 rounded-full border border-[#E0D4BF]">
                    {edu.period}
                  </span>
                  <span className="text-xs text-[#7A6B5C]">{edu.location}</span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-[#1C1A17] mt-3">
                  {edu.degree}
                </h3>
                <div className="text-xs font-medium text-[#7D6B58] mt-1 font-serif italic">
                  {edu.institution}
                </div>

                {edu.track && (
                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded text-[10px] font-sans font-semibold uppercase tracking-wider bg-[#EAE0CF] text-[#473D33]">
                    {edu.track}
                  </div>
                )}

                <div className="mt-4 space-y-1.5">
                  {edu.details.map((d, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#473D33] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] mt-1.5 shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#EAE0CF] flex justify-end">
                <button
                  onClick={() =>
                    onAskAboutExperience(
                      `Inès, parlez-moi de votre formation académique à ${edu.institution}.`,
                      'fr'
                    )
                  }
                  className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#695B4C] hover:text-black font-medium"
                >
                  <span>Ask Inès about this study</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Strategic Projects */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INES_PROFILE_DATA.strategicProjects.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F2] border border-[#E4D9C7] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8A7969] font-medium bg-[#F0E7D8] px-2.5 py-1 rounded-full border border-[#DFD3BF]">
                  {p.category}
                </span>

                <h3 className="font-serif text-xl font-semibold text-[#1C1A17] mt-3">
                  {p.title}
                </h3>

                <p className="text-xs text-[#473D33] leading-relaxed mt-2.5 font-sans">
                  {p.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#EAE0CF]">
                <button
                  onClick={() =>
                    onAskAboutExperience(
                      `Inès, comment avez-vous structuré le projet "${p.title}" ?`,
                      'fr'
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#29231D] hover:text-[#C5A880] transition-colors"
                >
                  <Mic className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Hear Inès' project strategy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Competencies & Soft Skills */}
      {activeTab === 'competencies' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INES_PROFILE_DATA.competencies.map((cat, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F2] border border-[#E4D9C7] rounded-3xl p-6 shadow-xs"
            >
              <h3 className="font-serif text-lg font-semibold text-[#1C1A17] pb-2 border-b border-[#EAE0CF]">
                {cat.category}
              </h3>

              <ul className="mt-4 space-y-2.5">
                {cat.skills.map((skill, sIdx) => (
                  <li key={sIdx} className="flex items-center gap-2 text-xs text-[#3D342B]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                    <span className="font-sans">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
