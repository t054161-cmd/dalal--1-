/* ═══════════════════════════════════════════════════════════════════════
   CONFIG — edit these values, nothing else needs to change.
   ═══════════════════════════════════════════════════════════════════════ */
window.DAL = window.DAL || {};

DAL.CONFIG = {
  name: 'Dalal Al-Mutairi',

  /* Contact ---------------------------------------------------------- */
  phone:        '94445352',
  phoneIntl:    '+96594445352',      // used for the tel: link

  // ↓↓↓  Replace with Dalal's preferred public email address if different.
  email:        't054161@coded.edu.kw',

  mailSubject:  'Hello Dalal — from your portfolio',
  mailBody:     "Hi Dalal,\n\nI came across your portfolio and wanted to get in touch about\n",

  /* Profiles --------------------------------------------------------- */
  // ↓↓↓  Replace the two URLs below with the real profile links.
  linkedin:     'https://www.linkedin.com/',
  github:       'https://github.com/',

  /* CV --------------------------------------------------------------- */
  // Points at the built-in CV page. Swap for 'assets/Dalal-Al-Mutairi-CV.pdf'
  // once a PDF is added to /assets.
  cv:           'cv.html',

  /* Coded terminal typing lines -------------------------------------- */
  codedLines: [
    'python analyse.py --frame office-tower --code ACI-318',
    'git commit -m "add load-combination solver"',
    'claude "review my beam deflection check"',
    'npm run build  # Focus Space',
    'staad export --model tower.std --report pdf'
  ]
};

/* Camera choreography — one keyframe per page (0=Home, 1=Work, 2=Contact).
   pos = camera position, tgt = look-at target, fov = field of view.       */
DAL.KEYFRAMES = [
  { pos: [ 0.00, 1.85,  7.40], tgt: [ 0.00, 1.55,  0.00], fov: 54, roll:  0.000 },
  { pos: [ 7.60, 5.40,  7.30], tgt: [ 0.40, 0.55, -1.60], fov: 46, roll: -0.030 },
  { pos: [-6.70, 3.20,  6.50], tgt: [-0.40, 0.95, -2.90], fov: 41, roll:  0.024 }
];
