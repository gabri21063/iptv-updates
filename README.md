# 📺 IPTV Player

> Lettore IPTV completo per Android TV / Phone — disponibile in 🇮🇹 🇬🇧 🇩🇪 🇫🇷

**Versione:** 216 (216.0) · **Min SDK:** Android 5.1 (API 22) · **Target:** Android 14 (API 35)
**Stack:** Kotlin · Media3 ExoPlayer · NanoHTTPD · Firebase Realtime DB

[![Download](https://img.shields.io/badge/Download-APK-v216-red)](https://github.com/gabri21063/iptv-updates/releases/download/v216/IPTVPlayer-v216.apk)

---

## 🇮🇹 ITALIANO

### ✨ Novità principali
- **🔄 Pulsante ritorno XromTV**: quando apri XromTV dal tasto XTV, in basso a destra appare il pulsante `◀ IPTV` per tornare subito all'app (e la notifica "Torna a IPTV Player" è cliccabile come fallback, anche sui contenuti DRM).
- **🚀 Aggiornamenti automatici**: a ogni avvio l'app controlla la nuova versione su **GitHub** (file `version.json`) con fallback su **Firebase**. Nessuna azione richiesta all'utente.

### 🎬 Il player
- ExoPlayer (Media3 1.3.1): HLS, DASH, SmoothStreaming, MP4, MKV
- DRM Widevine, Picture-in-Picture, selettore qualità, controlli Leanback per Android TV
- User-Agent / Referer / Origin / Cookie / header custom per ogni canale

### 🎛 I tre tasti principali
- **PRX** — Proxy Stalker + Provider M3U (condivisione canali via Firebase, senza VPS)
- **P2P** — Peer-to-peer: host, connessione a peer, griglia "Canali in diretta", refresh ogni 30 min
- **XTV** — apre XromTV + pulsante di ritorno

### 🔄 Relay Multi-Utente (max-1 risolto)
Un dispositivo apre **una sola** connessione a monte e la ridistribuisce a **N client** in tempo reale.
URL relay compatibile con qualsiasi player: `http://<ip>:<port>/peer/proxy?url=<encoded>` · supporto Cloudflare Tunnel.

### ✅ Altro
- Multi-Playlist M3U/M3U8 illimitate con parser robusto e ricerca istantanea
- Portale Stalker/Ministra (handshake, VOD, series, EPG, catchup)
- Interfaccia Web integrata (porta 8080) + invio liste da web
- Back-up/ripristino playlist, tema personalizzato, diagnostica

### 📥 Installazione / Aggiornamento
1. Scarica l'APK: [IPTVPlayer-v216.apk](https://github.com/gabri21063/iptv-updates/releases/download/v216/IPTVPlayer-v216.apk)
2. Android TV/Box: app **Downloader** → Code `2140263`
3. Telefono: abilita "Installa app sconosciute" → apri il link → installa
4. Aggiornamenti successivi: automatici (prompt in-app)

### ⚠️ Nota
L'app è un **player**: non fornisce contenuti, canali o playlist. Usa solo fonti legittime.

---

## 🇬🇧 ENGLISH

### ✨ Main additions
- **🔄 XromTV back button**: open XromTV via the XTV button and a `◀ IPTV` pill appears bottom-right to return to the app instantly (the clickable "Back to IPTV Player" notification works even on DRM content).
- **🚀 Automatic updates**: on every launch the app checks `version.json` on **GitHub** (fallback: Firebase). No user action needed.

### 🎬 The player
- ExoPlayer (Media3 1.3.1): HLS, DASH, SmoothStreaming, MP4, MKV
- Widevine DRM, Picture-in-Picture, quality selector, Leanback controls for Android TV
- User-Agent / Referer / Origin / Cookie / custom headers per channel

### 🎛 The three main buttons
- **PRX** — Stalker Proxy + M3U Provider (share channels via Firebase, no VPS)
- **P2P** — Peer-to-peer: host, connect to a peer, live channels grid, 30-min refresh
- **XTV** — opens XromTV + back button

### 🔄 Multi-User Relay (max-1 solved)
One device opens a **single** upstream connection and redistributes it to **N clients** in real time.
Player-compatible relay URL: `http://<ip>:<port>/peer/proxy?url=<encoded>` · Cloudflare Tunnel support.

### ✅ More
- Unlimited M3U/M3U8 multi-playlists, robust parser, instant search
- Stalker/Ministra portal (handshake, VOD, series, EPG, catchup)
- Built-in Web UI (port 8080) + web list sender
- Playlist backup/restore, custom theme, diagnostics

### 📥 Install / Update
1. Download the APK: [IPTVPlayer-v216.apk](https://github.com/gabri21063/iptv-updates/releases/download/v216/IPTVPlayer-v216.apk)
2. Android TV/Box: **Downloader** app → Code `2140263`
3. Phone: enable "Install unknown apps" → open the link → install
4. Future updates: automatic (in-app prompt)

### ⚠️ Note
The app is a **player**: it does not provide content, channels or playlists. Use only legitimate sources.

---

## 🇩🇪 DEUTSCH

### ✨ Hauptneuerungen
- **🔄 XromTV-Zurück-Taste**: öffne XromTV über die XTV-Taste und unten rechts erscheint das Feld `◀ IPTV`, um sofort zur App zurückzukehren (die klickbare Benachrichtigung "Zurück zu IPTV Player" funktioniert auch bei DRM-Inhalten).
- **🚀 Automatische Updates**: Bei jedem Start prüft die App `version.json` auf **GitHub** (Fallback: Firebase). Keine Nutzeraktion nötig.

### 🎬 Der Player
- ExoPlayer (Media3 1.3.1): HLS, DASH, SmoothStreaming, MP4, MKV
- Widevine-DRM, Picture-in-Picture, Qualitätsauswahl, Leanback-Steuerung für Android TV
- User-Agent / Referer / Origin / Cookie / benutzerdefinierte Header pro Kanal

### 🎛 Die drei Haupttasten
- **PRX** — Stalker-Proxy + M3U-Provider (Kanäle über Firebase teilen, ohne VPS)
- **P2P** — Peer-to-Peer: Host, Peer-Verbindung, Live-Kanäle-Raster, 30-Min-Aktualisierung
- **XTV** — öffnet XromTV + Zurück-Taste

### 🔄 Multi-User-Relay (max-1 gelöst)
Ein Gerät öffnet **eine einzige** Upstream-Verbindung und verteilt sie in Echtzeit an **N Clients**.
Player-kompatible Relay-URL: `http://<ip>:<port>/peer/proxy?url=<encoded>` · Cloudflare-Tunnel-Support.

### ✅ Mehr
- Unbegrenzte M3U/M3U8-Multi-Playlists, robuster Parser, Sofortsuche
- Stalker/Ministra-Portal (Handshake, VOD, Serien, EPG, Catchup)
- Integrierte Web-UI (Port 8080) + Web-Listenversand
- Playlist-Backup/Wiederherstellung, eigenes Design, Diagnose

### 📥 Installation / Update
1. APK herunterladen: [IPTVPlayer-v216.apk](https://github.com/gabri21063/iptv-updates/releases/download/v216/IPTVPlayer-v216.apk)
2. Android TV/Box: **Downloader**-App → Code `2140263`
3. Phone: "Unbekannte Apps installieren" aktivieren → Link öffnen → installieren
4. Weitere Updates: automatisch (In-App-Hinweis)

### ⚠️ Hinweis
Die App ist ein **Player**: Sie stellt keine Inhalte, Kanäle oder Playlists bereit. Nur legitime Quellen nutzen.

---

## 🇫🇷 FRANÇAIS

### ✨ Nouvelles fonctionnalités
- **🔄 Bouton retour XromTV** : ouvrez XromTV via le bouton XTV et une pastille `◀ IPTV` apparaît en bas à droite pour revenir instantanément à l'app (la notification cliquable "Revenir à IPTV Player" fonctionne aussi sur les contenus DRM).
- **🚀 Mises à jour automatiques** : à chaque lancement l'app vérifie `version.json` sur **GitHub** (fallback : Firebase). Aucune action requise.

### 🎬 Le lecteur
- ExoPlayer (Media3 1.3.1) : HLS, DASH, SmoothStreaming, MP4, MKV
- DRM Widevine, Picture-in-Picture, sélecteur de qualité, commandes Leanback pour Android TV
- User-Agent / Referer / Origin / Cookie / en-têtes personnalisés par chaîne

### 🎛 Les trois boutons principaux
- **PRX** — Proxy Stalker + Provider M3U (partage de chaînes via Firebase, sans VPS)
- **P2P** — Peer-to-peer : hôte, connexion à un pair, grille « Chaînes en direct », rafraîchissement 30 min
- **XTV** — ouvre XromTV + bouton retour

### 🔄 Relais Multi-Utilisateurs (max-1 résolu)
Un appareil ouvre **une seule** connexion amont et la redistribue à **N clients** en temps réel.
URL de relais compatible lecteur : `http://<ip>:<port>/peer/proxy?url=<encoded>` · support Cloudflare Tunnel.

### ✅ Et aussi
- Multi-playlists M3U/M3U8 illimitées, parseur robuste, recherche instantanée
- Portail Stalker/Ministra (handshake, VOD, séries, EPG, catchup)
- Interface Web intégrée (port 8080) + envoi de listes depuis le web
- Sauvegarde/restauration des playlists, thème personnalisé, diagnostic

### 📥 Installation / Mise à jour
1. Téléchargez l'APK : [IPTVPlayer-v216.apk](https://github.com/gabri21063/iptv-updates/releases/download/v216/IPTVPlayer-v216.apk)
2. Android TV/Box : app **Downloader** → Code `2140263`
3. Téléphone : activez « Installer les applications inconnues » → ouvrez le lien → installez
4. Mises à jour suivantes : automatiques (invite dans l'app)

### ⚠️ Note
L'app est un **lecteur** : elle ne fournit ni contenus, ni chaînes, ni playlists. Utilisez uniquement des sources légitimes.

---

## 🔗 Link / Links / Links / Liens

- 📥 APK: `https://github.com/gabri21063/iptv-updates/releases/download/v216/IPTVPlayer-v216.apk`
- 🖥 Invia liste al device / Send lists / Listen senden / Envoyer des listes: `https://gbclient.github.io/iptv-client/`
- 🔑 Downloader Code: `2140263`
- 🏷 `#IPTV #IPTVPlayer #M3U #ExoPlayer #AndroidTV #Relay #P2P #StalkerPortal #Media3 #Kotlin`