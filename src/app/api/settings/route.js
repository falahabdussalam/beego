import { getSettings, updateSettings } from '../../../server/data/settings';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSettings();
    return Response.json({ settings });
  } catch (err) {
    console.error('Settings GET error:', err);
    return Response.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const updated = await updateSettings(body);

    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      // Ignored
    }

    return Response.json({ success: true, settings: updated });
  } catch (err) {
    console.error('Settings PUT error:', err);
    return Response.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

