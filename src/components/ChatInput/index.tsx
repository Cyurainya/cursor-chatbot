'use client';

import React, { useState, useRef } from 'react';

interface ChatInputProps {
  onSend: (content: string) => Promise<void> | void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    await onSend(input.trim());
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto flex gap-4">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500/50
                   bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
                   text-sm text-gray-800 dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500
                   disabled:opacity-50 disabled:cursor-not-allowed
                   p-3 min-h-[42px] max-h-32"
          placeholder={isLoading ? "AI 正在回复..." : "输入消息... (Shift + Enter 换行)"}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="rounded-xl bg-blue-500 px-6 py-2 text-white text-sm
                   hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                   transition-colors duration-200 shadow-sm
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  );
};