import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query, getMemoryStore } from '../db/client.js';

const JWT_SECRET = process.env.JWT_SECRET || 'beego_default_secret_key_change_in_production_32chars';
const COOKIE_NAME = 'beego_session';

/**
 * Generate a signed JWT token
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(plaintext) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plaintext, salt);
}

/**
 * Compare password with hash
 */
export async function comparePassword(plaintext, hash) {
  return bcrypt.compare(plaintext, hash);
}

/**
 * Extract authenticated user session from Next.js Request (Headers/Cookies)
 */
export async function getUserFromRequest(request) {
  try {
    // 1. Try reading cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((c) => {
        const [k, ...v] = c.split('=');
        return [k, decodeURIComponent(v.join('='))];
      })
    );

    let token = cookies[COOKIE_NAME];

    // 2. Fallback to Authorization Bearer header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return null;
    }

    // Lookup user in DB to verify current active status
    const dbRes = await query('SELECT id, email, name, phone, role, is_active FROM users WHERE id = $1', [decoded.id]);
    if (dbRes.rows && dbRes.rows.length > 0) {
      const user = dbRes.rows[0];
      if (!user.is_active) return null;
      return user;
    }

    // In memory store fallback
    const memUser = getMemoryStore().users.find((u) => u.id === decoded.id);
    if (memUser) {
      return {
        id: memUser.id,
        email: memUser.email,
        name: memUser.name,
        phone: memUser.phone,
        role: memUser.role,
        is_active: true,
      };
    }

    return null;
  } catch (err) {
    console.error('Error in getUserFromRequest:', err);
    return null;
  }
}

/**
 * Enforce role-based authorization in server routes
 */
export async function requireRole(request, allowedRoles = []) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return {
      authorized: false,
      response: Response.json({ error: 'Authentication required. Please sign in.' }, { status: 401 }),
    };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return {
      authorized: false,
      response: Response.json(
        { error: `Forbidden. You do not have permission (${user.role}) for this resource.` },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user };
}

/**
 * Build Set-Cookie header string
 */
export function createSessionCookie(token) {
  const isProd = process.env.NODE_ENV === 'production';
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${isProd ? '; Secure' : ''}`;
}

export function createLogoutCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

