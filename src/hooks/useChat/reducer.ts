import { ChatState } from '@/types/message';
import { ChatAction } from './actions';

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };

    case 'PREPEND_MESSAGES':
      return { ...state, messages: [...action.payload, ...state.messages] };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_LOADING_HISTORY':
      return { ...state, isLoadingHistory: action.payload };

    case 'SET_HAS_MORE':
      return { ...state, hasMoreMessages: action.payload };

    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };

    default:
      return state;
  }
}