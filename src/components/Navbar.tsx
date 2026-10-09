import React from 'react';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
  onOpenVoice: () => void;
  isLiveActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContact,
  onOpenVoice,
  isLiveActive,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl tracking-wider text-[#1C1A17] font-medium uppercase">
              Inès Guillemet
            </span>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sans font-medium tracking-widest uppercase bg-[#EAE2D5] text-[#635547] border border-[#DDD3C3]">
              Palaces & Luxury PR
            </span>
          </div>
          <span className="text-xs tracking-widest uppercase text-[#8C7A6B] font-sans font-normal mt-0.5">
            Voice System Assistant & Professional Portfolio
          </span>
        </div>

        {/* Language pills & Voice indicator */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EDE2] border border-[#E2D7C5] text-xs text-[#5C5043]">
            <span className="font-medium">🇫🇷 FR</span>
            <span className="text-[#C5A880]">•</span>
            <span className="font-medium">🇬🇧 EN (British)</span>
            <span className="text-[#C5A880]">•</span>
            <span className="font-medium">🇯🇵 JA (Keigo)</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6B5E50] pl-2 border-l border-[#E2D7C5]">
            <MapPin className="w-3.5 h-3.5 text-[#A38A6E]" />
            <span>Paris, France</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenVoice}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium tracking-wide uppercase transition-all shadow-xs ${
              isLiveActive
                ? 'bg-[#1C1A17] text-[#FAF7F2] ring-2 ring-[#C5A880]'
                : 'bg-[#EFE8DC] hover:bg-[#E5DDCF] text-[#2B2621] border border-[#DDD2BF]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveActive ? 'bg-emerald-400 animate-ping' : 'bg-[#C5A880]'
              }`}
            />
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="font-sans">
              {isLiveActive ? 'Live Voice Active' : 'Speak with Inès'}
            </span>
          </button>

          <button
            onClick={onOpenContact}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium tracking-wide uppercase bg-[#1C1A17] text-[#FAF7F2] hover:bg-[#2F2B26] transition-colors shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-[#E0D5C1]" />
            <span className="hidden sm:inline">Contact</span>
          </button>
        </div>
      </div>
    </header>
  );
};
