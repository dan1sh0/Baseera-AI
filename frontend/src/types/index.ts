export interface Reference {
  type: 'quran' | 'hadith';
  citation: string;
  arabic: string;
  english: string;
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

export interface DailyReminder {
  arabic: string
  english: string
  source: string
}

export interface User {
  name?: string
  email?: string
  image?: string
}

export interface SearchResult {
  id: number
  surah_number: number
  verse_number: number
  arabic: string
  english: string
  surah_name: string
} 