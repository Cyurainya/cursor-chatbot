import { Message } from '@/types/message';

const STORAGE_KEY = 'chat_messages';

export const storage = {
  getMessages(): Message[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  saveMessages(messages: Message[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  },

  clearMessages(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
};