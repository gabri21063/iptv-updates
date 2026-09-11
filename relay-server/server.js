const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
// Token opzionale: se impostato, i client devono passarlo in Authorization
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';
const MAX_M3U8 = 8 * 1024 * 1024;

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

  const libFor = (u) => (u.protocol === 'https:' ? https : http);

  const headers = { 'User-Agent': 'IPTVPlayer/1.0' };
  // Inoltra Range se presente (per chunked .ts)
  if (req.headers.range) headers['Range'] = req.headers.range;
  if (req.headers['user-agent']) headers['User-Agent'] = req.headers['user-agent'];
  if (req.headers.referer) headers['Referer'] = req.headers.referer;
  if (req.headers.origin) headers['Origin'] = req.headers.origin;
  if (req.headers.cookie) headers['Cookie'] = req.headers.cookie;

  const proxyBase = `http://${req.headers.host}`;

  function isM3u8(ctype, urlText) {
    const ct = (ctype || '').toLowerCase();
    return ct.includes('mpegurl');
  }

  function rewriteM3u8(text, upstreamUrl, proxy) {
    const out = [];
    for (const raw of text.split('\n')) {
      const line = raw.trim();
      if (line === '' || line.startsWith('#')) { out.push(raw); continue; }
      let abs;
      try { abs = new URL(line, upstreamUrl).href; } catch { out.push(raw); continue; }
      out.push(proxy + '/proxy?url=' + encodeURIComponent(abs));
    }
    return out.join('\n');
  }

  const passHeaders = ['content-type', 'content-range', 'accept-ranges',
                       'cache-control', 'etag', 'last-modified', 'date'];

  // Segue i redirect server-side (hold: il client resta sempre sul relay)
  function fetchWithRedirects(url, hops) {
    const proxyReq = libFor(new URL(url)).get(url, { headers, timeout: 20000 }, (proxyRes) => {
      const code = proxyRes.statusCode;
      const loc = proxyRes.headers.location;
      if ([301, 302, 303, 307, 308].includes(code) && loc && hops < 6) {
        proxyRes.resume();
        fetchWithRedirects(new URL(loc, url).href, hops + 1);
        return;
      }

      const ctype = proxyRes.headers['content-type'] || '';
      const isPlaylist = isM3u8(ctype, url);
      if (isPlaylist) {
        let chunks = [];
        let size = 0;
        proxyRes.on('data', (c) => {
          size += c.length;
          if (size <= MAX_M3U8) chunks.push(c);
        });
        proxyRes.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf-8');
          const rewritten = rewriteM3u8(body, url, proxyBase);
          res.writeHead(code, {
            'Content-Type': 'application/vnd.apple.mpegurl',
            'Content-Length': Buffer.byteLength(rewritten),
            'Cache-Control': 'no-store',
          });
          res.end(rewritten);
        });
        proxyRes.on('error', () => {
          if (!res.headersSent) { res.writeHead(502); res.end('upstream error'); }
        });
        return;
      }

      const fwdHeaders = {};
      for (const k of passHeaders) if (proxyRes.headers[k]) fwdHeaders[k] = proxyRes.headers[k];

      res.writeHead(code, fwdHeaders);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', () => {
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
  }

  fetchWithRedirects(targetUrl.href, 0);

  // Client disconnesso prima della fine → chiudi upstream (evita connessioni zombie)
  res.on('close', () => { if (!res.writableFinished) res.destroy(); });
});

server.listen(PORT, () => {
  console.log(`relay listening on :${PORT}`);
});