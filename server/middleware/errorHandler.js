/**
 * Centralized Error Handling & 404 Middleware
 */

function notFoundHandler(req, res, next) {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist on this BEEGO server.`,
      documentation: '/api'
    });
  }
  // For web requests, let standard static routing take over or render 404
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>404 - Not Found | BEEGO Virajpet</title>
        <style>
          body { font-family: -apple-system, sans-serif; background: #FAF7F2; color: #221614; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
          .card { background: white; padding: 40px; border-radius: 16px; border: 1px solid #E5DACB; box-shadow: 0 10px 30px rgba(0,0,0,0.05); max-width: 450px; }
          h1 { color: #520D18; margin-top: 0; font-size: 28px; }
          a { display: inline-block; margin-top: 20px; background: #520D18; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>404 • Page Not Found</h1>
          <p>The page <code>${req.originalUrl}</code> was not found on the BEEGO Virajpet server.</p>
          <a href="/">Return to BEEGO Home</a>
        </div>
      </body>
    </html>
  `);
}

function errorHandler(err, req, res, next) {
  console.error('[Unhandled Server Error]', err);

  const statusCode = err.status || err.statusCode || 500;
  const response = {
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred on the server.'
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler
};
