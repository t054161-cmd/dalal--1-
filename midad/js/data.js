/* ═══════════════════════════════════════════════════════════════════
   DATA — the archive itself.
   Seeded with a real, finished reading journey; everything the reader
   adds afterwards is persisted to localStorage under one key.
   ═══════════════════════════════════════════════════════════════════ */

export const GENRES = ['novel','poetry','philosophy','history','memoir','heritage','world','thought','psychology','science'];

/* cover cloth palettes — a book's binding is chosen by its genre */
export const CLOTH = {
  novel:      ['#4a201a','#1c0b09'],
  poetry:     ['#17302a','#08120f'],
  philosophy: ['#20233a','#0b0d16'],
  history:    ['#3a2c13','#150f06'],
  memoir:     ['#3a1a2b','#13080f'],
  heritage:   ['#33200f','#110904'],
  world:      ['#152738','#070d15'],
  thought:    ['#2c2339','#100d16'],
  psychology: ['#1c3239','#080f12'],
  science:    ['#132c2c','#060f0f'],
};
export const cloth = (g) => CLOTH[g] || CLOTH.novel;

/* ── the finished books ─────────────────────────────────────────────── */
const BOOKS = [
  {
    id:'salt', lang:'ar', genre:'novel', pages:632, rating:5, finished:'2026-08-14',
    titleAr:'مدن الملح', titleEn:'Cities of Salt',
    authorAr:'عبد الرحمن منيف', authorEn:'Abdulrahman Munif',
    review:{
      ar:'خمس مجلدات تحكي كيف انقلبت الصحراء على نفسها حين وُجد النفط. منيف لا يكتب تاريخًا، بل يكتب ما يحدث للناس حين يُقتلع المكان من تحتهم ويُبنى مكان آخر على أسمائهم.',
      en:'Five volumes on how the desert turned on itself the day oil arrived. Munif does not write history; he writes what happens to people when the place beneath them is pulled away and another is built over their names.'},
    quotes:[
      {ar:'كان الناس يتغيرون، والبحر يتغير، والمدينة تتغير، وكل شيء يتغير إلا الذكرى.', en:'The people changed, the sea changed, the city changed — everything changed except the memory.', page:418},
      {ar:'المدن التي تُبنى على الملح تنهار حين يجيء أول مطر.', en:'Cities built on salt collapse with the first rain.', page:12}],
    ideas:[
      {ar:'الثروة المفاجئة لا تبني مجتمعًا، بل تعيد ترتيب من يملك الكلام فيه.', en:'Sudden wealth does not build a society; it rearranges who gets to speak in it.'},
      {ar:'الحداثة المفروضة من الخارج تُنتج مدنًا بلا ذاكرة.', en:'Modernity imposed from outside produces cities without memory.'},
      {ar:'الرواية الخليجية الكبرى ليست عن النفط، بل عن الفقدان.', en:'The great Gulf novel is not about oil; it is about loss.'}],
    notes:[{ar:'قرأت الجزء الأول في أسبوع، ثم توقفت شهرًا كاملًا قبل الثاني — كنت أحتاج أن أستوعب ما حدث لوادي العيون.', en:'I read the first volume in a week, then stopped for a whole month before the second — I needed time to absorb what happened to Wadi al‑Uyoun.'}],
    whyRating:{
      ar:'خمسة لأنها لا تُكتب مرتين: خمس مجلدات تحافظ على نَفَسها من الصفحة الأولى إلى الأخيرة، ولأنها الرواية الوحيدة التي شرحت لي الخليج الذي أعيش فيه.',
      en:'Five because it cannot be written twice: five volumes that hold their breath from the first page to the last, and the only novel that has explained to me the Gulf I live in.'},
    stayed:{ar:'أنّ التغيير الكبير لا يُرى وهو يحدث. يُرى بعد سنوات، في وجه رجل يقف أمام مكان لم يعد يعرفه.',
            en:'That great change is never visible while it happens. It becomes visible years later, in the face of a man standing before a place he no longer recognises.'},
  },
  {
    id:'migration', lang:'ar', genre:'novel', pages:169, rating:5, finished:'2026-06-02',
    titleAr:'موسم الهجرة إلى الشمال', titleEn:'Season of Migration to the North',
    authorAr:'الطيب صالح', authorEn:'Tayeb Salih',
    review:{
      ar:'رواية صغيرة الحجم، هائلة الأثر. مصطفى سعيد يعود من لندن إلى قرية على النيل حاملًا خرابه معه، والراوي يكتشف أن حكاية الآخر هي حكايته أيضًا.',
      en:'A small book with an enormous aftermath. Mustafa Sa’eed returns from London to a village on the Nile carrying his ruin with him, and the narrator discovers that the other man’s story is also his own.'},
    quotes:[
      {ar:'أنا لست عُطيل، أنا أكذوبة.', en:'I am no Othello. I am a lie.', page:33},
      {ar:'سأعيش لأنّ ثمة أناسًا قليلين أحب أن أبقى معهم زمنًا أطول.', en:'I shall live because there are a few people I want to stay with for as long as possible.', page:168}],
    ideas:[
      {ar:'الاستعمار لا ينتهي بخروج الجيوش؛ يبقى في اللغة والرغبة.', en:'Colonialism does not end when the armies leave; it stays in language and in desire.'},
      {ar:'الشمال والجنوب ليسا جهتين، بل جرحان متقابلان.', en:'North and South are not directions but two facing wounds.'}],
    notes:[{ar:'الفصل الأخير في النهر: أول مرة أقرأ نهاية معلّقة وأشعر أنها الاختيار الصحيح الوحيد.', en:'The last chapter in the river: the first time an unresolved ending felt like the only right choice.'}],
    whyRating:{
      ar:'خمسة رغم قِصَرها. كل صفحة فيها محسوبة، والنهاية المعلّقة ليست عجزًا عن الحسم بل هي الحسم نفسه.',
      en:'Five despite its brevity. Every page is measured, and the unresolved ending is not a failure to decide — it is the decision.'},
    stayed:{ar:'صوت الراوي وهو يصرخ في منتصف النهر «النجدة»، لا لأنه يريد أن يُنقذ، بل لأنه قرّر أن يعيش.',
            en:'The narrator shouting “Help!” in the middle of the river — not because he wants saving, but because he has decided to live.'},
  },
  {
    id:'palacewalk', lang:'ar', genre:'novel', pages:498, rating:5, finished:'2026-04-19',
    titleAr:'بين القصرين', titleEn:'Palace Walk',
    authorAr:'نجيب محفوظ', authorEn:'Naguib Mahfouz',
    review:{
      ar:'أول أجزاء الثلاثية. بيت واحد في القاهرة، وأب يحكمه كإله صغير، وثورة تدق الباب من الخارج. محفوظ يكتب الساعة واليوم والعادة حتى تصبح البيت نفسه شخصية.',
      en:'The first volume of the Trilogy. One house in Cairo, a father who rules it like a small god, and a revolution knocking from outside. Mahfouz writes the hour, the day and the habit until the house itself becomes a character.'},
    quotes:[
      {ar:'الحياة لا تنتظر أحدًا، والذين ينتظرون يخسرونها مرتين.', en:'Life waits for no one, and those who wait lose it twice.', page:301}],
    ideas:[
      {ar:'السلطة في البيت مرآة مصغّرة لسلطة الدولة.', en:'Authority inside the home is a scale model of authority in the state.'},
      {ar:'التفصيل اليومي هو مادة الرواية الكبرى، لا الحوادث الكبرى.', en:'The daily detail — not the great event — is the material of the great novel.'}],
    notes:[{ar:'كمال الصغير هو أجمل ما في الكتاب، وهو أيضًا أكثر من سيتألم في الأجزاء القادمة.', en:'Young Kamal is the loveliest thing in the book, and also the one who will hurt most in the volumes to come.'}],
    whyRating:{
      ar:'خمسة لأن محفوظ جعل بيتًا واحدًا يتّسع لمصر كلها، ولأني بعد خمسمئة صفحة كنت أعرف أمينة كما أعرف جارة.',
      en:'Five because Mahfouz made one house hold all of Egypt, and because after five hundred pages I knew Amina the way I know a neighbour.'},
    stayed:{ar:'أمينة وهي تصعد إلى السطح ليلًا لترى المدينة التي لا يُسمح لها بدخولها.',
            en:'Amina climbing to the roof at night to look at a city she is not allowed to enter.'},
  },
  {
    id:'meninsun', lang:'ar', genre:'novel', pages:96, rating:4, finished:'2026-02-27',
    titleAr:'رجال في الشمس', titleEn:'Men in the Sun',
    authorAr:'غسان كنفاني', authorEn:'Ghassan Kanafani',
    review:{
      ar:'ثلاثة رجال في خزان شاحنة، وطريق إلى الكويت، وسؤال واحد لا يفارق الكتاب: لماذا لم يقرعوا جدران الخزان؟ نص قصير يعمل كضربة.',
      en:'Three men inside a truck’s water tank, a road to Kuwait, and one question that never leaves the book: why did they not knock on the walls of the tank? A short text that works like a blow.'},
    quotes:[{ar:'لماذا لم تدقّوا جدران الخزان؟', en:'Why did you not knock on the walls of the tank?', page:94}],
    ideas:[
      {ar:'الصمت في اللحظة الحاسمة هو موضوع الرواية كلها.', en:'Silence at the decisive moment is the whole subject of the novel.'},
      {ar:'المنفى ليس مكانًا، بل انتظارٌ طويل في حرارة.', en:'Exile is not a place but a long wait in the heat.'}],
    notes:[{ar:'قرأتها في جلسة واحدة، ولم أستطع النوم. السؤال الأخير موجّه للقارئ لا للموتى.', en:'Read in one sitting; I could not sleep. The final question is addressed to the reader, not to the dead.'}],
    whyRating:{
      ar:'أربعة لا خمسة: الضربة الأخيرة هائلة، لكن الشخصيات الثلاث تبقى رموزًا أكثر منها بشرًا. وهذا ثمن القِصَر.',
      en:'Four rather than five: the final blow is enormous, but the three men stay closer to symbols than to people. That is the price of the brevity.'},
    stayed:{ar:'أن أقسى ما في النص ليس الموت، بل أنه كان يمكن تجنّبه بصوت.',
            en:'That the cruellest thing in the text is not the death, but that a single sound could have prevented it.'},
  },
  {
    id:'bamboo', lang:'ar', genre:'novel', pages:400, rating:4, finished:'2025-12-11',
    titleAr:'ساق البامبو', titleEn:'The Bamboo Stalk',
    authorAr:'سعود السنعوسي', authorEn:'Saud Alsanousi',
    review:{
      ar:'هوزيه/عيسى ينشأ في الفلبين ويعود إلى الكويت باسمٍ لا يجد له وجهًا. رواية عن الهوية حين تكون نصفين لا يعترف أحدهما بالآخر.',
      en:'José/Isa grows up in the Philippines and returns to Kuwait carrying a name he cannot find a face for. A novel about identity when it is two halves that refuse to acknowledge each other.'},
    quotes:[{ar:'كنت كساق البامبو، أُغرس في أي أرض فأنبت، لكن بلا جذور تُذكر.', en:'I was like a bamboo stalk: plant me anywhere and I grow, but with no roots to speak of.', page:7}],
    ideas:[
      {ar:'الهوية تُمنح وتُنزع اجتماعيًا قبل أن تكون شعورًا شخصيًا.', en:'Identity is socially granted and withdrawn before it is ever a private feeling.'},
      {ar:'الطبقة والعِرق في الخليج موضوعان لا تُقاربهما الرواية عادة بهذه المباشرة.', en:'Class and race in the Gulf are subjects the novel rarely approaches this directly.'}],
    notes:[{ar:'قرأتها بعد «مدن الملح» مباشرة، وبدت وكأنها الجزء المعاصر من الحكاية نفسها.', en:'I read it straight after Cities of Salt, and it felt like the contemporary chapter of the same story.'}],
    whyRating:{
      ar:'أربعة للسؤال الذي تطرحه، لا للغتها. الموضوع شجاع ونادر في الخليج، لكن السرد يشرح أحيانًا ما كان الأجدر أن يُترك.',
      en:'Four for the question it asks, not for its prose. The subject is brave and rare in the Gulf, but the narration sometimes explains what would have been better left alone.'},
    stayed:{ar:'أنّ الاسم يمكن أن يكون أثقل من الجسد الذي يحمله.',
            en:'That a name can weigh more than the body carrying it.'},
  },
  {
    id:'prophet', lang:'ar', genre:'poetry', pages:107, rating:4, finished:'2025-10-05',
    titleAr:'النبي', titleEn:'The Prophet',
    authorAr:'جبران خليل جبران', authorEn:'Kahlil Gibran',
    review:{
      ar:'ستّ وعشرون خطبة قصيرة في الحب والعمل والحرية والحزن. تُقرأ في ساعة وتُعاد عبر السنين، وكل قراءة تخصّ عمرًا مختلفًا.',
      en:'Twenty‑six short sermons on love, work, freedom and grief. Read in an hour and returned to across years, each reading belonging to a different age.'},
    quotes:[
      {ar:'وأولادكم ليسوا أولادكم، هم أبناء الحياة المشتاقة إلى نفسها.', en:'Your children are not your children. They are the sons and daughters of life’s longing for itself.', page:21},
      {ar:'وما الحزن إلا الفرح مكشوفًا عن قناعه.', en:'Your joy is your sorrow unmasked.', page:34}],
    ideas:[
      {ar:'الحكمة هنا شعرية لا فلسفية: تُقنع بالإيقاع لا بالبرهان.', en:'The wisdom here is poetic rather than philosophical: it persuades by rhythm, not by proof.'}],
    notes:[{ar:'أعدت قراءة فصل «العطاء» ثلاث مرات في ليلة واحدة.', en:'I reread the chapter “On Giving” three times in one night.'}],
    whyRating:{
      ar:'أربعة: فصول الحب والعطاء والأولاد تستحق الخمسة وحدها، لكن فصولًا أخرى تتكرّر بإيقاعها أكثر مما تضيف.',
      en:'Four: the chapters on love, giving and children would earn five on their own, but others repeat their music more than they add to it.'},
    stayed:{ar:'أنّ أجمل ما يُقال عن المحبة هو أقلّه ادّعاءً للملكية.',
            en:'That the finest thing said about love is whatever claims the least ownership.'},
  },
  {
    id:'muqaddimah', lang:'ar', genre:'heritage', pages:640, rating:5, finished:'2025-07-23',
    titleAr:'المقدمة', titleEn:'The Muqaddimah',
    authorAr:'ابن خلدون', authorEn:'Ibn Khaldun',
    review:{
      ar:'كتابٌ من القرن الرابع عشر يقرأ الدول كأجسام لها عمر: بداوة، ثم عمران، ثم ترف، ثم انحلال. قرأته ببطء، بقلم، وكنت أتوقف عند كل فصل.',
      en:'A fourteenth‑century book that reads states as bodies with a lifespan: hardiness, then civilisation, then luxury, then dissolution. I read it slowly, with a pen, stopping at every chapter.'},
    quotes:[{ar:'العصبيّة أصلٌ في قيام الدول، والترف مبدأٌ في سقوطها.', en:'Group solidarity founds dynasties; luxury begins their fall.', page:212}],
    ideas:[
      {ar:'العمران البشري موضوع علم قائم بذاته — وهذه أول مرة يُقال فيها ذلك بهذا الوضوح.', en:'Human social organisation is the subject of a science in its own right — stated here clearly for the first time.'},
      {ar:'العصبية تصنع الدولة، والترف يفكّكها في ثلاثة أجيال.', en:'Solidarity builds the state; luxury unbuilds it within three generations.'},
      {ar:'الكسب من الجاه لا من العمل علامة على تحلّل الاقتصاد.', en:'Income from status rather than labour is a sign of an economy dissolving.'}],
    notes:[{ar:'دفتر كامل من الملاحظات. فصل «في أن الظلم مؤذن بخراب العمران» يصلح أن يُقرأ اليوم بحرفه.', en:'A whole notebook of notes. The chapter on injustice ruining civilisation can be read today word for word.'}],
    whyRating:{
      ar:'خمسة، وهو الكتاب الوحيد هنا الذي قرأته بقلم ودفتر. لم أقرأ عملًا من القرن الرابع عشر يصلح أن يُناقَش اليوم بحرفه.',
      en:'Five, and the only book here I read with a pen and a notebook. I have read nothing else from the fourteenth century that can be argued with today, word for word.'},
    stayed:{ar:'أنّ الحضارة ليست شيئًا نملكه، بل شيئًا نصونه من أنفسنا كل جيل.',
            en:'That civilisation is not something we own, but something each generation defends from itself.'},
  },
  {
    id:'dove', lang:'ar', genre:'heritage', pages:224, rating:4, finished:'2025-05-16',
    titleAr:'طوق الحمامة', titleEn:'The Ring of the Dove',
    authorAr:'ابن حزم الأندلسي', authorEn:'Ibn Hazm al‑Andalusi',
    review:{
      ar:'رسالة أندلسية في الحب، تصنّف أحواله كما يصنّف عالمٌ ظواهر: كيف يبدأ، وكيف يُخفى، وكيف ينتهي. نثرٌ صافٍ وشعرٌ متقطع.',
      en:'An Andalusian treatise on love that classifies its states the way a scientist classifies phenomena: how it begins, how it is hidden, how it ends. Clear prose broken by verse.'},
    quotes:[{ar:'الحبّ أوّله هزلٌ وآخره جِدّ.', en:'Love begins in jest and ends in earnest.', page:19}],
    ideas:[
      {ar:'وصف العاطفة وصفًا منهجيًا لا يُفقدها شيئًا من رقّتها.', en:'Describing feeling methodically takes nothing away from its tenderness.'},
      {ar:'الأندلس تكتب الحب بوصفه معرفة، لا بوصفه انفعالًا فقط.', en:'Al‑Andalus writes love as a form of knowledge, not only as an emotion.'}],
    notes:[{ar:'باب «من أحبّ من نظرة واحدة» أقرب إلى علم النفس منه إلى الأدب.', en:'The chapter on falling in love at a single glance is closer to psychology than to literature.'}],
    whyRating:{
      ar:'أربعة لرقّته ودقّته معًا. ما منعني من الخامسة أن الأبواب الأخيرة تخفّ حدّتها بعد فصولٍ أولى باهرة.',
      en:'Four for its tenderness and its precision at once. What kept the fifth is that the closing chapters lose the edge of the dazzling early ones.'},
    stayed:{ar:'أنّ كاتبًا فقيهًا صارمًا كتب أرقّ ما قيل في الشوق، وأنّ ذلك ليس تناقضًا.',
            en:'That a severe jurist wrote the tenderest pages on longing, and that this is no contradiction.'},
  },
  {
    id:'azazeel', lang:'ar', genre:'novel', pages:380, rating:4, finished:'2025-03-08',
    titleAr:'عزازيل', titleEn:'Azazeel',
    authorAr:'يوسف زيدان', authorEn:'Youssef Ziedan',
    review:{
      ar:'رقوق راهب مصري في القرن الخامس، بين الإسكندرية وأنطاكية، وشيطانٌ يُجادله في الهامش. رواية عن الشك وقد صار فرضًا لا معصية.',
      en:'The scrolls of a fifth‑century Egyptian monk between Alexandria and Antioch, with a devil arguing in his margins. A novel in which doubt becomes an obligation rather than a sin.'},
    quotes:[{ar:'اكتب، فالكتابة وحدها تنجّيك من الجنون.', en:'Write — writing alone will save you from madness.', page:11}],
    ideas:[
      {ar:'الشك ليس نقيض الإيمان بل شرطه.', en:'Doubt is not the opposite of faith but its condition.'},
      {ar:'الصراع العقائدي يكتب تاريخه بلغة القتلة لا القتلى.', en:'Doctrinal conflict writes its history in the language of the killers, not the killed.'}],
    notes:[{ar:'مشهد مقتل هيباتيا كُتب ببرودٍ مرعب، وهو الفصل الذي لا أنساه.', en:'The killing of Hypatia is written with terrifying coldness; that is the chapter I cannot forget.'}],
    whyRating:{
      ar:'أربعة: الفكرة والبناء ممتازان، ومشهد هيباتيا لا يُنسى، لكن صوت الراهب يتشابه أحيانًا مع صوت المؤلف الباحث.',
      en:'Four: the idea and the structure are excellent and the Hypatia scene is unforgettable, but the monk’s voice sometimes slips into the scholar-author’s.'},
    stayed:{ar:'أنّ من يكتب اعترافه ليس مطمئنًا، بل يحاول أن ينجو.',
            en:'That whoever writes a confession is not at peace; he is trying to survive.'},
  },
  {
    id:'frankenstein', lang:'ar', genre:'novel', pages:352, rating:4, finished:'2025-01-19',
    titleAr:'فرانكشتاين في بغداد', titleEn:'Frankenstein in Baghdad',
    authorAr:'أحمد سعداوي', authorEn:'Ahmed Saadawi',
    review:{
      ar:'رجل يجمع أشلاء ضحايا التفجيرات في جسد واحد ليطالب بحقهم، فيصير الجسد قاتلًا. استعارة عن العدالة حين تتحول إلى انتقام لا يشبع.',
      en:'A man stitches the remains of bombing victims into one body to demand justice for them; the body becomes a killer. A metaphor for justice turning into a vengeance that never fills.'},
    quotes:[{ar:'أنا أول مواطن عراقي كامل، لأني مصنوع من كل العراقيين.', en:'I am the first complete Iraqi citizen, because I am made of all Iraqis.', page:147}],
    ideas:[
      {ar:'الانتقام العادل يفقد عدالته حين يستمر.', en:'Just vengeance stops being just the moment it continues.'},
      {ar:'العجائبي هو الأسلوب الواقعي الوحيد لكتابة حربٍ مدنية.', en:'The fantastical is the only realist mode for writing a civil war.'}],
    notes:[{ar:'كل فصل يُروى من زاوية مختلفة؛ لا أحد في بغداد يرى الحكاية كاملة.', en:'Each chapter comes from a different angle; no one in Baghdad sees the whole story.'}],
    whyRating:{
      ar:'أربعة للاستعارة المركزية، وهي من أذكى ما قرأت عن حرب أهلية. خصمتُ واحدة لأن بعض الخطوط الجانبية لا تكتمل.',
      en:'Four for the central metaphor, among the cleverest I have read about a civil war. I held one back because several side threads never close.'},
    stayed:{ar:'أنّ الضحية والجلاد قد يسكنان الجسد نفسه، وأن هذه هي الحرب.',
            en:'That victim and executioner can inhabit one body, and that this is what war is.'},
  },
  {
    id:'solitude', lang:'en', genre:'world', pages:417, rating:5, finished:'2024-11-27',
    titleAr:'مئة عام من العزلة', titleEn:'One Hundred Years of Solitude',
    authorAr:'غابرييل غارسيا ماركيز', authorEn:'Gabriel García Márquez',
    review:{
      ar:'ماكوندو تُولد وتزدهر وتُنسى في سبعة أجيال تحمل الأسماء نفسها. قرأتها ورسمت شجرة العائلة على ورقة كي لا أتوه، ثم أدركت أن التوهان جزء من القصد.',
      en:'Macondo is born, flourishes and is forgotten across seven generations bearing the same names. I read it while drawing the family tree on paper so as not to get lost, then realised getting lost is part of the design.'},
    quotes:[{ar:'الأجناس المحكوم عليها بمئة عام من العزلة لا تحصل على فرصة ثانية على الأرض.', en:'Races condemned to one hundred years of solitude do not get a second chance on earth.', page:416}],
    ideas:[
      {ar:'التاريخ في الرواية دائري: الأسماء تتكرر لأن الأخطاء تتكرر.', en:'History here is circular: the names repeat because the mistakes repeat.'},
      {ar:'الواقعية السحرية ليست تزيينًا، بل طريقة لقول ما لا يحتمله السرد المباشر.', en:'Magical realism is not decoration but a way of saying what plain narration cannot carry.'}],
    notes:[{ar:'الجملة الأولى أعظم افتتاحية قرأتها: ثلاثة أزمنة في سطر واحد.', en:'The first sentence is the greatest opening I have read: three tenses in one line.'}],
    whyRating:{
      ar:'خمسة. لم أقرأ كتابًا يصنع عالمًا كاملًا بهذا الاكتمال، ولا افتتاحيةً تحمل ثلاثة أزمنة في سطر واحد.',
      en:'Five. I have not read a book that builds a world this complete, nor an opening that carries three tenses in a single line.'},
    stayed:{ar:'أنّ العزلة تُورَّث كما تُورَّث البيوت والأسماء.',
            en:'That solitude is inherited the way houses and names are inherited.'},
  },
  {
    id:'crime', lang:'en', genre:'world', pages:671, rating:5, finished:'2024-09-14',
    titleAr:'الجريمة والعقاب', titleEn:'Crime and Punishment',
    authorAr:'فيودور دوستويفسكي', authorEn:'Fyodor Dostoevsky',
    review:{
      ar:'راسكولنيكوف يقتل ليثبت فكرة، ثم تكتشف الرواية أن الفكرة لا تحمي أحدًا من الحمّى. أطول حوار داخلي في الأدب، ولا صفحة زائدة فيه.',
      en:'Raskolnikov kills to prove an idea, and the novel discovers that an idea protects no one from the fever that follows. The longest interior argument in literature, without one spare page.'},
    quotes:[{ar:'الألم والعذاب لازمان دائمًا لعقلٍ واسع وقلبٍ عميق.', en:'Pain and suffering are always inevitable for a large intelligence and a deep heart.', page:242}],
    ideas:[
      {ar:'النظرية التي تبيح الاستثناء تبيح كل شيء في النهاية.', en:'A theory that permits one exception eventually permits everything.'},
      {ar:'العقاب يبدأ قبل الحكم بزمن طويل.', en:'The punishment begins long before the verdict.'}],
    notes:[{ar:'المحاور مع بورفيري أشبه بمباراة شطرنج: كلاهما يعرف، وكلاهما ينتظر أن يتكلم الآخر أولًا.', en:'The conversations with Porfiry are a chess match: both know, and both wait for the other to speak first.'}],
    whyRating:{
      ar:'خمسة لأن ستمئة صفحة من الحمّى الداخلية لا تفتر مرة واحدة. حوارات بورفيري وحدها تستحق التقييم كاملًا.',
      en:'Five because six hundred pages of interior fever never once slacken. The Porfiry conversations alone would earn the whole score.'},
    stayed:{ar:'أنّ الاعتراف لم يكن انكسارًا، بل أول لحظة يستعيد فيها نفسه.',
            en:'That the confession was not a collapse but the first moment he got himself back.'},
  },
  {
    id:'disquiet', lang:'en', genre:'thought', pages:544, rating:4, finished:'2024-06-30',
    titleAr:'كتاب القلق', titleEn:'The Book of Disquiet',
    authorAr:'فرناندو بيسوا', authorEn:'Fernando Pessoa',
    review:{
      ar:'ليس كتابًا بمعنى الكتاب: شذرات موظّف في لشبونة عن الملل والوحدة والحلم. قرأته على مدى أشهر، صفحتين كل ليلة، وهذه الطريقة الصحيحة الوحيدة.',
      en:'Not a book in the ordinary sense: the fragments of a Lisbon clerk on boredom, solitude and dreaming. I read it across months, two pages a night, which is the only correct way.'},
    quotes:[{ar:'الأدب هو أمتع طريقة لتجاهل الحياة.', en:'Literature is the most agreeable way of ignoring life.', page:71}],
    ideas:[
      {ar:'الشذرة شكلٌ كامل، لا مسوّدة لكتاب لم يُكتب.', en:'The fragment is a complete form, not the draft of an unwritten book.'},
      {ar:'يمكن للمرء أن يكون عدة أشخاص دون أن يكذب على أحد.', en:'A person can be several people without lying to anyone.'}],
    notes:[{ar:'وضعت علامات على ثلاث وأربعين شذرة. لن أعيد قراءة الكتاب كاملًا، بل هذه فقط.', en:'I marked forty‑three fragments. I will not reread the whole book — only these.'}],
    whyRating:{
      ar:'أربعة: شذرات تستحق الخمسة وشذرات تكرّر نفسها. قرأته صفحتين كل ليلة، وهذه الطريقة الوحيدة لإنصافه.',
      en:'Four: some fragments deserve five and some repeat themselves. Two pages a night is the only way to do it justice.'},
    stayed:{ar:'أنّ الملل يمكن أن يكون مادة أدبية عالية إن قيل بدقة كافية.',
            en:'That boredom can be a high literary material if described precisely enough.'},
  },
  {
    id:'bread', lang:'en', genre:'memoir', pages:192, rating:4, finished:'2024-04-11',
    titleAr:'الخبز الحافي', titleEn:'For Bread Alone',
    authorAr:'محمد شكري', authorEn:'Mohamed Choukri',
    review:{
      ar:'سيرة طفولة في طنجة بلا تجميل ولا شفقة على الذات. لغة عارية تصف الجوع كما هو: حاجة، لا استعارة.',
      en:'A childhood memoir from Tangier without embellishment or self‑pity. A bare language that describes hunger as it is: a need, not a metaphor.'},
    quotes:[{ar:'تعلّمت الحروف في العشرين، فصار الجوع قابلًا للكتابة.', en:'I learned my letters at twenty, and hunger became something that could be written.', page:8}],
    ideas:[
      {ar:'الكتابة عن الفقر تفقد صدقها لحظة تجمّله.', en:'Writing about poverty loses its truth the moment it prettifies it.'},
      {ar:'تعلّم القراءة متأخرًا يعطي اللغة حدة لا يملكها من نشأ فيها.', en:'Learning to read late gives language an edge that those raised inside it never have.'}],
    notes:[{ar:'قرأته في يومين وشعرت بأن الكتاب يقاومني، ثم أدركت أن هذا المقصود.', en:'Read in two days; the book seemed to resist me, then I understood that was the point.'}],
    whyRating:{
      ar:'أربعة لصدقه العاري. ما منعه من الخامسة ليس عيبًا فيه، بل أن قسوته تجعل إعادة القراءة صعبة.',
      en:'Four for its naked honesty. What kept it from five is no fault of the book: its harshness makes rereading hard.'},
    stayed:{ar:'أنّ الحرف نفسه يمكن أن يكون خلاصًا ماديًا، لا رمزيًا.',
            en:'That literacy itself can be a material rescue, not a symbolic one.'},
  },
  {
    id:'memory', lang:'ar', genre:'novel', pages:412, rating:3, finished:'2024-02-08',
    titleAr:'ذاكرة الجسد', titleEn:'Memory in the Flesh',
    authorAr:'أحلام مستغانمي', authorEn:'Ahlam Mosteghanemi',
    review:{
      ar:'نثرٌ عالي الشِعرية عن الجزائر والفقدان والحب المستحيل. أحببت اللغة أكثر من الحكاية؛ أحيانًا كانت الجملة أجمل من أن تخدم السرد.',
      en:'Highly poetic prose about Algeria, loss and impossible love. I loved the language more than the story; at times a sentence was too beautiful to serve the narrative.'},
    quotes:[{ar:'الوطن هو ذلك الذي نحمله معنا حين لا نستطيع العودة إليه.', en:'A homeland is what we carry with us when we can no longer return to it.', page:96}],
    ideas:[
      {ar:'الذاكرة الوطنية تُكتب هنا من خلال الجسد لا من خلال الوثيقة.', en:'National memory is written here through the body rather than the document.'}],
    notes:[{ar:'ثلاثة اقتباسات نقلتها إلى دفتري، ثم اكتفيت. اللغة تُشبع بسرعة.', en:'Three quotes went into my notebook, then I stopped. The language sates you quickly.'}],
    whyRating:{
      ar:'ثلاثة. اللغة أجمل من الحكاية، وقد أرهقتني بجمالها. احتفظت بثلاثة اقتباسات، واكتفيت.',
      en:'Three. The language is lovelier than the story, and its loveliness wore me out. I kept three quotes and stopped.'},
    stayed:{ar:'أنّ الجملة الجميلة جدًا قد تصبح عبئًا على الرواية.',
            en:'That a very beautiful sentence can become a burden on the novel carrying it.'},
  },
  {
    id:'ishiguro', lang:'en', genre:'world', pages:258, rating:5, finished:'2026-07-09',
    titleAr:'بقايا اليوم', titleEn:'The Remains of the Day',
    authorAr:'كازو إيشيغورو', authorEn:'Kazuo Ishiguro',
    review:{
      ar:'كبير خدم إنجليزي يروي حياته وهو يبرّر كل لحظة ضيّعها. أقسى رواية قرأتها عن الكرامة حين تُفهم خطأً.',
      en:'An English butler narrates his life while justifying every moment of it away. The cruellest novel I have read about dignity misunderstood.'},
    quotes:[{ar:'ما نفع أن نسترجع ما فات؟ لا شيء يعيده.', en:'What is the point of worrying oneself too much about what one could or could not have done?', page:244}],
    ideas:[
      {ar:'الرواية بأكملها مبنية على ما لا يقوله الراوي.', en:'The whole novel is built on what the narrator does not say.'},
      {ar:'الخدمة المطلقة قد تكون هروبًا من اتخاذ موقف.', en:'Absolute service can be a way of never having to take a position.'}],
    notes:[{ar:'قرأته بالإنجليزية؛ إيقاع الجمل نفسه جزء من الشخصية.', en:'Read in English; the rhythm of the sentences is itself part of the character.'}],
    whyRating:{
      ar:'خمسة لأن الرواية كلها مبنية على ما لا يقوله الراوي، ولأن إيشيغورو يجعلك تفهم قبل أن يفهم بطله بمئة صفحة.',
      en:'Five because the whole novel is built on what the narrator does not say, and because Ishiguro lets you understand a hundred pages before his butler does.'},
    stayed:{ar:'أنّ أشدّ ما يُفقد لا يُفقد في لحظة، بل في آلاف اللحظات الصغيرة التي قلنا فيها «لاحقًا».',
            en:'That what is most lost is never lost in a moment, but in the thousand small moments when we said “later”.'},
  },
  {
    id:'orwell', lang:'en', genre:'world', pages:328, rating:4, finished:'2026-05-21',
    titleAr:'١٩٨٤', titleEn:'Nineteen Eighty-Four',
    authorAr:'جورج أورويل', authorEn:'George Orwell',
    review:{
      ar:'قرأته متأخرة، وبعد كل ما قيل عنه. ما فاجأني ليس المراقبة، بل فصل اللغة: كيف يُقتل المعنى بتقليص المفردات.',
      en:'I came to it late, after everything that has been said about it. What surprised me was not the surveillance but the chapter on language: how meaning is killed by shrinking the vocabulary.'},
    quotes:[{ar:'الحرية هي حرية القول إنّ اثنين زائد اثنين يساوي أربعة.', en:'Freedom is the freedom to say that two plus two make four.', page:81}],
    ideas:[
      {ar:'من يملك اللغة يملك حدود ما يمكن التفكير فيه.', en:'Whoever owns the language owns the limits of what can be thought.'},
      {ar:'الملحق عن «اللغة الجديدة» هو قلب الكتاب، لا زائدة عليه.', en:'The appendix on Newspeak is the heart of the book, not an addendum to it.'}],
    notes:[{ar:'الملحق مكتوب بصيغة الماضي — أي أنّ النظام سقط. تفصيل يغيّر قراءة الرواية كلها.', en:'The appendix is written in the past tense — meaning the regime fell. A detail that changes the whole reading.'}],
    whyRating:{
      ar:'أربعة: الملحق عن اللغة الجديدة يستحق الخمسة، لكن الفصل الأوسط الطويل يشرح ما أثبتته الرواية بالفعل.',
      en:'Four: the appendix on Newspeak would earn five, but the long middle section explains what the novel has already proved.'},
    stayed:{ar:'أنّ أخطر رقابة ليست على ما نقول، بل على ما نملك من كلمات لنقوله.',
            en:'That the most dangerous censorship is not of what we say, but of the words we are left with to say it.'},
  },
  {
    id:'woolf', lang:'en', genre:'thought', pages:172, rating:4, finished:'2026-03-17',
    titleAr:'غرفة تخص المرء وحده', titleEn:'A Room of One’s Own',
    authorAr:'فرجينيا وولف', authorEn:'Virginia Woolf',
    review:{
      ar:'محاضرتان عن المرأة والكتابة، بحجة بسيطة وقاطعة: الإبداع يحتاج مالًا وبابًا يُغلق. قصير، ولا جملة فيه زائدة.',
      en:'Two lectures on women and fiction, resting on one plain and unanswerable argument: creation needs money and a door that shuts. Short, with no spare sentence.'},
    quotes:[{ar:'على المرأة أن تملك مالًا وغرفةً تخصّها وحدها إن أرادت أن تكتب.', en:'A woman must have money and a room of her own if she is to write fiction.', page:6}],
    ideas:[
      {ar:'الظروف المادية شرط للإبداع، لا تفصيل جانبي فيه.', en:'Material circumstances are a condition of creative work, not a footnote to it.'},
      {ar:'فصل «أخت شكسبير» يثبت الغياب بالخيال حين تعجز الوثائق.', en:'The “Shakespeare’s sister” chapter proves an absence by imagination where the records cannot.'}],
    notes:[{ar:'قرأته في جلستين. سأعود إليه كلما ظننت أنّ الموهبة وحدها تكفي.', en:'Read in two sittings. I will return to it whenever I think talent alone is enough.'}],
    whyRating:{
      ar:'أربعة لحجّته التي لا تُردّ، ولقِصَره الذي لا يضيّع كلمة. لم أعطه خمسة لأن المحاضرة تبقى محاضرة.',
      en:'Four for an argument that cannot be answered, and a brevity that wastes no word. Not five because a lecture remains a lecture.'},
    stayed:{ar:'أنّ الصمت في التاريخ ليس دائمًا غيابًا للموهبة، بل غيابًا للشروط.',
            en:'That silence in history is not always an absence of talent, but an absence of conditions.'},
  },
  {
    id:'calvino', lang:'en', genre:'world', pages:165, rating:5, finished:'2025-09-02',
    titleAr:'المدن اللامرئية', titleEn:'Invisible Cities',
    authorAr:'إيتالو كالفينو', authorEn:'Italo Calvino',
    review:{
      ar:'ماركو بولو يصف لقوبلاي خان مدنًا لا وجود لها، وكلها البندقية. كتاب يُقرأ بأي ترتيب، وكل مدينة فيه فكرة.',
      en:'Marco Polo describes to Kublai Khan cities that do not exist, and all of them are Venice. A book that can be read in any order, each city an idea.'},
    quotes:[{ar:'جحيم الأحياء ليس شيئًا سيأتي؛ إنه ما هو كائن هنا بالفعل.', en:'The inferno of the living is not something that will be; it is what is already here.', page:165}],
    ideas:[
      {ar:'الوصف يمكن أن يكون شكلًا من أشكال التفكير، لا زينة له.', en:'Description can be a form of thinking rather than an ornament on it.'},
      {ar:'كل مدينة متخيّلة هي سؤال عن المدينة التي نسكنها.', en:'Every imagined city is a question about the one we live in.'}],
    notes:[{ar:'قرأت مدينة واحدة كل ليلة لمدة شهرين. الطريقة الوحيدة التي احتمله بها.', en:'One city a night for two months. The only way I could hold it.'}],
    whyRating:{
      ar:'خمسة. كل مدينة فيه فكرة قائمة بذاتها، والجملة الأخيرة غيّرت طريقة نظري إلى المدينة التي أسكنها.',
      en:'Five. Every city in it is an idea standing on its own, and the final sentence changed how I look at the city I live in.'},
    stayed:{ar:'الجملة الأخيرة: أن نبحث في الجحيم عمّا ليس جحيمًا، ونمنحه مكانًا.',
            en:'The final sentence: to seek and learn to recognise who and what, in the midst of the inferno, are not inferno — and give them space.'},
  },
  {
    id:'prince', lang:'en', genre:'world', pages:96, rating:5, finished:'2023-12-24',
    titleAr:'الأمير الصغير', titleEn:'The Little Prince',
    authorAr:'أنطوان دو سانت إكزوبيري', authorEn:'Antoine de Saint‑Exupéry',
    review:{
      ar:'قرأته طفلةً، وأعدته هذا العام فوجدت كتابًا مختلفًا تمامًا: ليس عن كوكب صغير، بل عن الفقد وعن الوقت الذي نُهديه لما نحب.',
      en:'I read it as a child and returned to it this year to find an entirely different book: not about a small planet, but about loss and about the time we give to what we love.'},
    quotes:[
      {ar:'لا يرى المرء بعينيه جيدًا، إنما بقلبه.', en:'One sees clearly only with the heart.', page:72},
      {ar:'أنت مسؤول إلى الأبد عن كل ما رُوّضتَه.', en:'You become responsible, forever, for what you have tamed.', page:71}],
    ideas:[
      {ar:'الوقت المُهدى هو ما يصنع القيمة، لا الشيء نفسه.', en:'It is the time given that creates value, not the thing itself.'}],
    notes:[{ar:'رسمة الأفعى التي أكلت الفيل: أول درس في أن الشرح يقتل المعنى.', en:'The drawing of the snake that swallowed the elephant: the first lesson that explaining kills meaning.'}],
    whyRating:{
      ar:'خمسة لأني قرأته مرتين بعمرين مختلفين، ووجدته في المرة الثانية كتابًا آخر تمامًا عن الفقد.',
      en:'Five because I read it twice at two different ages, and the second time found an entirely different book about loss.'},
    stayed:{ar:'أنّ ما نحبه يصير مسؤوليتنا، وأنّ هذا هو الفرق بين الإعجاب والحب.',
            en:'That what we love becomes our responsibility, and that this is the difference between admiration and love.'},
  },
];

/* ── books offered by the community for exchange ─────────────────── */
const LISTINGS = [
  { id:'x1', owner:{ar:'ليلى العنزي',en:'Layla Al‑Anzi'}, mine:false, genre:'novel', condition:'good', bookLang:'ar',
    titleAr:'الطنطورية', titleEn:'The Woman from Tantoura', authorAr:'رضوى عاشور', authorEn:'Radwa Ashour',
    area:{ar:'حولي، الكويت',en:'Hawalli, Kuwait'}, status:'available',
    desc:{ar:'نسخة دار الشروق، قرأتها مرة واحدة وحافظت عليها.',en:'Dar El Shorouk edition, read once and kept carefully.'},
    wants:{ar:'رواية عربية معاصرة، أو شيء لهدى بركات.',en:'A contemporary Arabic novel, or anything by Hoda Barakat.'} },
  { id:'x2', owner:{ar:'يوسف الرشيد',en:'Youssef Al‑Rashid'}, mine:false, genre:'philosophy', condition:'new', bookLang:'ar',
    titleAr:'تهافت الفلاسفة', titleEn:'The Incoherence of the Philosophers', authorAr:'أبو حامد الغزالي', authorEn:'Al‑Ghazali',
    area:{ar:'السالمية، الكويت',en:'Salmiya, Kuwait'}, status:'available',
    desc:{ar:'طبعة محقّقة بغلاف صلب، لم تُقرأ إلا في فصلين.',en:'Annotated hardcover edition; only two chapters read.'},
    wants:{ar:'كتاب في الفلسفة الإسلامية أو ابن رشد.',en:'Anything on Islamic philosophy, or Ibn Rushd.'} },
  { id:'x3', owner:{ar:'مريم الصبّاح',en:'Maryam Al‑Sabah'}, mine:false, genre:'world', condition:'good', bookLang:'en',
    titleAr:'الحرس القديم', titleEn:'The Remains of the Day', authorAr:'كازو إيشيغورو', authorEn:'Kazuo Ishiguro',
    area:{ar:'الجابرية، الكويت',en:'Jabriya, Kuwait'}, status:'pending',
    desc:{ar:'نسخة إنجليزية، بها ملاحظات بالقلم الرصاص على الهوامش.',en:'English edition with pencil notes in the margins.'},
    wants:{ar:'رواية يابانية مترجمة.',en:'A translated Japanese novel.'} },
  { id:'x4', owner:{ar:'عبدالله المطيري',en:'Abdullah Al‑Mutairi'}, mine:false, genre:'history', condition:'worn', bookLang:'ar',
    titleAr:'تاريخ الكويت', titleEn:'A History of Kuwait', authorAr:'عبد العزيز الرشيد', authorEn:'Abdulaziz Al‑Rashid',
    area:{ar:'الفروانية، الكويت',en:'Farwaniya, Kuwait'}, status:'available',
    desc:{ar:'طبعة قديمة، الغلاف متعب لكن الصفحات كاملة.',en:'An old printing; tired cover but every page intact.'},
    wants:{ar:'أي كتاب في تاريخ الخليج.',en:'Any book on Gulf history.'} },
  { id:'x5', owner:{ar:'نورة الخالد',en:'Noura Al‑Khaled'}, mine:false, genre:'poetry', condition:'new', bookLang:'ar',
    titleAr:'لا أريد لهذي القصيدة أن تنتهي', titleEn:'I Don’t Want This Poem to End', authorAr:'محمود درويش', authorEn:'Mahmoud Darwish',
    area:{ar:'الشامية، الكويت',en:'Shamiya, Kuwait'}, status:'available',
    desc:{ar:'ديوان بحالة ممتازة، اشتريت نسختين بالخطأ.',en:'Excellent condition — I bought two copies by mistake.'},
    wants:{ar:'ديوان لسعدي يوسف أو أدونيس.',en:'A collection by Saadi Youssef or Adonis.'} },
  { id:'x6', owner:{ar:'حسن الفرحان',en:'Hassan Al‑Farhan'}, mine:false, genre:'psychology', condition:'good', bookLang:'ar',
    titleAr:'الإنسان يبحث عن المعنى', titleEn:'Man’s Search for Meaning', authorAr:'فيكتور فرانكل', authorEn:'Viktor Frankl',
    area:{ar:'الأحمدي، الكويت',en:'Ahmadi, Kuwait'}, status:'completed',
    desc:{ar:'قرأته مرتين وأودّ أن يقرأه غيري.',en:'Read twice; I would like someone else to read it.'},
    wants:{ar:'كتاب في علم النفس أو سيرة ذاتية.',en:'A psychology book, or a memoir.'} },
];

/* ── the reading community ───────────────────────────────────────── */
const READERS = [
  { id:'r1', name:{ar:'ليلى العنزي',en:'Layla Al‑Anzi'}, since:2019, books:184, avg:4.2, exchanges:11, genre:'novel',
    line:{ar:'أقرأ الرواية العربية المعاصرة، وأكتب على الهوامش بقلم رصاص دائمًا.',
           en:'I read contemporary Arabic fiction, and I always write in the margins in pencil.'},
    recs:['migration','frankenstein','bamboo'] },
  { id:'r2', name:{ar:'يوسف الرشيد',en:'Youssef Al‑Rashid'}, since:2016, books:263, avg:3.9, exchanges:24, genre:'philosophy',
    line:{ar:'التراث أولًا: لا أفهم الحاضر إلا بقراءة من كتبوا قبل ستة قرون.',
           en:'The classical tradition first: I cannot read the present without those who wrote six centuries ago.'},
    recs:['muqaddimah','dove','azazeel'] },
  { id:'r3', name:{ar:'مريم الصبّاح',en:'Maryam Al‑Sabah'}, since:2021, books:97, avg:4.5, exchanges:6, genre:'world',
    line:{ar:'أدب مترجم، ورواية واحدة طويلة كل صيف.',
           en:'Translated literature, and one long novel every summer.'},
    recs:['solitude','crime','disquiet'] },
  { id:'r4', name:{ar:'نورة الخالد',en:'Noura Al‑Khaled'}, since:2020, books:142, avg:4.4, exchanges:9, genre:'poetry',
    line:{ar:'الشعر أولًا وأخيرًا. أحفظ ما أحب، ولا أُعير دواويني إلا لمن يعيدها.',
           en:'Poetry first and last. I memorise what I love, and lend my collections only to people who return them.'},
    recs:['prophet','prince'] },
  { id:'r5', name:{ar:'عبدالله المطيري',en:'Abdullah Al‑Mutairi'}, since:2014, books:311, avg:3.7, exchanges:38, genre:'history',
    line:{ar:'تاريخ الخليج والجزيرة. أبحث دائمًا عن الطبعات الأولى.',
           en:'The history of the Gulf and the Peninsula. Always hunting for first printings.'},
    recs:['salt','muqaddimah'] },
  { id:'r6', name:{ar:'حسن الفرحان',en:'Hassan Al‑Farhan'}, since:2022, books:64, avg:4.1, exchanges:4, genre:'psychology',
    line:{ar:'أقرأ لأفهم الناس، ثم أعيد الكتاب لمن يحتاجه أكثر مني.',
           en:'I read to understand people, then pass the book on to whoever needs it more than I do.'},
    recs:['bread','meninsun'] },
];

/* ── the recommendation pool (books not yet in the library) ─────── */
const POOL = [
  { id:'p1', genre:'novel',      titleAr:'حجر الصبر', titleEn:'The Patience Stone', authorAr:'عتيق رحيمي', authorEn:'Atiq Rahimi', pages:160 },
  { id:'p2', genre:'novel',      titleAr:'حكايات يوسف إدريس', titleEn:'The Cheapest Nights', authorAr:'يوسف إدريس', authorEn:'Yusuf Idris', pages:208 },
  { id:'p3', genre:'novel',      titleAr:'حجر الضحك', titleEn:'The Stone of Laughter', authorAr:'هدى بركات', authorEn:'Hoda Barakat', pages:224 },
  { id:'p4', genre:'heritage',   titleAr:'رسالة الغفران', titleEn:'The Epistle of Forgiveness', authorAr:'أبو العلاء المعري', authorEn:'Al‑Ma‘arri', pages:480 },
  { id:'p5', genre:'world',      titleAr:'الأخوة كارامازوف', titleEn:'The Brothers Karamazov', authorAr:'فيودور دوستويفسكي', authorEn:'Fyodor Dostoevsky', pages:824 },
  { id:'p6', genre:'poetry',     titleAr:'أحد عشر كوكبًا', titleEn:'Eleven Planets', authorAr:'محمود درويش', authorEn:'Mahmoud Darwish', pages:132 },
  { id:'p7', genre:'thought',    titleAr:'الاستشراق', titleEn:'Orientalism', authorAr:'إدوارد سعيد', authorEn:'Edward Said', pages:432 },
  { id:'p8', genre:'history',    titleAr:'الحياة اليومية في القاهرة المملوكية', titleEn:'Daily Life in Mamluk Cairo', authorAr:'أحمد عبد الرازق', authorEn:'Ahmad Abd al‑Raziq', pages:288 },
  { id:'p9', genre:'memoir',     titleAr:'أيام', titleEn:'The Days', authorAr:'طه حسين', authorEn:'Taha Hussein', pages:352 },
  { id:'p10', genre:'psychology',titleAr:'التفكير السريع والبطيء', titleEn:'Thinking, Fast and Slow', authorAr:'دانيال كانمان', authorEn:'Daniel Kahneman', pages:512 },
  { id:'p11', genre:'philosophy', titleAr:'تأملات', titleEn:'Meditations', authorAr:'ماركوس أوريليوس', authorEn:'Marcus Aurelius', pages:176 },
  { id:'p12', genre:'philosophy', titleAr:'حي بن يقظان', titleEn:'Hayy ibn Yaqzan', authorAr:'ابن طفيل', authorEn:'Ibn Tufayl', pages:160 },
  { id:'p13', genre:'philosophy', titleAr:'أسطورة سيزيف', titleEn:'The Myth of Sisyphus', authorAr:'ألبير كامو', authorEn:'Albert Camus', pages:212 },
  { id:'p14', genre:'philosophy', titleAr:'فصل المقال', titleEn:'The Decisive Treatise', authorAr:'ابن رشد', authorEn:'Ibn Rushd', pages:128 },
  { id:'p15', genre:'science',    titleAr:'تاريخ موجز للزمن', titleEn:'A Brief History of Time', authorAr:'ستيفن هوكينغ', authorEn:'Stephen Hawking', pages:224 },
  { id:'p16', genre:'science',    titleAr:'الجين: تاريخ حميم', titleEn:'The Gene: An Intimate History', authorAr:'سيدهارتا موكرجي', authorEn:'Siddhartha Mukherjee', pages:592 },
  { id:'p17', genre:'psychology', titleAr:'الإنسان يبحث عن المعنى', titleEn:'Man’s Search for Meaning', authorAr:'فيكتور فرانكل', authorEn:'Viktor Frankl', pages:184 },
  { id:'p18', genre:'poetry',     titleAr:'ديوان المتنبي', titleEn:'The Diwan of al-Mutanabbi', authorAr:'أبو الطيب المتنبي', authorEn:'Al-Mutanabbi', pages:400 },
];

/* ═══════════════════════════ THE STORE ════════════════════════════
   Each reader has their own archive; signed out, everyone shares the
   guest shelf. `archiveKey()` decides which drawer is open.
   ══════════════════════════════════════════════════════════════════ */
import { archiveKey } from './account.js';

const seed = () => ({
  lang: 'ar',
  theme: 'night',
  profile: {
    name: { ar: 'قارئ مِداد', en: 'MIDĀD Reader' },
    member: '2024·2834',
    since: 2023,
  },
  books: BOOKS.map((b) => ({ ...b, added: b.finished })),
  listings: LISTINGS,
  requests: [
    { id:'q1', listing:'x3', dir:'out', status:'pending', at:'2026-09-02' },
    { id:'q2', listing:'x6', dir:'out', status:'completed', at:'2026-05-18' },
  ],
  saved: ['x5'],
  notes: [],   /* free-standing marginalia; book-bound notes live on the book */
});

let state = null;
let openKey = null;

export function load() {
  const key = archiveKey();
  if (state && openKey === key) return state;
  openKey = key;
  try {
    const raw = localStorage.getItem(key);
    state = raw ? { ...seed(), ...JSON.parse(raw) } : seed();
  } catch { state = seed(); }
  return state;
}
export function save() {
  try { localStorage.setItem(openKey || archiveKey(), JSON.stringify(state)); }
  catch { /* private mode: the session still works, it just will not persist */ }
}
/** Called when the reader changes: the next load() opens the other drawer. */
export function closeArchive() { state = null; openKey = null; }
export const db = () => load();
export const readers = () => READERS;
export const pool = () => POOL;
export const uid = (p = 'id') => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const bookById = (id) => db().books.find((b) => b.id === id);
export const listingById = (id) => db().listings.find((l) => l.id === id);

export function addBook(b) { db().books.push(b); save(); }
export function updateBook(id, patch) {
  const b = bookById(id); if (!b) return;
  Object.assign(b, patch); save();
}
export function removeBook(id) {
  const s = db(); s.books = s.books.filter((b) => b.id !== id); save();
}
export function addNote(note) { db().notes.push(note); save(); }
export function addListing(l) { db().listings.unshift(l); save(); }
export function toggleSaved(id) {
  const s = db();
  s.saved = s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id];
  save();
  return s.saved.includes(id);
}
export function requestFor(listingId) { return db().requests.find((r) => r.listing === listingId); }
export function addRequest(listingId, dir = 'out') {
  const s = db();
  s.requests.push({ id: uid('q'), listing: listingId, dir, status: 'pending', at: new Date().toISOString().slice(0, 10) });
  const l = listingById(listingId); if (l) l.status = 'pending';
  save();
}
export function setRequestStatus(reqId, status) {
  const r = db().requests.find((x) => x.id === reqId); if (!r) return;
  r.status = status;
  const l = listingById(r.listing);
  if (l) l.status = status === 'completed' ? 'completed' : status === 'declined' ? 'available' : 'pending';
  save();
}
export function setProfileName(ar, en) {
  const p = db().profile;
  p.name = { ar: ar || p.name.ar, en: en || p.name.en };
  save();
}

/* ── every marginalia fragment in the archive, book-bound + free ────
   Ordered newest first, so whatever the reader just wrote is the first
   thing they see when they land on the Marginalia wall. */
export function allMarginalia() {
  const out = [];
  for (const b of db().books) {
    const on = b.finished;
    for (const q of b.quotes || []) out.push({ kind:'quote', text:q, book:b, page:q.page, on });
    for (const nt of b.notes || []) out.push({ kind:'note', text:nt, book:b, on });
    for (const i of b.ideas || []) out.push({ kind:'idea', text:i, book:b, on });
    if (b.stayed) out.push({ kind:'stayed', text:b.stayed, book:b, on });
  }
  for (const nt of db().notes) {
    out.push({
      kind: nt.kind || 'note', text: nt.text, at: nt.at, on: nt.at, free: true,
      book: nt.book ? bookById(nt.book) : null,
    });
  }
  return out.sort((a, b) => {
    const d = new Date(b.on || 0) - new Date(a.on || 0);
    if (d) return d;
    return (b.free ? 1 : 0) - (a.free ? 1 : 0);   /* a free note outranks a book's own */
  });
}
