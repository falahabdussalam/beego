/**
 * API client helper connecting the standalone Admin Dashboard to the BeeGo Customer Backend.
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const CUSTOMER_SITE_URL = process.env.NEXT_PUBLIC_CUSTOMER_SITE_URL || 'http://localhost:3000';

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  return res;
}
