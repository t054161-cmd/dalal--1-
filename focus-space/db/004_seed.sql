-- ═══════════════════════════════════════════════════════════════════════
--  FOCUS SPACE — seed
--
--  Generated from focus-space/js/data.js by generate-seed.mjs.
--  Do not edit by hand: change the application data and regenerate, or
--  once the database is the source of truth, retire this file.
--
--  21 spaces · 3 categories · 18 services
-- ═══════════════════════════════════════════════════════════════════════

set search_path = public, extensions;

begin;

-- ── districts ──────────────────────────────────────────────────────────
insert into districts (slug, name, governorate, city, centre) values ('kuwait-city', '{"en":"Kuwait City","ar":"مدينة الكويت"}'::jsonb, '{"en":"Al Asimah","ar":"العاصمة"}'::jsonb, '{"en":"Kuwait","ar":"الكويت"}'::jsonb, st_setsrid(st_makepoint(47.989967, 29.378067), 4326)::geography) on conflict (slug) do nothing;
insert into districts (slug, name, governorate, city, centre) values ('salmiya', '{"en":"Salmiya","ar":"السالمية"}'::jsonb, '{"en":"Hawalli","ar":"حولي"}'::jsonb, '{"en":"Kuwait","ar":"الكويت"}'::jsonb, st_setsrid(st_makepoint(48.075367, 29.337233), 4326)::geography) on conflict (slug) do nothing;
insert into districts (slug, name, governorate, city, centre) values ('jabriya', '{"en":"Jabriya","ar":"الجابرية"}'::jsonb, '{"en":"Hawalli","ar":"حولي"}'::jsonb, '{"en":"Kuwait","ar":"الكويت"}'::jsonb, st_setsrid(st_makepoint(48.022250, 29.318650), 4326)::geography) on conflict (slug) do nothing;
insert into districts (slug, name, governorate, city, centre) values ('sharq', '{"en":"Sharq","ar":"شرق"}'::jsonb, '{"en":"Al Asimah","ar":"العاصمة"}'::jsonb, '{"en":"Kuwait","ar":"الكويت"}'::jsonb, st_setsrid(st_makepoint(48.001850, 29.378250), 4326)::geography) on conflict (slug) do nothing;
insert into districts (slug, name, governorate, city, centre) values ('mishref', '{"en":"Mishref","ar":"مشرف"}'::jsonb, '{"en":"Hawalli","ar":"حولي"}'::jsonb, '{"en":"Kuwait","ar":"الكويت"}'::jsonb, st_setsrid(st_makepoint(48.066750, 29.273050), 4326)::geography) on conflict (slug) do nothing;
insert into districts (slug, name, governorate, city, centre) values ('bneid-al-gar', '{"en":"Bneid Al-Gar","ar":"بنيد القار"}'::jsonb, '{"en":"Al Asimah","ar":"العاصمة"}'::jsonb, '{"en":"Kuwait","ar":"الكويت"}'::jsonb, st_setsrid(st_makepoint(48.004400, 29.369600), 4326)::geography) on conflict (slug) do nothing;
insert into districts (slug, name, governorate, city, centre) values ('shuwaikh', '{"en":"Shuwaikh","ar":"الشويخ"}'::jsonb, '{"en":"Al Asimah","ar":"العاصمة"}'::jsonb, '{"en":"Kuwait","ar":"الكويت"}'::jsonb, st_setsrid(st_makepoint(47.929000, 29.339600), 4326)::geography) on conflict (slug) do nothing;
insert into districts (slug, name, governorate, city, centre) values ('al-rai', '{"en":"Al-Rai","ar":"الري"}'::jsonb, '{"en":"Al Farwaniyah","ar":"الفروانية"}'::jsonb, '{"en":"Kuwait","ar":"الكويت"}'::jsonb, st_setsrid(st_makepoint(47.923600, 29.305500), 4326)::geography) on conflict (slug) do nothing;
insert into districts (slug, name, governorate, city, centre) values ('hawally', '{"en":"Hawally","ar":"حولي"}'::jsonb, '{"en":"Hawalli","ar":"حولي"}'::jsonb, '{"en":"Kuwait","ar":"الكويت"}'::jsonb, st_setsrid(st_makepoint(48.026700, 29.335150), 4326)::geography) on conflict (slug) do nothing;
insert into districts (slug, name, governorate, city, centre) values ('sabah-al-salem', '{"en":"Sabah Al-Salem","ar":"صباح السالم"}'::jsonb, '{"en":"Mubarak Al-Kabeer","ar":"مبارك الكبير"}'::jsonb, '{"en":"Kuwait","ar":"الكويت"}'::jsonb, st_setsrid(st_makepoint(48.063100, 29.258600), 4326)::geography) on conflict (slug) do nothing;
insert into districts (slug, name, governorate, city, centre) values ('salwa', '{"en":"Salwa","ar":"سلوى"}'::jsonb, '{"en":"Hawalli","ar":"حولي"}'::jsonb, '{"en":"Kuwait","ar":"الكويت"}'::jsonb, st_setsrid(st_makepoint(48.074200, 29.290500), 4326)::geography) on conflict (slug) do nothing;
insert into districts (slug, name, governorate, city, centre) values ('fintas', '{"en":"Fintas","ar":"الفنطاس"}'::jsonb, '{"en":"Al Ahmadi","ar":"الأحمدي"}'::jsonb, '{"en":"Kuwait","ar":"الكويت"}'::jsonb, st_setsrid(st_makepoint(48.121100, 29.174800), 4326)::geography) on conflict (slug) do nothing;

-- ── categories ─────────────────────────────────────────────────────────
insert into categories (slug, position, name, tagline, description, suited_for) values ('offices', 1, '{"en":"Offices","ar":"المكاتب"}'::jsonb, '{"en":"For studying and working","ar":"للدراسة والعمل"}'::jsonb, '{"en":"Private rooms and focused desks for studying and deep work. Quiet floors, good chairs, real power, and internet you can trust for a full day.","ar":"غرف خاصة ومكاتب مركّزة للدراسة والعمل العميق. طوابق هادئة، مقاعد مريحة، كهرباء حقيقية، وإنترنت يمكن الاعتماد عليه ليوم كامل."}'::jsonb, '{"en":["Deep work","Studying","Solo focus days","Two-person desks","Calls"],"ar":["العمل العميق","الدراسة","أيام التركيز الفردي","مكاتب لشخصين","المكالمات"]}'::jsonb) on conflict (slug) do nothing;
insert into categories (slug, position, name, tagline, description, suited_for) values ('halls', 2, '{"en":"Halls","ar":"القاعات"}'::jsonb, '{"en":"For companies, courses, meetings and workshops","ar":"للشركات والدورات والاجتماعات وورش العمل"}'::jsonb, '{"en":"Rooms that hold a group: company sessions, trainers and courses, meetings, workshops and events — with projection, sound and a setup that can be rearranged.","ar":"قاعات تتّسع لمجموعة: جلسات الشركات، المدربون والدورات، الاجتماعات وورش العمل والفعاليات — مع عرض وصوت وترتيب قابل للتغيير."}'::jsonb, '{"en":["Companies","Trainers & courses","Meetings","Workshops","Events"],"ar":["الشركات","المدربون والدورات","الاجتماعات","ورش العمل","الفعاليات"]}'::jsonb) on conflict (slug) do nothing;
insert into categories (slug, position, name, tagline, description, suited_for) values ('cafes', 3, '{"en":"Cafés","ar":"المقاهي"}'::jsonb, '{"en":"For quiet studying and working","ar":"للدراسة والعمل الهادئ"}'::jsonb, '{"en":"Cafés chosen for the way they treat a laptop and a long session: low noise, generous tables, sockets within reach, and staff who let you stay.","ar":"مقاهٍ اخترناها لطريقة تعاملها مع اللابتوب والجلسات الطويلة: ضجيج منخفض، طاولات واسعة، أفياش قريبة، وطاقم لا يستعجلك."}'::jsonb, '{"en":["Studying","Quiet work","Laptops","Productive sessions","Reading"],"ar":["الدراسة","العمل الهادئ","اللابتوب","الجلسات المنتجة","القراءة"]}'::jsonb) on conflict (slug) do nothing;

-- ── services ───────────────────────────────────────────────────────────
insert into services (key, name, sort_order) values ('wifi', '{"en":"Fast Wi-Fi","ar":"إنترنت سريع"}'::jsonb, 0) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('power', '{"en":"Power at every seat","ar":"كهرباء لكل مقعد"}'::jsonb, 1) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('quiet', '{"en":"Quiet zone","ar":"منطقة هادئة"}'::jsonb, 2) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('meeting', '{"en":"Meeting room","ar":"غرفة اجتماعات"}'::jsonb, 3) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('projector', '{"en":"Projector & screen","ar":"بروجكتر وشاشة"}'::jsonb, 4) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('sound', '{"en":"Sound system","ar":"نظام صوتي"}'::jsonb, 5) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('whiteboard', '{"en":"Whiteboard","ar":"سبورة"}'::jsonb, 6) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('coffee', '{"en":"Coffee & tea","ar":"قهوة وشاي"}'::jsonb, 7) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('catering', '{"en":"Catering","ar":"ضيافة"}'::jsonb, 8) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('parking', '{"en":"Free parking","ar":"موقف مجاني"}'::jsonb, 9) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('print', '{"en":"Printing","ar":"طباعة"}'::jsonb, 10) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('lockers', '{"en":"Lockers","ar":"خزائن"}'::jsonb, 11) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('access', '{"en":"Step-free access","ar":"مدخل بلا درج"}'::jsonb, 12) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('prayer', '{"en":"Prayer room","ar":"مصلّى"}'::jsonb, 13) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('ac', '{"en":"Climate control","ar":"تكييف"}'::jsonb, 14) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('open24', '{"en":"Open late","ar":"مفتوح حتى وقت متأخر"}'::jsonb, 15) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('outdoor', '{"en":"Outdoor seating","ar":"جلسات خارجية"}'::jsonb, 16) on conflict (key) do nothing;
insert into services (key, name, sort_order) values ('women', '{"en":"Women-only section","ar":"قسم للنساء"}'::jsonb, 17) on conflict (key) do nothing;

-- ── spaces ─────────────────────────────────────────────────────────────

-- Atlas Desk · Kuwait City
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'atlas-desk',
  (select id from categories where slug = 'offices'),
  (select id from districts  where slug = 'kuwait-city'),
  '{"en":"Atlas Desk","ar":"أطلس ديسك"}'::jsonb,
  '{"en":"A quiet floor above the city with fixed desks, three glass focus rooms and a rule the staff actually enforce: no calls at the desks. Chairs are proper task chairs, and the internet holds a video call at full load.","ar":"طابق هادئ يعلو المدينة، بمكاتب ثابتة وثلاث غرف تركيز زجاجية وقاعدة يطبّقها الفريق فعلاً: لا مكالمات على المكاتب. كراسي عمل حقيقية، وإنترنت يتحمّل مكالمة فيديو تحت الضغط."}'::jsonb,
  st_setsrid(st_makepoint(47.9926, 29.3789), 4326)::geography,
  12, 4.5, 11, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'atlas-desk'), key
  from unnest(array['wifi', 'power', 'quiet', 'meeting', 'coffee', 'print', 'parking', 'ac', 'prayer']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'atlas-desk'), d, '07:00:00'::time, '23:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'atlas-desk'), d, '09:00:00'::time, '11:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into offers (space_id, title) values (
  (select id from spaces where slug = 'atlas-desk'), '{"en":"20% off the first full day","ar":"خصم ٢٠٪ على أول يوم كامل"}'::jsonb);

-- North Study · Salmiya
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'north-study',
  (select id from categories where slug = 'offices'),
  (select id from districts  where slug = 'salmiya'),
  '{"en":"North Study","ar":"نورث ستدي"}'::jsonb,
  '{"en":"Built for the long study night. Individual carrels with their own lamp, a women-only reading room, lockers for anyone who leaves and comes back, and doors that stay open until midnight.","ar":"مصمّمة لليالي الدراسة الطويلة. طاولات فردية بإضاءة خاصة، قاعة قراءة للنساء، خزائن لمن يخرج ويعود، وأبواب تبقى مفتوحة حتى منتصف الليل."}'::jsonb,
  st_setsrid(st_makepoint(48.0754, 29.3339), 4326)::geography,
  8, 3, 12, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'north-study'), key
  from unnest(array['wifi', 'power', 'quiet', 'coffee', 'lockers', 'open24', 'ac', 'women']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'north-study'), d, '08:00:00'::time, '00:00:00'::time, true
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'north-study'), d, '17:00:00'::time, '21:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into offers (space_id, title) values (
  (select id from spaces where slug = 'north-study'), '{"en":"Student rate after 8pm","ar":"سعر الطلبة بعد الثامنة مساءً"}'::jsonb);

-- The Quiet Quarter · Jabriya
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'quiet-quarter',
  (select id from categories where slug = 'offices'),
  (select id from districts  where slug = 'jabriya'),
  '{"en":"The Quiet Quarter","ar":"الربع الهادئ"}'::jsonb,
  '{"en":"A converted villa: five private offices around a planted courtyard, each with a door that closes properly. Teams of two to six take it by the half-day.","ar":"فيلا مُعاد تصميمها: خمسة مكاتب خاصة حول فناء مزروع، لكلٍّ منها باب يُغلق كما ينبغي. تحجزها فرق من شخصين إلى ستة بنصف اليوم."}'::jsonb,
  st_setsrid(st_makepoint(48.0244, 29.3161), 4326)::geography,
  20, 5, 13, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'quiet-quarter'), key
  from unnest(array['wifi', 'power', 'quiet', 'meeting', 'whiteboard', 'coffee', 'parking', 'access', 'ac']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'quiet-quarter'), d, '08:00:00'::time, '20:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'quiet-quarter'), d, '11:00:00'::time, '14:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 6]) as d
on conflict do nothing;

-- Meridian Works · Sharq
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'meridian-works',
  (select id from categories where slug = 'offices'),
  (select id from districts  where slug = 'sharq'),
  '{"en":"Meridian Works","ar":"ميريديان ووركس"}'::jsonb,
  '{"en":"The largest floor on the platform, and the busiest at mid-morning. Come for the meeting rooms and the printing; the far corner by the sea windows stays quiet all day.","ar":"أكبر طابق على المنصة، وأكثرها ازدحاماً في منتصف الصباح. تأتي إليها لغرف الاجتماعات والطباعة؛ أما الركن البعيد قرب نوافذ البحر فيبقى هادئاً طوال اليوم."}'::jsonb,
  st_setsrid(st_makepoint(48.0006, 29.3797), 4326)::geography,
  40, 6, 14, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'meridian-works'), key
  from unnest(array['wifi', 'power', 'meeting', 'projector', 'coffee', 'print', 'parking', 'lockers', 'access', 'ac', 'prayer']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'meridian-works'), d, '07:00:00'::time, '22:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'meridian-works'), d, '09:00:00'::time, '12:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'meridian-works'), d, '14:00:00'::time, '16:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into offers (space_id, title) values (
  (select id from spaces where slug = 'meridian-works'), '{"en":"Free meeting-room hour with any day pass","ar":"ساعة مجانية بغرفة الاجتماعات مع أي تصريح يومي"}'::jsonb);

-- Cedar Room · Mishref
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'cedar-room',
  (select id from categories where slug = 'offices'),
  (select id from districts  where slug = 'mishref'),
  '{"en":"Cedar Room","ar":"غرفة الأرز"}'::jsonb,
  '{"en":"One small room, six seats, a single long oak table. It suits a pair of students or a founder who needs an afternoon without interruption.","ar":"غرفة صغيرة واحدة، ستة مقاعد، وطاولة بلوط طويلة. تناسب طالبين أو مؤسِّساً يحتاج بعد ظهيرة بلا مقاطعة."}'::jsonb,
  st_setsrid(st_makepoint(48.0631, 29.2703), 4326)::geography,
  6, 3.5, 15, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'cedar-room'), key
  from unnest(array['wifi', 'power', 'quiet', 'coffee', 'parking', 'ac', 'women']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'cedar-room'), d, '09:00:00'::time, '21:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'cedar-room'), d, '16:00:00'::time, '18:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;

-- Harbour Desk · Bneid Al-Gar
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'harbour-desk',
  (select id from categories where slug = 'offices'),
  (select id from districts  where slug = 'bneid-al-gar'),
  '{"en":"Harbour Desk","ar":"مكتب المرفأ"}'::jsonb,
  '{"en":"Sea-facing desks and a small terrace for the calls you would rather not take inside. Evenings fill up with graduate students.","ar":"مكاتب تطلّ على البحر وشرفة صغيرة للمكالمات التي تفضّل ألا تجريها في الداخل. تمتلئ أمسياتها بطلبة الدراسات العليا."}'::jsonb,
  st_setsrid(st_makepoint(48.0044, 29.3696), 4326)::geography,
  16, 3.8, 16, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'harbour-desk'), key
  from unnest(array['wifi', 'power', 'quiet', 'coffee', 'print', 'open24', 'outdoor', 'ac']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'harbour-desk'), d, '08:00:00'::time, '23:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'harbour-desk'), d, '19:00:00'::time, '22:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into offers (space_id, title) values (
  (select id from spaces where slug = 'harbour-desk'), '{"en":"Ten-day pass at the price of eight","ar":"تصريح عشرة أيام بسعر ثمانية"}'::jsonb);

-- Lumen Suite · Shuwaikh
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'lumen-suite',
  (select id from categories where slug = 'offices'),
  (select id from districts  where slug = 'shuwaikh'),
  '{"en":"Lumen Suite","ar":"جناح لومن"}'::jsonb,
  '{"en":"An industrial unit with high windows and very little decoration — the cheapest serious desk on the platform, and the brightest before noon.","ar":"وحدة صناعية بنوافذ عالية وزخرفة قليلة جداً — أرخص مكتب جادّ على المنصة، وأكثرها إضاءة قبل الظهر."}'::jsonb,
  st_setsrid(st_makepoint(47.9269, 29.3369), 4326)::geography,
  10, 2.8, 17, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'lumen-suite'), key
  from unnest(array['wifi', 'power', 'meeting', 'whiteboard', 'parking', 'print', 'ac']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'lumen-suite'), d, '08:00:00'::time, '18:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'lumen-suite'), d, '10:00:00'::time, '12:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 6]) as d
on conflict do nothing;

-- The Assembly · Kuwait City
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'assembly-hall',
  (select id from categories where slug = 'halls'),
  (select id from districts  where slug = 'kuwait-city'),
  '{"en":"The Assembly","ar":"قاعة الملتقى"}'::jsonb,
  '{"en":"A tiered hall for 120 with a proper sound desk, two wireless microphones and a screen you can read from the back row. Catering comes from the café downstairs.","ar":"قاعة مدرّجة تتّسع لـ١٢٠ شخصاً بطاولة صوت حقيقية وميكروفونين لاسلكيين وشاشة تُقرأ من الصف الأخير. الضيافة من المقهى في الطابق الأسفل."}'::jsonb,
  st_setsrid(st_makepoint(47.9878, 29.3811), 4326)::geography,
  120, 22, 21, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'assembly-hall'), key
  from unnest(array['wifi', 'power', 'projector', 'sound', 'whiteboard', 'catering', 'parking', 'access', 'ac', 'prayer']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'assembly-hall'), d, '08:00:00'::time, '22:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'assembly-hall'), d, '18:00:00'::time, '21:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into offers (space_id, title) values (
  (select id from spaces where slug = 'assembly-hall'), '{"en":"Weekday mornings 25% off","ar":"خصم ٢٥٪ صباحات أيام الأسبوع"}'::jsonb);

-- Workshop Loft · Al-Rai
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'workshop-loft',
  (select id from categories where slug = 'halls'),
  (select id from districts  where slug = 'al-rai'),
  '{"en":"Workshop Loft","ar":"لوفت الورش"}'::jsonb,
  '{"en":"Movable tables, four whiteboard walls and enough floor to break 45 people into groups. Trainers keep rebooking it for multi-week courses.","ar":"طاولات متحركة وأربعة جدران سبورة ومساحة تكفي لتقسيم ٤٥ شخصاً إلى مجموعات. يعيد المدربون حجزها لدورات تمتد أسابيع."}'::jsonb,
  st_setsrid(st_makepoint(47.9236, 29.3055), 4326)::geography,
  45, 12, 22, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'workshop-loft'), key
  from unnest(array['wifi', 'power', 'projector', 'whiteboard', 'coffee', 'catering', 'parking', 'ac']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'workshop-loft'), d, '09:00:00'::time, '21:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'workshop-loft'), d, '15:00:00'::time, '18:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into offers (space_id, title) values (
  (select id from spaces where slug = 'workshop-loft'), '{"en":"Third session free for course series","ar":"الجلسة الثالثة مجاناً لسلاسل الدورات"}'::jsonb);

-- Boardroom Nine · Sharq
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'boardroom-nine',
  (select id from categories where slug = 'halls'),
  (select id from districts  where slug = 'sharq'),
  '{"en":"Boardroom Nine","ar":"قاعة التسعة"}'::jsonb,
  '{"en":"Fourteen seats, one very good table, and a video-conference rig that connects on the first try. Companies use it for board days and client reviews.","ar":"أربعة عشر مقعداً وطاولة ممتازة ونظام اجتماعات مرئية يتصل من المحاولة الأولى. تستخدمها الشركات لأيام مجلس الإدارة ومراجعات العملاء."}'::jsonb,
  st_setsrid(st_makepoint(48.0031, 29.3768), 4326)::geography,
  14, 9, 23, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'boardroom-nine'), key
  from unnest(array['wifi', 'power', 'projector', 'sound', 'meeting', 'coffee', 'catering', 'parking', 'access', 'ac']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'boardroom-nine'), d, '08:00:00'::time, '20:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'boardroom-nine'), d, '10:00:00'::time, '13:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 6]) as d
on conflict do nothing;

-- Atrium Stage · Hawally
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'atrium-stage',
  (select id from categories where slug = 'halls'),
  (select id from districts  where slug = 'hawally'),
  '{"en":"Atrium Stage","ar":"منصة الأتريوم"}'::jsonb,
  '{"en":"The biggest room on the platform: a 200-seat atrium with a raised stage, house lighting and a loading door for anything you need to bring in.","ar":"أكبر قاعة على المنصة: أتريوم بمئتي مقعد ومسرح مرتفع وإضاءة ثابتة وباب تحميل لكل ما تحتاج إدخاله."}'::jsonb,
  st_setsrid(st_makepoint(48.0289, 29.3325), 4326)::geography,
  200, 30, 24, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'atrium-stage'), key
  from unnest(array['wifi', 'power', 'projector', 'sound', 'catering', 'parking', 'access', 'ac', 'prayer']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'atrium-stage'), d, '09:00:00'::time, '23:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'atrium-stage'), d, '19:00:00'::time, '22:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into offers (space_id, title) values (
  (select id from spaces where slug = 'atrium-stage'), '{"en":"Evening events include stage lighting","ar":"الفعاليات المسائية تشمل إضاءة المسرح"}'::jsonb);

-- Seminar Cube · Salmiya
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'seminar-cube',
  (select id from categories where slug = 'halls'),
  (select id from districts  where slug = 'salmiya'),
  '{"en":"Seminar Cube","ar":"مكعب الندوات"}'::jsonb,
  '{"en":"A square, acoustically treated room for thirty. No echo, no street noise, and a side room for the trainer to prepare in.","ar":"غرفة مربعة معالَجة صوتياً لثلاثين شخصاً. لا صدى ولا ضجيج شارع، مع غرفة جانبية يستعدّ فيها المدرب."}'::jsonb,
  st_setsrid(st_makepoint(48.0808, 29.3402), 4326)::geography,
  30, 10, 25, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'seminar-cube'), key
  from unnest(array['wifi', 'power', 'projector', 'sound', 'whiteboard', 'coffee', 'access', 'ac', 'women']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'seminar-cube'), d, '09:00:00'::time, '22:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'seminar-cube'), d, '17:00:00'::time, '20:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;

-- Olive Hall · Sabah Al-Salem
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'olive-hall',
  (select id from categories where slug = 'halls'),
  (select id from districts  where slug = 'sabah-al-salem'),
  '{"en":"Olive Hall","ar":"قاعة الزيتون"}'::jsonb,
  '{"en":"A warm hall for sixty with a separate women''s entrance and a kitchen that can actually feed the room. Popular for weekend courses.","ar":"قاعة دافئة لستين شخصاً بمدخل منفصل للنساء ومطبخ يستطيع إطعام القاعة فعلاً. مطلوبة لدورات نهاية الأسبوع."}'::jsonb,
  st_setsrid(st_makepoint(48.0631, 29.2586), 4326)::geography,
  60, 11, 26, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'olive-hall'), key
  from unnest(array['wifi', 'power', 'projector', 'sound', 'catering', 'parking', 'prayer', 'ac', 'women']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'olive-hall'), d, '10:00:00'::time, '22:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'olive-hall'), d, '18:00:00'::time, '21:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into offers (space_id, title) values (
  (select id from spaces where slug = 'olive-hall'), '{"en":"Catering package at cost for courses","ar":"باقة الضيافة بسعر التكلفة للدورات"}'::jsonb);

-- Blueprint Room · Shuwaikh
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'blueprint-room',
  (select id from categories where slug = 'halls'),
  (select id from districts  where slug = 'shuwaikh'),
  '{"en":"Blueprint Room","ar":"غرفة المخططات"}'::jsonb,
  '{"en":"A studio room with pin-up walls and a large-format printer next door — built for design reviews, engineering crits and anything that needs to go on a wall.","ar":"غرفة استوديو بجدران للتعليق وطابعة كبيرة الحجم في الغرفة المجاورة — مصمّمة لمراجعات التصميم والنقد الهندسي وكل ما يحتاج أن يُعلَّق."}'::jsonb,
  st_setsrid(st_makepoint(47.9311, 29.3423), 4326)::geography,
  25, 8.5, 27, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'blueprint-room'), key
  from unnest(array['wifi', 'power', 'projector', 'whiteboard', 'print', 'parking', 'coffee', 'ac']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'blueprint-room'), d, '08:00:00'::time, '19:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'blueprint-room'), d, '11:00:00'::time, '14:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 6]) as d
on conflict do nothing;

-- Sage & Salt · Salmiya
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'sage-and-salt',
  (select id from categories where slug = 'cafes'),
  (select id from districts  where slug = 'salmiya'),
  '{"en":"Sage & Salt","ar":"سيج آند سولت"}'::jsonb,
  '{"en":"The quietest café we know of that still makes good coffee. Long shared tables, sockets under every seat, and no music before noon.","ar":"أهدأ مقهى نعرفه ولا يزال يصنع قهوة جيدة. طاولات مشتركة طويلة، أفياش تحت كل مقعد، ولا موسيقى قبل الظهر."}'::jsonb,
  st_setsrid(st_makepoint(48.0699, 29.3376), 4326)::geography,
  34, null, 31, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'sage-and-salt'), key
  from unnest(array['wifi', 'power', 'quiet', 'coffee', 'outdoor', 'ac', 'women']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'sage-and-salt'), d, '07:00:00'::time, '23:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'sage-and-salt'), d, '16:00:00'::time, '19:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into offers (space_id, title) values (
  (select id from spaces where slug = 'sage-and-salt'), '{"en":"Second filter coffee free before 10am","ar":"قهوة الفلتر الثانية مجاناً قبل العاشرة صباحاً"}'::jsonb);

-- Paper Cup · Kuwait City
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'paper-cup',
  (select id from categories where slug = 'cafes'),
  (select id from districts  where slug = 'kuwait-city'),
  '{"en":"Paper Cup","ar":"بيبر كب"}'::jsonb,
  '{"en":"A commuter café that empties out after the morning rush and turns into a very good place to work from ten until four.","ar":"مقهى للمارّة يفرغ بعد زحمة الصباح فيتحوّل إلى مكان ممتاز للعمل من العاشرة حتى الرابعة."}'::jsonb,
  st_setsrid(st_makepoint(47.9895, 29.3742), 4326)::geography,
  28, null, 32, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'paper-cup'), key
  from unnest(array['wifi', 'power', 'coffee', 'print', 'access', 'ac']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'paper-cup'), d, '06:00:00'::time, '20:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'paper-cup'), d, '07:00:00'::time, '09:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'paper-cup'), d, '12:00:00'::time, '14:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;

-- The Reading Room · Jabriya
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'the-reading-room',
  (select id from categories where slug = 'cafes'),
  (select id from districts  where slug = 'jabriya'),
  '{"en":"The Reading Room","ar":"غرفة المطالعة"}'::jsonb,
  '{"en":"Half café, half library, with a strict quiet floor upstairs and a shelf of books nobody minds you reading. Students hold it until midnight.","ar":"نصفه مقهى ونصفه مكتبة، بطابق علوي هادئ بصرامة ورفّ كتب لا يمانع أحد أن تقرأها. يحتلّه الطلبة حتى منتصف الليل."}'::jsonb,
  st_setsrid(st_makepoint(48.0201, 29.3212), 4326)::geography,
  22, null, 33, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'the-reading-room'), key
  from unnest(array['wifi', 'power', 'quiet', 'coffee', 'open24', 'lockers', 'ac', 'women']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'the-reading-room'), d, '09:00:00'::time, '00:00:00'::time, true
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'the-reading-room'), d, '20:00:00'::time, '23:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into offers (space_id, title) values (
  (select id from spaces where slug = 'the-reading-room'), '{"en":"Free refill on any study session over three hours","ar":"إعادة تعبئة مجانية لأي جلسة دراسة تتجاوز ثلاث ساعات"}'::jsonb);

-- Dune Coffee · Mishref
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'dune-coffee',
  (select id from categories where slug = 'cafes'),
  (select id from districts  where slug = 'mishref'),
  '{"en":"Dune Coffee","ar":"دون كوفي"}'::jsonb,
  '{"en":"A large courtyard café where the outdoor tables stay usable most of the year. Bring headphones for the evening.","ar":"مقهى بفناء واسع تبقى طاولاته الخارجية صالحة معظم العام. أحضِر سمّاعاتك للمساء."}'::jsonb,
  st_setsrid(st_makepoint(48.0704, 29.2758), 4326)::geography,
  40, null, 34, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'dune-coffee'), key
  from unnest(array['wifi', 'power', 'coffee', 'outdoor', 'parking', 'ac']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'dune-coffee'), d, '08:00:00'::time, '23:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'dune-coffee'), d, '17:00:00'::time, '20:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;

-- Linen Espresso · Salwa
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'linen-espresso',
  (select id from categories where slug = 'cafes'),
  (select id from districts  where slug = 'salwa'),
  '{"en":"Linen Espresso","ar":"لينن إسبريسو"}'::jsonb,
  '{"en":"Eighteen seats, white walls, one espresso machine and nothing else competing for your attention.","ar":"ثمانية عشر مقعداً، جدران بيضاء، آلة إسبريسو واحدة، ولا شيء آخر ينافسك على انتباهك."}'::jsonb,
  st_setsrid(st_makepoint(48.0742, 29.2905), 4326)::geography,
  18, null, 35, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'linen-espresso'), key
  from unnest(array['wifi', 'power', 'quiet', 'coffee', 'access', 'ac']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'linen-espresso'), d, '07:00:00'::time, '19:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'linen-espresso'), d, '08:00:00'::time, '10:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 6]) as d
on conflict do nothing;
insert into offers (space_id, title) values (
  (select id from spaces where slug = 'linen-espresso'), '{"en":"Breakfast and a flat white for two dinars","ar":"فطور وفلات وايت بدينارين"}'::jsonb);

-- Garden & Grain · Fintas
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'garden-and-grain',
  (select id from categories where slug = 'cafes'),
  (select id from districts  where slug = 'fintas'),
  '{"en":"Garden & Grain","ar":"حديقة وحَب"}'::jsonb,
  '{"en":"A planted café away from the traffic, with a covered garden section that works well for a long, unhurried afternoon.","ar":"مقهى مزروع بعيداً عن الزحام، بقسم حديقة مغطّى يناسب بعد ظهيرة طويلة بلا استعجال."}'::jsonb,
  st_setsrid(st_makepoint(48.1211, 29.1748), 4326)::geography,
  30, null, 36, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'garden-and-grain'), key
  from unnest(array['wifi', 'power', 'coffee', 'outdoor', 'parking', 'prayer', 'ac', 'women']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'garden-and-grain'), d, '08:00:00'::time, '22:00:00'::time, false
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'garden-and-grain'), d, '18:00:00'::time, '21:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;

-- Nocturne · Hawally
insert into spaces (slug, category_id, district_id, name, description, location,
                    capacity, price_per_hour, render_seed, status) values (
  'nocturne',
  (select id from categories where slug = 'cafes'),
  (select id from districts  where slug = 'hawally'),
  '{"en":"Nocturne","ar":"نوكتيرن"}'::jsonb,
  '{"en":"Opens in the afternoon and closes at two in the morning. For people whose best hours arrive after everyone else has gone home.","ar":"يفتح بعد الظهر ويغلق في الثانية فجراً. لمن تأتيهم أفضل ساعاتهم بعد أن يعود الجميع إلى بيوتهم."}'::jsonb,
  st_setsrid(st_makepoint(48.0245, 29.3378), 4326)::geography,
  26, null, 37, 'published')
on conflict (slug) do nothing;
insert into space_services (space_id, service_key)
select (select id from spaces where slug = 'nocturne'), key
  from unnest(array['wifi', 'power', 'coffee', 'open24', 'quiet', 'ac']) as key
on conflict do nothing;
insert into space_hours (space_id, weekday, opens, closes, closes_next_day)
select (select id from spaces where slug = 'nocturne'), d, '16:00:00'::time, '02:00:00'::time, true
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into space_busy_windows (space_id, weekday, starts, ends)
select (select id from spaces where slug = 'nocturne'), d, '21:00:00'::time, '00:00:00'::time
  from unnest(array[0, 1, 2, 3, 4, 5, 6]) as d
on conflict do nothing;
insert into offers (space_id, title) values (
  (select id from spaces where slug = 'nocturne'), '{"en":"Night rate: free refills after 11pm","ar":"تعرفة الليل: إعادة تعبئة مجانية بعد الحادية عشرة"}'::jsonb);

commit;
