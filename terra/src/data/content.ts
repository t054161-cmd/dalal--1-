/**
 * ============================================================================
 * TERRA — EDITORIAL DATA
 * ============================================================================
 * Reviews, FAQ, community gallery, impact figures, bulk pricing tiers,
 * delivery regions and the demo order used by the tracking page.
 * All bilingual; all safe for a non-developer to edit.
 * ============================================================================
 */

import type { Bilingual } from '@/types/design'

/* -------------------------------------------------------------------------- */
/* REVIEWS                                                                    */
/* -------------------------------------------------------------------------- */

export type Review = {
  id: string
  author: Bilingual
  rating: 1 | 2 | 3 | 4 | 5
  months: number
  body: Bilingual
  /** Placeholder photo. Filename describes exactly what should replace it. */
  photo: string
  photoAltVars: { color: Bilingual; context: Bilingual }
  designId?: string
}

export const reviews: Review[] = [
  {
    id: 'r1',
    author: { en: 'Noura A.', ar: 'نورة ع.' },
    rating: 5,
    months: 8,
    body: {
      en: 'I filled it with karak at 7am on the way to work and it was still too hot to drink at 11. Eight months in, the engraving has not faded at all.',
      ar: 'ملأته كرك الساعة ٧ صباحاً في طريقي للعمل، وفي الحادية عشرة كان ما زال ساخناً جداً على الشرب. بعد ثمانية أشهر، لم يبهت النقش أبداً.',
    },
    photo: '/images/reviews/review-clay-500ml-on-office-desk.svg',
    photoAltVars: {
      color: { en: 'clay', ar: 'طيني' },
      context: { en: 'on an office desk beside a laptop', ar: 'على مكتب بجانب حاسوب محمول' },
    },
    designId: 'sd-morning',
  },
  {
    id: 'r2',
    author: { en: 'Yousef M.', ar: 'يوسف م.' },
    rating: 5,
    months: 6,
    body: {
      en: 'Bought the 700 ml for the gym. Ice from the night before is still ice the next afternoon. The chain means it hangs off my bag instead of rolling around in it.',
      ar: 'اشتريت ٧٠٠ مل للنادي. ثلج الليلة الماضية يبقى ثلجاً في عصر اليوم التالي. والسلسلة تجعله يتعلّق بحقيبتي بدلاً من التقلّب داخلها.',
    },
    photo: '/images/reviews/review-ash-700ml-gym-bag-with-chain.svg',
    photoAltVars: {
      color: { en: 'volcanic ash', ar: 'رمادي بركاني' },
      context: { en: 'hanging from a gym bag by its carry chain', ar: 'معلّق بحقيبة نادٍ بسلسلة الحمل' },
    },
    designId: 'sd-gym',
  },
  {
    id: 'r3',
    author: { en: 'Dana K.', ar: 'دانة ك.' },
    rating: 5,
    months: 4,
    body: {
      en: 'I ordered 40 of these for our team with the company logo. Nobody has lost theirs, which has never happened with any gift we have given.',
      ar: 'طلبت ٤٠ كوباً لفريقنا مع شعار الشركة. لم يفقد أحد كوبه، وهذا لم يحدث مع أي هدية قدّمناها قبلاً.',
    },
    photo: '/images/reviews/review-sage-500ml-team-order-logo.svg',
    photoAltVars: {
      color: { en: 'sage', ar: 'مريمية' },
      context: { en: 'forty mugs lined up on a meeting-room table', ar: 'أربعون كوباً مصطفّة على طاولة اجتماعات' },
    },
    designId: 'sd-desk',
  },
  {
    id: 'r4',
    author: { en: 'Abdullah S.', ar: 'عبدالله س.' },
    rating: 4,
    months: 11,
    body: {
      en: 'The mug is faultless. I dropped mine on tiles and it dented — my fault, and they replaced the lid free anyway. I would like more Arabic fonts.',
      ar: 'الكوب بلا عيب. أوقعته على البلاط فانطبع فيه أثر — وهذا خطأي، ومع ذلك بدّلوا الغطاء مجاناً. أتمنى خطوطاً عربية أكثر.',
    },
    photo: '/images/reviews/review-sand-350ml-arabic-engraving-closeup.svg',
    photoAltVars: {
      color: { en: 'sand', ar: 'رملي' },
      context: { en: 'close-up of Arabic engraving on the body', ar: 'صورة قريبة للنقش العربي على الجسم' },
    },
    designId: 'sd-sabah',
  },
  {
    id: 'r5',
    author: { en: 'Fatima H.', ar: 'فاطمة ح.' },
    rating: 5,
    months: 3,
    body: {
      en: 'The packaging is genuinely plastic-free — I looked for the hidden bag and there was not one. The wrapper grew basil on my balcony.',
      ar: 'التغليف خالٍ من البلاستيك فعلاً — بحثت عن الكيس المخفي فلم أجده. والغلاف أنبت ريحاناً في شرفتي.',
    },
    photo: '/images/reviews/review-cream-350ml-unboxing-pulp-cradle.svg',
    photoAltVars: {
      color: { en: 'cream', ar: 'كريمي' },
      context: { en: 'unboxed on a moulded pulp cradle', ar: 'مفتوح على حاضنة من لبّ الورق' },
    },
    designId: 'sd-saltflat',
  },
  {
    id: 'r6',
    author: { en: 'Mishari T.', ar: 'مشاري ت.' },
    rating: 5,
    months: 7,
    body: {
      en: 'I used the AI agent and typed one sentence in Arabic. It picked the colours and the kufic font better than I would have.',
      ar: 'استخدمت الوكيل الذكي وكتبت جملة واحدة بالعربية. اختار الألوان والخط الكوفي أفضل مما كنت سأختار.',
    },
    photo: '/images/reviews/review-indigo-500ml-kufic-brass-text.svg',
    photoAltVars: {
      color: { en: 'desert indigo', ar: 'نيلي صحراوي' },
      context: { en: 'held in one hand outdoors at sunset', ar: 'ممسوك بيد واحدة في الخارج عند الغروب' },
    },
    designId: 'sd-ramadan',
  },
]

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

export type FaqCategory = 'product' | 'customization' | 'orders' | 'care'

export type FaqItem = {
  id: string
  category: FaqCategory
  question: Bilingual
  answer: Bilingual
  /** Shown in the short homepage accordion. */
  featured?: boolean
}

export const faqs: FaqItem[] = [
  {
    id: 'f1',
    category: 'product',
    featured: true,
    question: { en: 'Does it really hold heat for 12 hours?', ar: 'هل يحفظ الحرارة ١٢ ساعة فعلاً؟' },
    answer: {
      en: 'Yes, with the lid on and filled to about a centimetre below the rim. Our workshop test: boiling water at 96°C reads 61°C after 12 hours in a 22°C room. Cold is easier — iced water is still under 8°C after 24 hours.',
      ar: 'نعم، بالغطاء ومملوءاً حتى نحو سنتيمتر تحت الحافة. اختبارنا في الورشة: ماء بحرارة ٩٦° يصل إلى ٦١° بعد ١٢ ساعة في غرفة بـ٢٢°. والبرودة أسهل — الماء المثلّج يبقى تحت ٨° بعد ٢٤ ساعة.',
    },
  },
  {
    id: 'f2',
    category: 'product',
    featured: true,
    question: { en: 'Is it dishwasher safe?', ar: 'هل يتحمّل غسّالة الأطباق؟' },
    answer: {
      en: 'The body and the steel lid are. The bamboo lid should be rinsed by hand — a dishwasher cycle will dry the wood out and shorten its life. Engraving and powder coating both survive the dishwasher.',
      ar: 'الجسم والغطاء الفولاذي نعم. أمّا غطاء الخيزران فاغسله باليد — دورة الغسّالة تجفّف الخشب وتقصّر عمره. والنقش والطلاء يصمدان في الغسّالة.',
    },
  },
  {
    id: 'f3',
    category: 'product',
    question: { en: 'Which size fits a car cup holder?', ar: 'أي حجم يناسب حاضن أكواب السيارة؟' },
    answer: {
      en: 'The 350 ml fits every holder we have tested, including older cars. The 500 ml fits most. The 700 ml fits wide holders only — order it without the handle if the holder is tight.',
      ar: 'حجم ٣٥٠ مل يناسب كل حاضن جرّبناه، حتى في السيارات القديمة. و٥٠٠ مل يناسب معظمها. أمّا ٧٠٠ مل فيناسب الحواضن الواسعة فقط — اطلبه بدون مقبض إن كان الحاضن ضيّقاً.',
    },
  },
  {
    id: 'f4',
    category: 'customization',
    featured: true,
    question: { en: 'Will Arabic text be shaped correctly?', ar: 'هل يُكتب النص العربي بشكل صحيح؟' },
    answer: {
      en: 'Yes. Letters join properly and read right-to-left, in the designer preview and on the finished mug. Our four Arabic faces are Plex Arabic, Tajawal, Amiri and Reem Kufi. Mixed Arabic and Latin in one line is fine too.',
      ar: 'نعم. الحروف تتّصل بشكل صحيح وتُقرأ من اليمين إلى اليسار، في المعاينة وعلى الكوب النهائي. خطوطنا العربية الأربعة: بلكس عربي، وتجوّل، وأميري، وريم كوفي. ويمكن خلط العربية واللاتينية في سطر واحد.',
    },
  },
  {
    id: 'f5',
    category: 'customization',
    question: { en: 'Why only 20 characters?', ar: 'لماذا ٢٠ حرفاً فقط؟' },
    answer: {
      en: 'Because the body is curved. Past twenty characters the letters get small enough that the engraving loses its edges and reads badly from the side. For longer text, use the wrap-around placement or ask us about a two-line layout.',
      ar: 'لأن الجسم منحنٍ. بعد عشرين حرفاً تصغر الحروف حتى يفقد النقش حدوده ويصعب قراءته من الجانب. للنص الأطول، استخدم الموضع الملفوف أو اسألنا عن تنسيق بسطرين.',
    },
  },
  {
    id: 'f6',
    category: 'customization',
    question: { en: 'What does the AI design agent actually do?', ar: 'ماذا يفعل وكيل التصميم الذكي؟' },
    answer: {
      en: 'You describe the mug in a sentence and it sets the size, colours, font, text and placement for you. It only fills in the designer — it never orders anything, and you can change every choice afterwards.',
      ar: 'تصف الكوب في جملة، فيضبط لك الحجم والألوان والخط والنص والموضع. وهو يعبّئ المصمّم فقط — لا يطلب شيئاً، ويمكنك تغيير كل خيار بعده.',
    },
  },
  {
    id: 'f7',
    category: 'orders',
    featured: true,
    question: { en: 'How long does a custom mug take?', ar: 'كم يستغرق الكوب المخصّص؟' },
    answer: {
      en: 'Two to four working days in the workshop, then delivery: same or next day inside Kuwait, 3–5 days to the GCC. Bulk orders over 100 pieces take 10–14 days.',
      ar: 'من يومين إلى أربعة أيام عمل في الورشة، ثم التوصيل: في اليوم نفسه أو التالي داخل الكويت، و٣–٥ أيام لدول الخليج. والطلبات فوق ١٠٠ قطعة تستغرق ١٠–١٤ يوماً.',
    },
  },
  {
    id: 'f8',
    category: 'orders',
    question: { en: 'Do I need an account to order?', ar: 'هل أحتاج حساباً للطلب؟' },
    answer: {
      en: 'No. Checkout is one screen and works as a guest. Joining the Soil Club is optional — it only exists so your points have somewhere to live.',
      ar: 'لا. الدفع في شاشة واحدة ويعمل كزائر. والانضمام إلى نادي التراب اختياري — وجوده فقط ليكون لنقاطك مكان.',
    },
  },
  {
    id: 'f9',
    category: 'orders',
    question: { en: 'How do the points work?', ar: 'كيف تعمل النقاط؟' },
    answer: {
      en: 'Ten points for every dinar you spend, plus points for voting on designs, sending an old cup back and reviewing with a photo. Points move you through four tiers, and each tier is a standing discount that does not expire.',
      ar: 'عشر نقاط لكل دينار تصرفه، ونقاط إضافية على التصويت للتصاميم وإعادة كوب قديم والتقييم بصورة. والنقاط تنقلك بين أربعة مستويات، وكل مستوى خصم دائم لا ينتهي.',
    },
  },
  {
    id: 'f10',
    category: 'care',
    featured: true,
    question: { en: 'What does the lifetime warranty cover?', ar: 'ماذا يشمل ضمان مدى الحياة؟' },
    answer: {
      en: 'Insulation failure, a seal that leaks, a coating that peels under normal use, and handles. It does not cover dents from drops or a mug left in a car in August with milk in it.',
      ar: 'تعطّل العزل، وتسريب الحلقة، وتقشّر الطلاء في الاستخدام العادي، والمقابض. ولا يشمل الانطباعات من السقوط، ولا كوباً تُرك في سيارة في أغسطس وفيه حليب.',
    },
  },
  {
    id: 'f11',
    category: 'care',
    question: { en: 'Can I buy a replacement lid or seal?', ar: 'هل يمكن شراء غطاء أو حلقة بديلة؟' },
    answer: {
      en: 'Yes, and you can also put them on a refill plan so they arrive every 3, 6 or 12 months in a paper envelope. Cancel from any email.',
      ar: 'نعم، ويمكنك أيضاً إدراجها في خطة تبديل لتصلك كل ٣ أو ٦ أو ١٢ شهراً في مغلّف ورقي. والإلغاء من أي رسالة.',
    },
  },
  {
    id: 'f12',
    category: 'care',
    question: { en: 'What happens to a cup I send back?', ar: 'ماذا يحدث للكوب الذي أعيده؟' },
    answer: {
      en: 'Steel goes to a licensed recycler in Shuwaikh and returns as new stock. Bamboo is composted at the workshop. You get 15% off your next mug and 250 points.',
      ar: 'الفولاذ يذهب إلى معيد تدوير مرخّص في الشويخ ويعود مادة جديدة. والخيزران يُحوَّل إلى كومبوست في الورشة. وتحصل أنت على خصم ١٥٪ من كوبك القادم و٢٥٠ نقطة.',
    },
  },
]

/* -------------------------------------------------------------------------- */
/* COMMUNITY GALLERY                                                          */
/* -------------------------------------------------------------------------- */

export type GalleryEntry = {
  id: string
  author: Bilingual
  votes: number
  submittedAt: string
  designOfMonth?: boolean
  design: {
    bodyColorId: string
    lidColorId: string
    text: string
    fontId: string
    textColorId: string
    placement: 'center' | 'lower' | 'wrap'
    sizeId: '350' | '500' | '700'
  }
  caption: Bilingual
}

export const galleryEntries: GalleryEntry[] = [
  {
    id: 'g1',
    author: { en: 'Layla', ar: 'ليلى' },
    votes: 412,
    submittedAt: '2026-08-04',
    designOfMonth: true,
    design: { bodyColorId: 'sand', lidColorId: 'bamboo', text: 'يا صباح', fontId: 'reem-kufi', textColorId: 'clay', placement: 'center', sizeId: '350' },
    caption: { en: 'For my mother, who says it every morning.', ar: 'لأمي، التي تقولها كل صباح.' },
  },
  {
    id: 'g2',
    author: { en: 'Hamad', ar: 'حمد' },
    votes: 388,
    submittedAt: '2026-08-19',
    design: { bodyColorId: 'moss', lidColorId: 'dark-bamboo', text: 'field notes', fontId: 'space-mono', textColorId: 'sand', placement: 'wrap', sizeId: '700' },
    caption: { en: 'Survey work in Wafra. It goes everywhere with me.', ar: 'أعمال مساحة في الوفرة. يذهب معي في كل مكان.' },
  },
  {
    id: 'g3',
    author: { en: 'Sara', ar: 'سارة' },
    votes: 341,
    submittedAt: '2026-08-22',
    design: { bodyColorId: 'cream', lidColorId: 'steel', text: 'one page', fontId: 'caveat', textColorId: 'sage', placement: 'lower', sizeId: '500' },
    caption: { en: 'Thesis fuel. Twelve hours is exactly one writing day.', ar: 'وقود الرسالة. اثنتا عشرة ساعة تساوي يوم كتابة واحداً.' },
  },
  {
    id: 'g4',
    author: { en: 'Omar', ar: 'عمر' },
    votes: 297,
    submittedAt: '2026-07-30',
    design: { bodyColorId: 'indigo', lidColorId: 'bamboo', text: 'البحر', fontId: 'amiri', textColorId: 'sand', placement: 'center', sizeId: '700' },
    caption: { en: 'Fishing at 4am. The tea stays hot until sunrise.', ar: 'صيد الرابعة فجراً. الشاي يبقى ساخناً حتى الشروق.' },
  },
  {
    id: 'g5',
    author: { en: 'Mariam', ar: 'مريم' },
    votes: 265,
    submittedAt: '2026-08-28',
    design: { bodyColorId: 'clay', lidColorId: 'cream', text: 'خلّها تبرد', fontId: 'tajawal', textColorId: 'cream', placement: 'center', sizeId: '500' },
    caption: { en: 'A joke my sister will understand.', ar: 'مزحة ستفهمها أختي.' },
  },
  {
    id: 'g6',
    author: { en: 'Faisal', ar: 'فيصل' },
    votes: 221,
    submittedAt: '2026-09-01',
    design: { bodyColorId: 'ash', lidColorId: 'steel', text: 'no small talk', fontId: 'manrope', textColorId: 'gold', placement: 'lower', sizeId: '500' },
    caption: { en: 'It has saved me at least four conversations.', ar: 'أنقذني من أربع محادثات على الأقل.' },
  },
  {
    id: 'g7',
    author: { en: 'Aisha', ar: 'عائشة' },
    votes: 198,
    submittedAt: '2026-09-03',
    design: { bodyColorId: 'saffron', lidColorId: 'dark-bamboo', text: 'هال وزعفران', fontId: 'plex-arabic', textColorId: 'bark', placement: 'wrap', sizeId: '350' },
    caption: { en: 'Two smells, wrapped all the way round.', ar: 'رائحتان، ملفوفتان حول الكوب كلّه.' },
  },
  {
    id: 'g8',
    author: { en: 'Bader', ar: 'بدر' },
    votes: 176,
    submittedAt: '2026-09-05',
    design: { bodyColorId: 'steel', lidColorId: 'bamboo', text: '1 of 1', fontId: 'space-mono', textColorId: 'bark', placement: 'center', sizeId: '500' },
    caption: { en: 'Bare steel. Nothing to go wrong.', ar: 'فولاذ عارٍ. لا شيء يتعطّل.' },
  },
]

/* -------------------------------------------------------------------------- */
/* IMPACT                                                                     */
/* -------------------------------------------------------------------------- */

/** Starting value for the animated homepage counter. */
export const IMPACT_BASE_CUPS = 1_284_600
/** Cups "replaced" per second, used only for the live ticker. */
export const IMPACT_CUPS_PER_SECOND = 0.42

export const materialsBreakdown: {
  material: Bilingual
  share: number
  note: Bilingual
  recycled: boolean
}[] = [
  {
    material: { en: '18/8 recycled stainless steel', ar: 'فولاذ ١٨/٨ معاد تدويره' },
    share: 82,
    note: { en: 'From post-consumer scrap. Infinitely recyclable.', ar: 'من خردة استهلاكية. قابل لإعادة التدوير بلا حدود.' },
    recycled: true,
  },
  {
    material: { en: 'Bamboo lid', ar: 'غطاء خيزران' },
    share: 9,
    note: { en: 'FSC-certified, grown in 4 years, compostable.', ar: 'معتمد FSC، ينمو في ٤ سنوات، قابل للتحلّل.' },
    recycled: false,
  },
  {
    material: { en: 'Mineral powder coating', ar: 'طلاء مسحوق معدني' },
    share: 5,
    note: { en: 'Solvent-free, cured at 200°C. BPA-free.', ar: 'بلا مذيبات، يُعالج بـ٢٠٠°. خالٍ من BPA.' },
    recycled: false,
  },
  {
    material: { en: 'Plant-based seal ring', ar: 'حلقة إحكام نباتية' },
    share: 3,
    note: { en: 'Silicone-free. The one part we still import.', ar: 'بلا سيليكون. الجزء الوحيد الذي ما زلنا نستورده.' },
    recycled: false,
  },
  {
    material: { en: 'Pulp packaging', ar: 'تغليف من لبّ الورق' },
    share: 1,
    note: { en: 'Moulded recycled paper. Compost it.', ar: 'ورق معاد تدويره مصبوب. حوّله إلى كومبوست.' },
    recycled: true,
  },
]

export const lifecycleStages: { title: Bilingual; body: Bilingual }[] = [
  {
    title: { en: 'Scrap steel', ar: 'خردة فولاذ' },
    body: { en: 'Cutlery, sinks, offcuts — melted and re-rolled into sheet.', ar: 'ملاعق ومغاسل وبقايا — تُصهر وتُدرَج ألواحاً.' },
  },
  {
    title: { en: 'Made in the workshop', ar: 'يُصنع في الورشة' },
    body: { en: 'Two walls, one vacuum, your colour, your words.', ar: 'جدارَان، وفراغ واحد، ولونك، وكلماتك.' },
  },
  {
    title: { en: 'Years of use', ar: 'سنوات من الاستخدام' },
    body: { en: 'Around 730 disposable cups avoided every year it is used.', ar: 'نحو ٧٣٠ كوباً ورقياً يُوفَّر كل سنة استخدام.' },
  },
  {
    title: { en: 'Repaired, not replaced', ar: 'يُصلَح لا يُستبدل' },
    body: { en: 'New lid, new seal, same mug. Sent in a paper envelope.', ar: 'غطاء جديد وحلقة جديدة والكوب نفسه. في مغلّف ورقي.' },
  },
  {
    title: { en: 'Back to steel', ar: 'يعود فولاذاً' },
    body: { en: 'Send it back one day and it becomes stock for the next one.', ar: 'أعِده يوماً فيصبح مادة للكوب القادم.' },
  },
]

export const impactNumbers: { value: string; label: Bilingual; note: Bilingual }[] = [
  {
    value: '730',
    label: { en: 'cups replaced per mug, per year', ar: 'كوب يوفّره كل مج في السنة' },
    note: { en: 'At two fills a day, every day.', ar: 'بتعبئتين يومياً، كل يوم.' },
  },
  {
    value: '1.46 kg',
    label: { en: 'CO₂e avoided per mug, per year', ar: 'كغم CO₂e يُوفَّر لكل مج سنوياً' },
    note: { en: '730 cups × 2 g per cup body. Conservative.', ar: '٧٣٠ كوباً × ٢ غرام لجسم الكوب. تقدير محافظ.' },
  },
  {
    value: '175 L',
    label: { en: 'water not used per mug, per year', ar: 'لتر ماء لا يُستهلك سنوياً' },
    note: { en: '0.24 L of process water per paper cup.', ar: '٠٫٢٤ لتر ماء تصنيع لكل كوب ورقي.' },
  },
  {
    value: '82%',
    label: { en: 'of each mug is recycled steel', ar: 'من كل مج فولاذ معاد تدويره' },
    note: { en: 'By weight, verified by our supplier.', ar: 'بالوزن، موثّق من مورّدنا.' },
  },
  {
    value: '0',
    label: { en: 'grams of plastic in the packaging', ar: 'غرام بلاستيك في التغليف' },
    note: { en: 'Not even the tape.', ar: 'ولا حتى الشريط اللاصق.' },
  },
  {
    value: '13 min',
    label: { en: 'average life of a disposable cup', ar: 'دقيقة: عمر الكوب الورقي' },
    note: { en: 'The number that started all of this.', ar: 'الرقم الذي بدأ كل هذا.' },
  },
]

/* -------------------------------------------------------------------------- */
/* BULK PRICING                                                               */
/* -------------------------------------------------------------------------- */

export const bulkTiers: { min: number; max?: number; unit: number; savePercent: number; lead: Bilingual }[] = [
  { min: 25, max: 49, unit: 9.75, savePercent: 7, lead: { en: '5–7 days', ar: '٥–٧ أيام' } },
  { min: 50, max: 99, unit: 9.1, savePercent: 13, lead: { en: '7–10 days', ar: '٧–١٠ أيام' } },
  { min: 100, max: 249, unit: 8.4, savePercent: 20, lead: { en: '10–14 days', ar: '١٠–١٤ يوماً' } },
  { min: 250, max: 499, unit: 7.75, savePercent: 26, lead: { en: '14–18 days', ar: '١٤–١٨ يوماً' } },
  { min: 500, unit: 7.1, savePercent: 32, lead: { en: '3–4 weeks', ar: '٣–٤ أسابيع' } },
]

/* -------------------------------------------------------------------------- */
/* DELIVERY REGIONS                                                           */
/* -------------------------------------------------------------------------- */

export const regions: { id: string; name: Bilingual; days: Bilingual; cost: Bilingual }[] = [
  { id: 'kw', name: { en: 'Kuwait', ar: 'الكويت' }, days: { en: 'Same or next day', ar: 'اليوم نفسه أو التالي' }, cost: { en: '1.500 KWD · free over 20', ar: '١٫٥٠٠ د.ك · مجاني فوق ٢٠' } },
  { id: 'gcc', name: { en: 'GCC', ar: 'دول الخليج' }, days: { en: '3–5 working days', ar: '٣–٥ أيام عمل' }, cost: { en: '4.500 KWD', ar: '٤٫٥٠٠ د.ك' } },
  { id: 'mena', name: { en: 'Wider Middle East', ar: 'الشرق الأوسط' }, days: { en: '5–8 working days', ar: '٥–٨ أيام عمل' }, cost: { en: '7.000 KWD', ar: '٧٫٠٠٠ د.ك' } },
  { id: 'intl', name: { en: 'Rest of world', ar: 'بقية العالم' }, days: { en: '8–14 working days', ar: '٨–١٤ يوم عمل' }, cost: { en: '11.000 KWD', ar: '١١٫٠٠٠ د.ك' } },
]

/* -------------------------------------------------------------------------- */
/* DEMO ORDER (tracking page)                                                 */
/* -------------------------------------------------------------------------- */

export const demoOrder = {
  number: 'TR-100238',
  placedAt: '2026-09-06',
  eta: { en: 'Thursday, 11 September', ar: 'الخميس ١١ سبتمبر' } as Bilingual,
  /** 0-based index into the five tracking stages. */
  currentStage: 2,
  design: {
    sizeId: '500' as const,
    bodyColorId: 'clay',
    lidColorId: 'bamboo',
    text: 'صباح الخير',
    fontId: 'tajawal',
    textColorId: 'cream',
    textSize: 'md' as const,
    placement: 'center' as const,
    handle: false,
    accessories: ['holder'],
  },
}
