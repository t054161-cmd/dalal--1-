/* ═══════════════════════════════════════════════════════════════════════
   I18N — English (LTR) and Arabic (RTL). Every string the interface can
   show lives here; space names and descriptions live in data.js.
   ═══════════════════════════════════════════════════════════════════════ */
(function (FS) {
  'use strict';

  const STRINGS = {
    en: {
      'brand.tag': 'Space for achievement',

      'nav.home': 'Home',
      'nav.spaces': 'Spaces',
      'nav.about': 'About',
      'nav.contact': 'Contact Us',
      'nav.profile': 'Profile',
      'nav.favorites': 'Favorites',

      'hero.cue': 'Offices · Halls · Cafés',
      'hero.explore': 'Explore Spaces',
      'hero.scroll': 'Scroll',

      'home.introEyebrow': 'The idea',
      'home.introTitle': 'Find the space that fits your achievement',
      'home.introBody': 'Focus Space is not a directory of places. It reads what you are trying to do — a deep work morning, a training course, a quiet afternoon of study — and points you at the room that fits it.',
      'home.stat1': 'curated spaces',
      'home.stat2': 'districts',
      'home.stat3': 'live availability',
      'home.stat3v': 'Always',

      'home.catEyebrow': 'Categories',
      'home.catTitle': 'Three kinds of room',
      'home.catBody': 'Every space on Focus Space belongs to one of three families. Choose the one that matches the work in front of you.',

      'home.featuredEyebrow': 'Selected',
      'home.featuredTitle': 'Spaces we would book ourselves',
      'home.featuredBody': 'A short, honest shortlist — rated by the people who actually worked there.',
      'home.featuredAll': 'See all spaces',

      'home.howEyebrow': 'How it works',
      'home.howTitle': 'Three quiet steps',
      'home.how1t': 'Tell us the work',
      'home.how1b': 'Studying, a workshop, a client meeting, or an afternoon that just needs to be quiet.',
      'home.how2t': 'Filter what matters',
      'home.how2b': 'Distance, rating, live availability, capacity, services and current offers.',
      'home.how3t': 'Save and return',
      'home.how3b': 'Keep the rooms that worked in your favorites and come back to them in one tap.',

      'home.quote': 'We don’t just help you find a place; we help you find the space that fits your achievement.',

      'cat.offices': 'Offices',
      'cat.offices.sub': 'For studying and working',
      'cat.offices.long': 'Private rooms and focused desks for studying and deep work. Quiet floors, good chairs, real power, and internet you can trust for a full day.',
      'cat.halls': 'Halls',
      'cat.halls.sub': 'For companies, courses, meetings and workshops',
      'cat.halls.long': 'Rooms that hold a group: company sessions, trainers and courses, meetings, workshops and events — with projection, sound and a setup that can be rearranged.',
      'cat.cafes': 'Cafés',
      'cat.cafes.sub': 'For quiet studying and working',
      'cat.cafes.long': 'Cafés chosen for the way they treat a laptop and a long session: low noise, generous tables, sockets within reach, and staff who let you stay.',
      'cat.explore': 'Explore',
      'cat.count': '{n} spaces',

      'spaces.title': 'Discover a space',
      'spaces.subtitle': 'Filter by what your day actually needs.',
      'spaces.search': 'Search a space, district or service',
      'spaces.results': '{n} spaces',
      'spaces.resultsOne': '1 space',
      'spaces.none': 'No space matches these filters yet.',
      'spaces.noneHint': 'Try widening the capacity, or clear a filter.',
      'spaces.clear': 'Clear filters',

      'filter.sort': 'Sort by',
      'filter.sort.recommended': 'Recommended',
      'filter.sort.nearest': 'Nearest',
      'filter.sort.rated': 'Highest rated',
      'filter.type': 'Space type',
      'filter.type.all': 'All types',
      'filter.people': 'Number of people',
      'filter.people.any': 'Any size',
      'filter.people.n': '{n}+ people',
      'filter.available': 'Available now',
      'filter.offers': 'Has an offer',
      'filter.services': 'Services',
      'filter.location': 'Use my location',
      'filter.locationOn': 'Location on',
      'filter.locating': 'Locating…',
      'filter.locationHint': 'Distances stay hidden until you allow location.',
      'filter.locationDenied': 'Location permission was declined.',
      'filter.locationFail': 'Location is unavailable right now.',

      'status.available': 'Available',
      'status.busy': 'Busy',
      'status.closed': 'Closed',

      'card.upTo': 'up to {n}',
      'card.rating': 'rating',
      'card.km': '{n} km',
      'card.fav': 'Add to favorites',
      'card.unfav': 'Remove from favorites',
      'card.view': 'View space',
      'card.offer': 'Offer',
      'card.more': '+{n} more',

      'detail.back': 'Back to spaces',
      'detail.about': 'About this space',
      'detail.services': 'Services',
      'detail.offers': 'Current offers',
      'detail.noOffers': 'No offer running at the moment.',
      'detail.hours': 'Opening hours',
      'detail.capacity': 'Capacity',
      'detail.capacityV': 'Up to {n} people',
      'detail.price': 'From',
      'detail.priceV': '{n} KD / hour',
      'detail.district': 'District',
      'detail.suited': 'Suited for',
      'detail.map': 'Open in maps',
      'detail.similar': 'Similar spaces',
      'detail.reviews': '{n} reviews',
      'detail.save': 'Save to favorites',
      'detail.saved': 'Saved to favorites',
      'detail.notFound': 'That space could not be found.',

      'fav.title': 'Favorite spaces',
      'fav.empty': 'No favorites yet.',
      'fav.emptyHint': 'Tap the heart on any space and it will wait for you here.',
      'fav.added': 'Added to favorites',
      'fav.removed': 'Removed from favorites',

      'profile.title': 'Profile',
      'profile.guest': 'Guest',
      'profile.editName': 'Your name',
      'profile.save': 'Save',
      'profile.saved': 'Profile saved',
      'profile.photo': 'Profile picture',
      'profile.photoHint': 'Choose an image, or keep your initials.',
      'profile.photoUpload': 'Upload a photo',
      'profile.photoRemove': 'Remove photo',
      'profile.recent': 'Recently viewed',
      'profile.recentEmpty': 'Nothing viewed yet.',
      'profile.language': 'Language settings',
      'profile.languageHint': 'The interface, the spaces and the direction of the page all follow this choice.',
      'profile.account': 'Account settings',
      'profile.email': 'Email',
      'profile.city': 'Preferred district',
      'profile.cityAny': 'No preference',
      'profile.notify': 'Email me about new spaces and offers',
      'profile.motion': 'Reduce motion and animation',
      'profile.clear': 'Clear saved data',
      'profile.clearConfirm': 'This clears your favorites, recents and profile on this device. Continue?',
      'profile.cleared': 'Saved data cleared',

      'about.eyebrow': 'About',
      'about.title': 'A harbour for people who finish things',
      'about.body1': 'Focus Space began with a small frustration: the room you work in changes the work. A café with the wrong noise costs you a morning. A hall without a screen costs you a workshop.',
      'about.body2': 'So we built a platform that describes rooms the way people actually judge them — how quiet, how full, how far, what it gives you, and whether it is open right now.',
      'about.body3': 'It is not a hotel booking platform, a café directory or a traditional listing site. It helps people discover the right space for work, learning, focus and achievement.',
      'about.v1t': 'Calm',
      'about.v1b': 'Nothing on the screen competes with the work you came to do.',
      'about.v2t': 'Honest',
      'about.v2b': 'Live availability and real capacity, not marketing photography.',
      'about.v3t': 'Local',
      'about.v3b': 'Districts, distances and hours that make sense where you actually are.',

      'contact.eyebrow': 'Contact',
      'contact.title': 'Let’s Connect',
      'contact.body': 'A question, a space you would like listed, or a partnership — write to us and a person will answer.',
      'contact.emailLabel': 'Email',
      'contact.phoneLabel': 'Phone',
      'contact.hoursLabel': 'We answer',
      'contact.hoursValue': 'Sunday to Thursday, 9:00 — 18:00',
      'contact.formTitle': 'Send a message',
      'contact.name': 'Full Name',
      'contact.email': 'Email',
      'contact.subject': 'Subject',
      'contact.message': 'Message',
      'contact.send': 'Send Message',
      'contact.sending': 'Sending…',
      'contact.thanks': 'Thank you. Your message has been received.',
      'contact.another': 'Send another message',
      'contact.errName': 'Please enter your full name.',
      'contact.errEmail': 'Please enter a valid email address.',
      'contact.errSubject': 'Please add a subject.',
      'contact.errMessage': 'Please write a short message.',

      'footer.navigate': 'Navigation',
      'footer.language': 'Language',
      'footer.contact': 'Contact',
      'footer.line': 'We don’t just help you find a place; we help you find the space that fits your achievement.',

      'srv.wifi': 'Fast Wi-Fi',
      'srv.power': 'Power at every seat',
      'srv.quiet': 'Quiet zone',
      'srv.meeting': 'Meeting room',
      'srv.projector': 'Projector & screen',
      'srv.sound': 'Sound system',
      'srv.whiteboard': 'Whiteboard',
      'srv.coffee': 'Coffee & tea',
      'srv.catering': 'Catering',
      'srv.parking': 'Free parking',
      'srv.print': 'Printing',
      'srv.lockers': 'Lockers',
      'srv.access': 'Step-free access',
      'srv.prayer': 'Prayer room',
      'srv.ac': 'Climate control',
      'srv.open24': 'Open late',
      'srv.outdoor': 'Outdoor seating',
      'srv.women': 'Women-only section',

      'time.open': 'Open {a} — {b}',
      'time.opens': 'Opens {a}',
      'time.until': 'Open until {b}',
      'time.busyNote': 'Busiest right now',

      'common.close': 'Close',
      'common.apply': 'Apply',
      'common.filters': 'Filters',
      'common.optional': 'optional'
    },

    ar: {
      'brand.tag': 'مساحة تليق بالإنجاز',

      'nav.home': 'الرئيسية',
      'nav.spaces': 'المساحات',
      'nav.about': 'عن المنصة',
      'nav.contact': 'تواصل معنا',
      'nav.profile': 'حسابي',
      'nav.favorites': 'المفضلة',

      'hero.cue': 'مكاتب · قاعات · مقاهي',
      'hero.explore': 'اكتشف المساحات',
      'hero.scroll': 'انزل',

      'home.introEyebrow': 'الفكرة',
      'home.introTitle': 'اعثر على المساحة التي تليق بإنجازك',
      'home.introBody': 'فوكس سبيس ليست دليل أماكن. نبدأ مما تنوي إنجازه — صباح عمل عميق، دورة تدريبية، أو بعد ظهيرة هادئة للدراسة — ثم نرشدك إلى الغرفة التي تناسبه.',
      'home.stat1': 'مساحة مختارة',
      'home.stat2': 'منطقة',
      'home.stat3': 'حالة الإتاحة',
      'home.stat3v': 'لحظية',

      'home.catEyebrow': 'الأقسام',
      'home.catTitle': 'ثلاثة أنواع من الغرف',
      'home.catBody': 'كل مساحة لدينا تنتمي إلى واحدة من ثلاث عائلات. اختر ما يناسب العمل الذي بين يديك.',

      'home.featuredEyebrow': 'مختارات',
      'home.featuredTitle': 'مساحات نحجزها لأنفسنا',
      'home.featuredBody': 'قائمة قصيرة وصادقة — بتقييم من عملوا فيها فعلاً.',
      'home.featuredAll': 'عرض كل المساحات',

      'home.howEyebrow': 'كيف تعمل',
      'home.howTitle': 'ثلاث خطوات هادئة',
      'home.how1t': 'حدّد طبيعة عملك',
      'home.how1b': 'دراسة، ورشة عمل، اجتماع مع عميل، أو بعد ظهيرة تحتاج الهدوء فقط.',
      'home.how2t': 'رشّح ما يهمّك',
      'home.how2b': 'المسافة، التقييم، الإتاحة الآن، عدد الأشخاص، الخدمات والعروض الحالية.',
      'home.how3t': 'احفظ وعُد',
      'home.how3b': 'احتفظ بالمساحات التي نجحت معك في المفضلة وعُد إليها بلمسة واحدة.',

      'home.quote': 'نحن لا نساعدك على إيجاد مكان فحسب؛ بل على إيجاد المساحة التي تليق بإنجازك.',

      'cat.offices': 'المكاتب',
      'cat.offices.sub': 'للدراسة والعمل',
      'cat.offices.long': 'غرف خاصة ومكاتب مركّزة للدراسة والعمل العميق. طوابق هادئة، مقاعد مريحة، كهرباء حقيقية، وإنترنت يمكن الاعتماد عليه ليوم كامل.',
      'cat.halls': 'القاعات',
      'cat.halls.sub': 'للشركات والدورات والاجتماعات وورش العمل',
      'cat.halls.long': 'قاعات تتّسع لمجموعة: جلسات الشركات، المدربون والدورات، الاجتماعات وورش العمل والفعاليات — مع عرض وصوت وترتيب قابل للتغيير.',
      'cat.cafes': 'المقاهي',
      'cat.cafes.sub': 'للدراسة والعمل الهادئ',
      'cat.cafes.long': 'مقاهٍ اخترناها لطريقة تعاملها مع اللابتوب والجلسات الطويلة: ضجيج منخفض، طاولات واسعة، أفياش قريبة، وطاقم لا يستعجلك.',
      'cat.explore': 'استكشف',
      'cat.count': '{n} مساحة',

      'spaces.title': 'اكتشف مساحة',
      'spaces.subtitle': 'رشّح حسب ما يحتاجه يومك فعلاً.',
      'spaces.search': 'ابحث عن مساحة أو منطقة أو خدمة',
      'spaces.results': '{n} مساحة',
      'spaces.resultsOne': 'مساحة واحدة',
      'spaces.none': 'لا توجد مساحة تطابق هذه المرشحات.',
      'spaces.noneHint': 'جرّب توسيع عدد الأشخاص أو إزالة أحد المرشحات.',
      'spaces.clear': 'مسح المرشحات',

      'filter.sort': 'الترتيب',
      'filter.sort.recommended': 'المقترح',
      'filter.sort.nearest': 'الأقرب',
      'filter.sort.rated': 'الأعلى تقييماً',
      'filter.type': 'نوع المساحة',
      'filter.type.all': 'كل الأنواع',
      'filter.people': 'عدد الأشخاص',
      'filter.people.any': 'أي عدد',
      'filter.people.n': '{n}+ أشخاص',
      'filter.available': 'متاحة الآن',
      'filter.offers': 'يوجد عرض',
      'filter.services': 'الخدمات',
      'filter.location': 'استخدم موقعي',
      'filter.locationOn': 'الموقع مفعّل',
      'filter.locating': 'جاري تحديد الموقع…',
      'filter.locationHint': 'لن تظهر المسافات إلا بعد السماح بالوصول للموقع.',
      'filter.locationDenied': 'تم رفض إذن الموقع.',
      'filter.locationFail': 'تعذّر تحديد الموقع الآن.',

      'status.available': 'متاحة',
      'status.busy': 'مزدحمة',
      'status.closed': 'مغلقة',

      'card.upTo': 'حتى {n}',
      'card.rating': 'التقييم',
      'card.km': '{n} كم',
      'card.fav': 'أضف إلى المفضلة',
      'card.unfav': 'إزالة من المفضلة',
      'card.view': 'عرض المساحة',
      'card.offer': 'عرض',
      'card.more': '+{n} أخرى',

      'detail.back': 'العودة للمساحات',
      'detail.about': 'عن هذه المساحة',
      'detail.services': 'الخدمات',
      'detail.offers': 'العروض الحالية',
      'detail.noOffers': 'لا يوجد عرض حالياً.',
      'detail.hours': 'ساعات العمل',
      'detail.capacity': 'السعة',
      'detail.capacityV': 'حتى {n} شخص',
      'detail.price': 'تبدأ من',
      'detail.priceV': '{n} د.ك / الساعة',
      'detail.district': 'المنطقة',
      'detail.suited': 'مناسبة لـ',
      'detail.map': 'افتح في الخرائط',
      'detail.similar': 'مساحات مشابهة',
      'detail.reviews': '{n} تقييم',
      'detail.save': 'احفظ في المفضلة',
      'detail.saved': 'محفوظة في المفضلة',
      'detail.notFound': 'تعذّر العثور على هذه المساحة.',

      'fav.title': 'المساحات المفضلة',
      'fav.empty': 'لا توجد مفضلات بعد.',
      'fav.emptyHint': 'اضغط القلب على أي مساحة وستنتظرك هنا.',
      'fav.added': 'أُضيفت إلى المفضلة',
      'fav.removed': 'أُزيلت من المفضلة',

      'profile.title': 'حسابي',
      'profile.guest': 'زائر',
      'profile.editName': 'اسمك',
      'profile.save': 'حفظ',
      'profile.saved': 'تم حفظ الملف',
      'profile.photo': 'الصورة الشخصية',
      'profile.photoHint': 'اختر صورة، أو أبقِ الأحرف الأولى من اسمك.',
      'profile.photoUpload': 'رفع صورة',
      'profile.photoRemove': 'إزالة الصورة',
      'profile.recent': 'شوهدت مؤخراً',
      'profile.recentEmpty': 'لم تشاهد أي مساحة بعد.',
      'profile.language': 'إعدادات اللغة',
      'profile.languageHint': 'الواجهة والمساحات واتجاه الصفحة تتبع هذا الاختيار.',
      'profile.account': 'إعدادات الحساب',
      'profile.email': 'البريد الإلكتروني',
      'profile.city': 'المنطقة المفضلة',
      'profile.cityAny': 'بدون تفضيل',
      'profile.notify': 'أرسلوا لي المساحات والعروض الجديدة',
      'profile.motion': 'تقليل الحركة والتأثيرات',
      'profile.clear': 'مسح البيانات المحفوظة',
      'profile.clearConfirm': 'سيؤدي هذا إلى مسح المفضلة والمشاهدات والملف على هذا الجهاز. هل تريد المتابعة؟',
      'profile.cleared': 'تم مسح البيانات المحفوظة',

      'about.eyebrow': 'عن المنصة',
      'about.title': 'مرفأ لمن يُنهون ما يبدؤون',
      'about.body1': 'بدأت فوكس سبيس من ملاحظة صغيرة: الغرفة التي تعمل فيها تغيّر عملك. مقهى بضجيج خاطئ يكلّفك صباحاً كاملاً، وقاعة بلا شاشة تكلّفك ورشة.',
      'about.body2': 'فبنينا منصة تصف الغرف كما يحكم عليها الناس فعلاً: كم هي هادئة، كم هي ممتلئة، كم تبعد، ماذا تقدّم، وهل هي مفتوحة الآن.',
      'about.body3': 'ليست منصة حجز فنادق ولا دليل مقاهٍ ولا موقع إعلانات تقليدي. إنها تساعد الناس على اكتشاف المساحة الصحيحة للعمل والتعلّم والتركيز والإنجاز.',
      'about.v1t': 'هدوء',
      'about.v1b': 'لا شيء على الشاشة ينافس العمل الذي جئت لأجله.',
      'about.v2t': 'صدق',
      'about.v2b': 'إتاحة لحظية وسعة حقيقية، لا صور تسويقية.',
      'about.v3t': 'محلية',
      'about.v3b': 'مناطق ومسافات وساعات عمل منطقية في مكانك فعلاً.',

      'contact.eyebrow': 'تواصل',
      'contact.title': 'Let’s Connect',
      'contact.body': 'سؤال، أو مساحة تودّ إضافتها، أو شراكة — اكتب لنا وسيردّ عليك إنسان.',
      'contact.emailLabel': 'البريد الإلكتروني',
      'contact.phoneLabel': 'الهاتف',
      'contact.hoursLabel': 'نردّ عليك',
      'contact.hoursValue': 'الأحد إلى الخميس، ٩:٠٠ — ١٨:٠٠',
      'contact.formTitle': 'أرسل رسالة',
      'contact.name': 'الاسم الكامل',
      'contact.email': 'البريد الإلكتروني',
      'contact.subject': 'الموضوع',
      'contact.message': 'الرسالة',
      'contact.send': 'إرسال الرسالة',
      'contact.sending': 'جاري الإرسال…',
      'contact.thanks': 'شكراً لك. تم استلام رسالتك.',
      'contact.another': 'إرسال رسالة أخرى',
      'contact.errName': 'يرجى كتابة الاسم الكامل.',
      'contact.errEmail': 'يرجى إدخال بريد إلكتروني صحيح.',
      'contact.errSubject': 'يرجى إضافة موضوع.',
      'contact.errMessage': 'يرجى كتابة رسالة قصيرة.',

      'footer.navigate': 'التنقل',
      'footer.language': 'اللغة',
      'footer.contact': 'تواصل',
      'footer.line': 'نحن لا نساعدك على إيجاد مكان فحسب؛ بل على إيجاد المساحة التي تليق بإنجازك.',

      'srv.wifi': 'إنترنت سريع',
      'srv.power': 'كهرباء لكل مقعد',
      'srv.quiet': 'منطقة هادئة',
      'srv.meeting': 'غرفة اجتماعات',
      'srv.projector': 'بروجكتر وشاشة',
      'srv.sound': 'نظام صوتي',
      'srv.whiteboard': 'سبورة',
      'srv.coffee': 'قهوة وشاي',
      'srv.catering': 'ضيافة',
      'srv.parking': 'موقف مجاني',
      'srv.print': 'طباعة',
      'srv.lockers': 'خزائن',
      'srv.access': 'مدخل بلا درج',
      'srv.prayer': 'مصلّى',
      'srv.ac': 'تكييف',
      'srv.open24': 'مفتوح حتى وقت متأخر',
      'srv.outdoor': 'جلسات خارجية',
      'srv.women': 'قسم للنساء',

      'time.open': 'مفتوحة {a} — {b}',
      'time.opens': 'تفتح {a}',
      'time.until': 'مفتوحة حتى {b}',
      'time.busyNote': 'الأكثر ازدحاماً الآن',

      'common.close': 'إغلاق',
      'common.apply': 'تطبيق',
      'common.filters': 'المرشحات',
      'common.optional': 'اختياري'
    }
  };

  const I18N = {
    lang: 'en',
    STRINGS,

    t(key, vars) {
      const table = STRINGS[I18N.lang] || STRINGS.en;
      let s = table[key];
      if (s === undefined) s = STRINGS.en[key];
      if (s === undefined) return key;
      if (vars) {
        for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
      }
      return s;
    },

    /* Pick the right half of a bilingual { en, ar } value. */
    pick(value) {
      if (value == null) return '';
      if (typeof value === 'string') return value;
      return value[I18N.lang] || value.en || '';
    },

    isRTL() { return I18N.lang === 'ar'; },

    /* Arabic-Indic digits read better inside Arabic copy. */
    num(n) {
      const s = String(n);
      if (I18N.lang !== 'ar') return s;
      const map = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
      return s.replace(/[0-9]/g, d => map[+d]);
    },

    /* Fill every [data-i18n] node inside a root. */
    apply(root) {
      (root || document).querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = I18N.t(el.getAttribute('data-i18n'));
      });
      (root || document).querySelectorAll('[data-i18n-ph]').forEach(el => {
        el.setAttribute('placeholder', I18N.t(el.getAttribute('data-i18n-ph')));
      });
      (root || document).querySelectorAll('[data-i18n-aria]').forEach(el => {
        el.setAttribute('aria-label', I18N.t(el.getAttribute('data-i18n-aria')));
      });
    }
  };

  FS.I18N = I18N;
  FS.t = I18N.t;
})(window.FS);
