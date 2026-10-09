import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { VoiceConsole } from './components/VoiceConsole';
import { AudioGreetingPlayer } from './components/AudioGreetingPlayer';
import { ResumeDossier } from './components/ResumeDossier';
import { ContactModal } from './components/ContactModal';
import { useLiveVoice } from './hooks/useLiveVoice';
import { Sparkles, MessageSquare, Volume2, ShieldCheck, Star } from 'lucide-react';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const voiceSectionRef = useRef<HTMLDivElement | null>(null);

  const {
    state,
    isLiveActive,
    isMuted,
    setIsMuted,
    messages,
    analyser,
    errorMessage,
    toggleLiveVoice,
    sendMessage,
    playMessageAudio,
  } = useLiveVoice();

  const scrollToVoice = () => {
    voiceSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAskAboutExperience = (promptText: string, lang: 'fr' | 'en' | 'ja') => {
    scrollToVoice();
    sendMessage(promptText, lang);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1A17] flex flex-col font-sans selection:bg-[#E8DFC8] selection:text-[#1C1A17]">
      {/* Editorial Navbar */}
      <Navbar
        onOpenContact={() => setIsContactOpen(true)}
        onOpenVoice={scrollToVoice}
        isLiveActive={isLiveActive}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2EAE0] border border-[#E0D5C3] text-xs font-serif italic text-[#635547]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Diplomatie • Excellence Hôtelière • Esprit Analytique</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1C1A17] leading-[1.15]">
            “L’art de l’hospitalité de luxe, guidé par la précision et l’élégance.”
          </h1>

          <p className="text-xs sm:text-sm text-[#5C5043] max-w-2xl mx-auto leading-relaxed font-sans">
            Assistant vocal interactif représentant <strong>Inès Guillemet</strong>, étudiante en dernière année de Master en International Business et Marketing de Luxe. Découvrez ses réalisations au palace <em>Le Lutetia</em>, ses audits qualité au <em>Sofitel Bali</em> et conversez en français, anglais britannique ou japonais.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={scrollToVoice}
              className="px-6 py-3 rounded-full bg-[#1C1A17] hover:bg-[#2F2923] text-[#FAF7F2] text-xs font-medium tracking-wide uppercase transition-all shadow-xs flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-[#C5A880]" />
              <span>Conversez en Direct avec Inès</span>
            </button>

            <button
              onClick={() => setIsContactOpen(true)}
              className="px-6 py-3 rounded-full bg-[#EFE8DC] hover:bg-[#E5DDCF] border border-[#DDD0BC] text-[#2A241E] text-xs font-medium tracking-wide uppercase transition-all shadow-xs"
            >
              Recruter Inès (Stage 2027)
            </button>
          </div>
        </section>

        {/* Audio Greeting Player: Listen to accents (British, Parisian, Japanese) */}
        <section>
          <AudioGreetingPlayer
            onSpeakText={(text, lang) => {
              sendMessage(text, lang);
              scrollToVoice();
            }}
          />
        </section>

        {/* Voice System Console Section */}
        <section ref={voiceSectionRef} className="scroll-mt-24">
          <VoiceConsole
            state={state}
            isLiveActive={isLiveActive}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            onToggleLive={toggleLiveVoice}
            analyser={analyser}
            messages={messages}
            errorMessage={errorMessage}
            onSendMessage={sendMessage}
            onPlayMessageAudio={playMessageAudio}
          />
        </section>

        {/* Full Resume & Dossier Section */}
        <section className="pt-8">
          <ResumeDossier onAskAboutExperience={handleAskAboutExperience} />
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className="mt-20 border-t border-[#E8DFD1] bg-[#F5EFE4] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-serif text-lg tracking-wider text-[#1C1A17] font-semibold uppercase">
              Inès Guillemet
            </div>
            <p className="text-xs text-[#7A6B5C] mt-0.5">
              Paris, France • inesguillemet.pro@gmail.com • +33 7 68 46 81 29
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#6B5E50]">
            <span>Master 1 / 2 ESCE International Business School</span>
            <span className="text-[#C5A880]">•</span>
            <span>Yonsei University (Seoul)</span>
            <span className="text-[#C5A880]">•</span>
            <span>Accor & Palace Standards</span>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
