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

const themeCss = `<style id="dhb-theme-css">
  /* Dream Home Builder brand theme overrides */
  :root {
    /* Purple (velvet plum) → Gold */
    --_global-colors---brand-500--velvet-plum: ${GOLD_DARK};
    /* Soft pink accent → Light Gold */
    --_global-colors---brand-500--blush-bloom: ${GOLD_LIGHT};
    /* Powder sky → Medium Royal Blue */
    --_global-colors---brand-500--powder-sky: ${BLUE_ROYAL};

    /* Blue / ink → Dark Navy Blue (+ alpha steps) */
    --_global-colors---base-1000--100: ${BLUE_NAVY};
    --_global-colors---base-1000--60: ${BLUE_NAVY}99;
    --_global-colors---base-1000--30: ${BLUE_NAVY}4d;
    --_global-colors---base-1000--10: ${BLUE_NAVY}1a;
    --_global-colors---base-1000--5: ${BLUE_NAVY}0d;
    --_global-colors---base-1000--0: ${BLUE_NAVY}00;

    /* App tokens */
    --dhb-gold: ${GOLD_DARK};
    --dhb-gold-light: ${GOLD_LIGHT};
    --dhb-bronze: ${GOLD_BRONZE};
    --dhb-navy: ${BLUE_NAVY};
    --dhb-royal: ${BLUE_ROYAL};
  }

  /* Darker gold for deep panels / footer feel */
  .theme_on-dark {
    --_colors---other--bg: ${GOLD_BRONZE};
  }
  .theme_on-color {
    --_colors---other--bg: ${GOLD_DARK};
  }

  /* Nav / CTA accents → gold */
  .dhb-topnav a.is-cta,
  .dhb-mob-nav .dhb-mob-cta,
  .header-nav_list.f-desk .dhb-nav-cta .l1 {
    color: ${GOLD_DARK} !important;
  }
  .dhb-topnav a.is-cta:hover {
    color: ${GOLD_BRONZE} !important;
  }

  /* Red lines / brand accents that read purple-ish on color themes */
  .red-line {
    background: ${GOLD_DARK} !important;
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

  // Hardcoded navy leftovers in our custom CSS blocks
  html = html.replaceAll('#17233b', BLUE_NAVY)
  html = html.replaceAll('#c4a035', GOLD_DARK)
  html = html.replaceAll('#a88720', GOLD_BRONZE)

  if (html !== before) {
    fs.writeFileSync(file, html)
    updated++
    console.log('updated', path.relative('public', file))
  }
}

const idx = fs.readFileSync('public/index.html', 'utf8')
console.log('files', updated)
console.log('theme css', idx.includes('dhb-theme-css'))
console.log('gold dark', idx.includes(GOLD_DARK))
console.log('navy', idx.includes(BLUE_NAVY))
console.log('old plum hardcode', idx.includes('#340c24'))
console.log('old navy hardcode', idx.includes('#17233b'))
