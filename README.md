# 📺 IPTV Player

> Lettore IPTV completo per Android TV / Phone / Fire Stick — disponibile in 🇮🇹 🇬🇧 🇩🇪 🇫🇷

**Versione:** 239 (239.0) · **Min SDK:** Android 5.1 (API 22) · **Target:** Android 14 (API 35) · **APK:** 4,9 MB
**Stack:** Kotlin · Media3 ExoPlayer 1.3.1 · NanoHTTPD · Firebase Realtime DB · OkHttp · WebRTC/WHEP · R8 hardening

[![Download](https://img.shields.io/badge/Download-APK-v239-red)](https://github.com/gabri21063/iptv-updates/releases/download/v239/IPTVPlayer-v239.apk)

---

## 🇮🇹 ITALIANO

### 🤝 La funzionalità XROM — una integrazione rispettosa

IPTV Player offre **accesso integrato e non invasivo** a XROM TV direttamente dal telecomando, con la stessa identità tecnica della piattaforma ufficiale (User-Agent e `Referer` originali). Nessun contenuto viene ospitato o replicato: l'app si limita a instradare la richiesta verso i server del servizio, esattamente come farebbe il launcher ufficiale.

**Tutte le novità XROM introdotte:**

- **📌 Accesso sempre disponibile (v236)** — il pulsante **XROM ▶** accanto a EPG è fisso e funziona **anche senza playlist caricata**: la barra mostra XROM ovunque, gli altri filtri compaiono solo quando serve.
- **🤝 Splash di rispetto (v232)** — all'apertura, una pagina informativa professionale (auto-chiusura 5s con conto alla rovescia o tasto *Continua*) riconosce in modo cortese il lavoro del servizio, in 4 lingue.
- **✅ Navigazione completa (v231)** — la griglia dei canali si pilota con il D-pad e **OK** apre il canale selezionato: la WebView non cattura più i tasti del telecomando.
- **☰ Menu rapido (v230)** — durante la visione, **MENU (≡)** apre la griglia dei 28 canali sopra il video, senza interruzioni: frecce per navigare, OK per cambiare, BACK per tornare.
- **🖥️ Visione a schermo pieno (v229)** — barra di chiusura e barra URL/Token si nascondono in automatico mentre guardi: esperienza pulita e immersiva.
- **🛡️ Scheda XROM stabile (v228)** — la WebView carica i menu locali dell'ecosistema XROM, espone il ponte `apriCanale(v, token)` e dialoga con `omega-engine.php` usando l'identità ufficiale (`xromtv.italia`): tutti i canali funzionano direttamente sul box.

### 🔐 Affidabilità e sicurezza (v238–v239)

- **Cifratura delle stringhe critiche (v239)** — URL/endpoint XROM, User-Agent e nome del ponte JS non sono più leggibili nel pacchetto, ma decodificati solo in memoria a runtime.
- **Verifica di firma (v239)** — all'avvio l'app controlla la propria firma: un APK ricompilato o ripackato non viene eseguito.
- **Offuscamento R8 completo (v238)** — rinomina classi e metodi, minificazione e repackaging: comportamento identico, decompilazione molto più difficile.

### ⏰ Orologio in alto a sinistra (v237)

Orologio di sistema nativo (`TextClock`) visibile **in alto a sinistra** durante la visione di tutti i canali — zero interferenze con i controlli del player o il cambio canale.

---

### ⚡ Bassa latenza WebRTC — come funziona
Il box crea automaticamente su **MediaMTX** un canale "pull-HLS" che ingesta lo stream (già risolto con User-Agent/referer dal box) e lo emette via **WHEP**. Il browser si collega direttamente a MediaMTX: latenza **<1s** (vs 3–10s HLS). Con `sourceOnDemand=true` l'upstream si apre **solo con spettatori**: niente doppio consumo sull'account max-1.

**Setup (una tantum):**
1. Installa MediaMTX (gratis, open source): `docker run --rm -p 8889:8889 -p 9997:9997 bluenviron/mediamtx` o il binario per Windows/Linux da `github.com/bluenviron/mediamtx/releases` (default: `webrtc` su 8889 e `api` su 9997 abilitati).
2. Apri `http://IP:8080/player` → ⚙ WebRTC → Host MediaMTX (default: `127.0.0.1`), Porta WHEP `8889`, Porta controllo `9997` → **Salva**.
3. Seleziona il canale → premi **⚡** per la bassa latenza. Alla fine si chiude da solo (il canale su MediaMTX viene rimosso).

**Nota:** serve MediaMTX ≥ 1.9 (sorgente HLS). Su GitHub Pages (HTTPS) il pulsante ⚡ usa un URL WHEP manuale: per la modalità automatica usa sempre il player dal box.

### 🎬 Il player
- ExoPlayer (Media3 1.3.1): HLS, DASH, SmoothStreaming, MP4, MKV
- DRM Widevine, Picture-in-Picture, selettore qualità, comandi Leanback per Android TV
- User-Agent / Referer / Origin / Cookie / Header personalizzati per ogni canale

### 🎛 I tre tasti principali
- **PRX** — Proxy Stalker + Provider M3U (condivisione canali via Firebase, senza VPS)
- **P2P** — Peer-to-peer: host, connessione peer, griglia "Canali in diretta", refresh ogni 30 min
- **XTV** — apre XromTV Revo + pulsante di ritorno (overlay + notifica cliccabile)

### 🔄 Relay Multi-Utente (max-1 risolto)
Un dispositivo apre **una sola** connessione a monte e la ridistribuisce a **N client** in tempo reale.
URL relay compatibile con qualsiasi player: `http://<ip>:<port>/peer/proxy?url=<encoded>` · supporto Cloudflare Tunnel.

### ✅ Funzionalità complete (v217–v227)
- Multi-Playlist M3U/M3U8 illimitate, parser robusto, ricerca istantanea
- Portale Stalker/Ministra (handshake, VOD, serie, EPG, catchup)
- Web Player integrato (`http://IP_BOX:8080/player`) + conversione HLS automatica per iPhone Safari
- Network Quality Monitor in tempo reale (banda, bitrate, risoluzione, buffer) + alert automatico
- Avvio canali rapido (2–4s), suite "connessioni lente", diagnostica completa
- Interfaccia Web integrata (porta 8080) + invio liste da web; backup/ripristino playlist, tema personalizzato

### 📥 Installazione / Aggiornamento
1. Scarica l'APK: [IPTVPlayer-v239.apk](https://github.com/gabri21063/iptv-updates/releases/download/v239/IPTVPlayer-v239.apk)
2. Android TV/Box: app **Downloader** → Code `2140263`
3. Telefono: abilita "Installa app sconosciute" → apri il link → installa
4. Aggiornamenti successivi: automatici (prompt in-app)

### ⚠️ Nota
L'app è un **player**: non fornisce contenuti, canali o playlist. Usa solo fonti legittime.

### 🙏 Ringraziamento
*Grazie al lavoro che **XROM TV** dedica alla propria piattaforma. La nostra integrazione nasce dal rispetto per chi costruisce ogni giorno servizi davvero funzionanti: cos'altro possiamo aggiungere? Buona visione.*

---

## 🇬🇧 ENGLISH

### 🤝 The XROM feature — a respectful integration

IPTV Player offers **seamless, non-invasive access** to XROM TV straight from the remote, keeping the exact technical identity of the official platform (original User-Agent and `Referer`). No content is hosted or mirrored: the app only routes the request to the service's servers, exactly as the official launcher would.

**All XROM additions introduced:**

- **📌 Always-available access (v236)** — the **XROM ▶** button next to EPG is fixed and works **even without a loaded playlist**: the bar shows XROM everywhere, other filters appear only when needed.
- **🤝 Respect splash (v232)** — on opening, a professional info page (auto-close in 5s with countdown, or *Continue* button) politely acknowledges the service's work, in 4 languages.
- **✅ Full navigation (v231)** — the channel grid is driven by the D-pad and **OK** opens the selected channel: the WebView no longer steals remote keys.
- **☰ Quick menu (v230)** — while watching, **MENU (≡)** opens the 28-channel grid over the video without interruption: arrows to browse, OK to switch, BACK to return.
- **🖥️ True full-screen viewing (v229)** — close bar and URL/Token bar auto-hide while watching: a clean, immersive experience.
- **🛡️ Stable XROM tab (v228)** — the WebView loads the local XROM ecosystem menus, exposes the `apriCanale(v, token)` bridge and talks to `omega-engine.php` with the official identity (`xromtv.italia`): every channel works right on the box.

### 🔐 Reliability & security (v238–v239)

- **Critical string encryption (v239)** — XROM URLs/endpoints, User-Agent and JS bridge name are no longer readable in the package, decoded only in memory at runtime.
- **Signature verification (v239)** — on startup the app checks its own signature: a rebuild or repackaged APK is not executed.
- **Full R8 obfuscation (v238)** — classes and methods renamed, minified and repackaged: identical behavior, decompilation far harder.

### ⏰ Top-left clock (v237)

Native system clock (`TextClock`) visible **in the top-left corner** during playback on every channel — zero impact on player controls or channel switching.

---

### ⚡ WebRTC ultra-low latency — how it works
The box automatically creates on **MediaMTX** a "pull-HLS" channel that ingests the stream (already resolved with User-Agent/referer by the box) and emits it via **WHEP**. The browser connects directly to MediaMTX: **<1s** latency (vs 3–10s HLS). With `sourceOnDemand=true` the upstream opens **only with viewers**: no double consumption on the max-1 account.

**One-time setup:**
1. Install MediaMTX (free, open source): `docker run --rm -p 8889:8889 -p 9997:9997 bluenviron/mediamtx` or the Windows/Linux binary from `github.com/bluenviron/mediamtx/releases` (defaults: `webrtc` on 8889 and `api` on 9997 enabled).
2. Open `http://IP:8080/player` → ⚙ WebRTC → MediaMTX host (default: `127.0.0.1`), WHEP port `8889`, control port `9997` → **Save**.
3. Select the channel → press **⚡** for low latency. It closes automatically when done (the MediaMTX channel is removed).

**Note:** MediaMTX ≥ 1.9 required (HLS source). On GitHub Pages (HTTPS) the ⚡ button uses a manual WHEP URL: for automatic mode always use the box player.

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

### ✅ Full feature set (v217–v227)
- Unlimited M3U/M3U8 multi-playlists, robust parser, instant search
- Stalker/Ministra portal (handshake, VOD, series, EPG, catchup)
- Built-in Web Player (`http://BOX_IP:8080/player`) + automatic HLS conversion for iPhone Safari
- Real-time Network Quality Monitor (bandwidth, bitrate, resolution, buffer) + automatic alert
- Fast channel start (2–4s), "slow connections" suite, full diagnostics
- Built-in Web UI (port 8080) + web list sender; playlist backup/restore, custom theme

### 📥 Install / Update
1. Download the APK: [IPTVPlayer-v239.apk](https://github.com/gabri21063/iptv-updates/releases/download/v239/IPTVPlayer-v239.apk)
2. Android TV/Box: **Downloader** app → Code `2140263`
3. Phone: enable "Install unknown apps" → open the link → install
4. Future updates: automatic (in-app prompt)

### ⚠️ Note
The app is a **player**: it does not provide content, channels or playlists. Use only legitimate sources.

### 🙏 Acknowledgement
*Thank you to **XROM TV** for the work they put into their platform. Our integration stems from respect for those who build genuinely working services every day: what else can we add? Enjoy the show.*

---

## 🇩🇪 DEUTSCH

### 🤝 Die XROM-Funktion — eine respektvolle Integration

IPTV Player bietet **nahtlosen, nicht-invasiven Zugriff** auf XROM TV direkt über die Fernbedienung und behält die exakte technische Identität der offiziellen Plattform bei (originaler User-Agent und `Referer`). Es werden keine Inhalte gehostet oder gespiegelt: Die App leitet die Anfrage lediglich an die Server des Dienstes weiter — genau wie der offizielle Launcher.

**Alle eingeführten XROM-Neuerungen:**

- **📌 Immer verfügbar (v236)** — der **XROM ▶**-Button neben EPG ist fest und funktioniert **auch ohne geladene Playlist**: Die Leiste zeigt XROM überall, weitere Filter erscheinen nur bei Bedarf.
- **🤝 Respekt-Splash (v232)** — beim Öffnen würdigt eine professionelle Info-Seite (Auto-Schließen nach 5s mit Countdown oder *Weiter*-Button) höflich die Arbeit des Dienstes, in 4 Sprachen.
- **✅ Volle Navigation (v231)** — das Kanalraster wird mit dem D-Pad gesteuert und **OK** öffnet den gewählten Kanal: Der WebView stiehlt keine Fernbedienungstasten mehr.
- **☰ Schnellmenü (v230)** — während der Wiedergabe öffnet **MENU (≡)** das 28-Kanäle-Raster über dem Video, ohne Unterbrechung: Pfeile zum Navigieren, OK zum Wechseln, BACK zum Zurückkehren.
- **🖥️ Echtes Vollbild (v229)** — Schließen-Leiste und URL/Token-Leiste werden während der Wiedergabe automatisch ausgeblendet: ein sauberes, immersives Erlebnis.
- **🛡️ Stabiler XROM-Tab (v228)** — der WebView lädt die lokalen XROM-Menüs, stellt die `apriCanale(v, token)`-Bridge bereit und spricht `omega-engine.php` mit der offiziellen Identität (`xromtv.italia`) an: Alle Kanäle laufen direkt auf der Box.

### 🔐 Zuverlässigkeit & Sicherheit (v238–v239)

- **Verschlüsselung kritischer Strings (v239)** — XROM-URLs/Endpunkte, User-Agent und Name der JS-Bridge sind im Paket nicht mehr lesbar, sondern werden nur zur Laufzeit im Speicher entschlüsselt.
- **Signaturprüfung (v239)** — beim Start prüft die App ihre eigene Signatur: Ein neu gebautes oder repacktes APK wird nicht ausgeführt.
- **Volle R8-Verschleierung (v238)** — Klassen und Methoden umbenannt, minifiziert und neu verpackt: gleiches Verhalten, Dekompilierung deutlich schwieriger.

### ⏰ Uhr oben links (v237)

Native Systemuhr (`TextClock`) sichtbar **oben links** bei der Wiedergabe aller Kanäle — kein Einfluss auf Bedienelemente oder Kanalwechsel.

---

### ⚡ WebRTC Ultra-Niedriglatenz — so funktioniert es
Die Box erstellt automatisch auf **MediaMTX** einen "Pull-HLS"-Kanal, der den Stream (von der Box bereits mit User-Agent/Referer aufgelöst) aufnimmt und via **WHEP** ausgibt. Der Browser verbindet sich direkt mit MediaMTX: **<1s** Latenz (vs. 3–10s HLS). Mit `sourceOnDemand=true` öffnet sich der Upstream **nur mit Zuschauern**: kein doppelter Verbrauch beim max-1-Konto.

**Einmalige Einrichtung:**
1. MediaMTX installieren (kostenlos, Open Source): `docker run --rm -p 8889:8889 -p 9997:9997 bluenviron/mediamtx` oder Windows/Linux-Binary von `github.com/bluenviron/mediamtx/releases` (Standard: `webrtc` auf 8889 und `api` auf 9997 aktiv).
2. `http://IP:8080/player` öffnen → ⚙ WebRTC → MediaMTX-Host (Standard: `127.0.0.1`), WHEP-Port `8889`, Kontroll-Port `9997` → **Speichern**.
3. Kanal wählen → **⚡** für Niedriglatenz drücken. Wird nach Beendigung automatisch geschlossen (MediaMTX-Kanal wird entfernt).

**Hinweis:** MediaMTX ≥ 1.9 erforderlich (HLS-Quelle). Auf GitHub Pages (HTTPS) nutzt die ⚡-Taste eine manuelle WHEP-URL: Für den automatischen Modus immer den Box-Player verwenden.

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

### ✅ Vollständiger Funktionsumfang (v217–v227)
- Unbegrenzte M3U/M3U8-Multi-Playlists, robuster Parser, Sofortsuche
- Stalker/Ministra-Portal (Handshake, VOD, Serien, EPG, Catchup)
- Integrierter Web Player (`http://BOX_IP:8080/player`) + automatische HLS-Konvertierung für iPhone Safari
- Netzwerk-Qualitätsmonitor in Echtzeit (Bandbreite, Bitrate, Auflösung, Puffer) + automatischer Alert
- Schneller Kanalstart (2–4s), Suite für "langsame Verbindungen", vollständige Diagnose
- Integrierte Web-UI (Port 8080) + Web-Listenversand; Playlist-Backup/-Wiederherstellung, eigenes Design

### 📥 Installation / Update
1. APK herunterladen: [IPTVPlayer-v239.apk](https://github.com/gabri21063/iptv-updates/releases/download/v239/IPTVPlayer-v239.apk)
2. Android TV/Box: **Downloader**-App → Code `2140263`
3. Phone: "Unbekannte Apps installieren" aktivieren → Link öffnen → installieren
4. Weitere Updates: automatisch (In-App-Hinweis)

### ⚠️ Hinweis
Die App ist ein **Player**: Sie stellt keine Inhalte, Kanäle oder Playlists bereit. Nur legitime Quellen nutzen.

### 🙏 Danksagung
*Danke für die Arbeit, die **XROM TV** in ihre Plattform steckt. Unsere Integration entsteht aus Respekt für alle, die jeden Tag echte, funktionierende Dienste bauen: Was bleibt uns sonst zu sagen? Viel Vergnügen.*

---

## 🇫🇷 FRANÇAIS

### 🤝 La fonctionnalité XROM — une intégration respectueuse

IPTV Player offre un **accès intégré et non invasif** à XROM TV, directement depuis la télécommande, en conservant l'identité technique exacte de la plateforme officielle (User-Agent et `Referer` d'origine). Aucun contenu n'est hébergé ni répliqué : l'application se contente d'acheminer la requête vers les serveurs du service, exactement comme le ferait le lanceur officiel.

**Toutes les nouveautés XROM introduites :**

- **📌 Accès toujours disponible (v236)** — le bouton **XROM ▶** à côté d'EPG est fixe et fonctionne **même sans playlist chargée** : la barre montre XROM partout, les autres filtres n'apparaissent qu'en cas de besoin.
- **🤝 Écran de respect (v232)** — à l'ouverture, une page d'information professionnelle (fermeture automatique en 5s avec compte à rebours, ou bouton *Continuer*) reconnaît poliment le travail du service, en 4 langues.
- **✅ Navigation complète (v231)** — la grille des chaînes se pilote avec le D-pad et **OK** ouvre la chaîne sélectionnée : la WebView ne capte plus les touches de la télécommande.
- **☰ Menu rapide (v230)** — pendant la lecture, **MENU (≡)** ouvre la grille des 28 chaînes par-dessus la vidéo, sans interruption : flèches pour naviguer, OK pour changer, BACK pour revenir.
- **🖥️ Plein écran réel (v229)** — la barre de fermeture et la barre URL/Token se masquent automatiquement pendant la lecture : une expérience propre et immersive.
- **🛡️ Onglet XROM stable (v228)** — la WebView charge les menus locaux de l'écosystème XROM, expose le pont `apriCanale(v, token)` et dialogue avec `omega-engine.php` sous l'identité officielle (`xromtv.italia`) : toutes les chaînes fonctionnent directement sur le boîtier.

### 🔐 Fiabilité et sécurité (v238–v239)

- **Chiffrement des chaînes critiques (v239)** — les URLs/points de terminaison XROM, le User-Agent et le nom du pont JS ne sont plus lisibles dans le paquet, décodés uniquement en mémoire à l'exécution.
- **Vérification de signature (v239)** — au démarrage, l'application contrôle sa propre signature : un APK recompilé ou re-packagé n'est pas exécuté.
- **Offuscation R8 complète (v238)** — classes et méthodes renommées, minifiées et re-packagées : comportement identique, décompilation bien plus difficile.

### ⏰ Horloge en haut à gauche (v237)

Horloge système native (`TextClock`) visible **en haut à gauche** pendant la lecture de toutes les chaînes — aucun impact sur les commandes ou le changement de chaîne.

---

### ⚡ Basse latence WebRTC — comment ça marche
Le boîtier crée automatiquement sur **MediaMTX** un canal "pull-HLS" qui ingère le flux (déjà résolu avec User-Agent/referer par le boîtier) et l'émet via **WHEP**. Le navigateur se connecte directement à MediaMTX : **<1s** de latence (vs 3–10s HLS). Avec `sourceOnDemand=true`, l'amont ne s'ouvre **qu'avec des spectateurs** : aucune double consommation sur le compte max-1.

**Configuration (une fois) :**
1. Installez MediaMTX (gratuit, open source) : `docker run --rm -p 8889:8889 -p 9997:9997 bluenviron/mediamtx` ou le binaire Windows/Linux de `github.com/bluenviron/mediamtx/releases` (défauts : `webrtc` sur 8889 et `api` sur 9997 actifs).
2. Ouvrez `http://IP:8080/player` → ⚙ WebRTC → Hôte MediaMTX (défaut : `127.0.0.1`), port WHEP `8889`, port de contrôle `9997` → **Enregistrer**.
3. Sélectionnez la chaîne → appuyez sur **⚡** pour la basse latence. Se ferme automatiquement (le canal MediaMTX est supprimé).

**Remarque :** MediaMTX ≥ 1.9 requis (source HLS). Sur GitHub Pages (HTTPS), le bouton ⚡ utilise une URL WHEP manuelle : pour le mode automatique, utilisez toujours le lecteur du boîtier.

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

### ✅ Fonctionnalités complètes (v217–v227)
- Multi-playlists M3U/M3U8 illimitées, parseur robuste, recherche instantanée
- Portail Stalker/Ministra (handshake, VOD, séries, EPG, catchup)
- Lecteur Web intégré (`http://BOX_IP:8080/player`) + conversion HLS automatique pour iPhone Safari
- Moniteur de qualité réseau en temps réel (bande passante, débit, résolution, tampon) + alerte automatique
- Démarrage rapide des chaînes (2–4s), suite « connexions lentes », diagnostic complet
- Interface Web intégrée (port 8080) + envoi de listes ; sauvegarde/restauration des playlists, thème personnalisé

### 📥 Installation / Mise à jour
1. Téléchargez l'APK : [IPTVPlayer-v239.apk](https://github.com/gabri21063/iptv-updates/releases/download/v239/IPTVPlayer-v239.apk)
2. Android TV/Box : app **Downloader** → Code `2140263`
3. Téléphone : activez « Installer les applications inconnues » → ouvrez le lien → installez
4. Mises à jour suivantes : automatiques (invite dans l'app)

### ⚠️ Note
L'application est un **lecteur** : elle ne fournit ni contenus, ni chaînes, ni playlists. Utilisez uniquement des sources légitimes.

### 🙏 Remerciement
*Merci pour le travail que **XROM TV** consacre à sa plateforme. Notre intégration naît du respect pour celles et ceux qui construisent chaque jour des services réellement fonctionnels : que dire de plus ? Bonne séance.*

---

## 🔗 Link / Links / Links / Liens

- 📥 APK: `https://github.com/gabri21063/iptv-updates/releases/download/v239/IPTVPlayer-v239.apk`
- 🖥 Invia liste al device / Send lists / Listen senden / Envoyer des listes: `https://gbclient.github.io/iptv-client/`
- ⚡ Bassa latenza WebRTC / Low latency (MediaMTX): `https://github.com/bluenviron/mediamtx/releases`
- 🔑 Downloader Code: `2140263`
- 🏷 `#IPTV #IPTVPlayer #M3U #ExoPlayer #AndroidTV #FireStick #Relay #P2P #StalkerPortal #Media3 #Kotlin #WebRTC #WHEP #MediaMTX`