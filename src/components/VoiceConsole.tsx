import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Send,
  Volume2,
  Sparkles,
  RotateCcw,
  Languages,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { VoiceSphere } from './VoiceSphere';
import { AssistantState, ChatMessage } from '../types';

interface VoiceConsoleProps {
  state: AssistantState;
  isLiveActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleLive: () => void;
  analyser: AnalyserNode | null;
  messages: ChatMessage[];
  errorMessage: string | null;
  onSendMessage: (text: string, language?: 'auto' | 'fr' | 'en' | 'ja') => void;
  onPlayMessageAudio: (audioBase64: string) => void;
}

const PRESET_TOPICS = [
  {
    category: 'Palace Experience',
    badge: 'Le Lutetia',
    prompts: [
      {
        lang: 'fr' as const,
        label: 'Le Lutetia Palace',
        text: 'Inès, parlez-moi de votre rôle de Chef de Rang et de la gestion des clients VIP au palace Le Lutetia.',
      },
      {
        lang: 'en' as const,
        label: 'VIP Protocol',
        text: 'Inès, how did you coordinate high-profile banquets and discrete VIP services in Paris?',
      },
    ],
  },
  {
    category: 'Quality & Audits',
    badge: 'Sofitel Bali',
    prompts: [
      {
        lang: 'en' as const,
        label: 'Bali Audits 99%',
        text: 'Could you explain how you achieved 99% in Sofitel Brand Standards and 85.3% in LQA at Bali?',
      },
      {
        lang: 'fr' as const,
        label: 'Projet Opérationnel',
        text: 'Quel projet opérationnel avez-vous conçu de A à Z au Sofitel Bali Nusa Dua Beach Resort ?',
      },
    ],
  },
  {
    category: 'International & Asia',
    badge: 'Japan & Korea',
    prompts: [
      {
        lang: 'ja' as const,
        label: '自己紹介 (日本語)',
        text: 'イネスさん、日本語で自己紹介と日本への輸出戦略プロジェクトについて教えてください。',
      },
      {
        lang: 'en' as const,
        label: 'Yonsei & Laurea',
        text: 'What did your academic exchanges at Yonsei University and Helsinki teach you about international luxury?',
      },
    ],
  },
  {
    category: 'Ambitions 2027',
    badge: 'Internship',
    prompts: [
      {
        lang: 'fr' as const,
        label: 'Stage Janvier 2027',
        text: "Quelle est votre valeur ajoutée pour un stage de 6 mois en Marketing et Relations Publiques de luxe en 2027 ?",
      },
      {
        lang: 'en' as const,
        label: 'Career Vision',
        text: 'What are your career aspirations in luxury hospitality brand management?',
      },
    ],
  },
];

export const VoiceConsole: React.FC<VoiceConsoleProps> = ({
  state,
  isLiveActive,
  isMuted,
  onToggleMute,
  onToggleLive,
  analyser,
  messages,
  errorMessage,
  onSendMessage,
  onPlayMessageAudio,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeLangFilter, setActiveLangFilter] = useState<'all' | 'fr' | 'en' | 'ja'>('all');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-[#FAF7F2] border border-[#E4D9C7] rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Visualizer & Live Session Controls */}
      <div className="flex flex-col items-center justify-center text-center pb-8 border-b border-[#E8DEC9]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0E8DA] border border-[#DDD0BC] text-xs text-[#6E5F50] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span className="font-medium tracking-wide uppercase">
            Powered by gemini-3.8-live & gemini-3.8-flash
          </span>
        </div>

        {/* Dynamic Voice Sphere */}
        <VoiceSphere
          state={state}
          analyser={analyser}
          size="lg"
          isLiveActive={isLiveActive}
        />

        <div className="max-w-md mt-4">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1A17] font-semibold">
            Inès Guillemet Voice Assistant
          </h2>
          <p className="text-xs sm:text-sm text-[#6E5F50] mt-1 leading-relaxed font-sans">
            Speak directly with Inès in real-time or type below. Responds fluently in
            <span className="font-medium text-[#29241E]"> French</span> (native Parisian),
            <span className="font-medium text-[#29241E]"> English</span> (British accent poise), and
            <span className="font-medium text-[#29241E]"> Japanese</span>.
          </p>
        </div>

        {/* Call Controls */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onToggleLive}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-md ${
              isLiveActive
                ? 'bg-red-800 hover:bg-red-900 text-white'
                : 'bg-[#1C1A17] hover:bg-[#2C2722] text-[#FAF7F2]'
            }`}
          >
            {isLiveActive ? (
              <>
                <PhoneOff className="w-4 h-4 text-red-200" />
                <span>End Voice Call</span>
              </>
            ) : (
              <>
                <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
                <span>Start Live Voice Call</span>
              </>
            )}
          </button>

          {isLiveActive && (
            <button
              onClick={onToggleMute}
              className={`p-3 rounded-full border transition-colors ${
                isMuted
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-[#EFE7D8] border-[#DDD0BC] text-[#3D342B] hover:bg-[#E4D9C7]'
              }`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? (
                <MicOff className="w-4 h-4 text-amber-800" />
              ) : (
                <Mic className="w-4 h-4 text-[#3D342B]" />
              )}
            </button>
          )}
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Suggested Inquiries / Prompt Chips */}
      <div className="pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#A8947C]" />
            <span className="text-xs font-serif text-[#1C1A17] font-semibold uppercase tracking-wider">
              Explore Inès' Credentials
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#8C7A6B] mr-1">Filter:</span>
            {(['all', 'fr', 'en', 'ja'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLangFilter(lang)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase transition-colors ${
                  activeLangFilter === lang
                    ? 'bg-[#1C1A17] text-[#FAF7F2]'
                    : 'bg-[#EDE4D4] text-[#6E5F50] hover:bg-[#E0D4C0]'
                }`}
              >
                {lang === 'all'
                  ? 'All'
                  : lang === 'fr'
                  ? '🇫🇷 FR'
                  : lang === 'en'
                  ? '🇬🇧 EN'
                  : '🇯🇵 JA'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_TOPICS.map((topic) =>
            topic.prompts
              .filter(
                (p) => activeLangFilter === 'all' || p.lang === activeLangFilter
              )
              .map((p, idx) => (
                <button
                  key={`${topic.category}-${idx}`}
                  onClick={() => onSendMessage(p.text, p.lang)}
                  className="group text-left p-3 rounded-xl bg-[#F4EDE0] hover:bg-[#EBE2D2] border border-[#E0D4BF] hover:border-[#C5A880] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-1 w-full text-[10px] uppercase tracking-wider text-[#8A7969] mb-1">
                    <span>{topic.badge}</span>
                    <span className="font-semibold text-[#54473A]">
                      {p.lang === 'fr'
                        ? '🇫🇷 FR'
                        : p.lang === 'en'
                        ? '🇬🇧 EN'
                        : '🇯🇵 JA'}
                    </span>
                  </div>
                  <p className="text-xs text-[#2A241E] line-clamp-2 group-hover:text-black font-sans leading-snug">
                    {p.text}
                  </p>
                </button>
              ))
          )}
        </div>
      </div>

      {/* Transcript & Message History */}
      <div className="mt-4 pt-4 border-t border-[#E8DEC9]">
        <div className="text-xs font-serif text-[#1C1A17] font-semibold uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Conversation History</span>
          <span className="text-[11px] text-[#8C7A6B] font-sans normal-case">
            {messages.length} messages
          </span>
        </div>

        <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-2 pb-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#2E2822] text-[#FAF7F2] rounded-tr-xs'
                    : 'bg-[#F2ECE0] text-[#1C1A17] border border-[#DFD3BE] rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[10px] text-[#A69886] mb-1 font-mono">
                  <span>{msg.role === 'user' ? 'You' : 'Inès Guillemet'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="font-sans whitespace-pre-wrap">{msg.text}</p>

                {msg.role === 'assistant' && msg.audioBase64 && (
                  <div className="mt-2 pt-2 border-t border-[#DECFC0] flex items-center gap-2">
                    <button
                      onClick={() => onPlayMessageAudio(msg.audioBase64!)}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#E4D8C4] hover:bg-[#D9CCB7] text-[#2C2620] text-[10px] font-medium transition-colors"
                    >
                      <Volume2 className="w-3 h-3 text-[#C5A880]" />
                      <span>Replay Voice</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {state === 'processing' && (
            <div className="flex items-start">
              <div className="bg-[#F2ECE0] border border-[#DFD3BE] rounded-2xl px-4 py-3 text-xs text-[#6B5E50] rounded-tl-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-bounce" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
                <span className="ml-1 text-[11px] font-serif italic">
                  Inès is composing a spoken response…
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Inès in English, French, or Japanese…"
            className="flex-1 px-4 py-3 rounded-full bg-[#F3ECE0] border border-[#DFD3BE] focus:border-[#C5A880] focus:outline-hidden text-xs text-[#1C1A17] placeholder-[#948473] font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-3 rounded-full bg-[#1C1A17] hover:bg-[#2F2923] disabled:opacity-40 text-[#FAF7F2] text-xs font-medium tracking-wide uppercase transition-colors flex items-center gap-2 shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
