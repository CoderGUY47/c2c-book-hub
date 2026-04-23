/* 
  SERVER V41 - NEXT 15 (Fixed Server App & Fetch Wrapper)
  Developed by Antigravity
*/
console.log('--- MERGED SERVER V41 STARTING ---');

const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 3000;
process.chdir(__dirname);

// 1. PATCH GLOBAL FETCH (Fixes Next.js SSR "Invalid URL /api/..." crash)
const originalFetch = global.fetch;
global.fetch = async (url, options) => {
    if (typeof url === 'string' && url.startsWith('/')) {
        url = `http://127.0.0.1:${port}${url}`; // Convert relative to absolute
    }
    return originalFetch(url, options);
};

// 2. ENVIRONMENT HIJACK
const hijackEnv = (host) => {
    const isLocal = host.includes('localhost');
    const protocol = isLocal ? 'http' : 'https';
    const base = `${protocol}://${host}`;
    process.env.FRONTEND_URL = base;
    process.env.GOOGLE_CALLBACK_URL = `${base}/api/auth/google/callback`;
    process.env.NEXT_PUBLIC_API_URL = base; 
    return base;
};

let nextConfig = { distDir: '.next' };
try {
  const configPath = path.join(__dirname, '.next', 'required-server-files.json');
  if (fs.existsSync(configPath)) nextConfig = JSON.parse(fs.readFileSync(configPath, 'utf8')).config;
} catch (e) {}

// 3. Load Backend API
let backendApp;
try {
  hijackEnv('oxpecker.pro.bd'); 
  const backendFile = path.join(__dirname, 'backend', 'dist', 'index');
  backendApp = require(backendFile).default || require(backendFile);
  console.log('Backend Loaded Successfully');
} catch (e) {
  console.log('Warning: Backend failed to load:', e.message);
}

// 4. Setup Custom Next.js Server
const NextServer = require('next/dist/server/next-server').default;
const nextServer = new NextServer({ 
    hostname: '0.0.0.0', 
    port, 
    dir: __dirname, 
    dev: false, 
    conf: nextConfig, 
    minimalMode: true 
});
const handle = nextServer.getRequestHandler();

const streamFile = (res, filePath, ext) => {
    const mimeMap = { 
        '.js': 'text/javascript', '.css': 'text/css', 
        '.png': 'image/png', '.jpg': 'image/jpeg', 
        '.svg': 'image/svg+xml', '.webp': 'image/webp', 
        '.txt': 'text/plain', '.ico': 'image/x-icon' 
    };
    res.setHeader('Content-Type', mimeMap[ext.toLowerCase()] || 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    fs.createReadStream(filePath).pipe(res);
};

const resolveLocalPath = (urlPath) => {
    if (!urlPath) return null;
    let asset = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
    asset = asset.split('?')[0];
    const candidates = [
        path.join(__dirname, asset),
        path.join(__dirname, 'public', asset),
        path.join(__dirname, 'backend', 'uploads', asset.replace(/^uploads\//, ''))
    ];
    for (const p of candidates) {
        if (fs.existsSync(p) && fs.lstatSync(p).isFile()) return p;
    }
    return null;
};

// 5. Start the Integrated Server
const server = createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;
  if (req.headers.host) hijackEnv(req.headers.host);

  try {
    // API Routes -> Backend
    if (pathname.startsWith('/api')) {
      if (backendApp) return backendApp(req, res);
      return res.end();
    }

    // Static Files -> _next/static
    if (pathname.startsWith('/_next/static/')) {
      const filePath = path.join(__dirname, '.next', 'static', pathname.replace('/_next/static/', ''));
      if (fs.existsSync(filePath)) return streamFile(res, filePath, path.extname(filePath));
    }

    // Static files inside Public / Uploads
    const local = resolveLocalPath(pathname);
    if (local && !pathname.startsWith('/_next')) return streamFile(res, local, path.extname(local));

    // Everything else -> Next.js Engine
    return handle(req, res, parsedUrl);
  } catch (err) { res.end(); }
});

server.listen(port, () => console.log(`> BRIDGE V41 READY: Port ${port}`));
