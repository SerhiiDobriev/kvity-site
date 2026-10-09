# KVITY — демо-сайт цветочной студии

Статический сайт (HTML/CSS/JS, без сборки и бэкенда). Mobile-first, 4 языка (RO по умолчанию / EN / UA / RU).

## Структура
```
site/index.html        — разметка
site/css/style.css     — стили и анимации
site/js/config.js      — ВСЕ контакты: номер WhatsApp, телефон, адреса, ссылки, галерея, отзывы, юр. данные
site/js/i18n.js        — все тексты на 4 языках
site/js/main.js        — логика: язык, галерея/лайтбокс, форма → WhatsApp, анимации
site/img/              — фото WebP: <id>.webp (большое) и <id>-s.webp (превью), og.jpg — превью ссылки
site/fonts/            — шрифты Jost и Cormorant Italic (свои, без Google Fonts)
site/v1/               — первая версия сайта (для сравнения): /v1/
photos-raw/            — исходные фото от владелицы (в git не попадают)
deploy/setup.sh        — установка на сервер (nginx + HTTPS + автообновление)
```

## Как поменять
- **Номер для заявок / телефон / адреса** → `site/js/config.js` (`whatsapp` — только цифры с кодом страны).
- **Тексты** → `site/js/i18n.js`, ключи одинаковые для всех языков.
- **Фото галереи** → сделать `site/img/gNN.webp` (до 1280 px) и `site/img/gNN-s.webp` (640 px), добавить `{ id, cat }` в `gallery` в `site/js/config.js` и подпись в `gallery.captions` в `site/js/i18n.js` (для всех 4 языков). Категории: bouquets, xl, baskets, wedding, balloons.
- **Рейтинги Google** → `rating` и `reviews` у каждой студии в `site/js/config.js` (выдуманных отзывов на сайте нет).

## Запуск локально
```bash
python -m http.server 5500 --directory site
```
Открыть http://localhost:5500. С телефона в той же Wi-Fi сети: `http://<IP компьютера>:5500`.

Язык выбирается так: `?lang=ro|en|ua|ru` → сохранённый выбор → язык браузера → RO.

## Публикация — https://kvity.tutormate.site
Сайт живёт на сервере Hetzner (95.217.133.58) рядом с TutorMate, в `/var/www/kvity`, отдельный конфиг nginx.
Сервер сам подтягивает изменения из GitHub (`SerhiiDobriev/kvity-site`) каждые 2 минуты, поэтому обновление — это просто:
```bash
git add -A
git commit -m "Обновление сайта"
git push
```
Первичная установка (один раз, в веб-консоли Hetzner от root — команды без спецсимволов, консоль их не портит):
```bash
curl -sL raw.githubusercontent.com/SerhiiDobriev/kvity-site/main/deploy/setup.sh -o /tmp/kvity.sh
bash /tmp/kvity.sh
```
DNS (Namecheap → Advanced DNS): A-запись `kvity` → `95.217.133.58`.

**После правок CSS/JS** увеличь версию в `site/index.html` (`?v=2.1` → `?v=2.2`), чтобы браузеры сразу взяли новые файлы.


## Дизайн (v2, «modern luxe»)
По её бренду (@kvity_flori): логотип KVITY с цветком-«одуванчиком» над I, персиково-пудровый #F6DDD1 + светло-серый + чёрный,
шрифт Jost (строгий гротеск как на лентах) + Cormorant Italic для акцентов. Анимации сдержанные: медленный зум первого фото,
мягкое появление блоков при прокрутке, плавная смена фильтров галереи. При «уменьшить движение» всё отключается.
Курсив (<em>) не ставить на румынские слова с «î/â» — в Cormorant Italic значок висит слишком высоко.

## До показа / открытые вопросы
- Главный номер для WhatsApp (сейчас +40 727 244 681).
- Реальные отзывы, юр. данные (фирма, CUI, email), политика конфиденциальности.
- Проверка румынских текстов носителем.
