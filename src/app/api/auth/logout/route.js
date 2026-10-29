import { createLogoutCookie } from '../../../../server/auth/session';

export async function POST() {
  const logoutCookie = createLogoutCookie();
  return new Response(
    JSON.stringify({ success: true, message: 'Logged out successfully.' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': logoutCookie,
      },
    }
  );
}

