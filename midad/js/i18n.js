/* ═══════════════════════════════════════════════════════════════════
   i18n — Arabic is primary and default. Every string in the interface
   lives here in both languages; nothing is translated by halves.
   ═══════════════════════════════════════════════════════════════════ */

export const LANGS = ['ar', 'en'];

const DICT = {
  /* ── chrome ── */
  'skip':               ['تجاوز إلى المحتوى', 'Skip to content'],
  'lang.switch':        ['English', 'العربية'],
  'menu':               ['القائمة', 'Menu'],
  'nav.main':           ['التنقل الرئيسي', 'Main navigation'],
  'close':              ['إغلاق', 'Close'],
  'back':               ['رجوع', 'Back'],

  'nav.home':           ['الرئيسية', 'Home'],
  'nav.library':        ['مكتبتي', 'My Library'],
  'nav.catalog':        ['الفهرس', 'Catalog'],
  'nav.chronicles':     ['سجل الرحلة', 'Reading Chronicles'],
  'nav.marginalia':     ['الهوامش', 'Marginalia'],
  'nav.stats':          ['الإحصائيات', 'Statistics'],
  'nav.exchange':       ['تبادل الكتب', 'Book Exchange'],
  'nav.community':      ['المجتمع', 'Community'],
  'nav.card':           ['بطاقة المكتبة', 'Library Card'],
  'nav.addBook':        ['إضافة كتاب', 'Add a Book'],

  /* ── shared vocabulary ── */
  'w.book':             ['كتاب', 'book'],
  'w.books':            ['كتاب', 'books'],
  'w.author':           ['المؤلف', 'Author'],
  'w.title':            ['العنوان', 'Title'],
  'w.genre':            ['التصنيف', 'Genre'],
  'w.rating':           ['التقييم', 'Rating'],
  'w.pages':            ['الصفحات', 'Pages'],
  'w.page':             ['صفحة', 'page'],
  'w.finished':         ['تاريخ الانتهاء', 'Date Finished'],
  'w.year':             ['السنة', 'Year'],
  'w.condition':        ['الحالة', 'Condition'],
  'w.language':         ['اللغة', 'Language'],
  'w.area':             ['المنطقة', 'Area'],
  'w.status':           ['حالة التبادل', 'Exchange Status'],
  'w.all':              ['الكل', 'All'],
  'w.of5':              ['من ٥', 'of 5'],
  'w.save':             ['حفظ', 'Save'],
  'w.cancel':           ['إلغاء', 'Cancel'],
  'w.edit':             ['تعديل', 'Edit'],
  'w.delete':           ['حذف', 'Delete'],
  'w.optional':         ['اختياري', 'optional'],
  'w.arabic':           ['العربية', 'Arabic'],
  'w.english':          ['الإنجليزية', 'English'],
  'w.readMore':         ['فتح السجل', 'Open the record'],

  /* ── home ── */
  'home.claim.ar':      ['مكتبة الكتب التي قرأتها، وما تركته فيك.', 'مكتبة الكتب التي قرأتها، وما تركته فيك.'],
  'home.claim.en':      ['A library of the books you’ve finished, and what they left within you.',
                         'A library of the books you’ve finished, and what they left within you.'],
  'home.enter':         ['ادخل مكتبتي', 'Enter My Library'],
  'home.chronicle':     ['تصفّح سجل الرحلة', 'Browse the Chronicles'],
  'home.journey':       ['رحلة القراءة', 'Reading Journey'],
  'home.trace':         ['كل كتاب ينزل أثرًا', 'Every book leaves a trace'],
  'home.traceEn':       ['Every book leaves a trace', 'Every book leaves a trace'],
  'home.archive':       ['الأرشيف الحيّ', 'Live Archive'],
  'home.fromMargins':   ['من الهوامش', 'From the Margins'],
  'home.features':      ['مميزات مِداد', 'What MIDĀD Keeps'],
  'home.f1':            ['تتبّع قراءاتك', 'Track Your Reading'],
  'home.f2':            ['ملاحظات واقتباسات', 'Notes & Quotes'],
  'home.f3':            ['تبادل الكتب', 'Book Exchange'],
  'home.f4':            ['مجتمع قارئ', 'Reading Community'],
  'home.f5':            ['إحصائيات تفصيلية', 'Detailed Statistics'],
  'home.f6':            ['توصيات مخصّصة', 'Personal Recommendations'],
  'home.recent':        ['آخر ما أنهيته', 'Recently Finished'],
  'home.recentAll':     ['كل المكتبة', 'The whole library'],

  /* ── statistics labels (used in panels & cards) ── */
  'st.finished':        ['كتاب منتهٍ', 'Books Finished'],
  'st.pages':           ['صفحة مقروءة', 'Pages Read'],
  'st.avg':             ['متوسط التقييم', 'Average Rating'],
  'st.thisYear':        ['كتاب هذا العام', 'Books This Year'],
  'st.perMonth':        ['الكتب المنتهية شهريًا', 'Books Finished Per Month'],
  'st.genres':          ['أكثر التصنيفات قراءة', 'Favourite Genres'],
  'st.topRated':        ['أعلى الكتب تقييمًا', 'Highest Rated Books'],
  'st.authors':         ['أكثر المؤلفين قراءة', 'Most Read Authors'],
  'st.activity':        ['نشاط القراءة', 'Reading Activity'],
  'st.longest':         ['أطول كتاب', 'Longest Book'],
  'st.notes':           ['هامش محفوظ', 'Saved Marginalia'],
  'st.perYear':         ['سنويًا', 'Yearly'],
  'st.monthly':         ['شهريًا', 'Monthly'],
  'st.allTime':         ['كل الوقت', 'All Time'],
  'st.pagesPerMonth':   ['الصفحات شهريًا', 'Pages Per Month'],
  'st.lede':            ['قراءة رقمية لرحلة ورقية: ما قرأته، ومتى، وكيف تغيّر إيقاعك مع الوقت.',
                         'A digital reading of a paper journey: what you read, when, and how your rhythm changed over time.'],
  'st.hint':            ['مرّر على أي عمود لعرض قيمته.', 'Hover any column to read its value.'],

  /* ── library ── */
  'lib.lede':           ['رفوف مكتبتك الشخصية: كل كتاب هنا وصل إلى صفحته الأخيرة.',
                         'The shelves of your personal library: every book here reached its last page.'],
  'lib.sort':           ['الترتيب', 'Arrange by'],
  'lib.filter':         ['التصفية', 'Filter'],
  'lib.sort.recent':    ['آخر ما انتهى', 'Recently Finished'],
  'lib.sort.rating':    ['الأعلى تقييمًا', 'Highest Rated'],
  'lib.sort.genre':     ['التصنيف', 'Genre'],
  'lib.sort.author':    ['المؤلف', 'Author'],
  'lib.sort.year':      ['سنة القراءة', 'Reading Year'],
  'lib.sort.pages':     ['عدد الصفحات', 'Number of Pages'],
  'lib.shelf':          ['رفّ', 'Shelf'],
  'lib.count':          ['كتاب على الرفوف', 'books on the shelves'],
  'lib.empty':          ['الرفوف فارغة', 'The shelves are empty'],
  'lib.emptyD':         ['أضف أول كتاب أنهيته ليبدأ أرشيف مِداد.', 'Add the first book you finished and the MIDĀD archive begins.'],
  'lib.noMatch':        ['لا كتاب بهذه الصفة', 'No book matches that'],
  'lib.noMatchD':       ['جرّب تصنيفًا آخر أو أعد التصفية إلى الكل.', 'Try another genre, or reset the filter to All.'],

  /* ── book archive ── */
  'bk.record':          ['سجل أرشيفي', 'Archival Record'],
  'bk.review':          ['قراءتي للكتاب', 'My Review'],
  'bk.notes':           ['ملاحظاتي', 'My Notes'],
  'bk.quotes':          ['اقتباسات مختارة', 'Favourite Quotes'],
  'bk.ideas':           ['الأفكار الرئيسية', 'Main Ideas'],
  'bk.stayed':          ['ما بقي معي', 'What Stayed With Me'],
  'bk.finishedOn':      ['أُنهي في', 'Finished on'],
  'bk.addedOn':         ['أُضيف إلى الأرشيف', 'Added to the archive'],
  'bk.none':            ['لم يُدوَّن شيء بعد في هذا الحقل.', 'Nothing has been recorded here yet.'],
  'bk.notFound':        ['هذا السجل غير موجود', 'That record does not exist'],
  'bk.notFoundD':       ['ربما حُذف الكتاب من الأرشيف.', 'The book may have been removed from the archive.'],
  'bk.deleted':         ['حُذف الكتاب من الأرشيف.', 'The book was removed from the archive.'],
  'bk.saved':           ['حُفظ السجل.', 'The record was saved.'],
  'bk.confirmDel':      ['حذف هذا الكتاب وكل ما دُوّن عنه؟', 'Delete this book and everything recorded about it?'],
  'bk.prev':            ['السابق', 'Previous'],
  'bk.next':            ['التالي', 'Next'],

  /* ── catalog ── */
  'cat.lede':           ['أدراج الفهرس القديمة، وخلفها نتائج رقمية فورية. ابحث بالعنوان أو المؤلف أو التصنيف.',
                         'The old catalogue drawers, with instant digital results behind them. Search by title, author or genre.'],
  'cat.placeholder':    ['ابحث عن كتاب، مؤلف، تصنيف…', 'Search a book, an author, a genre…'],
  'cat.drawers':        ['أدراج الفهرس', 'Catalogue Drawers'],
  'cat.results':        ['نتائج البحث', 'Search Results'],
  'cat.minRating':      ['التقييم الأدنى', 'Minimum rating'],
  'cat.clear':          ['مسح البحث', 'Clear search'],
  'cat.found':          ['نتيجة', 'results'],
  'cat.empty':          ['الفهرس لا يعرف هذا العنوان', 'The catalogue does not know that title'],
  'cat.emptyD':         ['حاول بكلمة أقصر، أو افتح درجًا من الأدراج.', 'Try a shorter word, or open one of the drawers.'],
  'cat.start':          ['اسحب درجًا أو اكتب في شريط البحث لتظهر النتائج.', 'Pull a drawer or type in the search bar to project results.'],

  /* ── chronicles ── */
  'chr.lede':           ['رحلتك في القراءة مرتّبة بالشهر والسنة، كسجل محفوظ في المكتبة.',
                         'Your reading journey ordered by month and year, like a record preserved in the library.'],
  'chr.inYear':         ['كتاب في هذه السنة', 'books this year'],
  'chr.inMonth':        ['كتاب', 'books'],
  'chr.empty':          ['السجل لم يبدأ بعد', 'The chronicle has not begun'],
  'chr.emptyD':         ['أول كتاب تنهيه سيفتح أول صفحة من السجل.', 'The first book you finish opens the first page of the chronicle.'],

  /* ── marginalia ── */
  'mg.lede':            ['ما كتبته على الحواشي: خواطر، تأملات، واقتباسات أردت الاحتفاظ بها.',
                         'What you wrote in the margins: thoughts, reflections and quotes you wanted to keep.'],
  'mg.all':             ['كل الهوامش', 'All Marginalia'],
  'mg.quote':           ['اقتباس', 'Quote'],
  'mg.note':            ['ملاحظة', 'Note'],
  'mg.idea':            ['فكرة', 'Idea'],
  'mg.stayed':          ['ما بقي', 'What Stayed'],
  'mg.add':             ['إضافة هامش', 'Add Marginalia'],
  'mg.added':           ['أُضيف الهامش.', 'The marginalia was added.'],
  'mg.text':            ['نصّ الهامش', 'The marginalia'],
  'mg.kind':            ['نوع الهامش', 'Kind'],
  'mg.onBook':          ['على كتاب', 'On the book'],
  'mg.empty':           ['لا هوامش بعد', 'No marginalia yet'],
  'mg.emptyD':          ['اكتب أول خاطرة، أو دوّنها من صفحة أي كتاب.', 'Write your first note, or record one from any book’s page.'],
  'mg.count':           ['هامش محفوظ', 'notes preserved'],
  'mg.more':            ['اعرض المزيد', 'Show more'],

  /* ── exchange ── */
  'ex.lede':            ['امنح كتابًا حياةً ثانية. اعرض كتبك، واطلب كتب غيرك، وتبادلوها يدًا بيد.',
                         'Give a book a second life. List your books, request others’, and exchange them hand to hand.'],
  'ex.motto':           ['امنح كتابًا حياةً ثانية', 'Give a book a second life'],
  'ex.discover':        ['استكشف المعروض', 'Discover'],
  'ex.mine':            ['كتبي المعروضة', 'My Listings'],
  'ex.requests':        ['طلبات التبادل', 'Exchange Requests'],
  'ex.saved':           ['المحفوظة', 'Saved'],
  'ex.offer':           ['اعرض كتابًا', 'Offer a Book'],
  'ex.request':         ['اطلب التبادل', 'Request Exchange'],
  'ex.requested':       ['طُلب بالفعل', 'Already requested'],
  'ex.save':            ['احفظ', 'Save'],
  'ex.unsave':          ['أزل الحفظ', 'Unsave'],
  'ex.accept':          ['قبول', 'Accept'],
  'ex.decline':         ['رفض', 'Decline'],
  'ex.complete':        ['تم التبادل', 'Mark Completed'],
  'ex.wants':           ['يبحث عن', 'Interested in receiving'],
  'ex.owner':           ['المُعير', 'Offered by'],
  'ex.you':             ['أنت', 'You'],
  'ex.st.available':    ['متاح', 'Available'],
  'ex.st.pending':      ['قيد التبادل', 'Exchange pending'],
  'ex.st.completed':    ['تمّ التبادل', 'Exchanged'],
  'ex.cond.new':        ['كالجديد', 'Like new'],
  'ex.cond.good':       ['جيدة', 'Good'],
  'ex.cond.worn':       ['قُرئ كثيرًا', 'Well read'],
  'ex.reqIn':           ['طلب واردٌ إليك', 'Request received'],
  'ex.reqOut':          ['طلب أرسلته', 'Request sent'],
  'ex.reqSent':         ['أُرسل طلب التبادل.', 'The exchange request was sent.'],
  'ex.reqAccepted':     ['قُبل الطلب — تواصلوا لتحديد موعد التسليم.', 'Request accepted — arrange the handover between you.'],
  'ex.reqDeclined':     ['رُفض الطلب.', 'The request was declined.'],
  'ex.reqDone':         ['تمّ التبادل. للكتاب حياة ثانية.', 'Exchange completed. The book has a second life.'],
  'ex.listed':          ['أُضيف الكتاب إلى المعروض.', 'Your book was listed for exchange.'],
  'ex.savedOk':         ['حُفظ في قائمتك.', 'Saved to your list.'],
  'ex.emptyReq':        ['لا طلبات حاليًا', 'No requests right now'],
  'ex.emptyReqD':       ['عندما تطلب كتابًا أو يطلب أحدهم كتابك سيظهر الطلب هنا.',
                         'When you request a book, or someone requests yours, it appears here.'],
  'ex.emptyMine':       ['لم تعرض كتابًا بعد', 'You have not listed a book yet'],
  'ex.emptyMineD':      ['اعرض كتابًا قرأته وتودّ أن يقرأه غيرك.', 'Offer a book you have read and would like someone else to read.'],
  'ex.emptySaved':      ['لا كتب محفوظة', 'Nothing saved yet'],
  'ex.emptySavedD':     ['احفظ ما يعجبك من المعروض لتعود إليه لاحقًا.', 'Save what interests you and come back to it later.'],
  'ex.desc':            ['وصف', 'Description'],

  /* ── community ── */
  'cm.lede':            ['قرّاء مِداد: ما يقرأونه، وما يوصون به. لا أكثر — المكتبة هنا هي الحديث.',
                         'The readers of MIDĀD: what they read and what they recommend. Nothing more — here the books do the talking.'],
  'cm.recommends':      ['يوصي بـ', 'Recommends'],
  'cm.favGenre':        ['التصنيف المفضّل', 'Favourite genre'],
  'cm.since':           ['قارئ منذ', 'Reading since'],
  'cm.finished':        ['كتاب', 'books'],
  'cm.avg':             ['متوسط', 'average'],
  'cm.exchanges':       ['تبادل', 'exchanges'],
  'cm.notInLib':        ['ليس في مكتبتك بعد', 'Not in your library yet'],

  /* ── library card ── */
  'lc.lede':            ['بطاقة عضويتك في مِداد، بورقها القديم وتفاصيلها المحفورة.',
                         'Your MIDĀD membership card, in aged paper with engraved detail.'],
  'lc.member':          ['رقم العضوية', 'Member No.'],
  'lc.since':           ['قارئ منذ', 'Reading since'],
  'lc.favGenre':        ['التصنيف المفضّل', 'Favourite genre'],
  'lc.finished':        ['كتاب منتهٍ', 'Books finished'],
  'lc.avg':             ['متوسط التقييم', 'Average rating'],
  'lc.pages':           ['صفحة', 'Pages read'],
  'lc.stamp':           ['قارئٌ دائمًا', 'A reader, always'],
  'lc.milestones':      ['محطات الرحلة', 'Reading Milestones'],
  'lc.ach':             ['أوسمة القراءة', 'Reading Achievements'],
  'lc.achLede':         ['أختامٌ صغيرة على هامش الرحلة.', 'Small seals in the margin of the journey.'],
  'lc.earned':          ['حُصِّل', 'Earned'],
  'lc.locked':          ['يتبقى', 'to go'],
  'lc.name':            ['اسم القارئ', 'Reader name'],
  'lc.editName':        ['تعديل الاسم', 'Edit name'],
  'lc.nameSaved':       ['حُدِّث اسم القارئ.', 'Reader name updated.'],
  'lc.m1':              ['أول كتاب في الأرشيف', 'First book in the archive'],
  'lc.m2':              ['أول عشرة كتب', 'First ten books'],
  'lc.m3':              ['أول ألف صفحة', 'First thousand pages'],
  'lc.m4':              ['أول تبادل مكتمل', 'First completed exchange'],

  /* ── achievements ── */
  'ac.first':           ['أول كتاب', 'First Book'],
  'ac.firstD':          ['أنهيت كتابك الأول', 'You finished your first book'],
  'ac.avid':            ['قارئ نهم', 'Avid Reader'],
  'ac.avidD':           ['عشرة كتب منتهية', 'Ten books finished'],
  'ac.hundred':         ['مئة صفحة', '100 Pages'],
  'ac.hundredD':        ['أول مئة صفحة', 'Your first hundred pages'],
  'ac.month':           ['كتاب الشهر', 'Book of the Month'],
  'ac.monthD':          ['كتاب واحد على الأقل هذا الشهر', 'At least one book this month'],
  'ac.lover':           ['عاشق الأدب', 'Literature Lover'],
  'ac.loverD':          ['خمسة كتب أدبية', 'Five works of literature'],
  'ac.margin':          ['صاحب الهوامش', 'Keeper of Margins'],
  'ac.marginD':         ['عشرون هامشًا محفوظًا', 'Twenty notes preserved'],
  'ac.second':          ['حياة ثانية', 'Second Life'],
  'ac.secondD':         ['أتممت تبادل كتاب', 'You completed a book exchange'],
  'ac.wide':            ['قارئ واسع', 'Wide Reader'],
  'ac.wideD':           ['خمسة تصنيفات مختلفة', 'Five different genres'],

  /* ── recommendations ── */
  'rc.title':           ['اقتراحات لك', 'Recommended for You'],
  'rc.lede':            ['اقتراحات مبنية على ما أنهيته، وتقييماتك، وتصنيفاتك المفضّلة.',
                         'Suggestions built from what you finished, how you rated it, and the genres you return to.'],
  'rc.becauseGenre':    ['لأنك تقرأ %s كثيرًا', 'Because you read a lot of %s'],
  'rc.becauseAuthor':   ['لأنك أعطيت %s تقييمًا عاليًا', 'Because you rated %s highly'],
  'rc.becauseWide':     ['توسيعًا لما قرأته', 'To widen what you have read'],

  /* ── forms ── */
  'fm.addTitle':        ['إضافة كتاب إلى الأرشيف', 'Add a book to the archive'],
  'fm.editTitle':       ['تعديل السجل', 'Edit the record'],
  'fm.titleAr':         ['العنوان بالعربية', 'Title in Arabic'],
  'fm.titleEn':         ['العنوان بالإنجليزية', 'Title in English'],
  'fm.authorAr':        ['المؤلف بالعربية', 'Author in Arabic'],
  'fm.authorEn':        ['المؤلف بالإنجليزية', 'Author in English'],
  'fm.review':          ['قراءتك للكتاب', 'Your review'],
  'fm.stayed':          ['ما بقي معك منه', 'What stayed with you'],
  'fm.quote':           ['اقتباس مختار', 'A favourite quote'],
  'fm.required':        ['العنوان والمؤلف مطلوبان.', 'A title and an author are required.'],
  'fm.offerTitle':      ['اعرض كتابًا للتبادل', 'Offer a book for exchange'],
  'fm.wants':           ['ما تودّ استلامه مقابله', 'What you would like in return'],
  'fm.area':            ['المنطقة أو المدينة', 'Area or city'],
  'fm.bilingualHint':   ['اكتب الحقلين إن استطعت — تُعرض المكتبة بلغتين.',
                         'Fill both fields when you can — the library is shown in two languages.'],

  /* ── genres ── */
  'g.novel':            ['رواية', 'Novel'],
  'g.poetry':           ['شعر', 'Poetry'],
  'g.philosophy':       ['فلسفة', 'Philosophy'],
  'g.history':          ['تاريخ', 'History'],
  'g.memoir':           ['سيرة ومذكرات', 'Memoir'],
  'g.heritage':         ['تراث', 'Classical Heritage'],
  'g.world':            ['أدب عالمي', 'World Literature'],
  'g.thought':          ['فكر', 'Thought & Essays'],
  'g.psychology':       ['علم نفس', 'Psychology'],
  'g.science':          ['علوم', 'Science'],
};

const MONTHS = [
  ['يناير', 'January'], ['فبراير', 'February'], ['مارس', 'March'], ['أبريل', 'April'],
  ['مايو', 'May'], ['يونيو', 'June'], ['يوليو', 'July'], ['أغسطس', 'August'],
  ['سبتمبر', 'September'], ['أكتوبر', 'October'], ['نوفمبر', 'November'], ['ديسمبر', 'December'],
];
const MONTHS_SHORT = [
  ['ينا', 'Jan'], ['فبر', 'Feb'], ['مار', 'Mar'], ['أبر', 'Apr'], ['ماي', 'May'], ['يون', 'Jun'],
  ['يول', 'Jul'], ['أغس', 'Aug'], ['سبت', 'Sep'], ['أكت', 'Oct'], ['نوف', 'Nov'], ['ديس', 'Dec'],
];

let lang = 'ar';

export const getLang = () => lang;
export const setLang = (l) => { lang = LANGS.includes(l) ? l : 'ar'; };
export const isAr = () => lang === 'ar';
const idx = () => (lang === 'ar' ? 0 : 1);

/** t('nav.home') → the string in the active language. */
export function t(key, ...subs) {
  const row = DICT[key];
  if (!row) return key;
  let s = row[idx()] ?? row[0];
  for (const sub of subs) s = s.replace('%s', sub);
  return s;
}

/** Both halves of a key, for the bilingual label pair. */
export const pair = (key) => ({ ar: DICT[key]?.[0] ?? key, en: DICT[key]?.[1] ?? key });

/** Pick the active side of a `{ar, en}` content object, never leaving a blank. */
export function pick(obj) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return (isAr() ? obj.ar || obj.en : obj.en || obj.ar) || '';
}
/** The *other* language's side — used for the quiet second line. */
export function other(obj) {
  if (obj == null || typeof obj === 'string') return '';
  const v = isAr() ? obj.en : obj.ar;
  return v && v !== pick(obj) ? v : '';
}

export const monthName = (m) => MONTHS[m][idx()];
export const monthShort = (m) => MONTHS_SHORT[m][idx()];

/** Western digits in both languages: they stay legible inside charts. */
export const n = (v) => Number(v ?? 0).toLocaleString('en-US');
export const dec = (v, p = 1) => Number(v ?? 0).toFixed(p);

/** 12 أكتوبر 2024 / 12 October 2024 */
export function dateLong(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.getDate()} ${monthName(d.getMonth())} ${d.getFullYear()}`;
}
export function dateShort(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${monthShort(d.getMonth())} ${d.getFullYear()}`;
}

/** Applies the language to the document: lang, dir, and every [data-i18n]. */
export function applyLang() {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = isAr() ? 'rtl' : 'ltr';
  document.title = isAr() ? 'مِداد | MIDĀD' : 'MIDĀD | مِداد';
  for (const el of document.querySelectorAll('[data-i18n]')) {
    const key = el.dataset.i18n;
    if (key.endsWith('.ar')) el.textContent = DICT[key.slice(0, -3)]?.[0] ?? el.textContent;
    else if (key.endsWith('.en')) el.textContent = DICT[key.slice(0, -3)]?.[1] ?? el.textContent;
    else el.textContent = t(key);
  }
  for (const el of document.querySelectorAll('[data-i18n-aria]')) {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  }
}
