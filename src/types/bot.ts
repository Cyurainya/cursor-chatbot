export enum BotType {
  CHAT = 'chat',
  CODE = 'code',
  ASSISTANT = 'assistant',
  KNOWLEDGE = "KNOWLEDGE",
  CUSTOMER_SERVICE = "CUSTOMER_SERVICE"
}

export interface Bot {
  id: BotType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}