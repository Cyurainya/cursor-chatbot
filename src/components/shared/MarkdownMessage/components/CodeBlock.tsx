import { useState } from 'react';
import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import copy from 'copy-to-clipboard';

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    copy(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
        {children}
      </code>
    );
  }

  return (
    <div className="relative group">
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className={className}>{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-lg
                 bg-gray-200 dark:bg-gray-700 opacity-0 group-hover:opacity-100
                 transition-opacity duration-200"
        title={copied ? "已复制" : "复制代码"}
      >
        {copied ? (
          <CheckIcon className="w-5 h-5 text-green-500" />
        ) : (
          <ClipboardIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>
    </div>
  );
};