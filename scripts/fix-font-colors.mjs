import fs from 'node:fs'
import path from 'node:path'

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, files)
    else if (e.name.endsWith('.html')) files.push(p)
  }
  return files
}

const GOLD_DARK = '#B88734'
const GOLD_LIGHT = '#E8BC5E'
const GOLD_BRONZE = '#7D5724'
const BLUE_NAVY = '#063670'
const BLUE_ROYAL = '#0F5E9A'
const CREAM = '#f3f3ec'
// Light tint of royal blue — keeps navy text readable on brand sections
const SKY_LIGHT = '#D9E8F4'

const themeCss = `<style id="dhb-theme-css">
  /* Dream Home Builder brand theme + readable font colors */
  :root {
    --_global-colors---brand-500--velvet-plum: ${GOLD_DARK};
    --_global-colors---brand-500--blush-bloom: ${GOLD_LIGHT};
    /* Keep powder-sky LIGHT so navy text stays readable on brand sections */
    --_global-colors---brand-500--powder-sky: ${SKY_LIGHT};

    --_global-colors---base-1000--100: ${BLUE_NAVY};
    --_global-colors---base-1000--60: ${BLUE_NAVY}99;
    --_global-colors---base-1000--30: ${BLUE_NAVY}4d;
    --_global-colors---base-1000--10: ${BLUE_NAVY}1a;
    --_global-colors---base-1000--5: ${BLUE_NAVY}0d;
    --_global-colors---base-1000--0: ${BLUE_NAVY}00;

    --dhb-gold: ${GOLD_DARK};
    --dhb-gold-light: ${GOLD_LIGHT};
    --dhb-bronze: ${GOLD_BRONZE};
    --dhb-navy: ${BLUE_NAVY};
    --dhb-royal: ${BLUE_ROYAL};
    --dhb-cream: ${CREAM};
  }

  /* ===== Theme text / background contrast locks ===== */

  /* Cream page + navy type */
  .theme_on-light,
  [data-bg="light"] {
    color: ${BLUE_NAVY};
    --_colors---base-1000--primary: ${BLUE_NAVY};
    --_colors---other--bg: ${CREAM};
    --_colors---base-1000--gray-text: ${BLUE_NAVY}99;
  }

  /* Soft sky brand panels + navy type */
  .theme_on-brand,
  [data-bg="brand"] {
    color: ${BLUE_NAVY};
    --_colors---base-1000--primary: ${BLUE_NAVY};
    --_colors---other--bg: ${SKY_LIGHT};
    --_colors---base-1000--gray-text: ${BLUE_NAVY}99;
  }

  /* Gold sections + cream type */
  .theme_on-color,
  [data-bg="color"] {
    color: ${CREAM};
    --_colors---base-1000--primary: ${CREAM};
    --_colors---other--bg: ${GOLD_DARK};
    --_colors---base-1000--gray-text: ${CREAM}cc;
    --_colors---base-0--primary: ${BLUE_NAVY};
  }

  /* Bronze / dark panels + cream type */
  .theme_on-dark,
  [data-bg="dark"] {
    color: ${CREAM};
    --_colors---base-1000--primary: ${CREAM};
    --_colors---other--bg: ${GOLD_BRONZE};
    --_colors---base-1000--gray-text: ${CREAM}b3;
    --_colors---base-0--primary: ${BLUE_NAVY};
  }

  /* Headings / body inherit theme text color */
  .theme_on-light h1, .theme_on-light h2, .theme_on-light h3,
  .theme_on-light h4, .theme_on-light h5, .theme_on-light p,
  .theme_on-light .l1, .theme_on-light .l2, .theme_on-light .p1,
  .theme_on-light .h1, .theme_on-light .h2, .theme_on-light .h5,
  [data-bg="light"] h1, [data-bg="light"] h2, [data-bg="light"] h3,
  [data-bg="light"] h4, [data-bg="light"] h5, [data-bg="light"] p,
  [data-bg="light"] .l1, [data-bg="light"] .p1, [data-bg="light"] .h1 {
    color: inherit;
  }

  .theme_on-brand h1, .theme_on-brand h2, .theme_on-brand h3,
  .theme_on-brand h4, .theme_on-brand h5, .theme_on-brand p,
  .theme_on-brand .l1, .theme_on-brand .l2, .theme_on-brand .p1,
  .theme_on-brand .h1, .theme_on-brand .h2, .theme_on-brand .h5 {
    color: inherit;
  }

  .theme_on-color h1, .theme_on-color h2, .theme_on-color h3,
  .theme_on-color h4, .theme_on-color h5, .theme_on-color p,
  .theme_on-color .l1, .theme_on-color .l2, .theme_on-color .p1,
  .theme_on-color .h1, .theme_on-color .h2, .theme_on-color .h5,
  .theme_on-color a,
  [data-bg="color"] h1, [data-bg="color"] h2, [data-bg="color"] h3,
  [data-bg="color"] p, [data-bg="color"] .l1, [data-bg="color"] .p1,
  [data-bg="color"] .h1, [data-bg="color"] a {
    color: inherit;
  }

  .theme_on-dark h1, .theme_on-dark h2, .theme_on-dark h3,
  .theme_on-dark h4, .theme_on-dark h5, .theme_on-dark p,
  .theme_on-dark .l1, .theme_on-dark .l2, .theme_on-dark .p1,
  .theme_on-dark .h1, .theme_on-dark .h2, .theme_on-dark .h5,
  .theme_on-dark a,
  [data-bg="dark"] h1, [data-bg="dark"] h2, [data-bg="dark"] h3,
  [data-bg="dark"] p, [data-bg="dark"] .l1, [data-bg="dark"] .p1,
  [data-bg="dark"] .h1, [data-bg="dark"] a {
    color: inherit;
  }

  /* DHB custom sections */
  .dhb-block.theme_on-brand,
  .dhb-block.theme_on-light,
  #services, #contact {
    color: ${BLUE_NAVY};
  }
  .dhb-block.theme_on-color,
  #inspired, #quote {
    color: ${CREAM};
  }
  .dhb-block.theme_on-dark,
  #testimonials {
    color: ${CREAM};
  }

  .dhb-head p,
  .dhb-service p,
  .dhb-testimonial .who,
  .dhb-panel > .p1 {
    opacity: 0.82;
  }

  /* Floating tip cards — always navy on cream */
  .floating-tip-card,
  .floating-tip-card h1,
  .floating-tip-card p {
    color: ${BLUE_NAVY} !important;
  }

  /* Top nav — navy on white */
  .dhb-topnav a:not(.dhb-topnav-logo):not(.is-cta) {
    color: ${BLUE_NAVY} !important;
  }
  .dhb-topnav a.is-cta,
  .dhb-mob-nav .dhb-mob-cta,
  .header-nav_list.f-desk .dhb-nav-cta .l1 {
    color: ${GOLD_DARK} !important;
  }
  .dhb-topnav a.is-cta:hover {
    color: ${GOLD_BRONZE} !important;
  }

  /* Forms on gold quote panel stay cream */
  #quote,
  #quote .dhb-panel,
  #quote .dhb-meta,
  #quote .dhb-meta a,
  #quote .dhb-form {
    color: ${CREAM} !important;
  }

  /* Accent line */
  .red-line {
    background: ${GOLD_DARK} !important;
  }

  /* Preloader / menus on dark gold */
  .preloader,
  .master-preloader,
  .modal.menu {
    color: ${CREAM};
  }
</style>`

let updated = 0
for (const file of walk('public')) {
  let html = fs.readFileSync(file, 'utf8')
  const before = html

  if (html.includes('id="dhb-theme-css"')) {
    html = html.replace(/<style id="dhb-theme-css">[\s\S]*?<\/style>/, themeCss)
  } else if (html.includes('</head>')) {
    html = html.replace('</head>', `${themeCss}</head>`)
  }

  // Tip card bg residual old navy alpha
  html = html.replaceAll('rgba(23, 35, 59, 0.06)', 'rgba(6, 54, 112, 0.06)')
  html = html.replaceAll('rgba(23, 35, 59, 0.08)', 'rgba(6, 54, 112, 0.08)')

  if (html !== before) {
    fs.writeFileSync(file, html)
    updated++
    console.log('updated', path.relative('public', file))
  }
}

const idx = fs.readFileSync('public/index.html', 'utf8')
console.log('files', updated)
console.log('sky light', idx.includes(SKY_LIGHT))
console.log('contrast locks', idx.includes('Theme text / background contrast'))
console.log('floating tip navy', idx.includes(`.floating-tip-card h1`))
