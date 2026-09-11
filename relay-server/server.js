const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
// Token opzionale: se impostato, i client devono passarlo in Authorization
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Range');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  // Autenticazione opzionale
  if (AUTH_TOKEN) {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${AUTH_TOKEN}` && !req.url.includes(`token=${AUTH_TOKEN}`)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('forbidden');
      return;
    }
  }

  // Estrai URL target dalla query string
  const parsed = new URL(req.url, `http://${req.headers.host}`);
  const target = parsed.searchParams.get('url');

  if (!target) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('missing ?url=');
    return;
  }

  let targetUrl;
  try { targetUrl = new URL(target); } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('invalid url');
    return;
  }

  const isTls = targetUrl.protocol === 'https:';
  const lib = isTls ? https : http;

  const headers = { 'User-Agent': 'IPTVPlayer/1.0' };
  // Inoltra Range se presente (per chunked .ts)
  if (req.headers.range) headers['Range'] = req.headers.range;

  const proxyReq = lib.get(targetUrl.href, { headers, timeout: 15000 }, (proxyRes) => {
    // Inoltra status + headers rilevanti
    const fwdHeaders = {};
    const pass = ['content-type', 'content-length', 'content-range', 'accept-ranges',
                  'cache-control', 'etag', 'last-modified', 'date'];
    for (const k of pass) if (proxyRes.headers[k]) fwdHeaders[k] = proxyRes.headers[k];

    res.writeHead(proxyRes.statusCode, fwdHeaders);
    // Streaming: pipe diretto senza bufferizzare
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end('upstream error');
    }
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    if (!res.headersSent) {
      res.writeHead(504, { 'Content-Type': 'text/plain' });
      res.end('timeout');
    }
  });

  // Chiusura client → annulla upstream
  req.on('close', () => proxyReq.destroy());
});

server.listen(PORT, () => {
  console.log(`relay listening on :${PORT}`);
});
