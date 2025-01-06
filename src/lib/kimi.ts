const KIMI_API_KEY = process.env.KIMI_API_KEY || '';
const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

export async function chatWithKimi(messages: { role: string; content: string }[]) {
  const response = await fetch(KIMI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KIMI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'moonshot-v1-8k',
      messages,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}