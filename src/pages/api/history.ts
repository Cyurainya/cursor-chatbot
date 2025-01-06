import type { NextApiRequest, NextApiResponse } from 'next';
import { Message } from '@/types/message';

// 模拟历史消息数据库
const historyMessages: Message[] = Array.from({ length: 50 }, (_, index) => ({
  id: (Date.now() - (50 - index) * 60000).toString(),
  content: `这是第 ${50 - index} 条历史消息`,
  role: index % 2 === 0 ? 'user' : 'assistant',
  timestamp: new Date(Date.now() - (50 - index) * 60000),
}));

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ messages: Message[]; hasMore: boolean }>
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { before, limit = 10 } = req.query;
  const beforeTimestamp = before ? new Date(before as string).getTime() : Date.now();

  const messages = historyMessages
    .filter(msg => new Date(msg.timestamp).getTime() < beforeTimestamp)
    .slice(0, Number(limit));

  const hasMore = historyMessages.some(
    msg => new Date(msg.timestamp).getTime() < messages[messages.length - 1]?.timestamp.getTime()
  );

  res.status(200).json({ messages, hasMore });
}