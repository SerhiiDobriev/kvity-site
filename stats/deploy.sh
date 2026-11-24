#!/usr/bin/env bash
# Выкладка статистики на сервер (из Git Bash): bash stats/deploy.sh
# Сайт и конструктор не трогаются. Данные статистики лежат в /opt/kvitystats/data и не стираются.
set -euo pipefail
cd "$(dirname "$0")"
KEY="${KVITY_SSH_KEY:-/c/Users/Sergey/Documents/Codex/2026-09-12/handoff-for-next-agent-md-x20-2/work/deploy-key/tutormate-github-actions}"
HOST="${KVITY_HOST:-root@95.217.133.58}"
ssh_() { ssh -i "$KEY" -o BatchMode=yes -o ConnectTimeout=15 "$HOST" "$@"; }

tar czf - Dockerfile docker-compose.yml server.js public nginx-stats.conf | ssh_ '
  set -e
  B=/opt/kvitystats
  mkdir -p $B/data && chown 1000:1000 $B/data
  rm -rf $B/app.new && mkdir $B/app.new && tar xzf - -C $B/app.new
  rm -rf $B/app.old; if [ -d $B/app ]; then mv $B/app $B/app.old; fi
  mv $B/app.new $B/app
  cd $B/app && docker compose -p kvitystats up -d --build
  # nginx: один раз вставляем location /stats/ в сайт kvity (рядом с /foto/)
  F=/etc/nginx/sites-available/kvity
  if ! grep -q "location \^~ /stats/" $F; then
    cp $F /root/kvity.nginx.bak-$(date +%Y%m%d-%H%M%S)
    python3 - "$F" "$B/app/nginx-stats.conf" <<"PY"
import sys
f, snip = sys.argv[1], open(sys.argv[2]).read()
s = open(f).read()
anchor = "    location = /foto {"
assert s.count(anchor) == 1
s = s.replace(anchor, snip.rstrip("\n") + "\n\n" + anchor, 1)
open(f, "w").write(s)
PY
    nginx -t && systemctl reload nginx
  fi
  sleep 2
  curl -fsS -o /dev/null -w "stats: %{http_code}\n" http://127.0.0.1:4200/stats/
'
