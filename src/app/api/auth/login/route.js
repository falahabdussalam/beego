import { z } from 'zod';
import { query, getMemoryStore } from '../../../../server/db/client';
import { comparePassword, signToken, createSessionCookie } from '../../../../server/auth/session';

const LoginSchema = z.object({
  identifier: z.string().min(1, 'Please enter your registered email or phone'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid login details', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { identifier, password } = parsed.data;
    const cleanId = identifier.trim().toLowerCase();

    // Look up user by email or phone
    let user = null;
    const res = await query(
      'SELECT id, name, email, phone, role, password_hash, is_active FROM users WHERE email = $1 OR phone = $1',
      [cleanId]
    );

    if (res.rows && res.rows.length > 0) {
      user = res.rows[0];
    } else {
      // Memory store fallback
      const mem = getMemoryStore();
      user = mem.users.find(
        (u) => u.email.toLowerCase() === cleanId || (u.phone && u.phone.includes(cleanId))
      );
    }

    if (!user) {
      return Response.json(
        { error: 'Invalid email/phone or password.' },
        { status: 401 }
      );
    }

    if (!user.is_active && user.is_active !== undefined) {
      return Response.json(
        { error: 'Your account has been deactivated. Please contact BeeGo support.' },
        { status: 403 }
      );
    }

    // Verify password hash
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return Response.json(
        { error: 'Invalid email/phone or password.' },
        { status: 401 }
      );
    }

    // Create session token
    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    });

    const cookieHeader = createSessionCookie(token);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Welcome back, ${user.name}!`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookieHeader,
        },
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    return Response.json({ error: 'Internal login error' }, { status: 500 });
  }
}

