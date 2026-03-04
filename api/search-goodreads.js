export default async function handler(req, res) {
  const { title, author } = req.query;
  if (!title) return res.status(400).json({ error: 'title required' });

  const query = [title, author].filter(Boolean).join(' ');
  const url = `https://www.goodreads.com/search?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      return res.status(404).json({ error: 'Goodreads search failed' });
    }

    const html = await response.text();

    // Goodreads book links look like /book/show/12345-book-title or /book/show/12345
    const match = html.match(/\/book\/show\/(\d+)/);
    if (match) {
      return res.status(200).json({ id: match[1] });
    }

    return res.status(404).json({ error: 'not found' });
  } catch (err) {
    return res.status(500).json({ error: 'search failed' });
  }
}
