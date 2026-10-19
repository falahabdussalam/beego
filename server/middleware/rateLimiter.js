/**
 * In-memory token bucket rate limiter
 * Protects critical endpoints like order placement and wallet top-ups
 */
const rateLimits = new Map();

// Periodic sweep to prevent unbounded memory growth from stale IPs
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimits.entries()) {
    if (now - record.startTime > 300000) {
      rateLimits.delete(ip);
    }
  }
}, 180000).unref();

function createRateLimiter({ windowMs = 60 * 1000, max = 60, message = 'Too many requests, please try again shortly.' } = {}) {
  return function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    let record = rateLimits.get(ip);
    if (!record || now - record.startTime > windowMs) {
      record = { count: 1, startTime: now };
      rateLimits.set(ip, record);
    } else {
      record.count += 1;
    }

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        error: 'TooManyRequests',
        message,
        retryAfterSeconds: Math.ceil((record.startTime + windowMs - now) / 1000)
      });
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil((record.startTime + windowMs) / 1000));

    next();
  };
}

module.exports = {
  createRateLimiter,
  standardLimiter: createRateLimiter({ windowMs: 60 * 1000, max: 120 }),
  orderLimiter: createRateLimiter({ windowMs: 60 * 1000, max: 30, message: 'Too many order requests in quick succession.' })
};
