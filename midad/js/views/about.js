/* ═══════════ عن مِداد — the library explains itself ═══════════ */
import { t, isAr } from '../i18n.js';
import { esc, icon, phead, shead } from '../ui.js';
import { totals } from '../metrics.js';

/* Each passage is written in both languages rather than translated across. */
const PASSAGES = [
  {
    key: 'ab.ink',
    ar: `المِداد هو الحبر: السائل الذي يُثبّت الكلام على الورق فيصير أثرًا يبقى بعد قائله.
         سُمّي هذا الموقع بهذا الاسم لأنّ القراءة تفعل بنا ما يفعله الحبر بالورقة — تترك علامة لا تُمحى بالكامل،
         حتى بعد أن يُغلق الكتاب ويعود إلى الرفّ.`,
    en: `Midād is ink: the liquid that fixes speech onto paper so it outlasts whoever said it.
         The site carries the name because reading does to us what ink does to a page — it leaves a mark
         that never quite washes out, long after the book is closed and back on the shelf.`,
  },
  {
    key: 'ab.why',
    ar: `أكثر تطبيقات القراءة تَعُدّ: كم كتابًا أنهيتَ هذا العام، وكم صفحة، وكم يومًا تابعتَ دون انقطاع.
         العدّ سهل، لكنه ليس ما يبقى. ما يبقى هو جملة أوقفتك في منتصف الليل، وفكرة غيّرت رأيك في أمرٍ ما،
         وشخصية ما زلت تحاكمها بعد سنوات.`,
    en: `Most reading apps count: how many books this year, how many pages, how many days in a row.
         Counting is easy, but it is not what remains. What remains is the sentence that stopped you at midnight,
         the idea that changed your mind about something, the character you are still arguing with years later.`,
  },
  {
    key: 'ab.finished',
    ar: `لهذا تبدأ مِداد من حيث تنتهي الكتب. لا تُسجَّل هنا الكتب التي تنوي قراءتها، ولا التي تركتها في المنتصف،
         بل الكتب التي وصلتَ فيها إلى الصفحة الأخيرة — ومعها ما كتبتَه على هوامشها.`,
    en: `So MIDĀD begins where books end. What is recorded here is not what you intend to read, nor what you
         abandoned halfway, but the books you carried to the last page — and with them, whatever you wrote in the margins.`,
  },
  {
    key: 'ab.archive',
    ar: `كل كتاب هنا سجلّ أرشيفي: تقييمك، ومراجعتك، واقتباساتك، وأفكاره الرئيسية، وحقلٌ أخير اسمه «ما بقي معي».
         هذا الحقل هو قلب الموقع. البقية إحصاء.`,
    en: `Every book here is an archival record: your rating, your review, your quotes, its main ideas, and one last
         field called “What Stayed With Me”. That field is the heart of the site. The rest is arithmetic.`,
  },
];

export default function about() {
  const s = totals();

  return `
  <div class="wrap">
    ${phead('nav.about', null)}

    <article class="about">
      <figure class="about__mark">
        <span class="about__glyph">مِداد</span>
        <figcaption>
          <span class="about__gloss">${esc(isAr() ? 'اسم' : 'noun')}</span>
          <span class="about__def">${esc(isAr()
            ? 'الحِبر؛ ما يُكتب به، وما يبقى من الكتابة.'
            : 'ink; that with which one writes, and what writing leaves behind.')}</span>
        </figcaption>
      </figure>

      ${PASSAGES.map((x) => `
        <p class="about__p">${esc((isAr() ? x.ar : x.en).replace(/\s+/g, ' ').trim())}</p>`).join('')}

      <blockquote class="about__creed">
        <p class="about__creed-ar" lang="ar">«بعض الكتب تنتهي عند آخر صفحة، لكنها لا تنتهي فينا.»</p>
        <p class="about__creed-en" lang="en">“Some books end at the last page, but they do not end within us.”</p>
      </blockquote>

      <div class="rule"><span class="rule__dot"></span></div>

      <p class="about__p about__p--quiet">${esc(isAr()
        ? `في هذه المكتبة الآن ${s.books} كتابًا منتهيًا، و${s.notes} هامشًا محفوظًا. لا يهم الرقم كثيرًا — المهم أن شيئًا منها بقي.`
        : `This library currently holds ${s.books} finished books and ${s.notes} preserved notes. The number matters little — what matters is that something of them stayed.`)}</p>

      <div class="about__acts">
        <a class="btn btn--brass" href="#/library">${icon('shelf')}<span>${esc(t('home.enter'))}</span></a>
        <a class="btn btn--ghost" href="#/marginalia">${icon('quill')}<span>${esc(t('nav.marginalia'))}</span></a>
      </div>
    </article>
  </div>`;
}
