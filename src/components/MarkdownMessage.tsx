import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import Tooltip from './Tooltip';

interface MarkdownMessageProps {
  content: string;
  onImageLoad?: () => void;
}

// Markdown 组件配置
const markdownComponents = {
  // 代码块处理
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <CodeBlock
        language={match[1]}
        value={String(children).replace(/\n$/, '')}
      />
    ) : (
      <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
        {children}
      </code>
    );
  },

  // 段落处理（包含提示工具）
  p: ({ children }: { children: string }) => {
    if (typeof children === 'string') {
      const parts = children.split(/\*\*\{(\d+)\}&&([^*]+)\*\*/);
      if (parts.length > 1) {
        return (
          <p className="mb-4 last:mb-0">
            {parts.map((part, index) => {
              if (index % 3 === 0) return part;
              if (index % 3 === 2) return <Tooltip key={index} content={part} />;
              return null;
            })}
          </p>
        );
      }
    }
    return <p className="mb-4 last:mb-0">{children}</p>;
  },

  // 表格相关组件
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {children}
    </tbody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">{children}</tr>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 dark:text-gray-100">
      {children}
    </td>
  ),

  // 列表组件
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc ml-4 mb-4">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal ml-4 mb-4">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="mb-1">{children}</li>
  ),

  // 标题组件
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-2xl font-bold mb-4">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-bold mb-3">{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-bold mb-2">{children}</h3>
  ),

  // 引用块
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic">
      {children}
    </blockquote>
  ),
};

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownMessage;