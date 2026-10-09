import React, { useState } from 'react';
import { Mail, Phone, MapPin, X, Copy, Check, Calendar, Sparkles } from 'lucide-react';
import { INES_PROFILE_DATA } from '../data/inesProfile';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FAF7F2] border border-[#E0D5C3] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#EFE7D8] text-[#695B4C] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7D8] text-[10px] font-sans font-medium tracking-widest uppercase text-[#695B4C] mb-3">
          <Sparkles className="w-3 h-3 text-[#C5A880]" />
          <span>Professional Inquiries</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1A17] font-semibold">
          Get in Touch with Inès
        </h3>
        <p className="text-xs text-[#635547] mt-1 font-sans leading-relaxed">
          Open to 6-month Master's internship opportunities in Marketing, Public Relations, and Palace Operations starting January 2027.
        </p>

        <div className="mt-6 space-y-3.5">
          {/* Email */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EDE0] border border-[#E0D4BF]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#2A241E] shadow-2xs">
                <Mail className="w-4 h-4 text-[#A8947C]" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#8C7A6B]">Email</div>
                <div className="text-xs font-semibold text-[#1C1A17]">{INES_PROFILE_DATA.email}</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(INES_PROFILE_DATA.email, 'email')}
              className="p-2 rounded-lg hover:bg-white text-[#635547] transition-colors"
              title="Copy email"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EDE0] border border-[#E0D4BF]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#2A241E] shadow-2xs">
                <Phone className="w-4 h-4 text-[#A8947C]" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#8C7A6B]">Phone / WhatsApp</div>
                <div className="text-xs font-semibold text-[#1C1A17]">{INES_PROFILE_DATA.phone}</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(INES_PROFILE_DATA.phone, 'phone')}
              className="p-2 rounded-lg hover:bg-white text-[#635547] transition-colors"
              title="Copy phone"
            >
              {copiedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Location & Availability */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F4EDE0] border border-[#E0D4BF]">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#2A241E] shadow-2xs">
              <MapPin className="w-4 h-4 text-[#A8947C]" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#8C7A6B]">Location & Mobilité</div>
              <div className="text-xs font-semibold text-[#1C1A17]">Paris, France & International (Europe / Asia)</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-[#E8DEC9] flex items-center justify-between">
          <div className="text-[11px] text-[#786959]">
            ESCE Business School • Yonsei University
          </div>

          <a
            href={`mailto:${INES_PROFILE_DATA.email}?subject=Internship%20Opportunity%20-%20Luxury%20Hospitality%202027`}
            className="px-4 py-2 rounded-full bg-[#1C1A17] text-[#FAF7F2] text-xs font-medium uppercase tracking-wider hover:bg-[#332D27] transition-colors"
          >
            Draft Email
          </a>
        </div>
      </div>
    </div>
  );
};
