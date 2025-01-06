'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Message } from '@/types/message';
import { BotType } from '@/types/bot';
import { useChat, useWebSocket } from '../../hooks';
import { ChatHeader } from '@/components/ChatHeader';

import { ChatMessage } from '@/components/ChatMessage';
import { ScrollToBottomButton } from '@/components/ScrollToBottomButton';
import { ChatInput } from '@/components/ChatInput';


export const ChatInterface: React.FC = () => {
  const {
    messages,
    isLoading,
    isLoadingHistory,
    hasMoreMessages,
    sendMessage,
    loadMoreMessages,
    clearMessages
  } = useChat();

  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleMessage = (message: Message) => {
    // 处理新消息
  };

  const { isConnected, isReconnecting, reconnect } = useWebSocket(handleMessage);

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    if (container.scrollTop === 0) {
      loadMoreMessages();
    }

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setIsAtBottom(isNearBottom);
    setShouldScrollToBottom(isNearBottom);
  };

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleCopy = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
    }
  }, [messages, shouldScrollToBottom]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <ChatHeader
        currentBot={BotType.CHAT}
        isConnected={isConnected}
        isReconnecting={isReconnecting}
        isDarkMode={isDarkMode}
        onBotChange={() => {}}
        onClearChat={clearMessages}
        onReconnect={reconnect}
        onToggleDarkMode={toggleDarkMode}
      />

      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLoading={isLoading}
            onResend={() => {}}
            onCopy={handleCopy}
            copiedMessageId={copiedMessageId}
            onImageLoad={scrollToBottom}
          />
        ))}
      </div>

      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
      />

      <ScrollToBottomButton
        onClick={scrollToBottom}
        show={!isAtBottom && messages.length > 0}
      />
    </div>
  );
};