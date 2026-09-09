/* ═══════════════════════════════════════════════════════════════════════
   CONFIG — brand constants. Edit here, nothing else needs to change.
   ═══════════════════════════════════════════════════════════════════════ */
window.FS = window.FS || {};

FS.CONFIG = {
  brand:      'FOCUS SPACE',
  sloganAr:   'مرفأ روّاد الإنجاز',

  email:      't054161@coded.edu.kw',
  phone:      '94445352',
  phoneIntl:  '+96594445352',

  /* City fallback for the map link + the "spaces near" copy. */
  city: { en: 'Kuwait', ar: 'الكويت', lat: 29.3759, lng: 47.9774 },

  /* localStorage namespace */
  ns: 'focus-space:v1',

  /* Supabase. The publishable key is meant to be in the browser — every
     table is behind row level security, so it grants exactly what an
     anonymous visitor is allowed: reading published spaces and writing a
     contact message. Leave url empty to run the site with no accounts. */
  supabase: {
    url: 'https://ojixptqwxlxkmkowxkdy.supabase.co',
    key: 'sb_publishable_50EtOSAfQv1lfkqLw6bAFQ_Bgd2HtHd'
  },

  /* Palette — mirrored in css/focus.css. Used by the 3D hero. */
  palette: {
    sage900: '#2E3A31',
    sage700: '#4C6152',
    sage500: '#7C9382',
    sage300: '#A9BDAE',
    sage100: '#DCE5DB',
    sand:    '#D8C6AE',
    sandDeep:'#B79E7E',
    cloud:   '#EDF0EE',
    cloudDeep:'#CFD6D3',
    vanilla: '#F5EFE1',
    vanillaDeep: '#EADFC6',
    ink:     '#232A24'
  }
};
