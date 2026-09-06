# 📺 IPTV Player

> Lettore IPTV completo per Android TV / Phone — disponibile in 🇮🇹 🇬🇧 🇩🇪 🇫🇷

**Versione:** 222 (222.0) · **Min SDK:** Android 5.1 (API 22) · **Target:** Android 14 (API 35)
**Stack:** Kotlin · Media3 ExoPlayer 1.3.1 · NanoHTTPD · Firebase Realtime DB · OkHttp

[![Download](https://img.shields.io/badge/Download-APK-v222-red)](https://github.com/gabri21063/iptv-updates/releases/download/v222/IPTVPlayer-v222.apk)

---

## 🇮🇹 ITALIANO

### ✨ Novità principali (v217–v222)

- **🌐 Web Player integrato (v217)**: apri `http://IP_BOX:8080/player` da qualsiasi browser (iPhone, Android, PC) — usa il proxy interno del box, niente blocchi Mixed Content/CORS, funziona con liste HTTP.
- **🔄 Conversione HLS automatica (v218)**: incolli la tua playlist Xtream (`type=m3u_plus`) e il box la converte in HLS (`output=hls`) — i canali partono nativamente su **iPhone Safari**.
- **⚡ Avvio canali veloce (v222)**: `bufferForPlaybackMs` 3s (live) / 5s (VOD) — i canali partono in 2–4 secondi, buffer max invariati (60–120s) per stabilità su linea lenta.
- **🛡️ Suite "connessioni lente" (v220–v221)**:
  - ExoPlayer: buffer aggressivi (Live 60–120s, VOD 30–60s), retry policy HLS/Progressive
  - StreamBroadcaster: coda 200→800 (25 MB) + backpressure metrics
  - HLS Proxy: cache manifest 5s + retry esponenziale 3× + keep-alive
  - Playlist loader: retry esponenziale 3× (1s→2s→4s) + timeout 90s
- **🔄 XromTV fix (v219, v221)**: cache sempre sovrascritta + apertura automatica dopo install — niente reinstallazione vecchia, Xrom si apre da solo.
- **📦 APK da 32.8 → 4.87 MB** grazie al nuovo Xrom Revo (1.17 MB vs 31 MB).

### 🎬 Il player
- ExoPlayer (Media3 1.3.1): HLS, DASH, SmoothStreaming, MP4, MKV
- DRM Widevine, Picture-in-Picture, selettore qualità, controlli Leanback per Android TV
- User-Agent / Referer / Origin / Cookie / header custom per ogni canale

### 🎛 I tre tasti principali
- **PRX** — Proxy Stalker + Provider M3U (condivisione canali via Firebase, senza VPS)
- **P2P** — Peer-to-peer: host, connessione a peer, griglia "Canali in diretta", refresh ogni 30 min
- **XTV** — apre XromTV Revo + pulsante di ritorno overlay/notifica cliccabile

### 🔄 Relay Multi-Utente (max-1 risolto)
Un dispositivo apre **una sola** connessione a monte e la ridistribuisce a **N client** in tempo reale.
URL relay compatibile con qualsiasi player: `http://<ip>:<port>/peer/proxy?url=<encoded>` · supporto Cloudflare Tunnel.

### ✅ Altro
- Multi-Playlist M3U/M3U8 illimitate con parser robusto e ricerca istantanea
- Portale Stalker/Ministra (handshake, VOD, series, EPG, catchup)
- Interfaccia Web integrata (porta 8080) + invio liste da web
- Back-up/ripristino playlist, tema personalizzato, diagnostica

### 📥 Installazione / Aggiornamento
1. Scarica l'APK: [IPTVPlayer-v222.apk](https://github.com/gabri21063/iptv-updates/releases/download/v222/IPTVPlayer-v222.apk)
2. Android TV/Box: app **Downloader** → Code `2140263`
3. Telefono: abilita "Installa app sconosciute" → apri il link → installa
4. Aggiornamenti successivi: automatici (prompt in-app)

### ⚠️ Nota
L'app è un **player**: non fornisce contenuti, canali o playlist. Usa solo fonti legittime.

---

## 🇬🇧 ENGLISH

### ✨ Main additions (v217–v222)

- **🌐 Built-in Web Player (v217)**: open `http://BOX_IP:8080/player` from any browser (iPhone, Android, PC) — uses the box's internal proxy, no Mixed Content/CORS blocks, works with HTTP playlists.
- **🔄 Automatic HLS conversion (v218)**: paste your Xtream playlist (`type=m3u_plus`) and the box auto-converts to HLS (`output=hls`) — channels play natively on **iPhone Safari**.
- **⚡ Fast channel start (v222)**: `bufferForPlaybackMs` 3s (live) / 5s (VOD) — channels start in 2–4 seconds, max buffers unchanged (60–120s) for stability on slow lines.
- **🛡️ "Slow connections" suite (v220–v221)**:
  - ExoPlayer: aggressive buffers (Live 60–120s, VOD 30–60s), HLS/Progressive retry policy
  - StreamBroadcaster: queue 200→800 (25 MB) + backpressure metrics
  - HLS Proxy: 5s manifest cache + 3× exponential backoff + keep-alive
  - Playlist loader: 3× exponential retry (1s→2s→4s) + 90s timeout
- **🔄 XromTV fixes (v219, v221)**: cache always overwritten + auto-open after install — no old-version reinstall loops, Xrom opens automatically.
- **📦 APK 32.8 → 4.87 MB** thanks to new Xrom Revo (1.17 MB vs 31 MB).

### 🎬 The player
- ExoPlayer (Media3 1.3.1): HLS, DASH, SmoothStreaming, MP4, MKV
- Widevine DRM, Picture-in-Picture, quality selector, Leanback controls for Android TV
- User-Agent / Referer / Origin / Cookie / custom headers per channel

### 🎛 The three main buttons
- **PRX** — Stalker Proxy + M3U Provider (share channels via Firebase, no VPS)
- **P2P** — Peer-to-peer: host, connect to a peer, live channels grid, 30-min refresh
- **XTV** — opens XromTV Revo + back button (overlay + clickable notification)

### 🔄 Multi-User Relay (max-1 solved)
One device opens a **single** upstream connection and redistributes it to **N clients** in real time.
Player-compatible relay URL: `http://<ip>:<port>/peer/proxy?url=<encoded>` · Cloudflare Tunnel support.

### ✅ More
- Unlimited M3U/M3U8 multi-playlists, robust parser, instant search
- Stalker/Ministra portal (handshake, VOD, series, EPG, catchup)
- Built-in Web UI (port 8080) + web list sender
- Playlist backup/restore, custom theme, diagnostics

### 📥 Install / Update
1. Download the APK: [IPTVPlayer-v222.apk](https://github.com/gabri21063/iptv-updates/releases/download/v222/IPTVPlayer-v222.apk)
2. Android TV/Box: **Downloader** app → Code `2140263`
3. Phone: enable "Install unknown apps" → open the link → install
4. Future updates: automatic (in-app prompt)

### ⚠️ Note
The app is a **player**: it does not provide content, channels or playlists. Use only legitimate sources.

---

## 🇩🇪 DEUTSCH

### ✨ Hauptneuerungen (v217–v222)

- **🌐 Integrierter Web Player (v217)**: öffne `http://BOX_IP:8080/player` in jedem Browser (iPhone, Android, PC) — nutzt den internen Proxy der Box, keine Mixed Content/CORS-Blockaden, funktioniert mit HTTP-Playlists.
- **🔄 Automatische HLS-Konvertierung (v218)**: füge deine Xtream-Playlist (`type=m3u_plus`) ein und die Box wandelt automatisch in HLS um (`output=hls`) — Kanäle laufen nativ auf **iPhone Safari**.
- **⚡ Schneller Kanalstart (v222)**: `bufferForPlaybackMs` 3s (live) / 5s (VOD) — Kanäle starten in 2–4 Sekunden, Maximalbuffer unverändert (60–120s) für Stabilität bei langsamer Leitung.
- **🛡️ "Langsame Verbindungen"-Suite (v220–v221)**:
  - ExoPlayer: aggressive Puffer (Live 60–120s, VOD 30–60s), HLS/Progressive-Retry-Policy
  - StreamBroadcaster: Warteschlange 200→800 (25 MB) + Backpressure-Metriken
  - HLS-Proxy: 5s Manifest-Cache + 3× exponentieller Backoff + Keep-Alive
  - Playlist-Loader: 3× exponentieller Retry (1s→2s→4s) + 90s Timeout
- **🔄 XromTV-Fixes (v219, v221)**: Cache wird immer überschrieben + Auto-Öffnen nach Installation — keine Neuinstallation der alten Version, Xrom öffnet sich automatisch.
- **📦 APK 32.8 → 4.87 MB** dank neuem Xrom Revo (1.17 MB vs 31 MB).

### 🎬 Der Player
- ExoPlayer (Media3 1.3.1): HLS, DASH, SmoothStreaming, MP4, MKV
- Widevine-DRM, Picture-in-Picture, Qualitätsauswahl, Leanback-Steuerung für Android TV
- User-Agent / Referer / Origin / Cookie / benutzerdefinierte Header pro Kanal

### 🎛 Die drei Haupttasten
- **PRX** — Stalker-Proxy + M3U-Provider (Kanäle über Firebase teilen, ohne VPS)
- **P2P** — Peer-to-Peer: Host, Peer-Verbindung, Live-Kanäle-Raster, 30-Min-Aktualisierung
- **XTV** — öffnet XromTV Revo + Zurück-Taste (Overlay + klickbare Benachrichtigung)

### 🔄 Multi-User-Relay (max-1 gelöst)
Ein Gerät öffnet **eine einzige** Upstream-Verbindung und verteilt sie in Echtzeit an **N Clients**.
Player-kompatible Relay-URL: `http://<ip>:<port>/peer/proxy?url=<encoded>` · Cloudflare-Tunnel-Support.

### ✅ Mehr
- Unbegrenzte M3U/M3U8-Multi-Playlists, robuster Parser, Sofortsuche
- Stalker/Ministra-Portal (Handshake, VOD, Serien, EPG, Catchup)
- Integrierte Web-UI (Port 8080) + Web-Listenversand
- Playlist-Backup/Wiederherstellung, eigenes Design, Diagnose

### 📥 Installation / Update
1. APK herunterladen: [IPTVPlayer-v222.apk](https://github.com/gabri21063/iptv-updates/releases/download/v222/IPTVPlayer-v222.apk)
2. Android TV/Box: **Downloader**-App → Code `2140263`
3. Phone: "Unbekannte Apps installieren" aktivieren → Link öffnen → installieren
4. Weitere Updates: automatisch (In-App-Hinweis)

### ⚠️ Hinweis
Die App ist ein **Player**: Sie stellt keine Inhalte, Kanäle oder Playlists bereit. Nur legitime Quellen nutzen.

---

## 🇫🇷 FRANÇAIS

### ✨ Nouvelles fonctionnalités (v217–v222)

- **🌐 Lecteur Web intégré (v217)** : ouvrez `http://IP_BOX:8080/player` depuis n'importe quel navigateur (iPhone, Android, PC) — utilise le proxy interne du boîtier, aucun blocage Mixed Content/CORS, fonctionne avec les playlists HTTP.
- **🔄 Conversion HLS automatique (v218)** : collez votre playlist Xtream (`type=m3u_plus`) et le boîtier la convertit automatiquement en HLS (`output=hls`) — les chaînes démarrent nativement sur **Safari iPhone**.
- **⚡ Démarrage rapide des chaînes (v222)** : `bufferForPlaybackMs` 3s (live) / 5s (VOD) — les chaînes démarrent en 2–4 secondes, tampons max inchangés (60–120s) pour la stabilité sur ligne lente.
- **🛡️ Suite "connexions lentes" (v220–v221)** :
  - ExoPlayer : tampons agressifs (Live 60–120s, VOD 30–60s), politique de retry HLS/Progressive
  - StreamBroadcaster : file d'attente 200→800 (25 MB) + métriques de backpressure
  - Proxy HLS : cache manifest 5s + retry exponentiel 3× + keep-alive
  - Chargeur de playlist : retry exponentiel 3× (1s→2s→4s) + timeout 90s
- **🔄 Correctifs XromTV (v219, v221)** : cache toujours écrasé + ouverture auto après installation — plus de réinstallation de l'ancienne version, Xrom s'ouvre automatiquement.
- **📦 APK 32,8 → 4,87 Mo** grâce au nouveau Xrom Revo (1,17 Mo vs 31 Mo).

### 🎬 Le lecteur
- ExoPlayer (Media3 1.3.1) : HLS, DASH, SmoothStreaming, MP4, MKV
- DRM Widevine, Picture-in-Picture, sélecteur de qualité, commandes Leanback pour Android TV
- User-Agent / Referer / Origin / Cookie / en-têtes personnalisés par chaîne

### 🎛 Les trois boutons principaux
- **PRX** — Proxy Stalker + Provider M3U (partage de chaînes via Firebase, sans VPS)
- **P2P** — Peer-to-peer : hôte, connexion à un pair, grille « Chaînes en direct », rafraîchissement 30 min
- **XTV** — ouvre XromTV Revo + bouton retour (overlay + notification cliquable)

### 🔄 Relais Multi-Utilisateurs (max-1 résolu)
Un appareil ouvre **une seule** connexion amont et la redistribue à **N clients** en temps réel.
URL de relais compatible lecteur : `http://<ip>:<port>/peer/proxy?url=<encoded>` · support Cloudflare Tunnel.

### ✅ Et aussi
- Multi-playlists M3U/M3U8 illimitées, parseur robuste, recherche instantanée
- Portail Stalker/Ministra (handshake, VOD, séries, EPG, catchup)
- Interface Web intégrée (port 8080) + envoi de listes depuis le web
- Sauvegarde/restauration des playlists, thème personnalisé, diagnostic

### 📥 Installation / Mise à jour
1. Téléchargez l'APK : [IPTVPlayer-v222.apk](https://github.com/gabri21063/iptv-updates/releases/download/v222/IPTVPlayer-v222.apk)
2. Android TV/Box : app **Downloader** → Code `2140263`
3. Téléphone : activez « Installer les applications inconnues » → ouvrez le lien → installez
4. Mises à jour suivantes : automatiques (invite dans l'app)

### ⚠️ Note
L'app est un **lecteur** : elle ne fournit ni contenus, ni chaînes, ni playlists. Utilisez uniquement des sources légitimes.

---

## 🔗 Link / Links / Links / Liens

- 📥 APK: `https://github.com/gabri21063/iptv-updates/releases/download/v222/IPTVPlayer-v222.apk`
- 🖥 Invia liste al device / Send lists / Listen senden / Envoyer des listes: `https://gbclient.github.io/iptv-client/`
- 🔑 Downloader Code: `2140263`
- 🏷 `#IPTV #IPTVPlayer #M3U #ExoPlayer #AndroidTV #Relay #P2P #StalkerPortal #Media3 #Kotlin`