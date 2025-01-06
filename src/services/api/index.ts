import { WebSocketService } from './websocket';
import { chatApi } from './chat';

export const api = {
  chat: chatApi,
  ws: WebSocketService.getInstance(),
};

export type { WebSocketService };