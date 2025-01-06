import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInterface } from './index';
import { useChat } from '../../hooks';
import { useWebSocket } from '../../hooks';

// Mock hooks
jest.mock('../../hooks', () => ({
  useChat: jest.fn(),
  useWebSocket: jest.fn(),
}));

describe('ChatInterface', () => {
  const mockMessages = [
    {
      id: '1',
      content: 'Hello',
      role: 'user',
      timestamp: new Date(),
    },
    {
      id: '2',
      content: 'Hi there!',
      role: 'assistant',
      timestamp: new Date(),
    },
  ];

  const mockUseChat = {
    messages: mockMessages,
    isLoading: false,
    isLoadingHistory: false,
    hasMoreMessages: true,
    sendMessage: jest.fn(),
    loadMoreMessages: jest.fn(),
    clearMessages: jest.fn(),
  };

  const mockUseWebSocket = {
    isConnected: true,
    isReconnecting: false,
    reconnect: jest.fn(),
  };

  beforeEach(() => {
    (useChat as jest.Mock).mockReturnValue(mockUseChat);
    (useWebSocket as jest.Mock).mockReturnValue(mockUseWebSocket);
  });

  it('renders correctly', () => {
    render(<ChatInterface />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('loads more messages on scroll to top', async () => {
    render(<ChatInterface />);

    const chatContainer = screen.getByRole('main');
    fireEvent.scroll(chatContainer, { target: { scrollTop: 0 } });

    await waitFor(() => {
      expect(mockUseChat.loadMoreMessages).toHaveBeenCalled();
    });
  });

  it('handles message sending', async () => {
    render(<ChatInterface />);

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /发送/i });

    await userEvent.type(input, 'New message');
    await userEvent.click(sendButton);

    expect(mockUseChat.sendMessage).toHaveBeenCalledWith('New message');
  });

  it('handles dark mode toggle', async () => {
    render(<ChatInterface />);

    const darkModeButton = screen.getByRole('button', { name: /切换主题/i });
    await userEvent.click(darkModeButton);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('handles reconnection', async () => {
    (useWebSocket as jest.Mock).mockReturnValue({
      ...mockUseWebSocket,
      isConnected: false,
    });

    render(<ChatInterface />);

    const reconnectButton = screen.getByRole('button', { name: /重新连接/i });
    await userEvent.click(reconnectButton);

    expect(mockUseWebSocket.reconnect).toHaveBeenCalled();
  });
});