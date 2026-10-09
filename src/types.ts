export type AssistantState =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'speaking'
  | 'processing'
  | 'error';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioBase64?: string;
  language?: 'fr' | 'en' | 'ja';
}

export type SupportedLanguage = 'all' | 'fr' | 'en' | 'ja';
