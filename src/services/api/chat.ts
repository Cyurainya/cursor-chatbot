import { Message } from '@/types/message';
import { WebSocketService } from './websocket';

export const chatApi = {
  // 获取历史消息
  async getHistory(before?: Date, limit: number = 10): Promise<{ messages: Message[]; hasMore: boolean }> {
    const response = await fetch(
      `/api/history?before=${before?.toISOString() || new Date().toISOString()}&limit=${limit}`
    );
    return response.json();
  },

  // 发送消息
  async sendMessage(message: Message): Promise<void> {
    const socket = WebSocketService.getInstance().getSocket();
    if (!socket) throw new Error('WebSocket not connected');

    return new Promise((resolve, reject) => {
      socket.emit('message', message, (error: any) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
};