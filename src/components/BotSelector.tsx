import { useState } from 'react';
import { ChatBubbleLeftRightIcon, BookOpenIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { BotType, Bot } from '@/types/bot';

const bots: Bot[] = [
  {
    id: BotType.CHAT,
    name: 'AI 助手',
    description: '智能聊天助手，可以回答各种问题',
    icon: ChatBubbleLeftRightIcon
  },
  {
    id: BotType.KNOWLEDGE,
    name: '知识库',
    description: '基于知识库的智能问答',
    icon: BookOpenIcon
  },
  {
    id: BotType.CUSTOMER_SERVICE,
    name: '人工客服',
    description: '专业的人工客服服务',
    icon: UserGroupIcon
  }
];

interface BotSelectorProps {
  currentBot: BotType;
  onBotChange: (bot: BotType) => void;
}

const BotSelector: React.FC<BotSelectorProps> = ({ currentBot, onBotChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentBotData = bots.find(bot => bot.id === currentBot)!;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
                 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
                 border border-gray-200 dark:border-gray-700
                 hover:bg-white/80 dark:hover:bg-gray-800/80
                 transition-colors duration-200"
      >
        <currentBotData.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="text-sm text-gray-800 dark:text-gray-200">{currentBotData.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {bots.map(bot => (
              <button
                key={bot.id}
                onClick={() => {
                  onBotChange(bot.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50
                          ${currentBot === bot.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
              >
                <bot.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {bot.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {bot.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BotSelector;