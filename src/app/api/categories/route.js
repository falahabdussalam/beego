import { CATEGORIES_DATA } from '../../../server/data/categories';
import { query } from '../../../server/db/client';

export async function GET() {
  try {
    const dbRes = await query('SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC');
    if (dbRes.rows && dbRes.rows.length > 0) {
      return Response.json({ categories: dbRes.rows });
    }
  } catch (e) {
    // Fallback to static catalog data
  }

  return Response.json({ categories: CATEGORIES_DATA });
}

