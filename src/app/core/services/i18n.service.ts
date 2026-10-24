import { Injectable, effect, signal } from '@angular/core';

export type Locale = 'ru' | 'kz' | 'en';

export type TranslationKey =
  | 'nav.events'
  | 'nav.map'
  | 'nav.tickets'
  | 'nav.profile'
  | 'nav.publish'
  | 'nav.terms'
  | 'nav.section'
  | 'nav.mainAria'
  | 'theme.switchToDark'
  | 'theme.switchToLight'
  | 'breadcrumb.home'
  | 'breadcrumb.events'
  | 'breadcrumb.event'
  | 'breadcrumb.ticket'
  | 'breadcrumb.orders'
  | 'breadcrumb.review'
  | 'breadcrumb.botMessages'
  | 'breadcrumb.map'
  | 'breadcrumb.tickets'
  | 'breadcrumb.groups'
  | 'breadcrumb.createEvent'
  | 'breadcrumb.profile'
  | 'breadcrumb.terms'
  | 'home.whatToday'
  | 'home.findEvent'
  | 'home.createEvent'
  | 'home.intro'
  | 'home.footer'
  | 'calendar.title'
  | 'calendar.subtitle'
  | 'calendar.month'
  | 'calendar.week'
  | 'calendar.today'
  | 'calendar.noEvents'
  | 'calendar.allEvents'
  | 'calendar.organizer'
  | 'calendar.terms'
  | 'calendar.demoNotice'
  | 'map.demoNotice'
  | 'events.heading'
  | 'events.subtitle'
  | 'events.organizer'
  | 'events.searchPlaceholder'
  | 'events.filters.all'
  | 'events.filters.free'
  | 'events.filters.under5000'
  | 'events.filters.available'
  | 'events.loading'
  | 'events.empty'
  | 'events.retry'
  | 'events.reset'
  | 'events.demo'
  | 'events.promo'
  | 'events.illustrative'
  | 'checkout.heading'
  | 'checkout.acceptTerms'
  | 'checkout.continue'
  | 'checkout.hint'
  | 'checkout.unavailable'
  | 'checkout.support'
  | 'tickets.heading'
  | 'tickets.empty'
  | 'tickets.catalog'
  | 'tickets.status.paid'
  | 'tickets.status.pending'
  | 'tickets.status.checkout'
  | 'tickets.status.failed'
  | 'tickets.status.refunded'
  | 'tickets.status.refundRequested'
  | 'tickets.status.expired'
  | 'tickets.status.unknown'
  | 'tickets.open'
  | 'tickets.entryCode'
  | 'tickets.demoNotice'
  | 'orders.heading'
  | 'orders.subtitle'
  | 'orders.sales'
  | 'orders.tickets'
  | 'orders.events'
  | 'orders.createNew'
  | 'orders.noOrders';

const translations: Record<Locale, Record<TranslationKey, string>> = {
  ru: {
    'nav.events': 'События',
    'nav.map': 'Карта города',
    'nav.tickets': 'Мои билеты',
    'nav.profile': 'Профиль',
    'nav.publish': 'Разместить событие',
    'nav.terms': 'Условия',
    'nav.section': 'Навигация',
    'nav.mainAria': 'Основная навигация',
    'theme.switchToDark': 'Включить тёмную тему',
    'theme.switchToLight': 'Включить светлую тему',
    'breadcrumb.home': 'Главная',
    'breadcrumb.events': 'События',
    'breadcrumb.event': 'Событие',
    'breadcrumb.ticket': 'Билет',
    'breadcrumb.orders': 'Заказы',
    'breadcrumb.review': 'Проверка заявок',
    'breadcrumb.botMessages': 'Сообщения боту',
    'breadcrumb.map': 'Карта города',
    'breadcrumb.tickets': 'Мои билеты',
    'breadcrumb.groups': 'Сообщества',
    'breadcrumb.createEvent': 'Новое событие',
    'breadcrumb.profile': 'Профиль',
    'breadcrumb.terms': 'Условия',
    'home.whatToday': 'Что ищешь',
    'home.findEvent': 'Найти событие',
    'home.createEvent': 'Создать событие',
    'home.intro': 'Найди событие в Астане или добавь своё в городскую афишу.',
    'home.footer': 'Город начинается с того, что происходит рядом.',
    'calendar.title': 'Афиша Астаны',
    'calendar.subtitle': 'Выберите дату и найдите событие, куда хочется пойти.',
    'calendar.month': 'Месяц',
    'calendar.week': 'Неделя',
    'calendar.today': 'Сегодня',
    'calendar.noEvents': 'На эту дату пока нет опубликованных событий.',
    'calendar.allEvents': 'Все события',
    'calendar.organizer': 'Вы организатор?',
    'calendar.terms': 'Условия и правила',
    'calendar.demoNotice': 'Показаны демо-события: данные хранятся только в приложении и не подтверждают реальные продажи.',
    'map.demoNotice': 'Демо-карта · примеры событий',
    'events.heading': 'Вечер начинается',
    'events.subtitle': 'События, которые хочется запомнить. Выбирай по настроению, месту и бюджету.',
    'events.organizer': 'Организаторам: разместить событие бесплатно',
    'events.searchPlaceholder': 'Название, место или описание',
    'events.filters.all': 'Все категории',
    'events.filters.free': 'Бесплатно',
    'events.filters.under5000': 'До 5 000 ₸',
    'events.filters.available': 'Есть места',
    'events.loading': 'Загружаем события…',
    'events.empty': 'Подходящих событий пока нет',
    'events.retry': 'Повторить',
    'events.reset': 'Сбросить фильтры',
    'events.demo': 'Пример',
    'events.promo': 'Промо',
    'events.illustrative': 'Иллюстрация',
    'checkout.heading': 'Оформить билет',
    'checkout.acceptTerms': 'Я прочитал(а) и принимаю',
    'checkout.continue': 'Продолжить в Telegram',
    'checkout.hint': 'Оплата проходит в Telegram в тенге через подключённого платёжного провайдера. Telegram Stars для входа не используются.',
    'checkout.unavailable': 'Билеты временно недоступны',
    'checkout.support': 'Написать в поддержку',
    'tickets.heading': 'Мои билеты',
    'tickets.empty': 'Здесь появятся ваши билеты и предстоящие события.',
    'tickets.catalog': 'Открыть каталог событий',
    'tickets.status.paid': 'Оплачено',
    'tickets.status.pending': 'Счёт выставлен',
    'tickets.status.checkout': 'Подтверждаем оплату',
    'tickets.status.failed': 'Ошибка оплаты',
    'tickets.status.refunded': 'Возврат оформлен',
    'tickets.status.refundRequested': 'Возврат на проверке',
    'tickets.status.expired': 'Счёт истёк',
    'tickets.status.unknown': 'Статус уточняется',
    'tickets.open': 'О сходке',
    'tickets.entryCode': 'Код входа:',
    'tickets.demoNotice': 'Демо-билет. QR-код не даёт права на вход.',
    'orders.heading': 'Заказы',
    'orders.subtitle': 'Продажи по вашим событиям и общий обзор для администратора.',
    'orders.sales': 'Выручка',
    'orders.tickets': 'Билеты',
    'orders.events': 'События',
    'orders.createNew': 'Разместить новое событие',
    'orders.noOrders': 'Заказов по вашим событиям пока нет. Для доступа откройте TUSA из Telegram.',
  },
  kz: {
    'nav.events': 'Іс-шақтар',
    'nav.map': 'Қала картасы',
    'nav.tickets': 'Билеттерім',
    'nav.profile': 'Профиль',
    'nav.publish': 'Іс-шақты орналастыру',
    'nav.terms': 'Шарттар',
    'nav.section': 'Мәзір',
    'nav.mainAria': 'Негізгі мәзір',
    'theme.switchToDark': 'Қараңғы тақырыпты қосу',
    'theme.switchToLight': 'Ашық тақырыпты қосу',
    'breadcrumb.home': 'Басты бет',
    'breadcrumb.events': 'Іс-шақтар',
    'breadcrumb.event': 'Іс-шақ',
    'breadcrumb.ticket': 'Билет',
    'breadcrumb.orders': 'Тапсырыстар',
    'breadcrumb.review': 'Өтінімдерді тексеру',
    'breadcrumb.botMessages': 'Бот хабарламалары',
    'breadcrumb.map': 'Қала картасы',
    'breadcrumb.tickets': 'Билеттерім',
    'breadcrumb.groups': 'Қауымдастықтар',
    'breadcrumb.createEvent': 'Жаңа іс-шақ',
    'breadcrumb.profile': 'Профиль',
    'breadcrumb.terms': 'Шарттар',
    'home.whatToday': 'Бүгін не іздейсіз?',
    'home.findEvent': 'Іс-шақты табу',
    'home.createEvent': 'Іс-шақты жасау',
    'home.intro': 'Астанадағы іс-шақты тап немесе қала афишасына өзіңді қос.',
    'home.footer': 'Қала жақын жердегі оқиғадан басталады.',
    'calendar.title': 'Астана афишасы',
    'calendar.subtitle': 'Күнді таңдап, барғыңыз келетін іс-шақты табыңыз.',
    'calendar.month': 'Ай',
    'calendar.week': 'Апта',
    'calendar.today': 'Бүгін',
    'calendar.noEvents': 'Бұл күнге әзірге жарияланған іс-шақ жоқ.',
    'calendar.allEvents': 'Барлық іс-шақтар',
    'calendar.organizer': 'Сіз ұйымдастырушысыз ба?',
    'calendar.terms': 'Шарттар мен ережелер',
    'calendar.demoNotice': 'Демо іс-шақтар көрсетіліп тұр. Мәліметтер тек осы қолданбада сақталады және нақты сатылымды білдірмейді.',
    'map.demoNotice': 'Демо карта · үлгі іс-шақтар',
    'events.heading': 'Кеш басталады',
    'events.subtitle': 'Ұмытылмайтын іс-шақтар. Әуенге, орынға және бюджетке қарай таңдаңыз.',
    'events.organizer': 'Ұйымдастырушылар: іс-шақты тегін орналастырыңыз',
    'events.searchPlaceholder': 'Атауы, орын немесе сипаттама',
    'events.filters.all': 'Барлық санаттар',
    'events.filters.free': 'Бесплатно',
    'events.filters.under5000': '5 000 ₸-ға дейін',
    'events.filters.available': 'Орын бар',
    'events.loading': 'Іс-шақтар жүктелуде…',
    'events.empty': 'Сәйкес іс-шақтар әлі жоқ',
    'events.retry': 'Қайталау',
    'events.reset': 'Фильтрлерді қалпына келтіру',
    'events.demo': 'Мысал',
    'events.promo': 'Промо',
    'events.illustrative': 'Иллюстрация',
    'checkout.heading': 'Билет сатып алу',
    'checkout.acceptTerms': 'Мен оқып шықтым және келісемін',
    'checkout.continue': 'Telegram арқылы жалғастыру',
    'checkout.hint': 'Төлем Telegram арқылы, теңгемен, қосылған төлем провайдері арқылы жүргізіледі. Telegram Stars кіріс үшін қолданылмайды.',
    'checkout.unavailable': 'Билеттер уақытша қолжетімсіз',
    'checkout.support': 'Қолдау қызметіне жазылу',
    'tickets.heading': 'Билеттерім',
    'tickets.empty': 'Мұнда сіздің билеттеріңіз бен келесі іс-шақтар пайда болады.',
    'tickets.catalog': 'Іс-шақтар каталогын ашу',
    'tickets.status.paid': 'Төленді',
    'tickets.status.pending': 'Шот берілді',
    'tickets.status.checkout': 'Төлемді растауда',
    'tickets.status.failed': 'Төлем қатесі',
    'tickets.status.refunded': 'Қайтару жасалды',
    'tickets.status.refundRequested': 'Қайтару тексеруде',
    'tickets.status.expired': 'Шот мерзімі аяқталды',
    'tickets.status.unknown': 'Статус уточняется',
    'tickets.open': 'Орын туралы',
    'tickets.entryCode': 'Кіру коды:',
    'tickets.demoNotice': 'Демо билет. Бұл QR-кодпен іс-шаққа кіруге болмайды.',
    'orders.heading': 'Заказы',
    'orders.subtitle': 'Оқиғаларыңыз бойынша сатылымдар және әкімшілік шолу.',
    'orders.sales': 'Түсім',
    'orders.tickets': 'Билеттер',
    'orders.events': 'Іс-шақтар',
    'orders.createNew': 'Жаңа іс-шақты орналастыру',
    'orders.noOrders': 'Сіздің іс-шақтарыңыз бойынша тапсырыстар әлі жоқ. TUSA-ға Telegram арқылы кіріңіз.',
  },
  en: {
    'nav.events': 'Events',
    'nav.map': 'City map',
    'nav.tickets': 'My tickets',
    'nav.profile': 'Profile',
    'nav.publish': 'Publish event',
    'nav.terms': 'Terms',
    'nav.section': 'Menu',
    'nav.mainAria': 'Main navigation',
    'theme.switchToDark': 'Switch to dark theme',
    'theme.switchToLight': 'Switch to light theme',
    'breadcrumb.home': 'Home',
    'breadcrumb.events': 'Events',
    'breadcrumb.event': 'Event',
    'breadcrumb.ticket': 'Ticket',
    'breadcrumb.orders': 'Orders',
    'breadcrumb.review': 'Submission review',
    'breadcrumb.botMessages': 'Bot messages',
    'breadcrumb.map': 'City map',
    'breadcrumb.tickets': 'My tickets',
    'breadcrumb.groups': 'Communities',
    'breadcrumb.createEvent': 'New event',
    'breadcrumb.profile': 'Profile',
    'breadcrumb.terms': 'Terms',
    'home.whatToday': 'What are you looking for',
    'home.findEvent': 'Find an event',
    'home.createEvent': 'Create an event',
    'home.intro': 'Find an event in Astana or add your own to the city listings.',
    'home.footer': 'The city begins with what happens nearby.',
    'calendar.title': 'Astana events',
    'calendar.subtitle': 'Choose a date and find an event you would love to attend.',
    'calendar.month': 'Month',
    'calendar.week': 'Week',
    'calendar.today': 'Today',
    'calendar.noEvents': 'No events have been published for this date yet.',
    'calendar.allEvents': 'All events',
    'calendar.organizer': 'Are you an organizer?',
    'calendar.terms': 'Terms and policies',
    'calendar.demoNotice': 'Showing demo events. These examples are stored only in this app and do not represent real ticket sales.',
    'map.demoNotice': 'Demo map · sample events',
    'events.heading': 'The evening starts',
    'events.subtitle': 'Events worth remembering. Choose by mood, location, and budget.',
    'events.organizer': 'For organizers: publish an event for free',
    'events.searchPlaceholder': 'Event name, venue, or description',
    'events.filters.all': 'All categories',
    'events.filters.free': 'Free',
    'events.filters.under5000': 'Up to 5,000 ₸',
    'events.filters.available': 'Available now',
    'events.loading': 'Loading events…',
    'events.empty': 'No matching events yet',
    'events.retry': 'Retry',
    'events.reset': 'Reset filters',
    'events.demo': 'Sample',
    'events.promo': 'Promo',
    'events.illustrative': 'Illustration',
    'checkout.heading': 'Buy ticket',
    'checkout.acceptTerms': 'I have read and accept',
    'checkout.continue': 'Continue in Telegram',
    'checkout.hint': 'Payment is processed in Telegram in tenge through a connected payment provider. Telegram Stars are not used for entry.',
    'checkout.unavailable': 'Tickets are temporarily unavailable',
    'checkout.support': 'Contact support',
    'tickets.heading': 'My tickets',
    'tickets.empty': 'Your tickets and upcoming events will appear here.',
    'tickets.catalog': 'Open event catalog',
    'tickets.status.paid': 'Paid',
    'tickets.status.pending': 'Invoice sent',
    'tickets.status.checkout': 'Confirming payment',
    'tickets.status.failed': 'Payment failed',
    'tickets.status.refunded': 'Refunded',
    'tickets.status.refundRequested': 'Refund under review',
    'tickets.status.expired': 'Invoice expired',
    'tickets.status.unknown': 'Status pending',
    'tickets.open': 'View event',
    'tickets.entryCode': 'Entry code:',
    'tickets.demoNotice': 'Demo ticket. This QR code is not valid for event entry.',
    'orders.heading': 'Orders',
    'orders.subtitle': 'Sales for your events and a summary for administrators.',
    'orders.sales': 'Revenue',
    'orders.tickets': 'Tickets',
    'orders.events': 'Events',
    'orders.createNew': 'Publish a new event',
    'orders.noOrders': 'There are no orders for your events yet. Open TUSA from Telegram to access this view.',
  },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly locale = signal<Locale>(this.getInitialLocale());

  constructor() {
    effect(() => {
      const current = this.locale();
      document.documentElement.lang = current;
      document.documentElement.setAttribute('data-locale', current);
      document.title = current === 'en' ? 'TUSA Astana' : current === 'kz' ? 'TUSA — Астана іс-шақтары' : 'TUSA — события Астаны';
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('tusa-locale', current);
      }
    });
  }

  t(key: TranslationKey): string {
    const current = this.locale();
    return translations[current][key] ?? translations.ru[key] ?? key;
  }

  brandCity(): string {
    const current = this.locale();
    return current === 'en' ? 'Astana' : 'Астана';
  }

  setLocale(locale: Locale): void {
    this.locale.set(locale);
  }

  private getInitialLocale(): Locale {
    if (typeof window === 'undefined') return 'ru';
    const saved = window.localStorage.getItem('tusa-locale');
    if (saved === 'ru' || saved === 'kz' || saved === 'en') return saved;
    const browser = navigator.language.toLowerCase();
    if (browser.startsWith('kk') || browser.startsWith('kz')) return 'kz';
    if (browser.startsWith('en')) return 'en';
    return 'ru';
  }
}
