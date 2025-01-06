'use client';

import React from 'react';

interface TableBlockProps {
  children: React.ReactNode;
}

export const TableBlock: React.FC<TableBlockProps> = ({ children }) => (
  <div className="overflow-x-auto my-4">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      {children}
    </table>
  </div>
);