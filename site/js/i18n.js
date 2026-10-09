/*
 * Все тексты сайта на четырёх языках. RO — язык по умолчанию.
 * В HTML: data-i18n="key" (текст), data-i18n-html="key" (с разметкой), data-i18n-ph (placeholder), data-i18n-aria.
 * TODO: румынские тексты проверить носителем языка.
 */
window.KVITY_I18N = {
  ro: {
    meta: {
      title: "KVITY — flori și baloane în Constanța și Mamaia",
      description: "Florărie modernă în Constanța și Mamaia: buchete de autor din flori de import, coșuri, buchete de mireasă și baloane."
    },
    nav: { works: "Lucrări", balloons: "Baloane", studios: "Studiouri", order: "Comandă" },
    hero: {
      eyebrow: "Flower studio · Constanța · Mamaia",
      title: "Buchete de autor<br>și baloane <em>cu stil</em>",
      sub: "Florărie modernă cu flori de import deosebite. Fiecare compoziție este creată special pentru tine.",
      ctaOrder: "Comandă",
      ctaWorks: "Vezi lucrările"
    },
    intro: {
      text: "<em>Kvity</em> înseamnă „flori” în ucraineană. Creăm buchete generoase și moderne din flori de import și decorăm momentele importante cu baloane."
    },
    cats: {
      kicker: "Ce creăm",
      bouquets: "Buchete",
      xl: "Size XL+",
      baskets: "Coșuri",
      wedding: "Nunți",
      balloons: "Baloane",
      all: "Toate"
    },
    gallery: {
      kicker: "Lucrările noastre",
      title: "Fiecare buchet<br>este <em>unic</em>",
      note: "Fiecare buchet este de autor și se creează din florile proaspete disponibile, de aceea poate diferi de exemple. Înainte de livrare îți trimitem o fotografie a buchetului gata.",
      similar: "Vreau unul similar",
      close: "Închide",
      prev: "Anterior",
      next: "Următor",
      captions: {
        g01: "Trandafiri roz, mathiola și eucalipt",
        g02: "Buchet XL de mușețel",
        g03: "Trandafiri tufă de culoarea piersicii",
        g04: "Baloane în nuanță de piersică",
        g05: "Hortensii albastre și trandafiri de grădină",
        g06: "Hortensii și trandafiri pudrați, XL",
        g07: "Coș cu hortensii roz",
        g08: "Buchet de mireasă cu anthurium",
        g09: "Hortensii și trandafiri pudrați",
        g10: "Hortensii roz",
        g11: "Baloane roz cu fundițe",
        g12: "Hortensii, bujor și delphinium",
        g13: "Trandafiri roșii și crem",
        g14: "Coș de vară cu crizanteme",
        g15: "Lalele, trandafiri și tweedia",
        g16: "Flori și baloane pentru o surpriză",
        g17: "Hortensii verzi și trandafiri roz",
        g18: "Buchet de mireasă în nuanțe de albastru",
        g19: "Trandafiri roșii, XL",
        g20: "Baloane albe și roz cu inimă",
        g21: "Bujori, scabiosa și mathiola",
        g22: "Dalii de toamnă",
        g23: "Crizanteme bordo",
        g24: "Cifra 10 și buchet de baloane",
        g25: "Cifra 7 în nuanțe de roz",
        g26: "Baloane argintii și aurii"
      }
    },
    balloons: {
      kicker: "Baloane",
      title: "Baloane pentru<br><em>orice ocazie</em>",
      text: "Buchete de baloane, cifre și inimi în nuanțele preferate. Le comanzi separat sau împreună cu flori — pentru o surpriză completă.",
      list: ["Cifre și litere", "Buchete de baloane", "Flori + baloane", "Nuanțe la alegere"],
      cta: "Comandă baloane"
    },
    about: {
      kicker: "Despre studio",
      title: "Prima florărie <em>ucraineană</em><br>din Constanța",
      p1: "Am adus în Constanța stilul florăriilor ucrainene: buchete generoase, soiuri de import deosebite și atenție la fiecare detaliu — de la flori până la ambalaj și panglică.",
      p2: "Nu avem buchete „de pe raft”. Fiecare compoziție este creată pentru tine, din florile proaspete care sunt azi în studio.",
      stat1: "rating Google",
      stat2: "studiouri",
      stat3: "deschis zilnic, 9:00–19:00"
    },
    how: {
      kicker: "Cum comanzi",
      title: "Simplu, în <em>patru pași</em>",
      steps: [
        { t: "Alegi ce îți dorești", d: "Ocazia, gama de culori și bugetul — fără coș și fără plată online." },
        { t: "Ne scrii pe WhatsApp", d: "Mesajul se completează singur, îl trimiți cu un singur clic." },
        { t: "Floristul creează compoziția", d: "Din cele mai frumoase flori proaspete din studio." },
        { t: "Primești fotografia și florile", d: "Îți trimitem poza înainte de livrare. Livrăm sau ridici din studio." }
      ]
    },
    form: {
      kicker: "Comandă",
      title: "Creează-ți<br><em>comanda</em>",
      sub: "Alege ce îți place, restul îl face floristul. Comanda se trimite pe WhatsApp, iar noi confirmăm detaliile și prețul.",
      what: "Ce dorești",
      whats: ["Flori", "Baloane", "Flori + baloane"],
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
      method: "Cum primești comanda",
      delivery: "Livrare",
      pickup: "Ridicare din studio",
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
      hello: "Bună ziua! Aș dori să fac o comandă.",
      what: "Comanda",
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
      title: "Te așteptăm<br>în <em>două locuri</em>",
      daily: "Zilnic",
      route: "Traseu",
      call: "Sună",
      map: "Arată harta",
      reviews: "recenzii pe Google"
    },
    reviews: {
      kicker: "Recenzii",
      title: "Ne recomandă<br><em>clienții</em>",
      read: "Toate recenziile pe Google"
    },
    cta: {
      title: "Flori sau baloane<br>pentru <em>cineva drag?</em>",
      sub: "Scrie-ne, iar floristul creează comanda astăzi.",
      btn: "Comandă"
    },
    footer: {
      tagline: "Buchete de autor și baloane în Constanța și Mamaia.",
      contacts: "Contacte",
      follow: "Urmărește-ne",
      legal: "Informații legale",
      privacy: "Politica de confidențialitate",
      terms: "Termeni și condiții",
      sal: "Soluționarea alternativă a litigiilor",
      cookies: "Hărțile Google de pe această pagină pot salva cookie-uri în browser.",
      rights: "Toate drepturile rezervate."
    },
    sticky: { order: "Comandă" }
  },

  en: {
    meta: {
      title: "KVITY — flowers & balloons in Constanța and Mamaia",
      description: "Modern flower studio in Constanța and Mamaia: signature bouquets from imported flowers, baskets, bridal bouquets and balloons."
    },
    nav: { works: "Works", balloons: "Balloons", studios: "Studios", order: "Order" },
    hero: {
      eyebrow: "Flower studio · Constanța · Mamaia",
      title: "Signature bouquets<br>& balloons <em>with style</em>",
      sub: "A modern flower studio with rare imported flowers. Every arrangement is created just for you.",
      ctaOrder: "Order",
      ctaWorks: "See our work"
    },
    intro: {
      text: "<em>Kvity</em> means “flowers” in Ukrainian. We create generous, modern bouquets from imported flowers and make important moments brighter with balloons."
    },
    cats: {
      kicker: "What we create",
      bouquets: "Bouquets",
      xl: "Size XL+",
      baskets: "Baskets",
      wedding: "Weddings",
      balloons: "Balloons",
      all: "All"
    },
    gallery: {
      kicker: "Our work",
      title: "Every bouquet<br>is <em>one of a kind</em>",
      note: "Every bouquet is handmade from the fresh flowers we have in stock, so it may differ from these examples. We send you a photo of the finished bouquet before delivery.",
      similar: "I want one like this",
      close: "Close",
      prev: "Previous",
      next: "Next",
      captions: {
        g01: "Pink roses, stock and eucalyptus",
        g02: "XL chamomile bouquet",
        g03: "Peach spray roses",
        g04: "Peach balloons",
        g05: "Blue hydrangeas and garden roses",
        g06: "Hydrangeas and powder-pink roses, XL",
        g07: "Basket of pink hydrangeas",
        g08: "Bridal bouquet with anthurium",
        g09: "Hydrangeas and powder-pink roses",
        g10: "Pink hydrangeas",
        g11: "Pink balloons with bows",
        g12: "Hydrangeas, peony and delphinium",
        g13: "Red and cream roses",
        g14: "Summer basket with chrysanthemums",
        g15: "Tulips, roses and tweedia",
        g16: "Flowers and balloons for a surprise",
        g17: "Green hydrangeas and pink roses",
        g18: "Bridal bouquet in shades of blue",
        g19: "Red roses, XL",
        g20: "White and pink balloons with a heart",
        g21: "Peonies, scabiosa and stock",
        g22: "Autumn dahlias",
        g23: "Burgundy chrysanthemums",
        g24: "Number 10 and a balloon bouquet",
        g25: "Number 7 in shades of pink",
        g26: "Silver and gold balloons"
      }
    },
    balloons: {
      kicker: "Balloons",
      title: "Balloons for<br><em>every occasion</em>",
      text: "Balloon bouquets, numbers and hearts in your favourite shades. Order them on their own or together with flowers for a complete surprise.",
      list: ["Numbers and letters", "Balloon bouquets", "Flowers + balloons", "Colours of your choice"],
      cta: "Order balloons"
    },
    about: {
      kicker: "About the studio",
      title: "The first <em>Ukrainian</em><br>flower studio in Constanța",
      p1: "We brought the Ukrainian florist style to Constanța: generous bouquets, rare imported varieties and care for every detail — from the flowers to the wrapping and ribbon.",
      p2: "We have no ready-made bouquets on a shelf. Every arrangement is created for you from the freshest flowers in the studio today.",
      stat1: "Google rating",
      stat2: "studios",
      stat3: "open daily, 9:00–19:00"
    },
    how: {
      kicker: "How to order",
      title: "Simple, <em>in four steps</em>",
      steps: [
        { t: "Choose what you'd like", d: "The occasion, colours and budget — no cart and no online payment." },
        { t: "Message us on WhatsApp", d: "The message fills itself in, so you send it with one tap." },
        { t: "The florist creates it", d: "From the most beautiful fresh flowers in the studio." },
        { t: "Get the photo, then the flowers", d: "We send a photo before delivery. We deliver, or you pick it up." }
      ]
    },
    form: {
      kicker: "Order",
      title: "Create<br><em>your order</em>",
      sub: "Pick what you like and the florist does the rest. Your request goes to WhatsApp, where we confirm the details and price.",
      what: "What would you like",
      whats: ["Flowers", "Balloons", "Flowers + balloons"],
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
      hello: "Hello! I'd like to place an order.",
      what: "Order",
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
      reviews: "Google reviews"
    },
    reviews: {
      kicker: "Reviews",
      title: "Recommended<br>by <em>our clients</em>",
      read: "All reviews on Google"
    },
    cta: {
      title: "Flowers or balloons<br>for <em>someone special?</em>",
      sub: "Message us and the florist will create your order today.",
      btn: "Order"
    },
    footer: {
      tagline: "Signature bouquets and balloons in Constanța and Mamaia.",
      contacts: "Contacts",
      follow: "Follow us",
      legal: "Legal",
      privacy: "Privacy policy",
      terms: "Terms and conditions",
      sal: "Alternative dispute resolution",
      cookies: "The Google Maps on this page may store cookies in your browser.",
      rights: "All rights reserved."
    },
    sticky: { order: "Order" }
  },

  ua: {
    meta: {
      title: "KVITY — квіти й кулі в Констанці та Мамаї",
      description: "Сучасна квіткова студія в Констанці та Мамаї: авторські букети з імпортних квітів, кошики, весільні букети та повітряні кулі."
    },
    nav: { works: "Роботи", balloons: "Кулі", studios: "Студії", order: "Замовити" },
    hero: {
      eyebrow: "Flower studio · Констанца · Мамая",
      title: "Авторські букети<br>і кулі <em>зі смаком</em>",
      sub: "Сучасна квіткова студія з імпортними квітами цікавих сортів. Кожну композицію створюємо саме для вас.",
      ctaOrder: "Замовити",
      ctaWorks: "Наші роботи"
    },
    intro: {
      text: "<em>Kvity</em> — це «квіти». Ми створюємо пишні сучасні букети з імпортних квітів і прикрашаємо важливі моменти повітряними кулями."
    },
    cats: {
      kicker: "Що ми створюємо",
      bouquets: "Букети",
      xl: "Size XL+",
      baskets: "Кошики",
      wedding: "Весілля",
      balloons: "Кулі",
      all: "Усі"
    },
    gallery: {
      kicker: "Наші роботи",
      title: "Кожен букет<br><em>унікальний</em>",
      note: "Кожен букет авторський і збирається зі свіжих квітів у наявності, тому може відрізнятися від прикладів. Перед доставкою надішлемо фото готового букета.",
      similar: "Хочу схожий",
      close: "Закрити",
      prev: "Попереднє",
      next: "Наступне",
      captions: {
        g01: "Рожеві троянди, матіола й евкаліпт",
        g02: "Букет XL з ромашок",
        g03: "Кущові троянди персикового кольору",
        g04: "Кулі персикового відтінку",
        g05: "Блакитні гортензії та садові троянди",
        g06: "Гортензії та пудрові троянди, XL",
        g07: "Кошик з рожевими гортензіями",
        g08: "Букет нареченої з антуріумом",
        g09: "Гортензії та пудрові троянди",
        g10: "Рожеві гортензії",
        g11: "Рожеві кулі з бантиками",
        g12: "Гортензії, півонія та дельфініум",
        g13: "Червоні та кремові троянди",
        g14: "Літній кошик з хризантемами",
        g15: "Тюльпани, троянди та твідія",
        g16: "Квіти й кулі для сюрпризу",
        g17: "Зелені гортензії та рожеві троянди",
        g18: "Букет нареченої в блакитних відтінках",
        g19: "Червоні троянди, XL",
        g20: "Білі й рожеві кулі із серцем",
        g21: "Півонії, скабіоза та матіола",
        g22: "Осінні жоржини",
        g23: "Бордові хризантеми",
        g24: "Цифра 10 і букет із куль",
        g25: "Цифра 7 у рожевих відтінках",
        g26: "Срібні та золоті кулі"
      }
    },
    balloons: {
      kicker: "Кулі",
      title: "Кулі для<br><em>будь-якої нагоди</em>",
      text: "Букети з куль, цифри й серця у ваших улюблених відтінках. Замовляйте окремо або разом із квітами — для повного сюрпризу.",
      list: ["Цифри та літери", "Букети з куль", "Квіти + кулі", "Відтінки на вибір"],
      cta: "Замовити кулі"
    },
    about: {
      kicker: "Про студію",
      title: "Перша <em>українська</em><br>квіткова студія в Констанці",
      p1: "Ми привезли в Констанцу стиль українських квіткових студій: пишні букети, імпортні квіти цікавих сортів і увагу до кожної деталі — від квітів до пакування та стрічки.",
      p2: "У нас немає букетів «з полиці». Кожну композицію ми створюємо для вас зі свіжих квітів, які сьогодні є в студії.",
      stat1: "рейтинг Google",
      stat2: "студії",
      stat3: "щодня, 9:00–19:00"
    },
    how: {
      kicker: "Як замовити",
      title: "Просто, <em>у чотири кроки</em>",
      steps: [
        { t: "Обираєте, що бажаєте", d: "Привід, кольори та бюджет — без кошика та онлайн-оплати." },
        { t: "Пишете нам у WhatsApp", d: "Повідомлення заповнюється саме, ви надсилаєте його одним дотиком." },
        { t: "Флорист створює композицію", d: "З найкращих свіжих квітів, що є в студії." },
        { t: "Отримуєте фото і квіти", d: "Надсилаємо фото перед доставкою. Доставляємо або ви забираєте зі студії." }
      ]
    },
    form: {
      kicker: "Замовлення",
      title: "Створіть<br><em>замовлення</em>",
      sub: "Оберіть, що вам до душі, решту зробить флорист. Заявка надсилається у WhatsApp, а ми підтверджуємо деталі та ціну.",
      what: "Що бажаєте",
      whats: ["Квіти", "Кулі", "Квіти + кулі"],
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
      method: "Як отримати замовлення",
      delivery: "Доставка",
      pickup: "Самовивіз зі студії",
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
      hello: "Добрий день! Хочу зробити замовлення.",
      what: "Замовлення",
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
      reviews: "відгуків у Google"
    },
    reviews: {
      kicker: "Відгуки",
      title: "Нас рекомендують<br><em>клієнти</em>",
      read: "Усі відгуки в Google"
    },
    cta: {
      title: "Квіти чи кулі<br>для <em>дорогої людини?</em>",
      sub: "Напишіть нам, і флорист створить замовлення вже сьогодні.",
      btn: "Замовити"
    },
    footer: {
      tagline: "Авторські букети та кулі в Констанці й Мамаї.",
      contacts: "Контакти",
      follow: "Ми в соцмережах",
      legal: "Юридична інформація",
      privacy: "Політика конфіденційності",
      terms: "Умови використання",
      sal: "Альтернативне вирішення спорів",
      cookies: "Карти Google на цій сторінці можуть зберігати cookies у браузері.",
      rights: "Усі права захищені."
    },
    sticky: { order: "Замовити" }
  },

  ru: {
    meta: {
      title: "KVITY — цветы и шары в Констанце и Мамае",
      description: "Современная цветочная студия в Констанце и Мамае: авторские букеты из импортных цветов, корзины, свадебные букеты и воздушные шары."
    },
    nav: { works: "Работы", balloons: "Шары", studios: "Студии", order: "Заказать" },
    hero: {
      eyebrow: "Flower studio · Констанца · Мамая",
      title: "Авторские букеты<br>и шары <em>со вкусом</em>",
      sub: "Современная цветочная студия с импортными цветами интересных сортов. Каждую композицию создаём специально для вас.",
      ctaOrder: "Заказать",
      ctaWorks: "Наши работы"
    },
    intro: {
      text: "<em>Kvity</em> по-украински значит «цветы». Мы создаём пышные современные букеты из импортных цветов и украшаем важные моменты воздушными шарами."
    },
    cats: {
      kicker: "Что мы создаём",
      bouquets: "Букеты",
      xl: "Size XL+",
      baskets: "Корзины",
      wedding: "Свадьба",
      balloons: "Шары",
      all: "Все"
    },
    gallery: {
      kicker: "Наши работы",
      title: "Каждый букет<br><em>уникален</em>",
      note: "Каждый букет авторский и собирается из свежих цветов в наличии, поэтому может отличаться от примеров. Перед доставкой пришлём фото готового букета.",
      similar: "Хочу похожий",
      close: "Закрыть",
      prev: "Предыдущее",
      next: "Следующее",
      captions: {
        g01: "Розовые розы, маттиола и эвкалипт",
        g02: "Букет XL из ромашек",
        g03: "Кустовые розы персикового цвета",
        g04: "Шары персикового оттенка",
        g05: "Голубые гортензии и садовые розы",
        g06: "Гортензии и пудровые розы, XL",
        g07: "Корзина с розовыми гортензиями",
        g08: "Букет невесты с антуриумом",
        g09: "Гортензии и пудровые розы",
        g10: "Розовые гортензии",
        g11: "Розовые шары с бантиками",
        g12: "Гортензии, пион и дельфиниум",
        g13: "Красные и кремовые розы",
        g14: "Летняя корзина с хризантемами",
        g15: "Тюльпаны, розы и твидия",
        g16: "Цветы и шары для сюрприза",
        g17: "Зелёные гортензии и розовые розы",
        g18: "Букет невесты в голубых оттенках",
        g19: "Красные розы, XL",
        g20: "Белые и розовые шары с сердцем",
        g21: "Пионы, скабиоза и маттиола",
        g22: "Осенние георгины",
        g23: "Бордовые хризантемы",
        g24: "Цифра 10 и букет из шаров",
        g25: "Цифра 7 в розовых оттенках",
        g26: "Серебряные и золотые шары"
      }
    },
    balloons: {
      kicker: "Шары",
      title: "Шары для<br><em>любого повода</em>",
      text: "Букеты из шаров, цифры и сердца в ваших любимых оттенках. Заказывайте отдельно или вместе с цветами — для полного сюрприза.",
      list: ["Цифры и буквы", "Букеты из шаров", "Цветы + шары", "Оттенки на выбор"],
      cta: "Заказать шары"
    },
    about: {
      kicker: "О студии",
      title: "Первая <em>украинская</em><br>цветочная студия в Констанце",
      p1: "Мы привезли в Констанцу стиль украинских цветочных студий: пышные букеты, импортные цветы интересных сортов и внимание к каждой детали — от цветов до упаковки и ленты.",
      p2: "У нас нет букетов «с полки». Каждую композицию мы создаём для вас из свежих цветов, которые сегодня есть в студии.",
      stat1: "рейтинг Google",
      stat2: "студии",
      stat3: "ежедневно, 9:00–19:00"
    },
    how: {
      kicker: "Как заказать",
      title: "Просто, <em>в четыре шага</em>",
      steps: [
        { t: "Выбираете, что хотите", d: "Повод, цвета и бюджет — без корзины и онлайн-оплаты." },
        { t: "Пишете нам в WhatsApp", d: "Сообщение заполняется само, вы отправляете его в одно касание." },
        { t: "Флорист создаёт композицию", d: "Из самых красивых свежих цветов в студии." },
        { t: "Получаете фото и цветы", d: "Присылаем фото перед доставкой. Доставляем или вы забираете из студии." }
      ]
    },
    form: {
      kicker: "Заказ",
      title: "Создайте<br><em>заказ</em>",
      sub: "Выберите, что вам нравится, остальное сделает флорист. Заявка отправляется в WhatsApp, а мы подтверждаем детали и цену.",
      what: "Что хотите",
      whats: ["Цветы", "Шары", "Цветы + шары"],
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
      method: "Как получить заказ",
      delivery: "Доставка",
      pickup: "Самовывоз из студии",
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
      hello: "Здравствуйте! Хочу сделать заказ.",
      what: "Заказ",
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
      reviews: "отзывов в Google"
    },
    reviews: {
      kicker: "Отзывы",
      title: "Нас рекомендуют<br><em>клиенты</em>",
      read: "Все отзывы в Google"
    },
    cta: {
      title: "Цветы или шары<br>для <em>близкого человека?</em>",
      sub: "Напишите нам, и флорист создаст заказ уже сегодня.",
      btn: "Заказать"
    },
    footer: {
      tagline: "Авторские букеты и шары в Констанце и Мамае.",
      contacts: "Контакты",
      follow: "Мы в соцсетях",
      legal: "Юридическая информация",
      privacy: "Политика конфиденциальности",
      terms: "Условия использования",
      sal: "Альтернативное разрешение споров",
      cookies: "Карты Google на этой странице могут сохранять cookies в браузере.",
      rights: "Все права защищены."
    },
    sticky: { order: "Заказать" }
  }
};
