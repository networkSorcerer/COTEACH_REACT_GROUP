export async function fetchKoreanAdvice(options = {}) {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 8000;
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch('https://korean-advice-open-api.vercel.app/api/advice', {
      cache: 'no-store',
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Advice API error: ${res.status} ${text}`);
    }
    const data = await res.json()
    const text = data?.advice || data?.message || data?.text || data?.quote || '';
    const author = data?.author || data?.by || '';
    return { text, author };
  } finally {
    clearTimeout(id);
  }
}
