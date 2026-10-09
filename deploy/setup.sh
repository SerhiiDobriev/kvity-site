#!/usr/bin/env bash
# KVITY — установка демо-сайта на сервер (Ubuntu + nginx).
# Запуск (в веб-консоли Hetzner, от root):
#   curl -sL raw.githubusercontent.com/SerhiiDobriev/kvity-site/main/deploy/setup.sh -o /tmp/kvity.sh
#   bash /tmp/kvity.sh
# Скрипт можно запускать повторно. Чужие сайты и конфиги (TutorMate) не трогает.

set -euo pipefail

DOMAIN="kvity.tutormate.site"
REPO="https://github.com/SerhiiDobriev/kvity-site.git"
DIR="/var/www/kvity"
SERVER_IP="95.217.133.58"

say()  { printf '\n\033[1;35m== %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m   OK:\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m   !!\033[0m %s\n' "$*"; }

[ "$(id -u)" -eq 0 ] || { echo "Запустите от root"; exit 1; }

say "1/6  Код сайта из GitHub"
command -v git >/dev/null || apt-get install -y -qq git
if [ -d "$DIR/.git" ]; then
  git -C "$DIR" pull --ff-only -q
  ok "обновлено: $DIR"
else
  mkdir -p "$(dirname "$DIR")"
  git clone -q --depth 1 "$REPO" "$DIR"
  ok "скачано в $DIR"
fi

say "2/6  Конфиг nginx только для $DOMAIN"
if grep -qs "sites-enabled" /etc/nginx/nginx.conf; then
  CONF="/etc/nginx/sites-available/kvity"
  LINK="/etc/nginx/sites-enabled/kvity"
else
  CONF="/etc/nginx/conf.d/kvity.conf"
  LINK=""
fi

if [ -f "$CONF" ]; then
  ok "конфиг уже есть ($CONF) — не перезаписываю (там может быть HTTPS от certbot)"
else
  cat > "$CONF" <<EOF
# KVITY demo — $DOMAIN (создано deploy/setup.sh)
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    root $DIR/site;
    index index.html;

    # демо: не индексировать поисковиками
    add_header X-Robots-Tag "noindex, nofollow" always;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~* \.(?:jpg|jpeg|png|webp|svg|css|js)$ {
        expires 7d;
        add_header Cache-Control "public";
        add_header X-Robots-Tag "noindex, nofollow" always;
    }
}
EOF
  ok "создан $CONF"
fi
[ -n "$LINK" ] && ln -sf "$CONF" "$LINK"

if nginx -t 2>/tmp/kvity-nginx-test.log; then
  systemctl reload nginx
  ok "nginx проверен и перезагружен"
else
  warn "nginx -t нашёл ошибку — откатываю конфиг KVITY, остальные сайты не тронуты:"
  cat /tmp/kvity-nginx-test.log
  [ -n "$LINK" ] && rm -f "$LINK"
  rm -f "$CONF"
  exit 1
fi

say "3/6  Проверка DNS"
RESOLVED="$(getent ahostsv4 "$DOMAIN" | awk 'NR==1{print $1}' || true)"
if [ "$RESOLVED" = "$SERVER_IP" ]; then
  ok "$DOMAIN -> $RESOLVED"
  DNS_OK=1
else
  warn "$DOMAIN пока не указывает на $SERVER_IP (сейчас: ${RESOLVED:-нет записи})."
  warn "Добавьте A-запись kvity -> $SERVER_IP в Namecheap, подождите 5-15 минут и запустите: bash /tmp/kvity.sh"
  DNS_OK=0
fi

say "4/6  HTTPS (Let's Encrypt)"
if [ "$DNS_OK" = 1 ]; then
  if ! command -v certbot >/dev/null || ! certbot plugins 2>/dev/null | grep -q nginx; then
    apt-get update -qq && apt-get install -y -qq certbot python3-certbot-nginx
  fi
  if certbot certificates 2>/dev/null | grep -q "Domains: .*$DOMAIN"; then
    ok "сертификат уже есть"
  else
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect
    ok "сертификат выпущен, включён редирект на https"
  fi
else
  warn "пропущено — сначала DNS"
fi

say "5/6  Автообновление из GitHub (каждые 2 минуты)"
cat > /etc/cron.d/kvity <<EOF
# KVITY: подтягивать изменения сайта из GitHub
*/2 * * * * root git -C $DIR pull --ff-only -q >/dev/null 2>&1
EOF
chmod 644 /etc/cron.d/kvity
ok "после git push сайт обновится сам"

say "6/6  Скорость: HTTP/2, сжатие, кэш (только для $DOMAIN)"
cp "$CONF" "$CONF.bak"
# HTTP/2 — директивой внутри server{} (nginx >= 1.25.1), чтобы не затрагивать другие сайты
if grep -q "listen 443 ssl" "$CONF" && ! grep -q "http2 on" "$CONF"; then
  sed -i '0,/listen 443 ssl;/s//listen 443 ssl;\n    http2 on;/' "$CONF"
fi
# gzip для текстовых файлов
if ! grep -q "gzip_types" "$CONF"; then
  sed -i '0,/index index.html;/s//index index.html;\n\n    gzip on;\n    gzip_types text\/css application\/javascript image\/svg+xml;/' "$CONF"
fi
# css/js не держать в кэше 7 дней (иначе после обновлений видна старая версия)
sed -i 's/(?:jpg|jpeg|png|webp|svg|css|js)\$/(?:jpg|jpeg|png|webp|svg|woff2)$/' "$CONF"

if nginx -t 2>/tmp/kvity-nginx-test.log; then
  systemctl reload nginx
  rm -f "$CONF.bak"
  ok "HTTP/2 и сжатие включены"
else
  warn "nginx -t не принял изменения — возвращаю прежний конфиг KVITY:"
  cat /tmp/kvity-nginx-test.log
  mv "$CONF.bak" "$CONF"
  nginx -t && systemctl reload nginx
fi

say "Готово"
if [ "$DNS_OK" = 1 ]; then
  echo "   https://$DOMAIN"
else
  echo "   Сайт заработает после DNS. Повторите: bash /tmp/kvity.sh"
fi
