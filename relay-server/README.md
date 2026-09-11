# Relay server IPTV (self-hosted)

Relay proxy per la funzione "Maschera IP" dell'app. A differenza dei worker Cloudflare/Vercel,
può essere hostato su un IP **non datacenter** (o comunque non bloccato dal provider) → funziona
anche con provider che bloccano Cloudflare/Vercel.

## Come funziona
Il client chiama:
```
https://IL-TUO-DOMINIO/proxy?url=<url_del_provider>
```
Il server scarica lo stream dal provider e lo inoltra **in streaming** (senza bufferizzare),
quindi funziona anche sui live `.ts` continui. Il provider vede l'IP del relay, non quello dell'utente.

## Endpoint
- `GET /proxy?url=<encoded>` — proxy streaming del flusso
- `GET /health` — health check

## Test locale
```
node server.js
curl -v "http://localhost:3000/proxy?url=http%3A%2F%2FIPTV-HOST%2Fget.php%3Fusername%3DX"
```

## Token (consigliato)
Per evitare uso abusivo, imposta una variabile d'ambiente e i client la passeranno come
`Authorization: Bearer TOKEN` (o `?token=TOKEN`). Se non la imposti il relay resta pubblico.

## Deploy gratis con IP pulito e senza dati (VPS free tier)
L'opzione consigliata: **Oracle Cloud Free Tier** — 2 istanze ARM sempre gratuite, IP pubblico
dedicato, ~10 TB traffico/mese incluso.

1. Crea account su cloud.oracle.com (richiede carta, ma il free tier è incluso per sempre)
2. Crea una VM **"Always Free"** (es. ARM Ampere A1.2, Ubuntu 22/24)
3. SSH nella VM e installa Node/nginx:
```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs nginx
```
4. Copia questo repo (o usa git), avvia:
```
cd relay-server && npm install --omit=dev && node server.js
```
5. Nginx reverse proxy + HTTPS (certbot):
```
server {
  listen 80;
  server_name IPTUO_IP;
  location / {
    proxy_pass http://localhost:3000;
    proxy_buffering off;
  }
}
sudo certbot --nginx -d il-tuo-dominio.com
```
6. Quando risponde `GET /health → ok`, aggiungi l'URL del relay su Firebase RTDB:
```
/relay/config/servers.json  →  ["https://il-tuo-dominio.com", "...esistenti"]
```
   In `config:true`, aggiorna anche `server` se vuoi renderlo primario.
   Fatto: **tutti i client lo usano automaticamente**, nessuna configurazione per gli utenti.

## Alternative
- **Container** (se preferisci un Docker service): `docker build -t iptv-relay . && docker run -p 3000:3000 iptv-relay`
- Se hai già un server qualsivoglia con IP che il provider accetta, il concetto è identico.