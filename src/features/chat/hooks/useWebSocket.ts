import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { Message } from '@/types/message';
import { BotType } from '@/types/bot';

export function useWebSocket(onMessage: (message: Message) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const connect = useCallback(async (botType?: BotType) => {
    const socket = await api.ws.connect(botType);

    socket.on('connect', () => {
      setIsConnected(true);
      setIsReconnecting(false);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('message', (message: Message) => {
      onMessage(message);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
  }, [onMessage]);

  const reconnect = useCallback(async () => {
    setIsReconnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error('Reconnection failed:', error);
    } finally {
      setIsReconnecting(false);
    }
  }, [connect]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      cleanup.then(cleanupFn => cleanupFn());
      api.ws.disconnect();
    };
  }, [connect]);

  return {
    isConnected,
    isReconnecting,
    reconnect
  };
}