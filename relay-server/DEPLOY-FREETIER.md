# Deploy relay su hosting free-tier (niente carta, test in ~5 minuti)

Il relay usa lo streaming diretto (senza buffer) quindi va bene anche sui live `.ts`.
Scegli UNA piattaforma, deploya, poi incolla l'URL a chi fa il test su moosezone.
Il primo che risponde 200 viene aggiunto a Firebase RTDB e **tutti i client lo useranno da soli**.

## Test finale (lo fa chi ha accesso, appena c'e' un URL)
```
curl -s "http://MOOSEZONE-host/live/USER/PASS/ID.ts"            # baseline = 200
curl -s "https://[IL-TUO-RELAY]/proxy?url=<encoded .ts>"          # deve dare 200
```
- 200 → VINTO: il provider accetta quell'ASN. URL → RTDB `/relay/config`.
- 403/458 → ASPN bloccato: prova con un'altra piattaforma (ASN diversa).

## 1) Glitch (piu' veloce)
1. Glitch.com → login con GitHub (usa `gabri21063`).
2. "New project" → "Import from GitHub" → `gabri21063/iptv-updates` → cartella `relay-server`.
3. Il progetto parte da solo (`npm start`).
4. URL = `https://<nome-progetto>.glitch.me`.

## 2) Render
1. render.com → login con GitHub → "New" → "Blueprint" → seleziona `gabri21063/iptv-updates`.
2. Usa `relay-server/render.yaml` (runtime node, free, no card).
3. URL = `https://iptv-relay.onrender.com`.

## 3) Deno Deploy
1. deno.com → login con GitHub → "New Project" → importa il repo, file = `relay-server/server.deno.ts`.
2. URL = `https://<nome>.deno.dev`.

## 4) Koyeb
1. koyeb.com → login con GitHub → "Create Web Service" → deploy da immagine/Dockerfile del repo.
2. URL = `https://<nome>.koyeb.app`.

## Dopo il 200
1. Firebase RTDB → `/relay/config/server` = `<URL>` (primario)
2. `/relay/config/servers` = `[<URL>, <i worker CF esistenti>]` (mettere il nuovo per PRIMO)
3. App: nessuna modifica, i client prendono la config al primo avvio.