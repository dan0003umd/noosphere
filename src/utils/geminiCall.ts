import { GROQ_API_KEY, GROQ_ENDPOINT, GROQ_MODEL } from '../config/apiConfig';

export async function callAI(prompt: string): Promise<string> {
  const attemptFetch = async () => {
    const res = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1024
      })
    });
    if (res.status === 429) throw new Error('RATE_LIMIT');
    if (!res.ok) throw new Error(`API_ERROR: ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? 'No response';
  };

  try {
    return await attemptFetch();
  } catch (e: any) {
    if (e.message === 'RATE_LIMIT') {
      await new Promise(r => setTimeout(r, 3000));
      return await attemptFetch();
    }
    throw e;
  }
}
