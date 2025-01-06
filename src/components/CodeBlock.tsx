import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import copy from 'copy-to-clipboard';

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 px-2 py-1 text-xs rounded bg-gray-700 text-gray-200
                 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        {copied ? '已复制!' : '复制'}
      </button>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          padding: '1rem',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;