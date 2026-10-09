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
      mapsQuery: "KVITY flower studio, Bulevardul Aurel Vlaicu 305A, Constanța"
    },
    {
      id: "navodari",
      name: "Mamaia · Năvodari",
      address: "Strada Prelungirea D12 nr. 6BIS, Bloc C2, 905700 Năvodari",
      phone: "+40 727 244 681",
      hours: "09:00–19:00",
      rating: 4.7,
      reviews: 43,
      mapsQuery: "KVITY flower studio, Strada Prelungirea D12 6BIS, Năvodari"
    }
  ],

  googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=KVITY+flower+studio+Constan%C8%9Ba",

  // Категории = разделы её Instagram. Порядок задаёт порядок фильтров.
  categories: ["bouquets", "xl", "baskets", "wedding", "balloons"],

  // Обложки категорий (img/<id>-s.webp).
  categoryCovers: { bouquets: "g01", xl: "g02", baskets: "g07", wedding: "g08", balloons: "g04" },

  // Галерея: файлы img/<id>.webp (большое) и img/<id>-s.webp (превью).
  // Подписи — в js/i18n.js → gallery.captions.<id>.
  gallery: [
    { id: "g01", cat: "bouquets" },
    { id: "g02", cat: "xl" },
    { id: "g03", cat: "bouquets" },
    { id: "g04", cat: "balloons" },
    { id: "g05", cat: "bouquets" },
    { id: "g06", cat: "xl" },
    { id: "g07", cat: "baskets" },
    { id: "g08", cat: "wedding" },
    { id: "g09", cat: "bouquets" },
    { id: "g10", cat: "bouquets" },
    { id: "g11", cat: "balloons" },
    { id: "g12", cat: "bouquets" },
    { id: "g13", cat: "xl" },
    { id: "g14", cat: "baskets" },
    { id: "g15", cat: "bouquets" },
    { id: "g16", cat: "balloons" },
    { id: "g17", cat: "bouquets" },
    { id: "g18", cat: "wedding" },
    { id: "g19", cat: "xl" },
    { id: "g20", cat: "balloons" },
    { id: "g21", cat: "bouquets" },
    { id: "g22", cat: "baskets" },
    { id: "g23", cat: "bouquets" },
    { id: "g24", cat: "balloons" },
    { id: "g25", cat: "balloons" },
    { id: "g26", cat: "balloons" }
  ],

  // Юридические данные (заглушки для демо).
  legal: {
    company: "S.C. ________ S.R.L.",
    cui: "RO________",
    email: "hello@kvity.ro"
  }
};
