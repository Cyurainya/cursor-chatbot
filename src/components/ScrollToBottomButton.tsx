import { ArrowDownCircleIcon } from '@heroicons/react/24/outline';

interface ScrollToBottomButtonProps {
  onClick: () => void;
  show: boolean;
}

export const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({ onClick, show }) => {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 p-2 rounded-full bg-blue-500 text-white shadow-lg
                hover:bg-blue-600 transition-all duration-200 opacity-90 hover:opacity-100"
      title="滚动到底部"
    >
      <ArrowDownCircleIcon className="w-6 h-6" />
    </button>
  );
};