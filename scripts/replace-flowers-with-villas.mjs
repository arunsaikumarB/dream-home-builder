import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

function villaDecor(src, alt, extraClass = '') {
  return `<div class="dhb-villa ${extraClass}"><img src="${src}" alt="${alt}" loading="eager" decoding="async" /></div>`
}

const villas = {
  info: villaDecor('/images/villas/villa-1.png', 'New Jersey custom villa', 'is-info'),
  intro: villaDecor('/images/villas/villa-4.png', 'New Jersey luxury home', 'is-intro'),
  path: villaDecor('/images/villas/villa-2.png', 'New Jersey modern residence', 'is-path'),
}

// Replace each flower video block with villa cutout
const flowerPatterns = [
  [
    /<div data-parallax="ctn-down" class="flower loc-info"><video[\s\S]*?<\/video><\/div>/,
    `<div data-parallax="ctn-down" class="flower loc-info dhb-villa-wrap">${villas.info}</div>`,
  ],
  [
    /<div class="flower loc-intro"><video[\s\S]*?<\/video><\/div>/,
    `<div class="flower loc-intro dhb-villa-wrap">${villas.intro}</div>`,
  ],
  [
    /<div class="loc-path-w_flower"><div class="flower loc-path"><video[\s\S]*?<\/video><\/div><\/div>/,
    `<div class="loc-path-w_flower"><div class="flower loc-path dhb-villa-wrap">${villas.path}</div></div>`,
  ],
]

for (const [re, rep] of flowerPatterns) {
  if (!re.test(html)) {
    console.error('MISSING flower pattern', String(re).slice(0, 60))
    process.exit(1)
  }
  html = html.replace(re, rep)
  console.log('replaced flower block')
}

// Soften / update portfolio intro copy slightly for NJ homes section feel
html = html.replace(
  '>A living gallery of custom homes, renovations and interiors — crafted around privacy, quality and timeless New Jersey living<',
  '>New Jersey villas and custom homes — crafted around privacy, quality and timeless living<',
)

const css = `<style id="dhb-villas-css">
  /* Replace Era flowers with transparent NJ villa cutouts */
  .dhb-villa-wrap,
  .flower.dhb-villa-wrap {
    pointer-events: none;
    z-index: 2;
  }
  .dhb-villa {
    width: min(34vw, 28rem);
    max-width: 420px;
    line-height: 0;
    filter: drop-shadow(0 18px 28px rgba(6, 54, 112, 0.18));
  }
  .dhb-villa img {
    width: 100%;
    height: auto;
    display: block;
    background: transparent !important;
    object-fit: contain;
  }
  .dhb-villa.is-info { width: min(38vw, 30rem); }
  .dhb-villa.is-intro { width: min(32vw, 26rem); }
  .dhb-villa.is-path { width: min(36vw, 28rem); }

  /* Portfolio / location scroll section restyle */
  .container.loc,
  .loc-scroll-area,
  .loc-info-w,
  .loc-intro-w,
  .loc-path-w {
    color: #063670;
  }
  .loc-info-s .l1,
  .loc-info-s .h4,
  .loc-info-s .p1,
  .loc-info-s .h1,
  .loc-intro-s .h1,
  .loc-intro-s .c1,
  .loc-intro-s .p1,
  .loc-intro-s .l1,
  .loc-path-s .h3,
  .loc-path-s .a2,
  .loc-path-s .l1 {
    color: #063670 !important;
  }
  .loc-info-s .h4,
  .loc-path-s .h3 {
    color: #063670 !important;
  }
  .loc-path-s .a2 {
    color: #B88734 !important;
  }

  /* Hide leftover flower video chrome if any */
  .flower video { display: none !important; }

  @media (max-width: 991px) {
    .dhb-villa {
      width: min(55vw, 16rem);
      max-width: 240px;
    }
  }
</style>`

if (html.includes('id="dhb-villas-css"')) {
  html = html.replace(/<style id="dhb-villas-css">[\s\S]*?<\/style>/, css)
} else {
  html = html.replace('</head>', `${css}</head>`)
}

// Extra villa accents inside the portfolio text panel for fuller section change
if (!html.includes('dhb-villa-rail')) {
  html = html.replace(
    '<div class="s_title"><h2 data-part="p" class="l1 a-center">Portfolio</h2></div>',
    `<div class="s_title"><h2 data-part="p" class="l1 a-center">New Jersey Homes</h2></div>
<div class="dhb-villa-rail" aria-hidden="true">
  <img src="/images/villas/villa-3.png" alt="" loading="lazy" />
  <img src="/images/villas/villa-5.png" alt="" loading="lazy" />
</div>`,
  )
}

const railCss = `
  .dhb-villa-rail {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin: 2rem auto 0;
    max-width: 40rem;
    align-items: flex-end;
  }
  .dhb-villa-rail img {
    width: 42%;
    height: auto;
    background: transparent;
    filter: drop-shadow(0 12px 20px rgba(6, 54, 112, 0.16));
  }
`

html = html.replace(
  /<style id="dhb-villas-css">([\s\S]*?)<\/style>/,
  (m, body) => {
    if (body.includes('dhb-villa-rail')) return m
    return `<style id="dhb-villas-css">${body}${railCss}</style>`
  },
)

fs.writeFileSync(path, html)

console.log('bougainvillea left', (html.match(/bougainvillea/g) || []).length)
console.log('villa imgs', (html.match(/\/images\/villas\//g) || []).length)
console.log('css', html.includes('dhb-villas-css'))
console.log('New Jersey Homes', html.includes('New Jersey Homes'))
console.log(
  'div diff',
  (html.match(/<div\b/g) || []).length - (html.match(/<\/div>/g) || []).length,
)
