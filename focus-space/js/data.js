/* ═══════════════════════════════════════════════════════════════════════
   DATA — the three categories, the service vocabulary and the spaces.
   Availability is computed from real opening hours and the visitor's own
   clock, so "Available / Busy / Closed" changes through the day.
   ═══════════════════════════════════════════════════════════════════════ */
(function (FS) {
  'use strict';

  /* ── real photographs ─────────────────────────────────────────────────
     Drop photos into focus-space/assets/photos/ and name them here. A value
     may be a local path ('assets/photos/atlas-desk.jpg') or a full URL. Any
     entry left empty keeps the rendered interior, so the site never breaks
     while the photography is still being collected.
     See focus-space/assets/photos/README.md for sizes and conventions. */
  const PHOTOS = {
    /* 01 · offices */
    'atlas-desk':       '',
    'north-study':      '',
    'quiet-quarter':    '',
    'meridian-works':   '',
    'cedar-room':       '',
    'harbour-desk':     '',
    'lumen-suite':      '',
    /* 02 · halls */
    'assembly-hall':    '',
    'workshop-loft':    '',
    'boardroom-nine':   '',
    'atrium-stage':     '',
    'seminar-cube':     '',
    'olive-hall':       '',
    'blueprint-room':   '',
    /* 03 · cafés */
    'sage-and-salt':    '',
    'paper-cup':        '',
    'the-reading-room': '',
    'dune-coffee':      '',
    'linen-espresso':   '',
    'garden-and-grain': '',
    'nocturne':         ''
  };

  /* One wide photograph per category, used on the category tiles and the
     category page header. Empty keeps the rendered interior. */
  const CATEGORY_PHOTOS = {
    offices: '',
    halls:   '',
    cafes:   ''
  };

  const CATEGORIES = [
    {
      id: 'offices', index: '01',
      name:  { en: 'Offices', ar: 'المكاتب' },
      sub:   'cat.offices.sub',
      long:  'cat.offices.long',
      suited: {
        en: ['Deep work', 'Studying', 'Solo focus days', 'Two-person desks', 'Calls'],
        ar: ['العمل العميق', 'الدراسة', 'أيام التركيز الفردي', 'مكاتب لشخصين', 'المكالمات']
      }
    },
    {
      id: 'halls', index: '02',
      name:  { en: 'Halls', ar: 'القاعات' },
      sub:   'cat.halls.sub',
      long:  'cat.halls.long',
      suited: {
        en: ['Companies', 'Trainers & courses', 'Meetings', 'Workshops', 'Events'],
        ar: ['الشركات', 'المدربون والدورات', 'الاجتماعات', 'ورش العمل', 'الفعاليات']
      }
    },
    {
      id: 'cafes', index: '03',
      name:  { en: 'Cafés', ar: 'المقاهي' },
      sub:   'cat.cafes.sub',
      long:  'cat.cafes.long',
      suited: {
        en: ['Studying', 'Quiet work', 'Laptops', 'Productive sessions', 'Reading'],
        ar: ['الدراسة', 'العمل الهادئ', 'اللابتوب', 'الجلسات المنتجة', 'القراءة']
      }
    }
  ];

  /* The service vocabulary — keys resolve through i18n (srv.*). */
  const SERVICES = [
    'wifi', 'power', 'quiet', 'meeting', 'projector', 'sound', 'whiteboard',
    'coffee', 'catering', 'parking', 'print', 'lockers', 'access', 'prayer',
    'ac', 'open24', 'outdoor', 'women'
  ];

  const D = (en, ar) => ({ en, ar });

  const SPACES = [
    /* ── 01 · OFFICES ────────────────────────────────────────────────── */
    {
      id: 'atlas-desk', cat: 'offices', seed: 11,
      name: D('Atlas Desk', 'أطلس ديسك'), district: D('Kuwait City', 'مدينة الكويت'),
      lat: 29.3789, lng: 47.9926, rating: 4.9, reviews: 214, capacity: 12, price: 4.5,
      hours: { open: 7, close: 23 }, busy: [[9, 11]], closedDays: [],
      services: ['wifi', 'power', 'quiet', 'meeting', 'coffee', 'print', 'parking', 'ac', 'prayer'],
      offer: D('20% off the first full day', 'خصم ٢٠٪ على أول يوم كامل'),
      desc: D('A quiet floor above the city with fixed desks, three glass focus rooms and a rule the staff actually enforce: no calls at the desks. Chairs are proper task chairs, and the internet holds a video call at full load.',
              'طابق هادئ يعلو المدينة، بمكاتب ثابتة وثلاث غرف تركيز زجاجية وقاعدة يطبّقها الفريق فعلاً: لا مكالمات على المكاتب. كراسي عمل حقيقية، وإنترنت يتحمّل مكالمة فيديو تحت الضغط.')
    },
    {
      id: 'north-study', cat: 'offices', seed: 12,
      name: D('North Study', 'نورث ستدي'), district: D('Salmiya', 'السالمية'),
      lat: 29.3339, lng: 48.0754, rating: 4.7, reviews: 168, capacity: 8, price: 3.0,
      hours: { open: 8, close: 24 }, busy: [[17, 21]], closedDays: [],
      services: ['wifi', 'power', 'quiet', 'coffee', 'lockers', 'open24', 'ac', 'women'],
      offer: D('Student rate after 8pm', 'سعر الطلبة بعد الثامنة مساءً'),
      desc: D('Built for the long study night. Individual carrels with their own lamp, a women-only reading room, lockers for anyone who leaves and comes back, and doors that stay open until midnight.',
              'مصمّمة لليالي الدراسة الطويلة. طاولات فردية بإضاءة خاصة، قاعة قراءة للنساء، خزائن لمن يخرج ويعود، وأبواب تبقى مفتوحة حتى منتصف الليل.')
    },
    {
      id: 'quiet-quarter', cat: 'offices', seed: 13,
      name: D('The Quiet Quarter', 'الربع الهادئ'), district: D('Jabriya', 'الجابرية'),
      lat: 29.3161, lng: 48.0244, rating: 4.8, reviews: 96, capacity: 20, price: 5.0,
      hours: { open: 8, close: 20 }, busy: [[11, 14]], closedDays: [5],
      services: ['wifi', 'power', 'quiet', 'meeting', 'whiteboard', 'coffee', 'parking', 'access', 'ac'],
      offer: null,
      desc: D('A converted villa: five private offices around a planted courtyard, each with a door that closes properly. Teams of two to six take it by the half-day.',
              'فيلا مُعاد تصميمها: خمسة مكاتب خاصة حول فناء مزروع، لكلٍّ منها باب يُغلق كما ينبغي. تحجزها فرق من شخصين إلى ستة بنصف اليوم.')
    },
    {
      id: 'meridian-works', cat: 'offices', seed: 14,
      name: D('Meridian Works', 'ميريديان ووركس'), district: D('Sharq', 'شرق'),
      lat: 29.3797, lng: 48.0006, rating: 4.6, reviews: 302, capacity: 40, price: 6.0,
      hours: { open: 7, close: 22 }, busy: [[9, 12], [14, 16]], closedDays: [],
      services: ['wifi', 'power', 'meeting', 'projector', 'coffee', 'print', 'parking', 'lockers', 'access', 'ac', 'prayer'],
      offer: D('Free meeting-room hour with any day pass', 'ساعة مجانية بغرفة الاجتماعات مع أي تصريح يومي'),
      desc: D('The largest floor on the platform, and the busiest at mid-morning. Come for the meeting rooms and the printing; the far corner by the sea windows stays quiet all day.',
              'أكبر طابق على المنصة، وأكثرها ازدحاماً في منتصف الصباح. تأتي إليها لغرف الاجتماعات والطباعة؛ أما الركن البعيد قرب نوافذ البحر فيبقى هادئاً طوال اليوم.')
    },
    {
      id: 'cedar-room', cat: 'offices', seed: 15,
      name: D('Cedar Room', 'غرفة الأرز'), district: D('Mishref', 'مشرف'),
      lat: 29.2703, lng: 48.0631, rating: 4.5, reviews: 74, capacity: 6, price: 3.5,
      hours: { open: 9, close: 21 }, busy: [[16, 18]], closedDays: [],
      services: ['wifi', 'power', 'quiet', 'coffee', 'parking', 'ac', 'women'],
      offer: null,
      desc: D('One small room, six seats, a single long oak table. It suits a pair of students or a founder who needs an afternoon without interruption.',
              'غرفة صغيرة واحدة، ستة مقاعد، وطاولة بلوط طويلة. تناسب طالبين أو مؤسِّساً يحتاج بعد ظهيرة بلا مقاطعة.')
    },
    {
      id: 'harbour-desk', cat: 'offices', seed: 16,
      name: D('Harbour Desk', 'مكتب المرفأ'), district: D('Bneid Al-Gar', 'بنيد القار'),
      lat: 29.3696, lng: 48.0044, rating: 4.4, reviews: 131, capacity: 16, price: 3.8,
      hours: { open: 8, close: 23 }, busy: [[19, 22]], closedDays: [],
      services: ['wifi', 'power', 'quiet', 'coffee', 'print', 'open24', 'outdoor', 'ac'],
      offer: D('Ten-day pass at the price of eight', 'تصريح عشرة أيام بسعر ثمانية'),
      desc: D('Sea-facing desks and a small terrace for the calls you would rather not take inside. Evenings fill up with graduate students.',
              'مكاتب تطلّ على البحر وشرفة صغيرة للمكالمات التي تفضّل ألا تجريها في الداخل. تمتلئ أمسياتها بطلبة الدراسات العليا.')
    },
    {
      id: 'lumen-suite', cat: 'offices', seed: 17,
      name: D('Lumen Suite', 'جناح لومن'), district: D('Shuwaikh', 'الشويخ'),
      lat: 29.3369, lng: 47.9269, rating: 4.3, reviews: 58, capacity: 10, price: 2.8,
      hours: { open: 8, close: 18 }, busy: [[10, 12]], closedDays: [5],
      services: ['wifi', 'power', 'meeting', 'whiteboard', 'parking', 'print', 'ac'],
      offer: null,
      desc: D('An industrial unit with high windows and very little decoration — the cheapest serious desk on the platform, and the brightest before noon.',
              'وحدة صناعية بنوافذ عالية وزخرفة قليلة جداً — أرخص مكتب جادّ على المنصة، وأكثرها إضاءة قبل الظهر.')
    },

    /* ── 02 · HALLS ──────────────────────────────────────────────────── */
    {
      id: 'assembly-hall', cat: 'halls', seed: 21,
      name: D('The Assembly', 'قاعة الملتقى'), district: D('Kuwait City', 'مدينة الكويت'),
      lat: 29.3811, lng: 47.9878, rating: 4.9, reviews: 143, capacity: 120, price: 22.0,
      hours: { open: 8, close: 22 }, busy: [[18, 21]], closedDays: [],
      services: ['wifi', 'power', 'projector', 'sound', 'whiteboard', 'catering', 'parking', 'access', 'ac', 'prayer'],
      offer: D('Weekday mornings 25% off', 'خصم ٢٥٪ صباحات أيام الأسبوع'),
      desc: D('A tiered hall for 120 with a proper sound desk, two wireless microphones and a screen you can read from the back row. Catering comes from the café downstairs.',
              'قاعة مدرّجة تتّسع لـ١٢٠ شخصاً بطاولة صوت حقيقية وميكروفونين لاسلكيين وشاشة تُقرأ من الصف الأخير. الضيافة من المقهى في الطابق الأسفل.')
    },
    {
      id: 'workshop-loft', cat: 'halls', seed: 22,
      name: D('Workshop Loft', 'لوفت الورش'), district: D('Al-Rai', 'الري'),
      lat: 29.3055, lng: 47.9236, rating: 4.7, reviews: 88, capacity: 45, price: 12.0,
      hours: { open: 9, close: 21 }, busy: [[15, 18]], closedDays: [],
      services: ['wifi', 'power', 'projector', 'whiteboard', 'coffee', 'catering', 'parking', 'ac'],
      offer: D('Third session free for course series', 'الجلسة الثالثة مجاناً لسلاسل الدورات'),
      desc: D('Movable tables, four whiteboard walls and enough floor to break 45 people into groups. Trainers keep rebooking it for multi-week courses.',
              'طاولات متحركة وأربعة جدران سبورة ومساحة تكفي لتقسيم ٤٥ شخصاً إلى مجموعات. يعيد المدربون حجزها لدورات تمتد أسابيع.')
    },
    {
      id: 'boardroom-nine', cat: 'halls', seed: 23,
      name: D('Boardroom Nine', 'قاعة التسعة'), district: D('Sharq', 'شرق'),
      lat: 29.3768, lng: 48.0031, rating: 4.8, reviews: 62, capacity: 14, price: 9.0,
      hours: { open: 8, close: 20 }, busy: [[10, 13]], closedDays: [5],
      services: ['wifi', 'power', 'projector', 'sound', 'meeting', 'coffee', 'catering', 'parking', 'access', 'ac'],
      offer: null,
      desc: D('Fourteen seats, one very good table, and a video-conference rig that connects on the first try. Companies use it for board days and client reviews.',
              'أربعة عشر مقعداً وطاولة ممتازة ونظام اجتماعات مرئية يتصل من المحاولة الأولى. تستخدمها الشركات لأيام مجلس الإدارة ومراجعات العملاء.')
    },
    {
      id: 'atrium-stage', cat: 'halls', seed: 24,
      name: D('Atrium Stage', 'منصة الأتريوم'), district: D('Hawally', 'حولي'),
      lat: 29.3325, lng: 48.0289, rating: 4.5, reviews: 117, capacity: 200, price: 30.0,
      hours: { open: 9, close: 23 }, busy: [[19, 22]], closedDays: [],
      services: ['wifi', 'power', 'projector', 'sound', 'catering', 'parking', 'access', 'ac', 'prayer'],
      offer: D('Evening events include stage lighting', 'الفعاليات المسائية تشمل إضاءة المسرح'),
      desc: D('The biggest room on the platform: a 200-seat atrium with a raised stage, house lighting and a loading door for anything you need to bring in.',
              'أكبر قاعة على المنصة: أتريوم بمئتي مقعد ومسرح مرتفع وإضاءة ثابتة وباب تحميل لكل ما تحتاج إدخاله.')
    },
    {
      id: 'seminar-cube', cat: 'halls', seed: 25,
      name: D('Seminar Cube', 'مكعب الندوات'), district: D('Salmiya', 'السالمية'),
      lat: 29.3402, lng: 48.0808, rating: 4.6, reviews: 71, capacity: 30, price: 10.0,
      hours: { open: 9, close: 22 }, busy: [[17, 20]], closedDays: [],
      services: ['wifi', 'power', 'projector', 'sound', 'whiteboard', 'coffee', 'access', 'ac', 'women'],
      offer: null,
      desc: D('A square, acoustically treated room for thirty. No echo, no street noise, and a side room for the trainer to prepare in.',
              'غرفة مربعة معالَجة صوتياً لثلاثين شخصاً. لا صدى ولا ضجيج شارع، مع غرفة جانبية يستعدّ فيها المدرب.')
    },
    {
      id: 'olive-hall', cat: 'halls', seed: 26,
      name: D('Olive Hall', 'قاعة الزيتون'), district: D('Sabah Al-Salem', 'صباح السالم'),
      lat: 29.2586, lng: 48.0631, rating: 4.4, reviews: 54, capacity: 60, price: 11.0,
      hours: { open: 10, close: 22 }, busy: [[18, 21]], closedDays: [],
      services: ['wifi', 'power', 'projector', 'sound', 'catering', 'parking', 'prayer', 'ac', 'women'],
      offer: D('Catering package at cost for courses', 'باقة الضيافة بسعر التكلفة للدورات'),
      desc: D('A warm hall for sixty with a separate women\'s entrance and a kitchen that can actually feed the room. Popular for weekend courses.',
              'قاعة دافئة لستين شخصاً بمدخل منفصل للنساء ومطبخ يستطيع إطعام القاعة فعلاً. مطلوبة لدورات نهاية الأسبوع.')
    },
    {
      id: 'blueprint-room', cat: 'halls', seed: 27,
      name: D('Blueprint Room', 'غرفة المخططات'), district: D('Shuwaikh', 'الشويخ'),
      lat: 29.3423, lng: 47.9311, rating: 4.6, reviews: 39, capacity: 25, price: 8.5,
      hours: { open: 8, close: 19 }, busy: [[11, 14]], closedDays: [5],
      services: ['wifi', 'power', 'projector', 'whiteboard', 'print', 'parking', 'coffee', 'ac'],
      offer: null,
      desc: D('A studio room with pin-up walls and a large-format printer next door — built for design reviews, engineering crits and anything that needs to go on a wall.',
              'غرفة استوديو بجدران للتعليق وطابعة كبيرة الحجم في الغرفة المجاورة — مصمّمة لمراجعات التصميم والنقد الهندسي وكل ما يحتاج أن يُعلَّق.')
    },

    /* ── 03 · CAFÉS ──────────────────────────────────────────────────── */
    {
      id: 'sage-and-salt', cat: 'cafes', seed: 31,
      name: D('Sage & Salt', 'سيج آند سولت'), district: D('Salmiya', 'السالمية'),
      lat: 29.3376, lng: 48.0699, rating: 4.8, reviews: 421, capacity: 34, price: 0,
      hours: { open: 7, close: 23 }, busy: [[16, 19]], closedDays: [],
      services: ['wifi', 'power', 'quiet', 'coffee', 'outdoor', 'ac', 'women'],
      offer: D('Second filter coffee free before 10am', 'قهوة الفلتر الثانية مجاناً قبل العاشرة صباحاً'),
      desc: D('The quietest café we know of that still makes good coffee. Long shared tables, sockets under every seat, and no music before noon.',
              'أهدأ مقهى نعرفه ولا يزال يصنع قهوة جيدة. طاولات مشتركة طويلة، أفياش تحت كل مقعد، ولا موسيقى قبل الظهر.')
    },
    {
      id: 'paper-cup', cat: 'cafes', seed: 32,
      name: D('Paper Cup', 'بيبر كب'), district: D('Kuwait City', 'مدينة الكويت'),
      lat: 29.3742, lng: 47.9895, rating: 4.6, reviews: 388, capacity: 28, price: 0,
      hours: { open: 6, close: 20 }, busy: [[7, 9], [12, 14]], closedDays: [],
      services: ['wifi', 'power', 'coffee', 'print', 'access', 'ac'],
      offer: null,
      desc: D('A commuter café that empties out after the morning rush and turns into a very good place to work from ten until four.',
              'مقهى للمارّة يفرغ بعد زحمة الصباح فيتحوّل إلى مكان ممتاز للعمل من العاشرة حتى الرابعة.')
    },
    {
      id: 'the-reading-room', cat: 'cafes', seed: 33,
      name: D('The Reading Room', 'غرفة المطالعة'), district: D('Jabriya', 'الجابرية'),
      lat: 29.3212, lng: 48.0201, rating: 4.9, reviews: 176, capacity: 22, price: 0,
      hours: { open: 9, close: 24 }, busy: [[20, 23]], closedDays: [],
      services: ['wifi', 'power', 'quiet', 'coffee', 'open24', 'lockers', 'ac', 'women'],
      offer: D('Free refill on any study session over three hours', 'إعادة تعبئة مجانية لأي جلسة دراسة تتجاوز ثلاث ساعات'),
      desc: D('Half café, half library, with a strict quiet floor upstairs and a shelf of books nobody minds you reading. Students hold it until midnight.',
              'نصفه مقهى ونصفه مكتبة، بطابق علوي هادئ بصرامة ورفّ كتب لا يمانع أحد أن تقرأها. يحتلّه الطلبة حتى منتصف الليل.')
    },
    {
      id: 'dune-coffee', cat: 'cafes', seed: 34,
      name: D('Dune Coffee', 'دون كوفي'), district: D('Mishref', 'مشرف'),
      lat: 29.2758, lng: 48.0704, rating: 4.5, reviews: 205, capacity: 40, price: 0,
      hours: { open: 8, close: 23 }, busy: [[17, 20]], closedDays: [],
      services: ['wifi', 'power', 'coffee', 'outdoor', 'parking', 'ac'],
      offer: null,
      desc: D('A large courtyard café where the outdoor tables stay usable most of the year. Bring headphones for the evening.',
              'مقهى بفناء واسع تبقى طاولاته الخارجية صالحة معظم العام. أحضِر سمّاعاتك للمساء.')
    },
    {
      id: 'linen-espresso', cat: 'cafes', seed: 35,
      name: D('Linen Espresso', 'لينن إسبريسو'), district: D('Salwa', 'سلوى'),
      lat: 29.2905, lng: 48.0742, rating: 4.4, reviews: 149, capacity: 18, price: 0,
      hours: { open: 7, close: 19 }, busy: [[8, 10]], closedDays: [5],
      services: ['wifi', 'power', 'quiet', 'coffee', 'access', 'ac'],
      offer: D('Breakfast and a flat white for two dinars', 'فطور وفلات وايت بدينارين'),
      desc: D('Eighteen seats, white walls, one espresso machine and nothing else competing for your attention.',
              'ثمانية عشر مقعداً، جدران بيضاء، آلة إسبريسو واحدة، ولا شيء آخر ينافسك على انتباهك.')
    },
    {
      id: 'garden-and-grain', cat: 'cafes', seed: 36,
      name: D('Garden & Grain', 'حديقة وحَب'), district: D('Fintas', 'الفنطاس'),
      lat: 29.1748, lng: 48.1211, rating: 4.7, reviews: 132, capacity: 30, price: 0,
      hours: { open: 8, close: 22 }, busy: [[18, 21]], closedDays: [],
      services: ['wifi', 'power', 'coffee', 'outdoor', 'parking', 'prayer', 'ac', 'women'],
      offer: null,
      desc: D('A planted café away from the traffic, with a covered garden section that works well for a long, unhurried afternoon.',
              'مقهى مزروع بعيداً عن الزحام، بقسم حديقة مغطّى يناسب بعد ظهيرة طويلة بلا استعجال.')
    },
    {
      id: 'nocturne', cat: 'cafes', seed: 37,
      name: D('Nocturne', 'نوكتيرن'), district: D('Hawally', 'حولي'),
      lat: 29.3378, lng: 48.0245, rating: 4.3, reviews: 264, capacity: 26, price: 0,
      hours: { open: 16, close: 26 }, busy: [[21, 24]], closedDays: [],
      services: ['wifi', 'power', 'coffee', 'open24', 'quiet', 'ac'],
      offer: D('Night rate: free refills after 11pm', 'تعرفة الليل: إعادة تعبئة مجانية بعد الحادية عشرة'),
      desc: D('Opens in the afternoon and closes at two in the morning. For people whose best hours arrive after everyone else has gone home.',
              'يفتح بعد الظهر ويغلق في الثانية فجراً. لمن تأتيهم أفضل ساعاتهم بعد أن يعود الجميع إلى بيوتهم.')
    }
  ];

  /* ── availability ──────────────────────────────────────────────────── */

  /* Hours can run past midnight (close: 26 === 02:00 next day). */
  function inWindow(h, a, b) {
    return b > 24 ? (h >= a || h < b - 24) : (h >= a && h < b);
  }

  function statusOf(space, now) {
    const d = now || new Date();
    const h = d.getHours() + d.getMinutes() / 60;
    if ((space.closedDays || []).indexOf(d.getDay()) !== -1) return 'closed';
    if (!inWindow(h, space.hours.open, space.hours.close)) return 'closed';
    for (const w of (space.busy || [])) if (inWindow(h, w[0], w[1])) return 'busy';
    return 'available';
  }

  function fmtHour(h) {
    const hh = ((Math.floor(h) % 24) + 24) % 24;
    const mm = Math.round((h - Math.floor(h)) * 60);
    const pad = n => (n < 10 ? '0' + n : '' + n);
    return pad(hh) + ':' + pad(mm);
  }

  /* ── distance ──────────────────────────────────────────────────────── */
  function haversine(a, b, c, d) {
    const R = 6371, rad = Math.PI / 180;
    const dLat = (c - a) * rad, dLng = (d - b) * rad;
    const s = Math.sin(dLat / 2) ** 2 +
              Math.cos(a * rad) * Math.cos(c * rad) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }

  FS.Data = {
    CATEGORIES, SERVICES, SPACES, PHOTOS, CATEGORY_PHOTOS,

    /* A real photograph for this space, or '' to fall back to a render. */
    photoFor(space) { return (space && PHOTOS[space.id]) || ''; },
    categoryPhoto(id) { return CATEGORY_PHOTOS[id] || ''; },
    category: id => CATEGORIES.find(c => c.id === id),
    space:    id => SPACES.find(s => s.id === id),
    byCategory: id => SPACES.filter(s => s.cat === id),
    statusOf, fmtHour,
    distanceKm(space, coords) {
      if (!coords) return null;
      return haversine(coords.lat, coords.lng, space.lat, space.lng);
    },
    /* Services actually used by at least one space, in vocabulary order. */
    activeServices() {
      const used = new Set();
      SPACES.forEach(s => s.services.forEach(k => used.add(k)));
      return SERVICES.filter(k => used.has(k));
    },
    districts() {
      const seen = new Map();
      SPACES.forEach(s => { if (!seen.has(s.district.en)) seen.set(s.district.en, s.district); });
      return Array.from(seen.values());
    }
  };
})(window.FS);
