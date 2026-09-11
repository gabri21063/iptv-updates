// Relay IPTV per Deno Deploy (deno.dev). Free: 100k req/giorno, no carta, no dati.
// Deploy: collega il repo GitHub a deno.land/x → questo file.
const token = Deno.env.get("AUTH_TOKEN") || "";

Deno.serve((req) => {
  const url = new URL(req.url);

  // CORS
  const cors = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, HEAD, OPTIONS",
    "access-control-allow-headers": "Authorization, Range",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  if (url.pathname === "/health") {
    return new Response("ok", { status: 200, headers: cors });
  }

  // Auth opzionale
  if (token) {
    const okAuth = req.headers.get("authorization") === `Bearer ${token}` || url.searchParams.get("token") === token;
    if (!okAuth) return new Response("forbidden", { status: 403, headers: cors });
  }

  const target = url.searchParams.get("url");
  if (!target) return new Response("missing ?url=", { status: 400, headers: cors });

  let t;
  try { t = new URL(target); } catch { return new Response("invalid url", { status: 400, headers: cors }); }

  const headers = new Headers({ "user-agent": "IPTVPlayer/1.0" });
  const range = req.headers.get("range");
  if (range) headers.set("range", range);

  return fetch(t.href, { headers, redirect: "follow" }).then((up) => {
    const out = new Response(up.body, {
      status: up.status,
      headers: { ...cors, "cache-control": "no-store" },
    });
    // inoltra headers utili
    for (const k of ["content-type", "content-length", "content-range", "accept-ranges", "etag"]) {
      const v = up.headers.get(k);
      if (v) out.headers.set(k, v);
    }
    return out;
  }).catch(() => new Response("upstream error", { status: 502, headers: cors }));
});