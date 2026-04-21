const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

// Import the backend app
// Note: In production, this will point to the compiled dist/index.js
let backendApp;
try {
  // In production, backend folder will be in the same root as server.js
  backendApp = require('./backend/dist/index').default;
} catch (e) {
  console.warn('Backend not found or not compiled. API routes will not work. Error:', e.message);
}

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Route /api requests to the Express backend
      if (pathname.startsWith('/api') && backendApp) {
        return backendApp(req, res);
      }

      // Handle all other requests with Next.js
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
