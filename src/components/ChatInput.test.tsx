import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
  const mockOnSend = jest.fn();
  const mockOnInputChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ChatInput onSend={mockOnSend} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles input changes', async () => {
    render(
      <ChatInput
        onInputChange={mockOnInputChange}
        onSend={mockOnSend}
      />
    );

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Hello');

    expect(mockOnInputChange).toHaveBeenCalledWith('Hello');
  });

  it('handles send button click', async () => {
    render(
      <ChatInput
        input="Hello"
        onSend={mockOnSend}
      />
    );

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(mockOnSend).toHaveBeenCalledWith('Hello');
  });

  it('disables input and button when loading', () => {
    render(
      <ChatInput
        isLoading={true}
        onSend={mockOnSend}
      />
    );

    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading placeholder when loading', () => {
    render(
      <ChatInput
        isLoading={true}
        onSend={mockOnSend}
      />
    );

    expect(screen.getByPlaceholderText('AI 正在回复...')).toBeInTheDocument();
  });

  it('handles Enter key press', async () => {
    render(
      <ChatInput
        onSend={mockOnSend}
        input="Hello"
      />
    );

    const input = screen.getByRole('textbox');

    // 模拟完整的键盘事件序列
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    fireEvent.keyUp(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnSend).toHaveBeenCalledWith('Hello');
  });

  it('does not send empty messages', async () => {
    render(
      <ChatInput
        input=""
        onSend={mockOnSend}
      />
    );

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(mockOnSend).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });
});