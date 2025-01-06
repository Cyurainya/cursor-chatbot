import { io, Socket } from 'socket.io-client';
import { Message } from '@/types/message';

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket | null = null;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  async connect(botType?: string): Promise<Socket> {
    if (!this.socket) {
      await fetch('/api/socket');

      this.socket = io({
        path: '/api/socket',
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        query: botType ? { botType } : undefined
      });
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}