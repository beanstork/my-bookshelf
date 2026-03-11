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

    // Try JSON-LD structured data first (most reliable for metadata)
    let ldData = null;
    const ldMatches = html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    for (const m of ldMatches) {
      try {
        const parsed = JSON.parse(m[1]);
        if (parsed['@type'] === 'Book' || parsed?.mainEntity?.['@type'] === 'Book') {
          ldData = parsed['@type'] === 'Book' ? parsed : parsed.mainEntity;
          break;
        }
      } catch {}
    }

    const title = ldData?.name
      || html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)?.[1]
      || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/i)?.[1]
      || '';

    const rawAuthor = ldData?.author?.name
      || (Array.isArray(ldData?.author) ? ldData.author[0]?.name : null)
      || html.match(/<meta[^>]+property="og:book:author"[^>]+content="([^"]+)"/i)?.[1]
      || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:book:author"/i)?.[1]
      || '';

    const pages = parseInt(ldData?.numberOfPages) || 0;
    const year = ldData?.datePublished ? String(ldData.datePublished).slice(0, 4) : '';
    const isbn = ldData?.isbn || '';

    const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)
      || html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i);
    const cover = (ogMatch?.[1] && !ogMatch[1].includes('nocover')) ? ogMatch[1] : '';

    return res.status(200).json({
      title: title.trim(),
      author: rawAuthor.trim(),
      pages,
      year,
      isbn,
      cover,
    });
  } catch {
    return res.status(500).json({ error: 'fetch failed' });
  }
}
