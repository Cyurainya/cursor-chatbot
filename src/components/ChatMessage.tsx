import { ArrowPathIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import MarkdownMessage from './MarkdownMessage';
import { Message } from '@/types/message';

interface ChatMessageProps {
  message: Message;
  isLoading: boolean;
  copiedMessageId: string | null;
  onResend: (message: Message) => void;
  onCopy: (content: string, messageId: string) => void;
  onImageLoad: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLoading,
  copiedMessageId,
  onResend,
  onCopy,
  onImageLoad
}) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
        message.role === 'user'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 dark:bg-gray-800 dark:text-white'
      } shadow-sm relative group`}
    >
      {message.role === 'assistant' ? (
        <div className="prose dark:prose-invert prose-sm max-w-none">
          <MarkdownMessage content={message.content} onImageLoad={onImageLoad} />
        </div>
      ) : (
        <>
          <p className="text-sm">{message.content}</p>
          <div className="absolute right-0 top-full mt-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onResend(message)}
              disabled={isLoading}
              className="p-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                       text-gray-600 dark:text-gray-300 transition-colors"
              title="重新发送"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onCopy(message.content, message.id)}
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
);