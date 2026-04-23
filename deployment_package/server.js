/*
  SERVER V38 - THE "ROOT PATH" BRIDGE
  Developed by Antigravity (Advanced Agentic Coding)
  Purpose: 1. Search parent dir for SSL Verification, 2. Global CORS, 3. Image Proxy.
*/

console.log('--- MERGED SERVER V38 (ROOT PATHS) STARTING ---');

const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

const port = process.env.PORT || 3000;
process.chdir(__dirname);

// 1. GLOBAL SANITIZATION
const globalSanitize = () => {
    const targets = [path.join(__dirname, '.next'), path.join(__dirname, 'backend', 'dist')];
    const junk = ['http://localhost:8000', 'https://localhost:8000', 'http://127.0.0.1:8000', 'localhost:8000', 'http://localhost:3000'];
    const walk = (dir) => {
        if (!fs.existsSync(dir)) return;
        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.lstatSync(fullPath).isDirectory()) {
                if (!['cache', 'node_modules'].includes(file)) walk(fullPath);
            } else if (/\.(js|json|html|css)$/.test(file)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let modified = false;
                junk.forEach(str => {
                    if (content.includes(str)) {
                        content = content.split(str).join('');
                        modified = true;
                    }
                });
                if (modified) fs.writeFileSync(fullPath, content, 'utf8');
            }
        });
    };
    targets.forEach(walk);
};
globalSanitize();

// 2. ENVIRONMENT HIJACK
const hijackEnv = (host) => {
    const isLocal = host.includes('localhost');
    const protocol = isLocal ? 'http' : 'https';
    const base = `${protocol}://${host}`;
    process.env.FRONTEND_URL = base;
    process.env.GOOGLE_CALLBACK_URL = `${base}/api/auth/google/callback`;
    process.env.SSLCOMMERZ_SUCCESS_URL = `${base}/api/payments/ssl/success`;
    process.env.SSLCOMMERZ_FAIL_URL = `${base}/api/payments/ssl/fail`;
    process.env.SSLCOMMERZ_CANCEL_URL = `${base}/api/payments/ssl/cancel`;
    process.env.NEXT_PUBLIC_API_URL = base; 
    return base;
};

// 3. Load Backend API
let backendApp;
try {
  hijackEnv('oxpecker-pro.bd'); 
  const backendFile = path.join(__dirname, 'backend', 'dist', 'index');
  backendApp = require(backendFile).default || require(backendFile);
} catch (e) {}

// 4. Setup Next.js
const NextServer = require('next/dist/server/next-server').default;
let nextConfig = { distDir: '.next' };
try {
  const configPath = path.join(__dirname, '.next', 'required-server-files.json');
  if (fs.existsSync(configPath)) nextConfig = JSON.parse(fs.readFileSync(configPath, 'utf8')).config;
} catch (e) {}

const nextServer = new NextServer({ hostname: '0.0.0.0', port, dir: __dirname, dev: false, conf: nextConfig, minimalMode: true });
const handle = nextServer.getRequestHandler();

// Helper: Streamer
const streamFile = (res, filePath, ext) => {
    const mimeMap = { '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.txt': 'text/plain' };
    res.setHeader('Content-Type', mimeMap[ext.toLowerCase()] || 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    fs.createReadStream(filePath).pipe(res);
};

// Helper: Secure Resolver (UPDATED V38: Search Parent Directory)
const resolveLocalPath = (urlPath) => {
    if (!urlPath) return null;
    let asset = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
    asset = asset.split('?')[0];
    const candidates = [
        path.join(__dirname, asset),           // Current Dir
        path.join(__dirname, '..', asset),      // PARENT Dir (e.g. public_html)
        path.join(__dirname, 'public', asset),  // Public Subfolder
        path.join(__dirname, 'uploads', asset.replace(/^uploads\//, '')),
        path.join(__dirname, 'backend', 'uploads', asset.replace(/^uploads\//, ''))
    ];
    for (const p of candidates) {
        if (fs.existsSync(p) && fs.lstatSync(p).isFile()) return p;
    }
    return null;
};

// Helper: Image Proxy
const proxyImage = (targetUrl, res, depth = 0) => {
    if (depth > 6) return res.end();
    let finalUrl = targetUrl.startsWith('//') ? `https:${targetUrl}` : targetUrl;
    const client = finalUrl.startsWith('https') ? https : http;
    client.get(finalUrl, { timeout: 10000, rejectUnauthorized: false, headers: { 'User-Agent': 'Mozilla/5.0' } }, (proxyRes) => {
        if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
            let loc = proxyRes.headers.location;
            if (!loc.startsWith('http')) loc = new URL(loc, new URL(finalUrl).origin).href;
            return proxyImage(loc, res, depth + 1);
        }
        res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'image/jpeg');
        res.setHeader('Access-Control-Allow-Origin', '*');
        proxyRes.pipe(res);
    }).on('error', () => res.end());
};

const server = createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;
  const host = req.headers.host;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

  try {
    // 404 Rescue for SSL Validation
    if (pathname.includes('.well-known/pki-validation/')) {
        const local = resolveLocalPath(pathname);
        if (local) return streamFile(res, local, '.txt');
    }

    if (pathname.startsWith('/api')) {
      if (host) hijackEnv(host);
      if (backendApp) return backendApp(req, res);
      return res.end();
    }

    if (pathname.startsWith('/_next/static/')) {
        const filePath = path.join(__dirname, '.next', 'static', pathname.replace('/_next/static/', ''));
        if (fs.existsSync(filePath)) return streamFile(res, filePath, path.extname(filePath));
    }

    if (pathname === '/_next/image' || pathname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/)) {
        const imageUrl = (parsedUrl.query.url || pathname).trim();
        if (imageUrl.startsWith('http')) return proxyImage(imageUrl, res);
        const local = resolveLocalPath(imageUrl);
        if (local) return streamFile(res, local, path.extname(local));
    }

    const directFile = resolveLocalPath(pathname);
    if (directFile && !pathname.startsWith('/_next')) return streamFile(res, directFile, path.extname(directFile));

    if (handle) await handle(req, res, parsedUrl);
    else res.end();
  } catch (err) { res.end(); }
});

server.listen(port, () => console.log(`> BRIDGE V38 READY: Port ${port}`));