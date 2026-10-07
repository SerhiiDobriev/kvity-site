/*
 * KVITY — все контакты, адреса и ссылки в одном месте.
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
      address: "Bulevardul Aurel Vlaicu 305, 900001 Constanța",
      phone: "+40 727 244 681",
      hours: "09:00–19:00",
      rating: 5.0,
      reviews: 12,
      mapsQuery: "KVITY flower studio, Bulevardul Aurel Vlaicu 305, Constanța"
    },
    {
      id: "navodari",
      name: "Năvodari · Mamaia",
      address: "Strada Prelungirea D12 nr. 6BIS, Bloc C2, 905700 Năvodari",
      phone: "+40 727 244 681",
      hours: "09:00–19:00",
      rating: 4.7,
      reviews: 43,
      mapsQuery: "KVITY flower studio, Strada Prelungirea D12 6BIS, Năvodari"
    }
  ],

  googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=KVITY+flower+studio+Constan%C8%9Ba",

  // Галерея «Примеры работ». Подписи — в js/i18n.js (gallery.captions, по ключу id).
  gallery: [
    { id: "w02", src: "images/work-02.jpg" },
    { id: "w03", src: "images/work-03.jpg" },
    { id: "w11", src: "images/work-11.jpg" },
    { id: "w07", src: "images/work-07.jpg" },
    { id: "w05", src: "images/work-05.jpg" },
    { id: "w04", src: "images/work-04.jpg" },
    { id: "w12", src: "images/work-12.jpg" },
    { id: "w01", src: "images/work-01.jpg" },
    { id: "w10", src: "images/work-10.jpg" },
    { id: "w13", src: "images/work-13.jpg" },
    { id: "w08", src: "images/work-08.jpg" },
    { id: "w09", src: "images/work-09.jpg" }
  ],

  // ДЕМО: тексты-заглушки. Заменить реальными отзывами из Google Maps (с сокращённым именем).
  reviews: [
    { name: "Andrei K.", stars: 5, text: "Cel mai frumos buchet pe care l-am comandat în Constanța. Mi-au trimis poza înainte de livrare — exact cum îmi doream." },
    { name: "Olena S.", stars: 5, text: "Неймовірні квіти і дуже уважне ставлення. Букет простояв майже два тижні!" },
    { name: "James W.", stars: 5, text: "Ordered for my wife's birthday while on holiday in Mamaia. Beautiful, fresh and delivered right on time." },
    { name: "Maria P.", stars: 5, text: "Flori deosebite, pe care nu le găsești în alte florării. Recomand din tot sufletul!" }
  ],

  // Юридические данные (заглушки для демо).
  legal: {
    company: "S.C. ________ S.R.L.",
    cui: "RO________",
    email: "hello@kvity.ro"
  }
};
