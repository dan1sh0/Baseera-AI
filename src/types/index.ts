export interface Reference {
  type: 'quran' | 'hadith';
  citation: string;
  arabic: string;
  english: string;
}

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  references?: Reference[];
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export interface ChatMessageProps {
  message: string;
  isBot: boolean;
  references?: Reference[];
} 