interface ChatInputProps {
  input?: string;
  isLoading?: boolean;
  onInputChange?: (value: string) => void;
  onSend?: (content: string) => Promise<void>;
  onKeyPress?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isLoading,
  onInputChange,
  onSend,
  onKeyPress,
}) => (
  <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4">
    <div className="max-w-4xl mx-auto flex space-x-4">
      <textarea
        value={input}
        onChange={(e) => onInputChange?.(e.target.value)}
        onKeyPress={onKeyPress}
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
        onClick={() => onSend?.(input || '')}
        disabled={isLoading || !input?.trim()}
        className="rounded-xl bg-blue-500 px-6 py-2.5 text-white text-sm
                 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                 transition-colors duration-200 shadow-sm
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '发送中...' : '发送'}
      </button>
    </div>
  </div>
);