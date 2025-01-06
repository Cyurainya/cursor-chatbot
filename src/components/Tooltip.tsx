import { useState } from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';

interface TooltipProps {
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="inline-block relative">
      <span
        className="inline-flex items-center justify-center cursor-help align-middle"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <BookOpenIcon className="w-4 h-4 text-blue-500 hover:text-blue-600 transition-colors" />
      </span>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs z-50">
          <div className="bg-black/75 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 shadow-lg">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-black/75" />
            </div>
          </div>
        </div>
      )}
    </span>
  );
};

export default Tooltip;