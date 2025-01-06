import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private static instance: WebSocketService;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  async connect() {
    if (!this.socket) {
      await fetch('/api/socket');

      this.socket = io({
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        this.startHeartbeat();
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        this.stopHeartbeat();
      });

      this.socket.on('pong', () => {
        console.log('Received pong from server');
      });
    }

    return this.socket;
  }

  private startHeartbeat() {
    this.stopHeartbeat(); // 清除可能存在的旧心跳
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.connected) {
        console.log('Sending ping to server');
        this.socket.emit('ping');
      }
    }, 30000); // 每30秒发送一次心跳
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default WebSocketService;