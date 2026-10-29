import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, comparePassword, signToken, verifyToken } from '../src/server/auth/session.js';

test('Password hashing and comparison with bcrypt', async () => {
  const password = 'BeeGoSecretPassword2026!';
  const hash = await hashPassword(password);

  assert.notEqual(password, hash);
  assert.ok(hash.startsWith('$2'));

  const isMatch = await comparePassword(password, hash);
  assert.equal(isMatch, true);

  const isWrong = await comparePassword('wrong_password', hash);
  assert.equal(isWrong, false);
});

test('JWT signing and verification', () => {
  const user = {
    id: 'user_123',
    email: 'tester@beegodelivery.in',
    role: 'customer',
  };

  const token = signToken(user);
  assert.ok(typeof token === 'string');

  const decoded = verifyToken(token);
  assert.equal(decoded.id, 'user_123');
  assert.equal(decoded.email, 'tester@beegodelivery.in');
  assert.equal(decoded.role, 'customer');

  const invalid = verifyToken('tampered.token.here');
  assert.equal(invalid, null);
});

