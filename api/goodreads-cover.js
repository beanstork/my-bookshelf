export default async function handler(req, res) {
  const { url, id } = req.query;
  const pageUrl = url || (id ? `https://www.goodreads.com/book/show/${id}` : null);
  if (!pageUrl) return res.status(400).json({ error: 'url or id required' });

  try {
    const response = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) return res.status(404).json({ error: 'page not found' });

    const html = await response.text();

    // Try og:image first (most reliable)
    const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)
      || html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i);

    if (ogMatch && ogMatch[1] && !ogMatch[1].includes('nocover')) {
      return res.status(200).json({ cover: ogMatch[1] });
    }

    return res.status(404).json({ error: 'cover not found' });
  } catch {
    return res.status(500).json({ error: 'fetch failed' });
  }
}
