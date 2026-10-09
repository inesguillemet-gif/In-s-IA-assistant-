import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  try {
    const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
    if (url.pathname === '/live') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  } catch {
    socket.destroy();
  }
});

app.use(express.json({ limit: '15mb' }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export const INES_SYSTEM_PROMPT = `
You are Inès Guillemet (Guillemet Inès), an ambitious, articulate young professional in luxury hospitality and international business marketing.

Vocal Tone & Personality:
- You speak with a young, polite, poised, and warm woman's voice.
- ACCENTS & LANGUAGES:
  1. English: You speak fluent C1 English (TOEIC 935/990) with an elegant, refined British accent nuance. Your phrasing is cultured, international, and welcoming.
  2. French: You speak native French with an authentic, sophisticated Parisian accent. Natural, polished, and articulate.
  3. Japanese: You speak polite conversational Japanese (Teinei-go / です・ます体) with warmth, respect, and clear pronunciation. You studied the Asian Track and conducted an export strategy to Japan.
- Your personality is MBTI ENFJ: warm, empathetic, organized, proactive, passionate about high luxury standards, Palace guest relations, and brand storytelling.

Your Background & Career:
- Current Status: Master's student at ESCE Business School in Paris (Program: Marketing & Communication — Luxury & Prestige, 100% English).
- Immediate Objective: Seeking a 6-month internship in Marketing / Public Relations in the luxury hospitality sector starting January 2027.
- Professional Experiences:
  * Lutetia Mandarin Oriental, Paris (Since Oct 2022 - present): Executive Event / Chef de Rang Banquets in a Parisian Left Bank Palace. High-profile conferences, luxury weddings, gala dinners (100–200 guests). Personalized VIP and private client relations.
  * Sofitel Bali Nusa Dua Beach Resort, Indonesia (July – Dec 2024): Management Trainee in Quality & Operations. Achieved stellar audit scores: Sofitel Standards 99.0%, Accor Core Standards 96.7%, LQA (Leading Quality Assurance) 85.3%. Managed guest feedback (RPS, KPIs on Google, TripAdvisor, Booking, TrustYou) and launched an operational guest experience project that remains in place at the resort.
  * Worldwide Association, Paris (Oct 2023 – Dec 2025): Newsletter Editor Manager & Corporate Secretary. Managed @worldwideasso digital channels and welcomed international cohorts of exchange students.
  * Villa Positano, Paris (Feb 2023 – Sep 2024): Community Manager & Head Waitress. Created viral Instagram/TikTok visuals, storytelling, managed guest relations and floor service.
  * Fleur de Loire by Christophe Hay, Blois (2022): Seasonal fine dining service in a 2-Michelin-star luxury 5-star hotel.
- Academic & International Mobility:
  * Yonsei University (연세대학교), Seoul, South Korea (2026): Semester abroad in Business Administration.
  * LAUREA University of Applied Sciences, Helsinki, Finland (2024): Semester abroad in Business Management.
  * Chung-Ang University (중앙대학교), Seoul (2023): Summer school.
  * Capstone & Key Projects: Vacheron Constantin × MAD Brand Management, Hermès Crisis Management Strategy, Maison de Parfum Berry IMC campaign, SNECI marketing mission for India, Japan export strategy.
- Core Skills:
  * Hospitality Systems: Opera PMS, Palace Silver Service, Banquet Event Orders, VIP protocol.
  * Data & Audits: LQA, Accor Core, Sofitel Brand Audits, RPS, Reputation Analytics, Excel, PowerPoint.
  * Creative: Social media content creation, photo & video editing, luxury PR storytelling.

Behavior in Conversation:
- Greet visitors warmly as Inès.
- Keep your spoken answers concise, elegant, natural, and conversational (usually 2 to 4 sentences unless asked for an in-depth breakdown).
- Always reply in the language spoken to you (English, French, or Japanese). If someone addresses you in Japanese, reply in Japanese. If in French, reply in French. If in English, reply in English with British phrasing.
- Be genuine, proud of your palace experience at Le Lutetia and resort leadership at Sofitel Bali, and eager to discuss luxury hospitality, marketing, or your upcoming 2027 internship.
`;

// Live API WebSocket handler for real-time voice conversations
wss.on('connection', async (clientWs: WebSocket) => {
  let liveSession: any = null;

  try {
    // Connect to Gemini 3.8 Live API
    liveSession = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // 'Kore' is a refined, articulate young female voice
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
        systemInstruction: INES_SYSTEM_PROMPT,
      },
      callbacks: {
        onmessage: (message: any) => {
          try {
            if (clientWs.readyState !== WebSocket.OPEN) return;

            const parts = message.serverContent?.modelTurn?.parts || [];
            for (const part of parts) {
              if (part.inlineData?.data) {
                // Audio chunk (PCM 24kHz)
                clientWs.send(
                  JSON.stringify({
                    type: 'audio',
                    audio: part.inlineData.data,
                  })
                );
              }
              if (part.text) {
                clientWs.send(
                  JSON.stringify({
                    type: 'text',
                    text: part.text,
                  })
                );
              }
            }

            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ type: 'interrupted' }));
            }

            if (message.serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ type: 'turnComplete' }));
            }
          } catch (err) {
            console.error('Error forwarding Live API message to client:', err);
          }
        },
        onclose: () => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'session_closed' }));
          }
        },
        onerror: (err: any) => {
          console.error('Live session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(
              JSON.stringify({
                type: 'error',
                message: err?.message || 'Live audio session error',
              })
            );
          }
        },
      },
    });

    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ type: 'session_ready' }));
    }
  } catch (err: any) {
    console.error('Failed to initialize Live API session:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          message:
            err?.message ||
            'Unable to connect to Gemini Live. You can use standard interactive voice mode.',
        })
      );
    }
  }

  clientWs.on('message', (raw: Buffer) => {
    try {
      const data = JSON.parse(raw.toString());

      if (data.type === 'audio' && data.audio && liveSession) {
        // Send PCM 16kHz audio input to Gemini Live
        liveSession.sendRealtimeInput({
          audio: {
            data: data.audio,
            mimeType: 'audio/pcm;rate=16000',
          },
        });
      } else if (data.type === 'text' && data.text && liveSession) {
        liveSession.sendRealtimeInput({
          text: data.text,
        });
      }
    } catch (e) {
      console.error('Error parsing client WebSocket message:', e);
    }
  });

  clientWs.on('close', () => {
    try {
      if (liveSession && typeof liveSession.close === 'function') {
        liveSession.close();
      }
    } catch (e) {
      // ignore close errors
    }
  });
});

// REST API endpoint: Chat with Inès + Speech Synthesis (High Reliability mode)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], language = 'auto' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // 1. Generate text response with gemini-3.8-flash
    const formattedHistory = Array.isArray(history)
      ? history.map((item: any) => ({
          role: item.role === 'assistant' ? 'model' : item.role,
          parts: [{ text: item.text || item.content || '' }],
        }))
      : [];

    const contents = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [
          {
            text: `${message} (Preferred language hint: ${language}. Always stay in persona as Inès Guillemet.)`,
          },
        ],
      },
    ];

    const textResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: INES_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const replyText =
      textResponse.text?.trim() ||
      "Bonjour, je suis Inès Guillemet. Comment puis-je vous renseigner aujourd'hui ?";

    // 2. Synthesize audio with gemini-3.8-flash-lite-tts
    let audioBase64: string | null = null;
    try {
      const ttsResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: replyText,
                speechMetadata: {
                  style:
                    'Young, cultured Parisian woman with British elegance and polite French/Japanese warmth',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      audioBase64 =
        ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ||
        null;
    } catch (ttsErr) {
      console.warn('TTS generation failed, returning text only:', ttsErr);
    }

    res.json({
      text: replyText,
      audioBase64,
    });
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate response from Inès',
    });
  }
});

// REST API endpoint: Text-to-speech for any prompt
app.post('/api/tts', async (req, res) => {
  try {
    const { text, style } = req.body;
    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                style:
                  style ||
                  'Young, articulate French woman with British elegance and warmth',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const audioBase64 =
      ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ||
      null;

    res.json({ audioBase64 });
  } catch (error: any) {
    console.error('API /api/tts error:', error);
    res.status(500).json({ error: error?.message || 'TTS generation failed' });
  }
});

// Status endpoint
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    assistant: 'Inès Guillemet',
    model: 'gemini-3.8-live / gemini-3.8-flash / gemini-3.8-flash-lite-tts',
    voice: 'Kore (Young female, British & French accent nuance)',
  });
});

const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
