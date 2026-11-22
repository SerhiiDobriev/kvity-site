#!/usr/bin/env bash
# Выкладка конструктора фото на сервер (из Git Bash): bash foto/deploy.sh
# Сайт kvity при этом не трогается. Фото и раскладка Алины лежат в /opt/kvityfoto/data и не стираются.
set -euo pipefail
cd "$(dirname "$0")"
KEY="${KVITY_SSH_KEY:-/c/Users/Sergey/Documents/Codex/2026-09-12/handoff-for-next-agent-md-x20-2/work/deploy-key/tutormate-github-actions}"
HOST="${KVITY_HOST:-root@95.217.133.58}"
ssh_() { ssh -i "$KEY" -o BatchMode=yes -o ConnectTimeout=15 "$HOST" "$@"; }

# Пароль: при первой выкладке берётся из foto/.env (в git не идёт), дальше живёт на сервере
if ! ssh_ 'test -f /opt/kvityfoto/.env'; then
  test -f .env || { echo "Нет foto/.env с FOTO_PASSWORD=..."; exit 1; }
  ssh_ 'mkdir -p /opt/kvityfoto && umask 077 && cat > /opt/kvityfoto/.env' < .env
  echo "Пароль записан в /opt/kvityfoto/.env"
fi

tar czf - Dockerfile docker-compose.yml server.js public | ssh_ '
  set -e
  B=/opt/kvityfoto
  mkdir -p $B/data && chown 1000:1000 $B/data
  rm -rf $B/app.new && mkdir $B/app.new && tar xzf - -C $B/app.new
  rm -rf $B/app.old; if [ -d $B/app ]; then mv $B/app $B/app.old; fi
  mv $B/app.new $B/app
  cd $B/app && docker compose -p kvityfoto up -d --build
  sleep 2
  curl -fsS -o /dev/null -w "foto: %{http_code}\n" http://127.0.0.1:4100/foto/
'
