import { z } from 'zod';
import { query, getMemoryStore } from '../../../../server/db/client';
import { hashPassword, signToken, createSessionCookie } from '../../../../server/auth/session';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = parsed.data;
    const formattedPhone = `+91 ${phone}`;

    // Check if user already exists
    const existing = await query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2',
      [email.toLowerCase(), formattedPhone]
    );

    if (existing.rows && existing.rows.length > 0) {
      return Response.json(
        { error: 'An account with this email or phone number already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const userId = crypto.randomUUID();

    // Insert user into DB
    try {
      await query(
        `INSERT INTO users (id, name, email, phone, role, password_hash)
         VALUES ($1, $2, $3, $4, 'customer', $5)`,
        [userId, name, email.toLowerCase(), formattedPhone, passwordHash]
      );
    } catch (dbErr) {
      // Memory store fallback if PG is not active
      const memStore = getMemoryStore();
      const existingMem = memStore.users.find(
        (u) => u.email === email.toLowerCase() || u.phone === formattedPhone
      );
      if (existingMem) {
        return Response.json(
          { error: 'An account with this email or phone number already exists.' },
          { status: 409 }
        );
      }
      memStore.users.push({
        id: userId,
        name,
        email: email.toLowerCase(),
        phone: formattedPhone,
        role: 'customer',
        password_hash: passwordHash,
        is_active: true,
      });
    }

    // Generate JWT token
    const token = signToken({
      id: userId,
      email: email.toLowerCase(),
      name,
      role: 'customer',
      phone: formattedPhone,
    });

    const cookieHeader = createSessionCookie(token);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Registration successful! Welcome to BeeGo Delivery.',
        user: {
          id: userId,
          name,
          email: email.toLowerCase(),
          phone: formattedPhone,
          role: 'customer',
        },
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookieHeader,
        },
      }
    );
  } catch (error) {
    console.error('Registration route error:', error);
    return Response.json(
      { error: 'Internal server error while creating account.' },
      { status: 500 }
    );
  }
}

