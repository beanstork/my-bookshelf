import { XMLParser } from 'fast-xml-parser';

const GOODREADS_USER_ID = '174446438';
const RSS_URL = `https://www.goodreads.com/review/list_rss/${GOODREADS_USER_ID}?shelf=%23all&per_page=200`;

const EXCLUSIVE_SHELVES = new Set(['read', 'currently-reading', 'to-read', 'dnf']);

function parseGoodreadsDate(dateStr) {
  if (!dateStr || dateStr === '') return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

function parseShelfAndGenres(userShelves) {
  if (!userShelves) return { shelf: 'read', genres: [] };
  const all = String(userShelves).split(',').map(s => s.trim()).filter(Boolean);
  const exclusive = all.find(s => EXCLUSIVE_SHELVES.has(s)) || 'read';
  const genres = all.filter(s => !EXCLUSIVE_SHELVES.has(s) && s !== 'audiobook' && s !== 'audible' && s !== 'kindle' && s !== 'favorites');
  return { shelf: exclusive, genres };
}

function parseTitle(rawTitle) {
  const byIndex = rawTitle.lastIndexOf(' by ');
  if (byIndex > 0 && byIndex > rawTitle.length / 2) {
    return rawTitle.substring(0, byIndex).trim();
  }
  return rawTitle.trim();
}

function itemToBook(item) {
  const userShelves = item.user_shelves || '';
  const { shelf, genres } = parseShelfAndGenres(userShelves);

  const bookNode = item.book || {};
  const pages = parseInt(bookNode.num_pages) || 0;
  const avgRating = parseFloat(item.average_rating) || 0;
  const userRating = parseInt(item.user_rating) || 0;
  const isbn = String(item.isbn || bookNode.isbn || '').replace(/[^0-9X]/gi, '');

  const cover =
    item.book_large_image_url ||
    item.book_medium_image_url ||
    item.book_image_url ||
    item.book_small_image_url ||
    '';

  return {
    id: String(item.book_id || ''),
    t: parseTitle(String(item.title || '')),
    a: String(item.author_name || ''),
    r: userRating,
    ar: Math.round(avgRating * 100) / 100,
    p: pages,
    y: String(item.book_published || bookNode.publication_year || ''),
    dr: parseGoodreadsDate(item.user_read_at),
    da: parseGoodreadsDate(item.user_date_added),
    s: shelf,
    g: genres,
    sn: '',
    si: 0,
    au: userShelves.includes('audiobook') || userShelves.includes('audible'),
    ki: userShelves.includes('kindle'),
    fav: userShelves.includes('favorites'),
    isbn,
    pub: String(bookNode.publisher || ''),
    bind: String(bookNode.binding || ''),
    rev: String(item.user_review || ''),
    cover,
  };
}

export default async function handler(req, res) {
  try {
    const response = await fetch(RSS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bookshelf-app/1.0)' },
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Goodreads returned ${response.status}` });
    }

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      isArray: (name) => name === 'item',
    });

    const parsed = parser.parse(xml);
    const items = parsed?.rss?.channel?.item || [];

    const books = items
      .map(itemToBook)
      .filter(b => b.id && b.t);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json(books);
  } catch (err) {
    console.error('Goodreads fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch Goodreads data' });
  }
}
