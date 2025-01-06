import React, { useState, useRef, useEffect } from 'react';
import WebSocketService from '@/services/websocket';
import Navbar from './Navbar';
import MarkdownMessage from './MarkdownMessage';
import { ArrowPathIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import copy from 'copy-to-clipboard';
import BotSelector from './BotSelector';
import { BotType } from '@/types/bot';
import { ScrollToBottomButton } from './ScrollToBottomButton';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const STORAGE_KEY = 'chat_messages';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsService = WebSocketService.getInstance();
  const [isLoading, setIsLoading] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [currentBot, setCurrentBot] = useState<BotType>(BotType.CHAT);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [initialScrollHeight, setInitialScrollHeight] = useState<number>(0);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const initSocket = async () => {
      const socket = await wsService.connect();

      socket.on('connect', () => {
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('message', (message: Message) => {
        setMessages(prev => [...prev, message]);
        setIsLoading(false);
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
        setIsLoading(false);
      });
    };

    initSocket();

    return () => {
      wsService.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
    }
  }, [messages, shouldScrollToBottom]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    const socket = wsService.getSocket();
    if (socket) {
      setIsLoading(true);
      setShouldScrollToBottom(true);
      socket.emit('message', newMessage);
      setMessages(prev => [...prev, newMessage]);
      setInput('');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newValue;
    });
  };

  const handleReconnect = async () => {
    setIsReconnecting(true);
    try {
      const socket = await wsService.connect();
      if (socket) {
        console.log('Manual reconnection successful');
      }
    } catch (error) {
      console.error('Reconnection failed:', error);
    } finally {
      setIsReconnecting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 阻止默认的换行行为
      handleSend();
    }
  };

  const handleResend = (message: Message) => {
    if (isLoading) return;

    const socket = wsService.getSocket();
    if (socket) {
      setIsLoading(true);
      socket.emit('message', message);
    }
  };

  const handleCopy = (content: string, messageId: string) => {
    copy(content);
    setCopiedMessageId(messageId);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000); // 2秒后恢复原始图标
  };

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleBotChange = (bot: BotType) => {
    setCurrentBot(bot);
    // 可以在这里清除聊天记录或执行其他初始化操作
  };

  // 加载历史消息
  const loadMoreMessages = async () => {
    if (isLoadingHistory || !hasMoreMessages) return;

    setIsLoadingHistory(true);
    setShouldScrollToBottom(false);
    try {
      const oldestMessage = messages[0];
      const response = await fetch(
        `/api/history?before=${oldestMessage?.timestamp || new Date()}&limit=10`
      );
      const data = await response.json();

      if (data.messages.length > 0) {
        // 保存当前滚动高度
        const scrollContainer = chatContainerRef.current;
        const previousScrollHeight = scrollContainer?.scrollHeight || 0;

        setMessages(prev => [...data.messages, ...prev]);
        setHasMoreMessages(data.hasMore);

        // 保持滚动位置
        if (scrollContainer) {
          const newScrollHeight = scrollContainer.scrollHeight;
          scrollContainer.scrollTop = newScrollHeight - previousScrollHeight;
        }
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // 监听滚动事件
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    if (container.scrollTop === 0) {
      loadMoreMessages();
    }

    // 检查是否在底部
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setIsAtBottom(isNearBottom);
    setShouldScrollToBottom(isNearBottom);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Unified Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-medium text-gray-800 dark:text-white">
                AI Chat
              </h1>
              <BotSelector
                currentBot={currentBot}
                onBotChange={handleBotChange}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <button
                  onClick={handleClearChat}
                  className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  清空记录
                </button>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  {!isConnected && (
                    <button
                      onClick={handleReconnect}
                      disabled={isReconnecting}
                      className="hover:text-blue-500 dark:hover:text-blue-400 disabled:opacity-50"
                    >
                      {isReconnecting ? '重连中...' : '重新连接'}
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 mt-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
      >
        {/* Loading history indicator */}
        {isLoadingHistory && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span>加载历史消息...</span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 dark:text-white'
                } shadow-sm relative group`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose dark:prose-invert prose-sm max-w-none">
                    <MarkdownMessage
                      content={message.content}
                      onImageLoad={scrollToBottom}
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-sm">{message.content}</p>
                    {/* 用户消息的操作按钮 */}
                    <div className="absolute right-0 top-full mt-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleResend(message)}
                        disabled={isLoading}
                        className="p-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                                 text-gray-600 dark:text-gray-300 transition-colors"
                        title="重新发送"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className={`p-1 rounded transition-all duration-200 ${
                          copiedMessageId === message.id
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                        title={copiedMessageId === message.id ? "已复制" : "复制"}
                      >
                        {copiedMessageId === message.id ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <ClipboardIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </>
                )}
                <span className="text-xs opacity-50 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 animate-pulse">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4">
        <div className="max-w-4xl mx-auto flex space-x-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            rows={1}
            className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
                     text-sm text-gray-800 dark:text-white
                     placeholder-gray-400 dark:placeholder-gray-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     resize-none min-h-[42px] max-h-32 overflow-y-auto"
            placeholder={isLoading ? "AI 正在回复..." : "输入消息... (Shift + Enter 换行)"}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="rounded-xl bg-blue-500 px-6 py-2.5 text-white text-sm
                     hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     transition-colors duration-200 shadow-sm
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
      </div>

      <ScrollToBottomButton
        onClick={scrollToBottom}
        show={!isAtBottom && messages.length > 0}
      />
    </div>
  );
};

export default ChatInterface;