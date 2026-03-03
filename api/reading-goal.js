const GOODREADS_USER_ID = '174446438';
const PROFILE_URL = `https://www.goodreads.com/user/show/${GOODREADS_USER_ID}`;

export default async function handler(req, res) {
  try {
    const response = await fetch(PROFILE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Goodreads returned ${response.status}` });
    }

    const html = await response.text();
    const year = new Date().getFullYear();

    // Try multiple HTML patterns Goodreads has used for reading challenge goal
    const patterns = [
      /(\d+)\s*book reading challenge/i,
      /reading challenge.*?(\d+)\s*book/i,
      /goal.*?(\d+)\s*book/i,
      /"readingChallengeGoal"[^>]*>(\d+)/i,
      /challenge-goal[^>]*>(\d+)/i,
      /(\d+)\s*of\s*\d+\s*books/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        const goal = parseInt(match[1]);
        if (goal > 0 && goal < 10000) { // sanity check
          res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
          return res.status(200).json({ year, goal });
        }
      }
    }

    // No challenge found — return null goal so UI falls back to manual entry
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({ year, goal: null });

  } catch (err) {
    console.error('Reading goal fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch reading goal' });
  }
}
