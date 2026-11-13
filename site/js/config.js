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

  telegram: "https://t.me/kvity_flori",
  instagram: "https://www.instagram.com/kvity_flori/",

  // Бюджеты в леях (кнопки в форме). «Своя сумма» добавляется автоматически.
  budgets: [200, 350, 500],

  studios: [
    {
      id: "constanta",
      name: "Constanța",
      address: "Bulevardul Aurel Vlaicu 305A, 900001 Constanța",
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
  categories: ["bouquets", "xl", "baskets", "wedding", "balloons"],

  // Обложки категорий (img/<id>-s.webp).
  categoryCovers: { bouquets: "g01", xl: "g02", baskets: "g07", wedding: "g08", balloons: "g04" },

  // Галерея: файлы img/<id>-<slug>.webp (большое) и img/<id>-<slug>-s.webp (превью). slug — по-румынски, для Google.
  // Подписи — в js/i18n.js → gallery.captions.<id>.
  gallery: [
    { id: "g01", slug: "trandafiri-roz-mathiola-eucalipt", cat: "bouquets" },
    { id: "g02", slug: "buchet-xl-musetel", cat: "xl" },
    { id: "g03", slug: "trandafiri-tufa-piersica", cat: "bouquets" },
    { id: "g04", slug: "baloane-heliu-piersica", cat: "balloons" },
    { id: "g05", slug: "hortensii-albastre-trandafiri-gradina", cat: "bouquets" },
    { id: "g06", slug: "hortensii-trandafiri-pudrati-xl", cat: "xl" },
    { id: "g07", slug: "cos-hortensii-roz", cat: "baskets" },
    { id: "g08", slug: "buchet-mireasa-anthurium", cat: "wedding" },
    { id: "g09", slug: "hortensii-trandafiri-pudrati", cat: "bouquets" },
    { id: "g10", slug: "hortensii-roz", cat: "bouquets" },
    { id: "g11", slug: "baloane-roz-fundite", cat: "balloons" },
    { id: "g12", slug: "hortensii-bujor-delphinium", cat: "bouquets" },
    { id: "g13", slug: "trandafiri-rosii-crem", cat: "xl" },
    { id: "g14", slug: "cos-vara-crizanteme", cat: "baskets" },
    { id: "g15", slug: "lalele-trandafiri-tweedia", cat: "bouquets" },
    { id: "g16", slug: "flori-si-baloane-surpriza", cat: "balloons" },
    { id: "g17", slug: "hortensii-verzi-trandafiri-roz", cat: "bouquets" },
    { id: "g18", slug: "buchet-mireasa-albastru", cat: "wedding" },
    { id: "g19", slug: "trandafiri-rosii-xl", cat: "xl" },
    { id: "g20", slug: "baloane-albe-roz-inima", cat: "balloons" },
    { id: "g21", slug: "bujori-scabiosa-mathiola", cat: "bouquets" },
    { id: "g22", slug: "dalii-toamna", cat: "baskets" },
    { id: "g23", slug: "crizanteme-bordo", cat: "bouquets" },
    { id: "g24", slug: "baloane-cifra-10", cat: "balloons" },
    { id: "g25", slug: "baloane-cifra-7-roz", cat: "balloons" },
    { id: "g26", slug: "baloane-argintii-aurii", cat: "balloons" }
  ],

  // Юридические данные (заглушки для демо).
  legal: {
    company: "S.C. ________ S.R.L.",
    cui: "RO________",
    email: "hello@kvity.ro"
  }
};
