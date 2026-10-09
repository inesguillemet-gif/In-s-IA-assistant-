import { useState, useRef, useCallback, useEffect } from 'react';
import { AssistantState, ChatMessage } from '../types';
import { LiveAudioPlayer, LiveMicrophoneRecorder } from '../utils/audio';

export function useLiveVoice() {
  const [state, setState] = useState<AssistantState>('idle');
  const [isLiveActive, setIsLiveActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: "Bonjour ! Je suis Inès Guillemet. Étudiante en Master en International Business et Luxe, je suis ravie d'échanger avec vous sur mon parcours au Lutetia, au Sofitel Bali et mes projets à l'international.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const playerRef = useRef<LiveAudioPlayer | null>(null);
  const recorderRef = useRef<LiveMicrophoneRecorder | null>(null);
  const currentAssistantMsgRef = useRef<string>('');

  // Initialize audio player
  useEffect(() => {
    playerRef.current = new LiveAudioPlayer();
    return () => {
      stopLiveSession();
    };
  }, []);

  // Update analyser when player or recorder becomes active
  const checkAnalyser = useCallback(() => {
    if (state === 'speaking' && playerRef.current) {
      setAnalyser(playerRef.current.getAnalyser());
    } else if (state === 'listening' && recorderRef.current) {
      setAnalyser(recorderRef.current.getAnalyser());
    }
  }, [state]);

  useEffect(() => {
    checkAnalyser();
  }, [state, checkAnalyser]);

  const stopLiveSession = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    if (playerRef.current) {
      playerRef.current.stop();
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsLiveActive(false);
    setState('idle');
    setAnalyser(null);
  }, []);

  const startLiveSession = useCallback(async () => {
    try {
      setErrorMessage(null);
      setState('connecting');

      // 1. Establish WebSocket connection to backend
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const player = playerRef.current || new LiveAudioPlayer();
      playerRef.current = player;
      player.init();

      ws.onopen = async () => {
        setIsLiveActive(true);
        setState('listening');

        // Start microphone recording
        try {
          const recorder = new LiveMicrophoneRecorder();
          recorderRef.current = recorder;

          await recorder.start(
            (base64Audio) => {
              if (ws.readyState === WebSocket.OPEN && !isMuted) {
                ws.send(JSON.stringify({ type: 'audio', audio: base64Audio }));
              }
            },
            (micAnalyser) => {
              setAnalyser(micAnalyser);
            }
          );
        } catch (micErr: any) {
          console.warn('Microphone permission denied or failed:', micErr);
          setErrorMessage(
            'Microphone access was denied. You can still speak via text or click prompts below.'
          );
          setState('idle');
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'session_ready') {
            setState('listening');
          } else if (msg.type === 'audio' && msg.audio) {
            setState('speaking');
            player.playChunk(msg.audio);
            setAnalyser(player.getAnalyser());
          } else if (msg.type === 'text' && msg.text) {
            currentAssistantMsgRef.current += msg.text;
          } else if (msg.type === 'interrupted') {
            player.stop();
            setState('listening');
            currentAssistantMsgRef.current = '';
          } else if (msg.type === 'turnComplete') {
            if (currentAssistantMsgRef.current.trim()) {
              const fullText = currentAssistantMsgRef.current.trim();
              setMessages((prev) => [
                ...prev,
                {
                  id: String(Date.now()),
                  role: 'assistant',
                  text: fullText,
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                },
              ]);
              currentAssistantMsgRef.current = '';
            }
            setState('listening');
          } else if (msg.type === 'error') {
            console.error('Live WS error:', msg.message);
            setErrorMessage(msg.message);
            setState('idle');
          }
        } catch (e) {
          console.error('Error handling WebSocket message:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket connection error:', e);
        setErrorMessage(
          'Could not connect to Live Audio WebSocket. Using high-fidelity interactive mode.'
        );
        stopLiveSession();
      };

      ws.onclose = () => {
        setIsLiveActive(false);
        setState('idle');
      };
    } catch (err: any) {
      console.error('Failed to start Live Voice session:', err);
      setErrorMessage(err?.message || 'Failed to initiate voice session');
      stopLiveSession();
    }
  }, [isMuted, stopLiveSession]);

  const toggleLiveVoice = useCallback(() => {
    if (isLiveActive) {
      stopLiveSession();
    } else {
      startLiveSession();
    }
  }, [isLiveActive, startLiveSession, stopLiveSession]);

  // Send interactive message (supports text input or clicking preset prompts)
  const sendMessage = useCallback(
    async (text: string, language: 'auto' | 'fr' | 'en' | 'ja' = 'auto') => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = {
        id: String(Date.now()),
        role: 'user',
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setState('processing');

      // If Live API session is active, we can send text directly to live session
      if (isLiveActive && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'text', text }));
        return;
      }

      // Otherwise, call reliable /api/chat with Gemini 3.8 Flash + TTS
      try {
        const historyPayload = messages.slice(-6).map((m) => ({
          role: m.role,
          content: m.text,
        }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: historyPayload,
            language,
          }),
        });

        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }

        const data = await res.json();
        const assistantText = data.text;
        const audioBase64 = data.audioBase64;

        const assistantMsg: ChatMessage = {
          id: String(Date.now() + 1),
          role: 'assistant',
          text: assistantText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          audioBase64,
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Play audio if available
        if (audioBase64) {
          setState('speaking');
          const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
          audio.onended = () => {
            setState('idle');
          };
          audio.onerror = () => {
            setState('idle');
          };
          await audio.play();
        } else {
          setState('idle');
        }
      } catch (err: any) {
        console.error('Chat error:', err);
        setErrorMessage('Unable to reach Inès assistant. Please try again.');
        setState('idle');
      }
    },
    [isLiveActive, messages]
  );

  // Play standalone audio from a message
  const playMessageAudio = useCallback(async (audioBase64: string) => {
    try {
      setState('speaking');
      const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
      audio.onended = () => setState('idle');
      audio.onerror = () => setState('idle');
      await audio.play();
    } catch (e) {
      console.warn('Playback error:', e);
      setState('idle');
    }
  }, []);

  return {
    state,
    isLiveActive,
    isMuted,
    setIsMuted,
    messages,
    analyser,
    errorMessage,
    setErrorMessage,
    toggleLiveVoice,
    sendMessage,
    playMessageAudio,
    stopLiveSession,
  };
}
