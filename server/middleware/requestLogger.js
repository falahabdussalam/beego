/**
 * Custom HTTP Request Logger Middleware
 */
function requestLogger(req, res, next) {
  const start = process.hrtime();
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  // Log on response finish
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const timeMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
    const status = res.statusCode;

    // Color code status
    let statusColor = '\x1b[32m'; // Green
    if (status >= 500) statusColor = '\x1b[31m'; // Red
    else if (status >= 400) statusColor = '\x1b[33m'; // Yellow
    else if (status >= 300) statusColor = '\x1b[36m'; // Cyan

    const resetColor = '\x1b[0m';
    const methodColor = '\x1b[35m'; // Magenta

    // Avoid logging static asset spam if unnecessary, but keep API calls highlighted
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/admin') || status >= 400) {
      console.log(
        `[${timestamp}] ${methodColor}${req.method.padEnd(6)}${resetColor} ${req.originalUrl} ${statusColor}${status}${resetColor} - ${timeMs}ms`
      );
    }
  });

  next();
}

module.exports = requestLogger;
