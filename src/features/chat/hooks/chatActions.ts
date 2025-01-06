import { Message } from '@/types/message';

export type ChatAction =
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'PREPEND_MESSAGES'; payload: Message[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOADING_HISTORY'; payload: boolean }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'CLEAR_MESSAGES' };