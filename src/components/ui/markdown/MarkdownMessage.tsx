'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { TableBlock } from './TableBlock';

interface MarkdownMessageProps {
  content: string;
  onImageLoad?: () => void;
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({
  content,
  onImageLoad
}) => {
  const components = React.useMemo(() => ({
    code: CodeBlock,
    table: TableBlock,
    img: ({ src, alt, ...props }: any) => (
      <img
        src={src}
        alt={alt}
        className="max-w-full rounded-lg"
        onLoad={onImageLoad}
        {...props}
      />
    ),
  }), [onImageLoad]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};