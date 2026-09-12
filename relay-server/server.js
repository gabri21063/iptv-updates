const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
// Token opzionale: se impostato, i client devono passarlo in Authorization
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';
const MAX_M3U8 = 8 * 1024 * 1024;
const MAX_CHUNK_BODY = 256 * 1024;
const MAX_KEEP = 48;   // ~30s di buffer per la condivisione peer

// ------------------------------------------------------------------
// Carico per il balancer: quanti flussi /proxy e /stream sono attivi.
// L'app legge /status sui vari relay e sceglie il meno carico.
// ------------------------------------------------------------------
let activeStreams = 0;
let totalStreams = 0;
const startedAt = Date.now();
function activeCount(up) { activeStreams += up; }

// ------------------------------------------------------------------
// Sessioni "engine" (stile XROM): le credenziali del provider restano
// sul relay; il device riceve playlists/canali senza mai esporle.
// Sid -> { host, user, pass, type, cookies, ua, ref, ts }
// ------------------------------------------------------------------
const SESS_TTL = 12 * 3600 * 1000;
const SESS_MAX = 40;
const sessions = new Map();

function newSid() { return require('crypto').randomBytes(16).toString('hex'); }

function sessionTouch(sid) {
  const s = sessions.get(sid);
  if (s) s.ts = Date.now();
  return s;
}

function sessionPrune() {
  const now = Date.now();
  for (const [k, v] of sessions) if (now - v.ts > SESS_TTL) sessions.delete(k);
  while (sessions.size > SESS_MAX) {
    let oldestKey = null, oldestTs = Infinity;
    for (const [k, v] of sessions) if (v.ts < oldestTs) { oldestTs = v.ts; oldestKey = k; }
    if (oldestKey === null) break;
    sessions.delete(oldestKey);
  }
}

function parseCookies(setCookieArr) {
  const out = {};
  for (const c of setCookieArr || []) {
    const kv = c.split(';')[0].split('=');
    if (kv.length === 2) out[kv[0].trim()] = kv[1].trim();
  }
  return out;
}

function cookieHeader(cookies) {
  return Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
}

function loginFromParams(params) {
  return new Promise((resolve) => {
    const hostRaw = (params.get('host') || '').trim().replace(/\/+$/, '');
    const user = params.get('user') || '';
    const pass = params.get('pass') || '';
    const type = (params.get('type') || 'm3u').toLowerCase();
    const ua = (params.get('ua') || '').trim();
    const ref = (params.get('ref') || '').trim();
    if (!hostRaw || !user || !pass) return resolve({ ok: false, msg: 'host/user/pass richiesti' });
    let base = hostRaw;
    if (!/^https?:\/\//i.test(base)) base = 'http://' + base;
    const lib = base.startsWith('https:') ? https : http;
    const dl = (u) =>
      `${base}${u}?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`;
    const probeUrl = type === 'xtream'
      ? dl('/player_api.php')
      : dl('/get.php') + `&type=m3u_plus`;
    const req = lib.get(probeUrl, {
      headers: {
        'User-Agent': ua || 'VLC/3.0.20 LibVLC/3.0.20',
        Referer: ref || base + '/',
      },
      timeout: 20000,
    }, (res) => {
      const cookies = parseCookies(res.headers['set-cookie']);
      let size = 0;
      res.on('data', (c) => { size += c.length; });
      res.on('error', () => resolve({ ok: false, msg: 'login error' }));
      res.on('end', () => {
        if (res.statusCode >= 400) return resolve({ ok: false, msg: 'login HTTP ' + res.statusCode });
        if (size === 0) return resolve({ ok: false, msg: 'credenziali non valide' });
        sessionPrune();
        const sid = newSid();
        sessions.set(sid, {
          host: base, user, pass, type,
          cookies, ua, ref: ref || base + '/',
          ts: Date.now(),
        });
        resolve({ ok: true, sid });
      });
    });
    req.on('error', () => resolve({ ok: false, msg: 'login unreachable' }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, msg: 'login timeout' }); });
  });
}

function proxyLine(proxyPrefix, abs, sess, extra = '') {
  const q = '?url=' + encodeURIComponent(abs);
  const tail = sess ? '&sess=' + sess : '';
  return proxyPrefix + q + tail + (extra ? '&' + extra : '');
}

// ------------------------------------------------------------------
// Stato condivisione peer (come il worker CF: niente disco, ultimi ~30s)
// ------------------------------------------------------------------
const rooms = new Map(); // code -> { chunks: Map<seq,Buffer>, cur, waiters:[], lastAt }

function room(code) {
  let r = rooms.get(code);
  if (!r) {
    r = { chunks: new Map(), cur: -1, waiters: [], lastAt: 0 };
    rooms.set(code, r);
  }
  return r;
}

function wake(r) {
  const w = r.waiters.splice(0);
  for (const fn of w) fn();
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Range');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const parsed = new URL(req.url, `http://${req.headers.host}`);
  const path = parsed.pathname;

  // Health check
  if (path === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  // Stato del relay per il balancer (carico attivo)
  if (path === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      v: '281-engine',
      name: process.env.SERVICE_NAME || (req.headers.host || 'relay'),
      active: activeStreams,
      total: totalStreams,
      uptime: Math.round((Date.now() - startedAt) / 1000),
      mem: Math.round(process.memoryUsage().rss / 1024 / 1024),
    }));
    return;
  }

  // ------------------------------------------------------------------
  // Engine: login sul relay (credenziali mai esposte al device)
  // ------------------------------------------------------------------
  if (path === '/login') {
    loginFromParams(parsed.searchParams).then((r) => {
      res.writeHead(r.ok ? 200 : 400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }

  // ------------------------------------------------------------------
  // /playlist?sess=SID -> m3u_plus riscritta tutta via /proxy (IP relay)
  // ------------------------------------------------------------------
  if (path === '/playlist') {
    const sid = parsed.searchParams.get('sess') || '';
    const sess = sessionTouch(sid);
    if (!sess) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, msg: 'sessione non valida' }));
      return;
    }
    const upstream = sess.host + '/get.php?username=' + encodeURIComponent(sess.user) +
      '&password=' + encodeURIComponent(sess.pass) + '&type=m3u_plus';
    const lib = sess.host.startsWith('https:') ? https : http;
    const proto = req.headers['x-forwarded-proto'] || (req.socket.encrypted ? 'https' : 'http');
    const proxyPrefix = `${proto}://${req.headers.host}/proxy`;
    const ureq = lib.get(upstream, {
      headers: {
        'User-Agent': sess.ua || 'VLC/3.0.20 LibVLC/3.0.20',
        Referer: sess.ref || sess.host + '/',
        ...(Object.keys(sess.cookies).length ? { Cookie: cookieHeader(sess.cookies) } : {}),
      },
      timeout: 30000,
    }, (pr) => {
      if (pr.statusCode >= 400) {
        pr.resume();
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, msg: 'provider HTTP ' + pr.statusCode }));
        return;
      }
      const mySess = sid;
      let parts = [];
      let size = 0;
      pr.on('data', (c) => {
        size += c.length;
        if (size <= 40 * 1024 * 1024) parts.push(c);
      });
      pr.on('error', () => {
        if (!res.headersSent) { res.writeHead(502, { 'Content-Type': 'text/plain' }); res.end('provider error'); }
      });
      pr.on('end', () => {
        const body = Buffer.concat(parts).toString('utf-8');
        const out = [];
        for (const raw of body.split('\n')) {
          const t = raw.trim();
          if (t === '' || t.startsWith('#')) { out.push(raw); continue; }
          let abs;
          try { abs = new URL(t, sess.host + '/').href; } catch { out.push(raw); continue; }
          out.push(proxyLine(proxyPrefix, abs, mySess));
        }
        const rew = out.join('\n');
        res.writeHead(200, {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Content-Length': Buffer.byteLength(rew),
          'Cache-Control': 'no-store',
        });
        res.end(rew);
      });
    });
    ureq.on('error', () => {
      if (!res.headersSent) { res.writeHead(502, { 'Content-Type': 'text/plain' }); res.end('provider unreachable'); }
    });
    ureq.on('timeout', () => { ureq.destroy(); });
    return;
  }

  // Autenticazione opzionale (non blocca /health)
  if (AUTH_TOKEN) {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${AUTH_TOKEN}` && !req.url.includes(`token=${AUTH_TOKEN}`)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('forbidden');
      return;
    }
  }

  // ------------------------------------------------------------------
  // /info?code=X  -> stato della stanza
  // ------------------------------------------------------------------
  if (path === '/info') {
    const code = parsed.searchParams.get('code') || 'default';
    const r = room(code);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, code, chunks: r.chunks.size, cur: r.cur, last: r.lastAt }));
    return;
  }

  // ------------------------------------------------------------------
  // POST /chunk?code=X&seq=N  -> il coordinatore deposita un pezzo
  // ------------------------------------------------------------------
  if (req.method === 'POST' && path === '/chunk') {
    const code = parsed.searchParams.get('code') || 'default';
    const seq = parseInt(parsed.searchParams.get('seq') || '0', 10);
    const r = room(code);
    let size = 0;
    const parts = [];
    req.on('data', (c) => {
      size += c.length;
      if (size <= MAX_CHUNK_BODY) parts.push(c);
    });
    req.on('end', () => {
      if (parts.length === 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false }));
        return;
      }
      const buf = Buffer.concat(parts);
      if (seq > r.cur) {
        r.cur = seq;
      } else if (r.cur - seq > MAX_KEEP) {
        r.chunks.clear();
        r.cur = seq;
      }
      r.chunks.set(seq, buf);
      r.lastAt = Date.now();
      if (r.chunks.size > MAX_KEEP) {
        const oldest = r.chunks.keys().next().value;
        r.chunks.delete(oldest);
      }
      wake(r);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, seq }));
    });
    req.on('error', () => {
      if (!res.headersSent) { res.writeHead(500); res.end(); }
    });
    return;
  }

  // ------------------------------------------------------------------
  // GET /stream?code=X  -> il ricevente tira i chunk in sequenza
  // ------------------------------------------------------------------
  if (req.method === 'GET' && path === '/stream') {
    const code = parsed.searchParams.get('code') || 'default';
    const r = room(code);
    const STREAM_MS = 20000;   // ~20s poi chiudi (limite free)
    const IDLE_MS = 4000;      // più di 4s senza chunk -> host spento
    const DELAY = 8;           // chunk dietro il live: cuscinetto anti-freeze
    const started = Date.now();
    let want = r.cur < 0 ? 0 : Math.max(0, r.cur - DELAY);
    const firstKey = r.chunks.keys().next().value;
    if (firstKey !== undefined && want < firstKey) want = firstKey;
    if (r.cur >= 0 && want > r.cur) want = r.cur;

    res.writeHead(200, {
      'Content-Type': 'video/mp2t',
      'Cache-Control': 'no-store',
      'Transfer-Encoding': 'chunked',
    });
    if (typeof res.flushHeaders === 'function') res.flushHeaders();

    activeCount(1); totalStreams++;
    let closed = false;
    const close = () => { if (!closed) { closed = true; res.end(); } };
    res.on('close', () => { closed = true; activeCount(-1); });

    (async () => {
      try {
        while (!closed && Date.now() - started < STREAM_MS) {
          // 1) svuota i chunk disponibili in memoria
          while (!closed) {
            const c = r.chunks.get(want);
            if (c === undefined) {
              if (want < r.cur - MAX_KEEP + 1) { want = r.cur < 0 ? 0 : r.cur; continue; }
              break;
            }
            if (!res.write(c)) {
              await new Promise((resolve) => res.once('drain', resolve));
            }
            want++;
          }
          if (closed || Date.now() - started >= STREAM_MS) break;
          // 2) aspetta il prossimo chunk (fino a IDLE_MS di silenzio)
          const idleDeadline = Date.now() + IDLE_MS;
          const waiter = new Promise((resolve) => r.waiters.push(resolve));
          let done = false;
          while (!done && !closed) {
            const timeout = new Promise((resolve) => setTimeout(() => resolve('t'), 250));
            const result = await Promise.race([waiter, timeout]);
            if (r.chunks.get(want) !== undefined) done = true;
            if (Date.now() - started >= STREAM_MS || Date.now() >= idleDeadline) break;
            if (result !== 't' && r.chunks.get(want) === undefined) done = false;
          }
        }
      } catch (_) {
      } finally {
        close();
      }
    })();
    return;
  }

  // ------------------------------------------------------------------
  // / o /info senza code -> stato generale
  // ------------------------------------------------------------------
  if (path === '/' || path === '/info' && parsed.searchParams.get('code') === null) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, msg: 'IPTVPlayer relay online', rooms: rooms.size }));
    return;
  }

  // ------------------------------------------------------------------
  // /proxy?url=...  -> relay generico (stream/API/playlist)
  // ------------------------------------------------------------------
  if (path !== '/proxy') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found');
    return;
  }

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

  const sessId = parsed.searchParams.get('sess') || '';
  const sess = sessId ? sessionTouch(sessId) : null;

  const sessionUa = (sess && sess.ua) || 'IPTVPlayer/1.0';
  const headers = { 'User-Agent': sessionUa };
  if (req.headers.range) headers['Range'] = req.headers.range;
  if (req.headers['user-agent']) headers['User-Agent'] = req.headers['user-agent'];
  if (req.headers.referer) headers['Referer'] = req.headers.referer;
  else if (sess) headers['Referer'] = sess.ref || sess.host + '/';
  if (req.headers.origin) headers['Origin'] = req.headers.origin;
  if (req.headers.cookie) headers['Cookie'] = req.headers.cookie;
  else if (sess && Object.keys(sess.cookies).length) headers['Cookie'] = cookieHeader(sess.cookies);

  const proto = req.headers['x-forwarded-proto'] || (req.socket.encrypted ? 'https' : 'http');
  const proxyBase = `${proto}://${req.headers.host}`;

  function isM3u8(ctype) {
    return (ctype || '').toLowerCase().includes('mpegurl');
  }

  function rewriteM3u8(text, upstreamUrl, proxy) {
    const out = [];
    for (const raw of text.split('\n')) {
      const line = raw.trim();
      if (line === '' || line.startsWith('#')) { out.push(raw); continue; }
      let abs;
      try { abs = new URL(line, upstreamUrl).href; } catch { out.push(raw); continue; }
      out.push(proxyLine(proxy + '/proxy', abs, sessId));
    }
    return out.join('\n');
  }

  const passHeaders = ['content-type', 'content-range', 'accept-ranges',
                       'cache-control', 'etag', 'last-modified', 'date'];

  // Segue i redirect server-side (hold: il client resta sempre sul relay)
  activeCount(1); totalStreams++;
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
      if (isM3u8(ctype)) {
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

  res.on('close', () => { activeCount(-1); if (!res.writableFinished) res.destroy(); });
});

server.listen(PORT, () => {
  console.log(`relay listening on :${PORT}`);
});