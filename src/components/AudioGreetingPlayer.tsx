import React, { useState } from 'react';
import { Volume2, Play, Pause, Loader2, Sparkles } from 'lucide-react';

interface AudioGreetingPlayerProps {
  onSpeakText?: (text: string, language: 'fr' | 'en' | 'ja') => void;
}

const GREETINGS = [
  {
    lang: 'fr' as const,
    label: 'Français',
    accent: 'Native Parisienne',
    flag: '🇫🇷',
    text: "Bonjour, je suis Inès Guillemet. Bienvenue sur mon espace interactif. Étudiante en Master en International Business et Luxe, je serais ravie de vous présenter mon parcours au palace Le Lutetia, mes audits au Sofitel Bali et mes projets pour 2027.",
  },
  {
    lang: 'en' as const,
    label: 'English',
    accent: 'British Poise',
    flag: '🇬🇧',
    text: "Good day, I am Inès Guillemet. It is a genuine pleasure to welcome you. As a Master's student specialized in luxury hospitality and international business, I would be delighted to discuss my palace experience in Paris and brand audits in Bali.",
  },
  {
    lang: 'ja' as const,
    label: '日本語',
    accent: '丁寧語 (Keigo)',
    flag: '🇯🇵',
    text: "初めまして、イネス・ギルメと申します。パリの高級ホテル「ルテシア」での経験や、バリ島のソフィテルでの品質管理について、日本語でも喜んでお話しさせていただきます。どうぞよろしくお願いいたします。",
  },
];

export const AudioGreetingPlayer: React.FC<AudioGreetingPlayerProps> = ({
  onSpeakText,
}) => {
  const [selectedGreeting, setSelectedGreeting] = useState<'fr' | 'en' | 'ja'>('fr');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const activeGreeting = GREETINGS.find((g) => g.lang === selectedGreeting)!;

  const handlePlay = async () => {
    if (isPlaying && currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
      return;
    }

    if (onSpeakText) {
      onSpeakText(activeGreeting.text, activeGreeting.lang);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: activeGreeting.text,
          style:
            activeGreeting.lang === 'en'
              ? 'Young, poised British-accented French woman, refined and articulate'
              : activeGreeting.lang === 'ja'
              ? 'Polite, young woman speaking Japanese with international hospitality grace'
              : 'Young, elegant native Parisian woman in luxury hospitality',
        }),
      });

      const data = await res.json();
      if (data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        setCurrentAudio(audio);
        setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await audio.play();
      }
    } catch (e) {
      console.error('Failed to play greeting:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F6F0E5] border border-[#E4D9C7] rounded-2xl p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC9]">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <h3 className="font-serif text-lg sm:text-xl text-[#1C1A17] font-semibold">
              Voice Introduction & Linguistic Nuance
            </h3>
          </div>
          <p className="text-xs text-[#736657] mt-1 font-sans">
            Listen to Inès' vocal tone: refined British cadence, native Parisian elegance, or polite Japanese.
          </p>
        </div>

        {/* Language selector chips */}
        <div className="flex items-center gap-1.5 p-1 bg-[#ECE3D4] rounded-xl self-start sm:self-auto">
          {GREETINGS.map((g) => (
            <button
              key={g.lang}
              onClick={() => {
                if (isPlaying && currentAudio) {
                  currentAudio.pause();
                  setIsPlaying(false);
                }
                setSelectedGreeting(g.lang);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedGreeting === g.lang
                  ? 'bg-white text-[#1C1A17] shadow-xs font-semibold'
                  : 'text-[#695B4C] hover:text-[#1C1A17]'
              }`}
            >
              <span>{g.flag}</span>
              <span>{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-wider text-[#9E8B76] font-medium">
            Accent profile: <span className="text-[#383129] font-semibold">{activeGreeting.accent}</span>
          </div>
          <p className="text-sm text-[#383129] italic mt-1 leading-relaxed font-serif">
            "{activeGreeting.text}"
          </p>
        </div>

        <button
          onClick={handlePlay}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2B2621] hover:bg-[#1C1A17] text-[#FAF7F2] text-xs font-medium tracking-wide uppercase transition-all shadow-xs self-start md:self-auto min-w-[150px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
              <span>Generating...</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-4 h-4 text-[#C5A880]" />
              <span>Pause Audio</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-[#C5A880]" />
              <span>Listen to Voice</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
