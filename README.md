# 📺 IPTV Player

> Lettore IPTV completo per Android TV / Phone — disponibile in 🇮🇹 🇬🇧 🇩🇪 🇫🇷

**Versione:** 223 (223.0) · **Min SDK:** Android 5.1 (API 22) · **Target:** Android 14 (API 35)
**Stack:** Kotlin · Media3 ExoPlayer 1.3.1 · NanoHTTPD · Firebase Realtime DB · OkHttp · WebRTC/WHEP

[![Download](https://img.shields.io/badge/Download-APK-v223-red)](https://github.com/gabri21063/iptv-updates/releases/download/v223/IPTVPlayer-v223.apk)

---

## 🇮🇹 ITALIANO

### ✨ Novità principali (v217–v223)

- **🌐 Web Player integrato (v217)**: apri `http://IP_BOX:8080/player` da qualsiasi browser (iPhone, Android, PC) — usa il proxy interno del box, niente blocchi Mixed Content/CORS, funziona con liste HTTP.
- **🔄 Conversione HLS automatica (v218)**: incolli la tua playlist Xtream (`type=m3u_plus`) e il box la converte in HLS (`output=hls`) — i canali partono nativamente su **iPhone Safari**.
- **📡 Network Quality Monitor (v223)**: overlay in tempo reale con banda stimata (Mbps), bitrate/corrente video, risoluzione e salute buffer. Alert automatico "Connessione lenta — qualità adattata" quando la linea degrada. Cap qualità configurabile per risparmiare banda (impostazione `nqm_max_mbps`).
- **⚡ Bassa latenza WebRTC (v223)**: canali sport/interattivi a **<1s di latenza** via WebRTC/WHEP nel web player (pulsante ⚡). Integrazione MediaMTX automatica — vedi sezione dedicata sotto.
- **⚡ Avvio canali veloce (v222)**: `bufferForPlaybackMs` 3s (live) / 5s (VOD) — i canali partono in 2–4 secondi, buffer max invariati (60–120s).
- **🛡️ Suite "connessioni lente" (v220–v221)**: buffer aggressivi ExoPlayer, StreamBroadcaster 800×64KB, HLS proxy cache 5s + retry 3×, keep-alive, playlist retry 3× + timeout 90s.
- **🔄 XromTV fix (v219, v221)**: cache sempre sovrascritta + apertura automatica dopo install.
- **📦 APK da 32.8 → 4.9 MB** grazie al nuovo Xrom Revo (1.17 MB vs 31 MB).

### ⚡ Bassa latenza WebRTC — come funziona
Il box crea automaticamente su **MediaMTX** un canale "pull-HLS" che ingesta lo stream (già risolto con User-Agent/referer dal box) e lo emette via **WHEP**. Il browser si collega direttamente a MediaMTX: latenza **<1s** (vs 3-10s HLS). Con `sourceOnDemand=true` l'upstream si apre **solo con spettatori**: niente doppio consumo sull'account max-1.

**Setup (una tantum):**
1. Installa MediaMTX (gratis, open source): Docker `docker run --rm -p 8889:8889 -p 9997:9997 bluenviron/mediamtx` oppure il binario per Windows/Linux da `github.com/bluenviron/mediamtx/releases` (default: `webrtc` su 8889 e `api` su 9997 già abilitati).
2. Apri `http://IP:8080/player` → ⚙ WebRTC → Host MediaMTX (default: il box stesso `127.0.0.1`), Porta WHEP `8889`, Porta controllo `9997` → **Salva**.
3. Seleziona il canale → premi **⚡** per la bassa latenza. Al termine si chiude da solo (il canale su MediaMTX viene rimosso).

**Nota:** serve MediaMTX ≥ 1.9 (sorgente HLS). Su GitHub Pages (HTTPS) il pulsante ⚡ usa un URL WHEP manuale: per la modalità automatica usa sempre il player dal box.

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
1. Scarica l'APK: [IPTVPlayer-v223.apk](https://github.com/gabri21063/iptv-updates/releases/download/v223/IPTVPlayer-v223.apk)
2. Android TV/Box: app **Downloader** → Code `2140263`
3. Telefono: abilita "Installa app sconosciute" → apri il link → installa
4. Aggiornamenti successivi: automatici (prompt in-app)

### ⚠️ Nota
L'app è un **player**: non fornisce contenuti, canali o playlist. Usa solo fonti legittime.

---

## 🇬🇧 ENGLISH

### ✨ Main additions (v217–v223)

- **🌐 Built-in Web Player (v217)**: open `http://BOX_IP:8080/player` from any browser (iPhone, Android, PC) — uses the box's internal proxy, no Mixed Content/CORS blocks, works with HTTP playlists.
- **🔄 Automatic HLS conversion (v218)**: paste your Xtream playlist (`type=m3u_plus`) and the box auto-converts to HLS (`output=hls`) — channels play natively on **iPhone Safari**.
- **📡 Network Quality Monitor (v223)**: real-time overlay with estimated bandwidth (Mbps), current video bitrate, resolution and buffer health. Automatic "Slow connection — quality adapted" alert when the line degrades. Configurable quality cap to save bandwidth (`nqm_max_mbps`).
- **⚡ WebRTC ultra-low latency (v223)**: sports/interactive channels at **<1s latency** via WebRTC/WHEP in the web player (⚡ button). Automatic MediaMTX integration — see dedicated section below.
- **⚡ Fast channel start (v222)**: `bufferForPlaybackMs` 3s (live) / 5s (VOD) — channels start in 2–4 seconds, max buffers unchanged (60–120s).
- **🛡️ "Slow connections" suite (v220–v221)**: aggressive ExoPlayer buffers, StreamBroadcaster 800×64KB, HLS proxy 5s cache + 3× retry, keep-alive, playlist retry 3× + 90s timeout.
- **🔄 XromTV fixes (v219, v221)**: cache always overwritten + auto-open after install.
- **📦 APK 32.8 → 4.9 MB** thanks to new Xrom Revo (1.17 MB vs 31 MB).

### ⚡ WebRTC ultra-low latency — how it works
The box automatically creates on **MediaMTX** a "pull-HLS" channel that ingests the stream (already resolved with User-Agent/referer by the box) and emits it via **WHEP**. The browser connects directly to MediaMTX: **<1s** latency (vs 3-10s HLS). With `sourceOnDemand=true` the upstream opens **only when viewers** exist: no double consumption on the max-1 account.

**One-time setup:**
1. Install MediaMTX (free, open source): Docker `docker run --rm -p 8889:8889 -p 9997:9997 bluenviron/mediamtx` or the Windows/Linux binary from `github.com/bluenviron/mediamtx/releases` (defaults: `webrtc` on 8889 and `api` on 9997 already enabled).
2. Open `http://IP:8080/player` → ⚙ WebRTC → MediaMTX host (default: the box itself `127.0.0.1`), WHEP port `8889`, control port `9997` → **Save**.
3. Select the channel → press **⚡** for low latency. It closes automatically when done (the MediaMTX channel is removed).

**Note:** MediaMTX ≥ 1.9 required (HLS source). On GitHub Pages (HTTPS) the ⚡ button uses a manual WHEP URL: for the automatic mode always use the box player.

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
1. Download the APK: [IPTVPlayer-v223.apk](https://github.com/gabri21063/iptv-updates/releases/download/v223/IPTVPlayer-v223.apk)
2. Android TV/Box: **Downloader** app → Code `2140263`
3. Phone: enable "Install unknown apps" → open the link → install
4. Future updates: automatic (in-app prompt)

### ⚠️ Note
The app is a **player**: it does not provide content, channels or playlists. Use only legitimate sources.

---

## 🇩🇪 DEUTSCH

### ✨ Hauptneuerungen (v217–v223)

- **🌐 Integrierter Web Player (v217)**: öffne `http://BOX_IP:8080/player` in jedem Browser (iPhone, Android, PC) — nutzt den internen Proxy der Box, keine Mixed Content/CORS-Blockaden, funktioniert mit HTTP-Playlists.
- **🔄 Automatische HLS-Konvertierung (v218)**: füge deine Xtream-Playlist (`type=m3u_plus`) ein und die Box wandelt automatisch in HLS um — Kanäle laufen nativ auf **iPhone Safari**.
- **📡 Netzwerk-Qualitätsmonitor (v223)**: Echtzeit-Overlay mit geschätzter Bandbreite (Mbps), aktuellem Video-Bitraten, Auflösung und Pufferzustand. Automatischer Alert "Langsame Verbindung — Qualität angepasst" bei absinkender Leitung. Konfigurierbare Qualitätsgrenze zur Bandbreitenersparnis (`nqm_max_mbps`).
- **⚡ WebRTC Ultra-Niedriglatenz (v223)**: Sport-/Interaktivkanäle mit **<1s Latenz** via WebRTC/WHEP im Web Player (⚡-Taste). Automatische MediaMTX-Integration — siehe Abschnitt unten.
- **⚡ Schneller Kanalstart (v222)**: `bufferForPlaybackMs` 3s (live) / 5s (VOD) — Kanäle starten in 2–4 Sekunden, Maximalpuffer unverändert.
- **🛡️ "Langsame Verbindungen"-Suite (v220–v221)**: aggressive ExoPlayer-Puffer, StreamBroadcaster 800×64KB, HLS-Proxy-Cache 5s + 3× Retry, Keep-Alive, Playlist-Retry 3× + 90s Timeout.
- **🔄 XromTV-Fixes (v219, v221)**: Cache immer überschrieben + Auto-Öffnen nach Installation.
- **📦 APK 32.8 → 4.9 MB** dank neuem Xrom Revo (1.17 MB vs 31 MB).

### ⚡ WebRTC Ultra-Niedriglatenz — so funktioniert es
Die Box erstellt automatisch auf **MediaMTX** einen "Pull-HLS"-Kanal, der den Stream (von der Box bereits mit User-Agent/Referer aufgelöst) aufnimmt und via **WHEP** ausgibt. Der Browser verbindet sich direkt mit MediaMTX: **<1s** Latenz (vs. 3-10s HLS). Mit `sourceOnDemand=true` öffnet sich der Upstream **nur mit Zuschauern**: kein doppelter Verbrauch beim max-1-Konto.

**Einmalige Einrichtung:**
1. MediaMTX installieren (kostenlos, Open Source): Docker `docker run --rm -p 8889:8889 -p 9997:9997 bluenviron/mediamtx` oder Windows/Linux-Binary von `github.com/bluenviron/mediamtx/releases` (Standard: `webrtc` auf 8889 und `api` auf 9997 aktiv).
2. `http://IP:8080/player` öffnen → ⚙ WebRTC → MediaMTX-Host (Standard: die Box selbst `127.0.0.1`), WHEP-Port `8889`, Kontroll-Port `9997` → **Speichern**.
3. Kanal wählen → **⚡** für Niedriglatenz drücken. Wird nach Beendigung automatisch geschlossen (MediaMTX-Kanal wird entfernt).

**Hinweis:** MediaMTX ≥ 1.9 erforderlich (HLS-Quelle). Auf GitHub Pages (HTTPS) nutzt die ⚡-Taste eine manuelle WHEP-URL: für den automatischen Modus immer den Box-Player verwenden.

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
1. APK herunterladen: [IPTVPlayer-v223.apk](https://github.com/gabri21063/iptv-updates/releases/download/v223/IPTVPlayer-v223.apk)
2. Android TV/Box: **Downloader**-App → Code `2140263`
3. Phone: "Unbekannte Apps installieren" aktivieren → Link öffnen → installieren
4. Weitere Updates: automatisch (In-App-Hinweis)

### ⚠️ Hinweis
Die App ist ein **Player**: Sie stellt keine Inhalte, Kanäle oder Playlists bereit. Nur legitime Quellen nutzen.

---

## 🇫🇷 FRANÇAIS

### ✨ Nouvelles fonctionnalités (v217–v223)

- **🌐 Lecteur Web intégré (v217)** : ouvrez `http://IP_BOX:8080/player` depuis n'importe quel navigateur (iPhone, Android, PC) — utilise le proxy interne du boîtier, aucun blocage Mixed Content/CORS, fonctionne avec les playlists HTTP.
- **🔄 Conversion HLS automatique (v218)** : collez votre playlist Xtream (`type=m3u_plus`) et le boîtier la convertit automatiquement en HLS (`output=hls`) — les chaînes démarrent nativement sur **Safari iPhone**.
- **📡 Moniteur de qualité réseau (v223)** : superposition en temps réel avec bande passante estimée (Mbps), débit vidéo actuel, résolution et santé du tampon. Alerte automatique "Connexion lente — qualité adaptée" lorsque la ligne se dégrade. Limite de qualité configurable pour économiser la bande passante (`nqm_max_mbps`).
- **⚡ Basse latence WebRTC (v223)** : chaînes sport/interactives à **<1s de latence** via WebRTC/WHEP dans le lecteur web (bouton ⚡). Intégration automatique MediaMTX — voir la section dédiée ci-dessous.
- **⚡ Démarrage rapide des chaînes (v222)** : `bufferForPlaybackMs` 3s (live) / 5s (VOD) — les chaînes démarrent en 2–4 secondes, tampons max inchangés.
- **🛡️ Suite "connexions lentes" (v220–v221)** : tampons ExoPlayer agressifs, StreamBroadcaster 800×64KB, proxy HLS cache 5s + retry 3×, keep-alive, chargeur de playlist retry 3× + timeout 90s.
- **🔄 Correctifs XromTV (v219, v221)** : cache toujours écrasé + ouverture auto après installation.
- **📦 APK 32,8 → 4,9 Mo** grâce au nouveau Xrom Revo (1,17 Mo vs 31 Mo).

### ⚡ Basse latence WebRTC — comment ça marche
Le boîtier crée automatiquement sur **MediaMTX** un canal "pull-HLS" qui ingère le flux (déjà résolu avec User-Agent/referer par le boîtier) et l'émet via **WHEP**. Le navigateur se connecte directement à MediaMTX : **<1s** de latence (vs 3-10s HLS). Avec `sourceOnDemand=true` l'amont ne s'ouvre **qu'avec des spectateurs** : aucune double consommation sur le compte max-1.

**Configuration (une fois) :**
1. Installez MediaMTX (gratuit, open source) : Docker `docker run --rm -p 8889:8889 -p 9997:9997 bluenviron/mediamtx` ou le binaire Windows/Linux de `github.com/bluenviron/mediamtx/releases` (défauts : `webrtc` sur 8889 et `api` sur 9997 déjà actifs).
2. Ouvrez `http://IP:8080/player` → ⚙ WebRTC → Hôte MediaMTX (défaut : le boîtier lui-même `127.0.0.1`), port WHEP `8889`, port de contrôle `9997` → **Enregistrer**.
3. Sélectionnez la chaîne → appuyez sur **⚡** pour la basse latence. Se ferme automatiquement (le canal MediaMTX est supprimé).

**Remarque :** MediaMTX ≥ 1.9 requis (source HLS). Sur GitHub Pages (HTTPS) le bouton ⚡ utilise une URL WHEP manuelle : pour le mode automatique utilisez toujours le lecteur du boîtier.

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
1. Téléchargez l'APK : [IPTVPlayer-v223.apk](https://github.com/gabri21063/iptv-updates/releases/download/v223/IPTVPlayer-v223.apk)
2. Android TV/Box : app **Downloader** → Code `2140263`
3. Téléphone : activez « Installer les applications inconnues » → ouvrez le lien → installez
4. Mises à jour suivantes : automatiques (invite dans l'app)

### ⚠️ Note
L'app est un **lecteur** : elle ne fournit ni contenus, ni chaînes, ni playlists. Utilisez uniquement des sources légitimes.

---

## 🔗 Link / Links / Links / Liens

- 📥 APK: `https://github.com/gabri21063/iptv-updates/releases/download/v223/IPTVPlayer-v223.apk`
- 🖥 Invia liste al device / Send lists / Listen senden / Envoyer des listes: `https://gbclient.github.io/iptv-client/`
- ⚡ Bassa latenza WebRTC / Low latency (MediaMTX): `https://github.com/bluenviron/mediamtx/releases`
- 🔑 Downloader Code: `2140263`
- 🏷 `#IPTV #IPTVPlayer #M3U #ExoPlayer #AndroidTV #Relay #P2P #StalkerPortal #Media3 #Kotlin #WebRTC #WHEP #MediaMTX`