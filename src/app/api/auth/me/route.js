import { getUserFromRequest } from '../../../../server/auth/session';

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return Response.json({ user: null }, { status: 200 });
    }

    return Response.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API /api/auth/me error:', error);
    return Response.json({ user: null }, { status: 500 });
  }
}

