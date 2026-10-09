/*
 * Все тексты сайта на четырёх языках. RO — язык по умолчанию.
 * Ключи из HTML: data-i18n="hero.sub" (текст), data-i18n-html (с разметкой), data-i18n-ph (placeholder).
 * TODO: румынские тексты проверить носителем языка.
 */
window.KVITY_I18N = {
  ro: {
    meta: {
      title: "KVITY — buchete de autor în Constanța și Mamaia",
      description: "Florărie ucraineană în Constanța și Năvodari (Mamaia). Buchete de autor din flori proaspete de import, livrare și ridicare din studio."
    },
    nav: { order: "Comandă", works: "Lucrări", studios: "Studiouri", menu: "Meniu" },
    hero: {
      eyebrow: "Flower studio · Constanța & Mamaia",
      title: "Buchete de autor<br><em>din flori proaspete</em>",
      sub: "Prima florărie ucraineană din Constanța și Mamaia. Soiuri de import deosebite și compoziții moderne, create special pentru tine.",
      ctaOrder: "Comandă un buchet",
      ctaCall: "Sună-ne",
      badge: "buchete de autor · flower studio · kvity ·",
      scroll: "Derulează"
    },
    marquee: ["Buchete de autor", "Flori de import", "Livrare în Constanța și Mamaia", "Fotografie înainte de livrare", "Zilnic 9:00–19:00"],
    about: {
      kicker: "Despre noi",
      title: "<em>Kvity</em> înseamnă „flori”",
      p1: "În ucraineană, «квіти» (kvity) înseamnă flori. Am adus în Constanța stilul florăriilor ucrainene: buchete generoase, combinații curajoase de culori și atenție la fiecare detaliu.",
      p2: "Nu avem buchete „de pe raft”. Fiecare compoziție este creată pentru tine, din florile proaspete care sunt azi în studio.",
      stat1: "rating Google",
      stat2: "studiouri",
      stat3: "zilnic"
    },
    quote: {
      text: "Florile spun ceea ce<br><em>cuvintele nu reușesc</em>",
      by: "— echipa KVITY"
    },
    gallery: {
      kicker: "Lucrările noastre",
      title: "Fiecare buchet<br><em>este unic</em>",
      note: "Fiecare buchet este de autor și se creează din flori proaspete disponibile, de aceea poate diferi de exemple. Înainte de livrare îți trimitem o fotografie a buchetului gata.",
      similar: "Vreau unul similar",
      tap: "Atinge o fotografie",
      close: "Închide",
      prev: "Anterior",
      next: "Următor",
      captions: {
        w01: "Trandafiri roșii în ambalaj negru",
        w02: "Hortensii verzi și trandafiri roz",
        w03: "Hortensii albastre și trandafiri de grădină",
        w04: "Bujori, scabiosa și mathiola",
        w05: "Coș cu hortensii și trandafiri",
        w07: "Lalele și mușețel",
        w08: "Hortensii roz",
        w09: "Buchete pentru un eveniment",
        w10: "Hortensii roz, trandafiri și mușețel",
        w11: "Crizanteme bordo",
        w12: "Hortensii, trandafiri și eustoma",
        w13: "Trandafiri roșii și crem"
      }
    },
    how: {
      kicker: "Cum comanzi",
      title: "Simplu, <em>în patru pași</em>",
      steps: [
        { t: "Alegi ocazia și bugetul", d: "Un formular scurt, fără coș și fără plată online." },
        { t: "Ne scrii pe WhatsApp", d: "Mesajul se completează singur, îl trimiți cu un singur clic." },
        { t: "Floristul creează buchetul", d: "Din cele mai frumoase flori proaspete din studio." },
        { t: "Primești fotografia și florile", d: "Îți trimitem poza înainte de livrare. Livrăm sau îl ridici din studio." }
      ]
    },
    form: {
      kicker: "Comandă",
      title: "Creează-ți<br><em>buchetul</em>",
      sub: "Alege ce îți place, restul îl face floristul. Comanda se trimite pe WhatsApp, iar noi confirmăm detaliile și prețul.",
      occasion: "Ocazia",
      occasions: ["Zi de naștere", "Dragoste", "Nuntă", "Scuze", "Mulțumesc", "Așa, din suflet"],
      palette: "Gama de culori",
      palettes: ["Delicată", "Vibrantă", "Albă", "La alegerea floristului"],
      style: "Stilul",
      styles: ["Bogat", "Minimalist", "În cutie sau coș"],
      budget: "Bugetul",
      custom: "Altă sumă",
      customPh: "Suma ta",
      currency: "lei",
      when: "Data și ora",
      date: "Data",
      time: "Interval",
      asap: "Cât mai repede",
      method: "Cum primești buchetul",
      delivery: "Livrare",
      pickup: "Ridicare din studio",
      studio: "Studioul",
      address: "Adresa de livrare",
      addressPh: "Strada, nr., bloc, apartament, oraș",
      card: "Text pentru card",
      cardPh: "De exemplu: La mulți ani, mamă!",
      optional: "opțional",
      contact: "Datele tale",
      name: "Numele",
      phone: "Telefon",
      submit: "Trimite pe WhatsApp",
      hint: "Se deschide WhatsApp cu mesajul gata. Nimic nu se trimite fără tine.",
      ref: "Exemplul ales",
      remove: "Elimină",
      required: "Completează acest câmp",
      sent: "Se deschide WhatsApp…"
    },
    msg: {
      hello: "Bună ziua! Aș dori să comand un buchet.",
      occasion: "Ocazia",
      palette: "Gama",
      style: "Stilul",
      budget: "Buget",
      date: "Data",
      delivery: "Livrare la adresa",
      pickup: "Ridicare din studioul",
      card: "Text card",
      example: "Exemplu",
      name: "Nume",
      phone: "Telefon",
      thanks: "Mulțumesc!"
    },
    studios: {
      kicker: "Studiourile noastre",
      title: "Te așteptăm<br><em>în două locuri</em>",
      daily: "Zilnic",
      route: "Traseu",
      call: "Sună",
      map: "Arată harta",
      reviews: "recenzii"
    },
    reviews: {
      kicker: "Recenzii",
      title: "Ce spun<br><em>clienții noștri</em>",
      from: "din Google",
      all: "Toate recenziile pe Google Maps"
    },
    cta: {
      title: "Un buchet pentru<br><em>cineva drag?</em>",
      sub: "Scrie-ne, iar floristul îl creează astăzi.",
      btn: "Comandă un buchet"
    },
    footer: {
      tagline: "Buchete de autor în Constanța și Mamaia.",
      contacts: "Contacte",
      follow: "Urmărește-ne",
      legal: "Informații legale",
      privacy: "Politica de confidențialitate",
      terms: "Termeni și condiții",
      anpc: "ANPC",
      sal: "Soluționarea alternativă a litigiilor",
      rights: "Toate drepturile rezervate."
    },
    sticky: { order: "Comandă un buchet" }
  },

  en: {
    meta: {
      title: "KVITY — signature bouquets in Constanța & Mamaia",
      description: "Ukrainian flower studio in Constanța and Năvodari (Mamaia). Signature bouquets from fresh imported flowers, delivery or in-store pickup."
    },
    nav: { order: "Order", works: "Works", studios: "Studios", menu: "Menu" },
    hero: {
      eyebrow: "Flower studio · Constanța & Mamaia",
      title: "Signature bouquets<br><em>from fresh flowers</em>",
      sub: "The first Ukrainian flower studio in Constanța and Mamaia. Rare imported varieties and modern arrangements, made just for you.",
      ctaOrder: "Order a bouquet",
      ctaCall: "Call us",
      badge: "signature bouquets · flower studio · kvity ·",
      scroll: "Scroll"
    },
    marquee: ["Signature bouquets", "Imported flowers", "Delivery in Constanța & Mamaia", "Photo before delivery", "Daily 9:00–19:00"],
    about: {
      kicker: "About us",
      title: "<em>Kvity</em> means “flowers”",
      p1: "In Ukrainian, «квіти» (kvity) means flowers. We brought the Ukrainian florist style to Constanța: generous bouquets, bold colour pairings and care for every detail.",
      p2: "We have no ready-made bouquets on a shelf. Every arrangement is created for you from the freshest flowers in the studio today.",
      stat1: "Google rating",
      stat2: "studios",
      stat3: "open daily"
    },
    quote: {
      text: "Flowers say what<br><em>words cannot</em>",
      by: "— the KVITY team"
    },
    gallery: {
      kicker: "Our work",
      title: "Every bouquet<br><em>is one of a kind</em>",
      note: "Every bouquet is handmade from the fresh flowers we have in stock, so it may differ from these examples. We send you a photo of the finished bouquet before delivery.",
      similar: "I want one like this",
      tap: "Tap a photo",
      close: "Close",
      prev: "Previous",
      next: "Next",
      captions: {
        w01: "Red roses in black wrapping",
        w02: "Green hydrangeas and pink roses",
        w03: "Blue hydrangeas and garden roses",
        w04: "Peonies, scabiosa and stock",
        w05: "Basket of hydrangeas and roses",
        w07: "Tulips and chamomile",
        w08: "Pink hydrangeas",
        w09: "Bouquets for an event",
        w10: "Pink hydrangeas, roses and chamomile",
        w11: "Burgundy chrysanthemums",
        w12: "Hydrangeas, roses and lisianthus",
        w13: "Red and cream roses"
      }
    },
    how: {
      kicker: "How to order",
      title: "Simple, <em>in four steps</em>",
      steps: [
        { t: "Choose the occasion and budget", d: "A short form, with no cart and no online payment." },
        { t: "Message us on WhatsApp", d: "The message fills itself in, so you send it with one tap." },
        { t: "The florist creates your bouquet", d: "From the most beautiful fresh flowers in the studio." },
        { t: "Get the photo, then the flowers", d: "We send a photo before delivery. We deliver, or you pick it up." }
      ]
    },
    form: {
      kicker: "Order",
      title: "Create<br><em>your bouquet</em>",
      sub: "Pick what you like and the florist does the rest. Your request goes to WhatsApp, where we confirm the details and price.",
      occasion: "Occasion",
      occasions: ["Birthday", "Love", "Wedding", "Sorry", "Thank you", "Just because"],
      palette: "Colour palette",
      palettes: ["Soft", "Bright", "White", "Florist's choice"],
      style: "Style",
      styles: ["Lush", "Minimal", "In a box or basket"],
      budget: "Budget",
      custom: "Other amount",
      customPh: "Your amount",
      currency: "lei",
      when: "Date and time",
      date: "Date",
      time: "Time slot",
      asap: "As soon as possible",
      method: "How to receive it",
      delivery: "Delivery",
      pickup: "Studio pickup",
      studio: "Studio",
      address: "Delivery address",
      addressPh: "Street, no., building, apartment, city",
      card: "Card message",
      cardPh: "For example: Happy birthday, Mom!",
      optional: "optional",
      contact: "Your details",
      name: "Name",
      phone: "Phone",
      submit: "Send via WhatsApp",
      hint: "WhatsApp opens with the message ready. Nothing is sent without you.",
      ref: "Chosen example",
      remove: "Remove",
      required: "Please fill in this field",
      sent: "Opening WhatsApp…"
    },
    msg: {
      hello: "Hello! I'd like to order a bouquet.",
      occasion: "Occasion",
      palette: "Palette",
      style: "Style",
      budget: "Budget",
      date: "Date",
      delivery: "Delivery to",
      pickup: "Pickup from studio",
      card: "Card text",
      example: "Example",
      name: "Name",
      phone: "Phone",
      thanks: "Thank you!"
    },
    studios: {
      kicker: "Our studios",
      title: "Visit us<br><em>in two places</em>",
      daily: "Daily",
      route: "Directions",
      call: "Call",
      map: "Show map",
      reviews: "reviews"
    },
    reviews: {
      kicker: "Reviews",
      title: "What our<br><em>clients say</em>",
      from: "on Google",
      all: "All reviews on Google Maps"
    },
    cta: {
      title: "A bouquet for<br><em>someone special?</em>",
      sub: "Message us and the florist will create it today.",
      btn: "Order a bouquet"
    },
    footer: {
      tagline: "Signature bouquets in Constanța and Mamaia.",
      contacts: "Contacts",
      follow: "Follow us",
      legal: "Legal",
      privacy: "Privacy policy",
      terms: "Terms and conditions",
      anpc: "ANPC",
      sal: "Alternative dispute resolution",
      rights: "All rights reserved."
    },
    sticky: { order: "Order a bouquet" }
  },

  ua: {
    meta: {
      title: "KVITY — авторські букети в Констанці та Мамаї",
      description: "Українська квіткова студія в Констанці та Нэводарі (Мамая). Авторські букети зі свіжих імпортних квітів, доставка та самовивіз."
    },
    nav: { order: "Замовити", works: "Роботи", studios: "Студії", menu: "Меню" },
    hero: {
      eyebrow: "Flower studio · Констанца & Мамая",
      title: "Авторські букети<br><em>зі свіжих квітів</em>",
      sub: "Перша українська квіткова студія в Констанці та на Мамаї. Імпортні квіти цікавих сортів і сучасні букети, створені саме для вас.",
      ctaOrder: "Замовити букет",
      ctaCall: "Зателефонувати",
      badge: "авторські букети · flower studio · kvity ·",
      scroll: "Гортайте"
    },
    marquee: ["Авторські букети", "Імпортні квіти", "Доставка по Констанці та Мамаї", "Фото перед доставкою", "Щодня 9:00–19:00"],
    about: {
      kicker: "Про нас",
      title: "<em>Kvity</em> — це «квіти»",
      p1: "Ми привезли в Констанцу стиль українських квіткових студій: пишні букети, сміливі поєднання кольорів і увага до кожної деталі.",
      p2: "У нас немає букетів «з полиці». Кожну композицію ми створюємо для вас зі свіжих квітів, які сьогодні є в студії.",
      stat1: "рейтинг Google",
      stat2: "студії",
      stat3: "щодня"
    },
    quote: {
      text: "Квіти кажуть те,<br><em>чого не скажуть слова</em>",
      by: "— команда KVITY"
    },
    gallery: {
      kicker: "Наші роботи",
      title: "Кожен букет<br><em>унікальний</em>",
      note: "Кожен букет авторський і збирається зі свіжих квітів у наявності, тому може відрізнятися від прикладів. Перед доставкою надішлемо фото готового букета.",
      similar: "Хочу схожий",
      tap: "Торкніться фото",
      close: "Закрити",
      prev: "Попереднє",
      next: "Наступне",
      captions: {
        w01: "Червоні троянди в чорному пакуванні",
        w02: "Зелені гортензії та рожеві троянди",
        w03: "Блакитні гортензії та піоноподібні троянди",
        w04: "Півонії, скабіоза та матіола",
        w05: "Кошик з гортензіями та трояндами",
        w07: "Тюльпани та ромашки",
        w08: "Рожеві гортензії",
        w09: "Букети для події",
        w10: "Рожеві гортензії, троянди та ромашки",
        w11: "Бордові хризантеми",
        w12: "Гортензії, троянди та еустома",
        w13: "Червоні та кремові троянди"
      }
    },
    how: {
      kicker: "Як замовити",
      title: "Просто, <em>у чотири кроки</em>",
      steps: [
        { t: "Обираєте привід і бюджет", d: "Коротка форма, без кошика та онлайн-оплати." },
        { t: "Пишете нам у WhatsApp", d: "Повідомлення заповнюється саме, ви надсилаєте його одним дотиком." },
        { t: "Флорист створює букет", d: "З найкращих свіжих квітів, що є в студії." },
        { t: "Отримуєте фото і квіти", d: "Надсилаємо фото перед доставкою. Доставляємо або ви забираєте зі студії." }
      ]
    },
    form: {
      kicker: "Замовлення",
      title: "Створіть<br><em>свій букет</em>",
      sub: "Оберіть, що вам до душі, решту зробить флорист. Заявка надсилається у WhatsApp, а ми підтверджуємо деталі та ціну.",
      occasion: "Привід",
      occasions: ["День народження", "Кохання", "Весілля", "Вибачення", "Подяка", "Просто так"],
      palette: "Кольорова гама",
      palettes: ["Ніжна", "Яскрава", "Біла", "На смак флориста"],
      style: "Стиль",
      styles: ["Пишний", "Лаконічний", "У коробці чи кошику"],
      budget: "Бюджет",
      custom: "Своя сума",
      customPh: "Ваша сума",
      currency: "лей",
      when: "Дата і час",
      date: "Дата",
      time: "Інтервал",
      asap: "Якнайшвидше",
      method: "Як отримати букет",
      delivery: "Доставка",
      pickup: "Самовивіз зі студії",
      studio: "Студія",
      address: "Адреса доставки",
      addressPh: "Вулиця, будинок, блок, квартира, місто",
      card: "Текст листівки",
      cardPh: "Наприклад: З днем народження, мамо!",
      optional: "необов'язково",
      contact: "Ваші дані",
      name: "Ім'я",
      phone: "Телефон",
      submit: "Надіслати у WhatsApp",
      hint: "Відкриється WhatsApp з готовим повідомленням. Без вас нічого не надсилається.",
      ref: "Обраний приклад",
      remove: "Прибрати",
      required: "Заповніть це поле",
      sent: "Відкриваємо WhatsApp…"
    },
    msg: {
      hello: "Добрий день! Хочу замовити букет.",
      occasion: "Привід",
      palette: "Гама",
      style: "Стиль",
      budget: "Бюджет",
      date: "Дата",
      delivery: "Доставка за адресою",
      pickup: "Самовивіз зі студії",
      card: "Текст листівки",
      example: "Приклад",
      name: "Ім'я",
      phone: "Телефон",
      thanks: "Дякую!"
    },
    studios: {
      kicker: "Наші студії",
      title: "Чекаємо на вас<br><em>у двох місцях</em>",
      daily: "Щодня",
      route: "Маршрут",
      call: "Подзвонити",
      map: "Показати мапу",
      reviews: "відгуків"
    },
    reviews: {
      kicker: "Відгуки",
      title: "Що кажуть<br><em>наші клієнти</em>",
      from: "з Google",
      all: "Усі відгуки на Google Maps"
    },
    cta: {
      title: "Букет для<br><em>дорогої людини?</em>",
      sub: "Напишіть нам, і флорист збере його вже сьогодні.",
      btn: "Замовити букет"
    },
    footer: {
      tagline: "Авторські букети в Констанці та Мамаї.",
      contacts: "Контакти",
      follow: "Ми в соцмережах",
      legal: "Юридична інформація",
      privacy: "Політика конфіденційності",
      terms: "Умови використання",
      anpc: "ANPC",
      sal: "Альтернативне вирішення спорів",
      rights: "Усі права захищені."
    },
    sticky: { order: "Замовити букет" }
  },

  ru: {
    meta: {
      title: "KVITY — авторские букеты в Констанце и Мамае",
      description: "Украинская цветочная студия в Констанце и Нэводари (Мамая). Авторские букеты из свежих импортных цветов, доставка и самовывоз."
    },
    nav: { order: "Заказать", works: "Работы", studios: "Студии", menu: "Меню" },
    hero: {
      eyebrow: "Flower studio · Констанца & Мамая",
      title: "Авторские букеты<br><em>из свежих цветов</em>",
      sub: "Первая украинская цветочная студия в Констанце и на Мамае. Импортные цветы интересных сортов и современные букеты, созданные специально для вас.",
      ctaOrder: "Заказать букет",
      ctaCall: "Позвонить",
      badge: "авторские букеты · flower studio · kvity ·",
      scroll: "Листайте"
    },
    marquee: ["Авторские букеты", "Импортные цветы", "Доставка по Констанце и Мамае", "Фото перед доставкой", "Ежедневно 9:00–19:00"],
    about: {
      kicker: "О нас",
      title: "<em>Kvity</em> — значит «цветы»",
      p1: "По-украински «квіти» (kvity) значит цветы. Мы привезли в Констанцу стиль украинских цветочных студий: пышные букеты, смелые сочетания цветов и внимание к каждой детали.",
      p2: "У нас нет букетов «с полки». Каждую композицию мы создаём для вас из свежих цветов, которые сегодня есть в студии.",
      stat1: "рейтинг Google",
      stat2: "студии",
      stat3: "ежедневно"
    },
    quote: {
      text: "Цветы говорят то,<br><em>что не скажут слова</em>",
      by: "— команда KVITY"
    },
    gallery: {
      kicker: "Наши работы",
      title: "Каждый букет<br><em>уникален</em>",
      note: "Каждый букет авторский и собирается из свежих цветов в наличии, поэтому может отличаться от примеров. Перед доставкой пришлём фото готового букета.",
      similar: "Хочу похожий",
      tap: "Нажмите на фото",
      close: "Закрыть",
      prev: "Предыдущее",
      next: "Следующее",
      captions: {
        w01: "Красные розы в чёрной упаковке",
        w02: "Зелёные гортензии и розовые розы",
        w03: "Голубые гортензии и пионовидные розы",
        w04: "Пионы, скабиоза и маттиола",
        w05: "Корзина с гортензиями и розами",
        w07: "Тюльпаны и ромашки",
        w08: "Розовые гортензии",
        w09: "Букеты для мероприятия",
        w10: "Розовые гортензии, розы и ромашки",
        w11: "Бордовые хризантемы",
        w12: "Гортензии, розы и эустома",
        w13: "Красные и кремовые розы"
      }
    },
    how: {
      kicker: "Как заказать",
      title: "Просто, <em>в четыре шага</em>",
      steps: [
        { t: "Выбираете повод и бюджет", d: "Короткая форма, без корзины и онлайн-оплаты." },
        { t: "Пишете нам в WhatsApp", d: "Сообщение заполняется само, вы отправляете его в одно касание." },
        { t: "Флорист создаёт букет", d: "Из самых красивых свежих цветов в студии." },
        { t: "Получаете фото и цветы", d: "Присылаем фото перед доставкой. Доставляем или вы забираете из студии." }
      ]
    },
    form: {
      kicker: "Заказ",
      title: "Создайте<br><em>свой букет</em>",
      sub: "Выберите, что вам нравится, остальное сделает флорист. Заявка отправляется в WhatsApp, а мы подтверждаем детали и цену.",
      occasion: "Повод",
      occasions: ["День рождения", "Любовь", "Свадьба", "Извинение", "Благодарность", "Просто так"],
      palette: "Цветовая гамма",
      palettes: ["Нежная", "Яркая", "Белая", "На вкус флориста"],
      style: "Стиль",
      styles: ["Пышный", "Лаконичный", "В коробке или корзине"],
      budget: "Бюджет",
      custom: "Своя сумма",
      customPh: "Ваша сумма",
      currency: "лей",
      when: "Дата и время",
      date: "Дата",
      time: "Интервал",
      asap: "Как можно скорее",
      method: "Как получить букет",
      delivery: "Доставка",
      pickup: "Самовывоз из студии",
      studio: "Студия",
      address: "Адрес доставки",
      addressPh: "Улица, дом, блок, квартира, город",
      card: "Текст открытки",
      cardPh: "Например: С днём рождения, мама!",
      optional: "необязательно",
      contact: "Ваши данные",
      name: "Имя",
      phone: "Телефон",
      submit: "Отправить в WhatsApp",
      hint: "Откроется WhatsApp с готовым сообщением. Без вас ничего не отправится.",
      ref: "Выбранный пример",
      remove: "Убрать",
      required: "Заполните это поле",
      sent: "Открываем WhatsApp…"
    },
    msg: {
      hello: "Здравствуйте! Хочу заказать букет.",
      occasion: "Повод",
      palette: "Гамма",
      style: "Стиль",
      budget: "Бюджет",
      date: "Дата",
      delivery: "Доставка по адресу",
      pickup: "Самовывоз из студии",
      card: "Текст открытки",
      example: "Пример",
      name: "Имя",
      phone: "Телефон",
      thanks: "Спасибо!"
    },
    studios: {
      kicker: "Наши студии",
      title: "Ждём вас<br><em>в двух местах</em>",
      daily: "Ежедневно",
      route: "Маршрут",
      call: "Позвонить",
      map: "Показать карту",
      reviews: "отзывов"
    },
    reviews: {
      kicker: "Отзывы",
      title: "Что говорят<br><em>наши клиенты</em>",
      from: "из Google",
      all: "Все отзывы на Google Maps"
    },
    cta: {
      title: "Букет для<br><em>близкого человека?</em>",
      sub: "Напишите нам, и флорист соберёт его уже сегодня.",
      btn: "Заказать букет"
    },
    footer: {
      tagline: "Авторские букеты в Констанце и Мамае.",
      contacts: "Контакты",
      follow: "Мы в соцсетях",
      legal: "Юридическая информация",
      privacy: "Политика конфиденциальности",
      terms: "Условия использования",
      anpc: "ANPC",
      sal: "Альтернативное разрешение споров",
      rights: "Все права защищены."
    },
    sticky: { order: "Заказать букет" }
  }
};
