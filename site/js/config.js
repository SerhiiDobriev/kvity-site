/*
 * KVITY — все контакты, адреса, ссылки и галерея в одном месте.
 * Меняй только этот файл, чтобы обновить данные на сайте.
 */
window.KVITY_CONFIG = {
  brand: "KVITY",

  // Номер для заявок в WhatsApp: только цифры, с кодом страны, без "+".
  // TODO: уточнить у владелицы главный номер (+40 727 244 681 / +40 747 263 524 / +380 93 703 1103).
  whatsapp: "40727244681",

  // Главный телефон для кнопок «Позвонить».
  phone: "+40 727 244 681",

  telegram: "https://t.me/kvity_flori", // группа/канал студии (для ссылок «Мы в Telegram»)

  // Личный Telegram-ник для ЗАЯВОК (без @). Пока пусто — кнопка «Отправить в Telegram» скрыта.
  // НЕ ставить сюда группу kvity_flori: там 1200+ участников, они увидят имя, телефон и адрес клиента.
  // Аккаунт «KVITY Manager» (личный, для заказов) — проверено 2026-11-13.
  telegramOrders: "kvity_manager",
  instagram: "https://www.instagram.com/kvity_flori/",

  // Бюджеты в леях (кнопки в форме), список Алины 22.11.2026. «Власна сума» добавляется автоматически.
  budgets: ["120–150", "150–200", "250–350", "450–500", "550–750", "800–1000", "1000+"],

  // Подпись разработчика внизу сайта (правка 30). Пустой telegram/whatsapp — значок не показывается.
  credit: {
    name: { ro: "Serhii Dobriev", en: "Serhii Dobriev", ua: "Сергій Добрєв" },
    telegram: "serhiidob",       // ник без @
    whatsapp: "380994768052"     // номер только цифрами, с кодом страны
  },

  studios: [
    {
      id: "constanta",
      name: "Constanța",
      address: "Bulevardul Aurel Vlaicu 305, 900001 Constanța",
      phone: "+40 727 244 681",
      hours: "09:00–19:00",
      rating: 5.0,
      reviews: 12,
      // Точная точка и карточка в Google Maps (маршрут, карта, отзывы)
      lat: 44.2095337,
      lng: 28.6170152,
      placeId: "ChIJcfB7xanxukARjQSgXdOneUs"
    },
    {
      id: "navodari",
      name: "Mamaia · Năvodari",
      address: "Strada Prelungirea D12 nr. 6BIS, Bloc C2, 905700 Năvodari",
      phone: "+40 727 244 681",
      hours: "09:00–19:00",
      rating: 4.7,
      reviews: 43,
      lat: 44.304458,
      lng: 28.6256995,
      placeId: "ChIJ9bsDKWH3ukAR1lI4RegLZtQ"
    }
  ],

  // Настоящие отзывы из Google Maps: текст дословно (длинные — фрагментом с «…»), имя сокращено. Проверено 2026-10-09.
  // studio — id студии выше.
  reviews: [
    { name: "Viktor G.", studio: "navodari", text: "…Цветы свежие, упаковка шикарная, внимание к деталям. Однозначно, не пожалеете." },
    { name: "Vladyslav L.", studio: "constanta", text: "Am cumpărat ieri flori din acest loc. Sunt foarte frumoase și proaspete! Soției și fiicei mele le-au plăcut enorm. Personalul este foarte amabil, fetele sunt drăguțe și își fac treaba de minune. Recomand cu încredere și ofer nota 5!" },
    { name: "Maksim K.", studio: "navodari", text: "…Заказывал девушке бело-розовый букет. Очень нежные, воздушный, а самое главное, что девушка просто в восторге! Спасибо вам огромное!" },
    { name: "Вадим К.", studio: "constanta", text: "Очень повезло что я нашел этот магазин! Когда вошел даже растерялся от такого обилия красоты! Жена была восхищена таким букетом цветов! Спасибо вам девочки за праздник!!! Всем рекомендую" },
    { name: "Ivan O.", studio: "navodari", text: "Хороший сервис, отличные цветы, стоят уже вторую неделю в отличном состоянии. Крайне рекомендую." },
    { name: "Денис К.", studio: "navodari", text: "Наверное лучший цветочный магазин в Мамаи" }
  ],

  // Категории = разделы её Instagram. Порядок задаёт порядок фильтров.
  // Пустые категории (без фото) на сайте не показываются.
  categories: ["bouquets", "mono", "xl", "baskets", "wedding", "balloons", "christmas"],

  // Обложки категорий (img/<id>-s.webp). Нет обложки — берётся первое фото категории.
  categoryCovers: { balloons: "cover-balloons", baskets: "cover-baskets", bouquets: "k128", christmas: "cover-christmas", mono: "cover-mono", wedding: "cover-wedding", xl: "cover-xl" },

  // Галерея: файлы img/<id>-<slug>.webp (большое) и img/<id>-<slug>-s.webp (превью). slug — по-румынски, для Google.
  // Подписи — в js/i18n.js → gallery.captions.<id>.
  // Фото и подписи — от Алины из конструктора (22.11.2026, обновлено 24.11.2026)
  gallery: [
    { id: "k001", slug: "hortensii-roz-cu-trandafiri", cat: "bouquets" },
    { id: "k002", slug: "baloane-roz-sidefate", cat: "balloons" },
    { id: "k003", slug: "hortensii-lila-si-baloane-inima", cat: "balloons" },
    { id: "k004", slug: "baloane-pudra-si-cosuri-cu-flori", cat: "balloons" },
    { id: "k005", slug: "baloane-inima-lila", cat: "balloons" },
    { id: "k006", slug: "buchet-cu-hortensii-si-baloane-pastel", cat: "balloons" },
    { id: "k007", slug: "baloane-cu-funda-si-norisor", cat: "balloons" },
    { id: "k009", slug: "baloane-albe-si-aurii", cat: "balloons" },
    { id: "k010", slug: "baloane-cu-dinozauri", cat: "balloons" },
    { id: "k011", slug: "baloane-negre-si-trandafiri-rosii", cat: "balloons" },
    { id: "k012", slug: "cifra-10-si-baloane", cat: "balloons" },
    { id: "k013", slug: "baloane-roz-si-buchet-cu-hortensii", cat: "balloons" },
    { id: "k014", slug: "baloane-pastel-cu-inima-argintie", cat: "balloons" },
    { id: "k015", slug: "baloane-pahar-si-luna", cat: "balloons" },
    { id: "k016", slug: "baloane-albe-si-buchet-de-trandafiri-zmeurii", cat: "balloons" },
    { id: "k017", slug: "baloane-norisori", cat: "balloons" },
    { id: "k018", slug: "baloane-inima-rosii-si-trandafiri", cat: "balloons" },
    { id: "k019", slug: "baloane-lila", cat: "balloons" },
    { id: "k020", slug: "baloane-roz", cat: "balloons" },
    { id: "k021", slug: "baloane-pudra-cu-fundite", cat: "balloons" },
    { id: "k022", slug: "baloane-delicate-cu-cifre", cat: "balloons" },
    { id: "k023", slug: "baloane-galbene", cat: "balloons" },
    { id: "k024", slug: "baloane-negru-aurii-cu-zebra", cat: "balloons" },
    { id: "k025", slug: "baloane-pentru-2-ani-cu-excavator", cat: "balloons" },
    { id: "k026", slug: "baloane-albe-cu-funde-rosii", cat: "balloons" },
    { id: "k027", slug: "baloane-gaming-de-ziua-de-nastere", cat: "balloons" },
    { id: "k028", slug: "baloane-cu-inima-rosie", cat: "balloons" },
    { id: "k029", slug: "baloane-roz-si-bleu", cat: "balloons" },
    { id: "k030", slug: "baloane-transparente-si-argintii", cat: "balloons" },
    { id: "k031", slug: "cifra-16-si-baloane-piersica", cat: "balloons" },
    { id: "k032", slug: "cifrele-23", cat: "balloons" },
    { id: "k033", slug: "baloane-negru-aurii", cat: "balloons" },
    { id: "k034", slug: "baloane-pastel", cat: "balloons" },
    { id: "k035", slug: "cifra-7-si-baloane-bleu", cat: "balloons" },
    { id: "k036", slug: "trandafiri-tufa-tip-bujor", cat: "mono" },
    { id: "k037", slug: "hortensii-roz", cat: "mono" },
    { id: "k038", slug: "aranjament-de-craciun-in-cutie-roz", cat: "christmas" },
    { id: "k039", slug: "cos-de-craciun-cu-brad", cat: "christmas" },
    { id: "k040", slug: "buchet-de-iarna-cu-trandafiri-si-fructe-rosii", cat: "christmas" },
    { id: "k041", slug: "aranjamente-de-craciun-cu-globuri", cat: "christmas" },
    { id: "k042", slug: "coronita-de-craciun-cu-panglici-rosii", cat: "christmas" },
    { id: "k043", slug: "coronita-din-brad", cat: "christmas" },
    { id: "k044", slug: "braduti-in-hartie-kraft", cat: "christmas" },
    { id: "k045", slug: "aranjament-de-craciun-cu-globuri-alb-negru", cat: "christmas" },
    { id: "k046", slug: "coronita-de-iarna-cu-perle", cat: "christmas" },
    { id: "k047", slug: "aranjament-de-craciun-in-cutie", cat: "christmas" },
    { id: "k048", slug: "aranjament-de-craciun-cu-globuri", cat: "christmas" },
    { id: "k049", slug: "buchet-de-mireasa-cu-anthurium", cat: "wedding" },
    { id: "k050", slug: "buchet-de-mireasa-cu-ranunculus", cat: "wedding" },
    { id: "k051", slug: "buchet-de-mireasa-cu-anthurium-si-bujori", cat: "wedding" },
    { id: "k052", slug: "buchet-de-mireasa-cu-orhidee-si-trandafiri", cat: "wedding" },
    { id: "k053", slug: "lumanari-de-nunta-cu-orhidee", cat: "wedding" },
    { id: "k054", slug: "buchete-pentru-mireasa-si-domnisoara-de-onoare", cat: "wedding" },
    { id: "k055", slug: "buchet-de-mireasa-cu-trandafiri-crem", cat: "wedding" },
    { id: "k056", slug: "buchet-de-mireasa-cu-delphinium", cat: "wedding" },
    { id: "k057", slug: "lumanare-de-nunta-cu-orhidee", cat: "wedding" },
    { id: "k058", slug: "baloane-cu-buline", cat: "balloons" },
    { id: "k059", slug: "trandafiri-rosii", cat: "mono" },
    { id: "k060", slug: "buchet-de-mireasa-cu-cale", cat: "wedding" },
    { id: "k061", slug: "buchet-de-mireasa-cu-trandafiri-si-amarant", cat: "wedding" },
    { id: "k062", slug: "buchet-de-mireasa-cu-lisianthus", cat: "wedding" },
    { id: "k063", slug: "buchet-de-mireasa-cu-protea", cat: "wedding" },
    { id: "k064", slug: "buchet-de-mireasa-cu-trandafiri-si-eucalipt", cat: "wedding" },
    { id: "k065", slug: "buchet-cu-cale-si-lisianthus", cat: "wedding" },
    { id: "k066", slug: "buchet-de-mireasa-cu-ranunculus", cat: "wedding" },
    { id: "k067", slug: "buchet-de-mireasa-bordo", cat: "wedding" },
    { id: "k068", slug: "buchete-de-nunta-in-pungi-kvity", cat: "wedding" },
    { id: "k069", slug: "butoniere-si-buchete-de-nunta", cat: "wedding" },
    { id: "k070", slug: "buchet-de-mireasa-cu-bujori-si-trandafiri", cat: "wedding" },
    { id: "k071", slug: "cos-cu-hortensii-roz", cat: "baskets" },
    { id: "k072", slug: "flori-in-cutii-roz", cat: "baskets" },
    { id: "k073", slug: "cos-cu-crizanteme-si-trandafiri", cat: "baskets" },
    { id: "k074", slug: "cos-cu-trandafiri-rosii-si-eucalipt", cat: "baskets" },
    { id: "k075", slug: "cos-cu-bujori-corai", cat: "baskets" },
    { id: "k076", slug: "cos-cu-bujori-albi", cat: "baskets" },
    { id: "k077", slug: "cos-mare-cu-trandafiri-rosii", cat: "baskets" },
    { id: "k078", slug: "cosuri-cu-trandafiri-roz", cat: "baskets" },
    { id: "k079", slug: "trandafiri-rosii-in-cos", cat: "baskets" },
    { id: "k080", slug: "flori-in-cutii-cu-ranunculus", cat: "baskets" },
    { id: "k081", slug: "cos-si-buchet-de-trandafiri-rosii", cat: "baskets" },
    { id: "k082", slug: "cos-cu-trandafiri-albi", cat: "baskets" },
    { id: "k083", slug: "lalele-roz", cat: "mono" },
    { id: "k084", slug: "crizanteme-bordo", cat: "mono" },
    { id: "k085", slug: "trandafiri-roz", cat: "mono" },
    { id: "k086", slug: "trandafiri-roz-pal-cu-eucalipt", cat: "mono" },
    { id: "k087", slug: "crizanteme-bordo-bogate", cat: "mono" },
    { id: "k088", slug: "trandafiri-tufa-cu-eucalipt", cat: "mono" },
    { id: "k089", slug: "trandafiri-roz-pal", cat: "mono" },
    { id: "k090", slug: "trandafiri-albi", cat: "mono" },
    { id: "k091", slug: "hortensii-lila", cat: "mono" },
    { id: "k092", slug: "trandafiri-tufa-roz", cat: "mono" },
    { id: "k093", slug: "garoafe-albe", cat: "mono" },
    { id: "k094", slug: "trandafiri-rosii-si-crem", cat: "mono" },
    { id: "k095", slug: "trandafiri-roz-cu-eucalipt", cat: "mono" },
    { id: "k096", slug: "trandafiri-tip-bujor-cu-eucalipt", cat: "mono" },
    { id: "k097", slug: "trandafiri-roz-aprins", cat: "mono" },
    { id: "k098", slug: "protea", cat: "mono" },
    { id: "k099", slug: "hortensii-albe", cat: "mono" },
    { id: "k100", slug: "hortensii-roz-xl", cat: "xl" },
    { id: "k101", slug: "trandafiri-rosii-si-crem-xl", cat: "xl" },
    { id: "k102", slug: "trandafiri-tufa-xl", cat: "xl" },
    { id: "k103", slug: "musetel-xl", cat: "xl" },
    { id: "k104", slug: "trandafiri-rosii-xl", cat: "xl" },
    { id: "k105", slug: "cos-cu-hortensii-si-trandafiri-xl", cat: "xl" },
    { id: "k106", slug: "protea-regala", cat: "mono" },
    { id: "k107", slug: "hortensii-roz", cat: "mono" },
    { id: "k108", slug: "trandafiri-rosii", cat: "mono" },
    { id: "k109", slug: "trandafiri-zmeurii", cat: "mono" },
    { id: "k110", slug: "trandafiri-rosii-in-negru", cat: "mono" },
    { id: "k111", slug: "cos-cu-trandafiri-rosii", cat: "baskets" },
    { id: "k112", slug: "cifra-5-si-baloane-negre", cat: "balloons" },
    { id: "k113", slug: "buchet-de-mireasa-cu-orhidee", cat: "wedding" },
    { id: "k114", slug: "buchet-de-mireasa-alb", cat: "wedding" },
    { id: "k115", slug: "baloane-piersica-cu-stele", cat: "balloons" },
    { id: "k116", slug: "hortensii-roz", cat: "mono" },
    { id: "k118", slug: "hortensii-cu-trandafiri-xl", cat: "xl" },
    { id: "k119", slug: "cos-cu-hortensii-si-trandafiri", cat: "baskets" },
    { id: "k120", slug: "hortensii-cu-trandafiri-xl", cat: "xl" },
    { id: "k121", slug: "buchete-vii-cu-crizanteme", cat: "bouquets" },
    { id: "k122", slug: "buchet-delicat-cu-trandafiri", cat: "bouquets" },
    { id: "k123", slug: "buchet-cu-trandafiri-si-eucalipt", cat: "bouquets" },
    { id: "k124", slug: "hortensii-cu-trandafiri", cat: "bouquets" },
    { id: "k125", slug: "buchet-cu-hortensie-verde", cat: "bouquets" },
    { id: "k126", slug: "buchete-delicate-cu-hortensii", cat: "bouquets" },
    { id: "k127", slug: "buchet-bogat-cu-crizanteme-si-amarant", cat: "bouquets" },
    { id: "k128", slug: "buchete-roz-cu-hortensii", cat: "bouquets" },
    { id: "k129", slug: "hortensii-roz-si-albastre-cu-trandafiri", cat: "bouquets" },
    { id: "k130", slug: "hortensii-cu-trandafiri", cat: "bouquets" },
    { id: "k131", slug: "buchete-de-toamna-cu-crizanteme", cat: "bouquets" },
    { id: "k132", slug: "buchet-delicat-cu-trandafiri", cat: "bouquets" },
    { id: "k133", slug: "hortensii-cu-trandafiri-tufa", cat: "bouquets" },
    { id: "k134", slug: "trandafiri-cu-eucalipt", cat: "bouquets" },
    { id: "k135", slug: "hortensii-cu-trandafiri", cat: "bouquets" },
    { id: "k136", slug: "hortensii-roz-cu-trandafiri", cat: "bouquets" },
    { id: "k137", slug: "buchet-cu-trandafiri-in-ambalaj-menta", cat: "bouquets" },
    { id: "k138", slug: "hortensii-cu-crizanteme-bordo", cat: "bouquets" },
    { id: "k139", slug: "buchete-cu-hortensii", cat: "bouquets" },
    { id: "k140", slug: "buchet-mare-cu-hortensii", cat: "bouquets" },
    { id: "k142", slug: "cos-colorat-marimea-xl-in-afara-sezonului", cat: "baskets" },
    { id: "k143", slug: "complimente-de-primavara-marimea-xs", cat: "bouquets" },
    { id: "k144", slug: "buchet-in-stil-boho", cat: "bouquets" },
    { id: "k141", slug: "hortensii-cu-trandafiri", cat: "bouquets" },
    { id: "k145", slug: "buchet-cu-hortensie-verde-marimea-m", cat: "bouquets" },
    { id: "k146", slug: "buchete-compuse-colorate-marimea-xl", cat: "xl" }
  ],

  // Юридические данные фирмы (по сертификату ONRC от 17.03.2025, прислал Сергей 22.11.2026).
  legal: {
    company: "KVITY FLORI S.R.L.",
    cui: "49267079",
    regCom: "J2023023757409",
    seat: "București, Sector 2, Aleea Pantelimon nr. 6, bl. 8, sc. 1, et. 3, ap. 29",
    email: "" // почты пока нет (решение Алины 22.11.2026); появится — вписать сюда
  }
};
