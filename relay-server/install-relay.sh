#!/usr/bin/env bash
# Installa il relay IPTV su una VM Ubuntu (22/24) come servizio systemd.
# Uso:  sudo bash install-relay.sh [PORT] [TOKEN]
# Es.   sudo bash install-relay.sh 3000 mioTokenSegreto
set -euo pipefail

PORT="${1:-3000}"
TOKEN="${2:-}"
DIR="/opt/iptv-relay"

echo ">> installazione su $HOSTNAME (port $PORT)"

apt-get update -y
apt-get install -y curl ca-certificates

# Node.js LTS 20
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

mkdir -p "$DIR"
cd "$DIR"

# Scarica/aggiorna il relay dalla repo (modifica la riga se usi un fork/mirror)
RELAY_REPO="https://raw.githubusercontent.com/gabri21063/iptv-updates/main/relay-server"
curl -fsSL -o server.js    "$RELAY_REPO/server.js"
curl -fsSL -o package.json "$RELAY_REPO/package.json"

if [ ! -d node_modules ]; then
  npm install --omit=dev --no-audit --no-fund
fi

# systemd unit
cat > /etc/systemd/system/iptv-relay.service <<UNIT
[Unit]
Description=IPTV Relay Proxy
After=network.target

[Service]
WorkingDirectory=$DIR
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=3
Environment=PORT=$PORT
$( [ -n "$TOKEN" ] && echo "Environment=AUTH_TOKEN=$TOKEN" )
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable iptv-relay.service
systemctl restart iptv-relay.service

IP=$(curl -s https://api.ipify.org || hostname -I | awk '{print $1}')
echo ""
echo ">>> RELAY ONLINE"
echo ">>> Test:"
echo "     curl http://$IP:$PORT/health"
echo "     curl -s 'http://$IP:$PORT/proxy?url=http%3A%2F%2Fapi.ipify.org'"
echo ">>> Per tutti i client aggiungi l'URL su Firebase RTDB:"
echo "     /relay/config/server = http://$IP:$PORT"
echo "     /relay/config/servers = [...esistenti, \"http://$IP:$PORT\"]"