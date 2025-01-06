import { useReducer, useCallback, useEffect } from 'react';
import { Message, ChatState } from '@/types/message';
import { api } from '@/services/api';
import { storage } from '@/services/storage';
import { chatReducer } from './reducer';
import { Socket } from 'socket.io-client';

const initialState: ChatState = {
  messages: storage.getMessages(),
  isLoading: false,
  isLoadingHistory: false,
  hasMoreMessages: true
};

export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // 加载历史消息
  const loadMoreMessages = useCallback(async (before?: Date) => {
    if (state.isLoadingHistory || !state.hasMoreMessages) return;

    dispatch({ type: 'SET_LOADING_HISTORY', payload: true });
    try {
      const { messages, hasMore } = await api.chat.getHistory(before);
      dispatch({ type: 'PREPEND_MESSAGES', payload: messages });
      dispatch({ type: 'SET_HAS_MORE', payload: hasMore });
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      dispatch({ type: 'SET_LOADING_HISTORY', payload: false });
    }
  }, [state.isLoadingHistory, state.hasMoreMessages]);

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    const message: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await api.chat.sendMessage(message);
      dispatch({ type: 'ADD_MESSAGE', payload: message });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [state.isLoading]);

  // 清除消息
  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    storage.clearMessages();
  }, []);

  // 保存消息到本地存储
  useEffect(() => {
    storage.saveMessages(state.messages);
  }, [state.messages]);

  return {
    ...state,
    sendMessage,
    loadMoreMessages,
    clearMessages,
  };
}