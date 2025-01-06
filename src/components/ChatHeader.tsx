import { BotType } from '@/types/bot';
import BotSelector from './BotSelector';

interface ChatHeaderProps {
  currentBot: BotType;
  isConnected: boolean;
  isReconnecting: boolean;
  isDarkMode: boolean;
  onBotChange: (bot: BotType) => void;
  onClearChat: () => void;
  onReconnect: () => void;
  onToggleDarkMode: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentBot,
  isConnected,
  isReconnecting,
  isDarkMode,
  onBotChange,
  onClearChat,
  onReconnect,
  onToggleDarkMode,
}) => (
  <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
    <div className="max-w-4xl mx-auto px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-medium text-gray-800 dark:text-white">
            AI Chat
          </h1>
          <BotSelector currentBot={currentBot} onBotChange={onBotChange} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <button
              onClick={onClearChat}
              className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              清空记录
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              {!isConnected && (
                <button
                  onClick={onReconnect}
                  disabled={isReconnecting}
                  className="hover:text-blue-500 dark:hover:text-blue-400 disabled:opacity-50"
                >
                  {isReconnecting ? '重连中...' : '重新连接'}
                </button>
              )}
            </div>
          </div>
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
    </div>
  </div>
);