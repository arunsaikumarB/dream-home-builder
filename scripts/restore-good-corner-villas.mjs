/**
 * Restore good NJ villa cutouts only.
 * - Skip faded villa-4 / villa-5
 * - No repeated cutouts across panels
 * - Intro panel: top corners only (avoid covering copy)
 */
import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

// Clear any existing corner layers
html = html.replace(/<div class="dhb-corner-villas"[\s\S]*?<\/div>\s*/g, '')

function corners(items) {
  // items: [{cls, src}, ...]
  const imgs = items
    .map(
      ({ cls, src }) =>
        `  <img class="${cls}" src="${src}" alt="" loading="lazy" decoding="async" />`,
    )
    .join('\n')
  return `<div class="dhb-corner-villas" aria-hidden="true">\n${imgs}\n</div>`
}

// Panel 1 — New Jersey Homes: 4 unique good cutouts
const infoCorners = corners([
  { cls: 'is-tl', src: '/images/villas/villa-1.png' },
  { cls: 'is-tr', src: '/images/villas/villa-2.png' },
  { cls: 'is-bl', src: '/images/villas/villa-3.png' },
  { cls: 'is-br', src: '/images/villas/villa-6.png' },
])

// Panel 2 — intro: top corners only (villa-7, villa-8) — no bottom overlap on copy
const introCorners = corners([
  { cls: 'is-tl', src: '/images/villas/villa-7.png' },
  { cls: 'is-tr', src: '/images/villas/villa-8.png' },
])

// Panel 3 — path: no cutouts (would force repeats of the good set)

function injectAfterOpen(className, block) {
  const needle = `class="${className}"`
  const i = html.indexOf(needle)
  if (i < 0) {
    console.error('missing', className)
    process.exit(1)
  }
  const gt = html.indexOf('>', i)
  html = html.slice(0, gt + 1) + block + html.slice(gt + 1)
}

injectAfterOpen('loc-info-w', infoCorners)
injectAfterOpen('loc-intro-w', introCorners)

const css = `<style id="dhb-villas-css">
  /* Good NJ villa cutouts in corners — no faded assets, no repeats */
  .container.loc,
  .loc-scroll-area,
  .loc-info-w,
  .loc-intro-w,
  .loc-path-w {
    color: #063670;
  }
  .loc-info-w,
  .loc-intro-w,
  .loc-path-w {
    position: relative;
    overflow: hidden;
  }
  .loc-info-s,
  .loc-intro-s,
  .loc-path-s {
    position: relative;
    z-index: 3;
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
  .loc-path-s .a2 {
    color: #B88734 !important;
  }
  .flower video,
  .dhb-villa-rail,
  .flower.dhb-villa-wrap,
  .loc-path-w_flower,
  .loc-info-s .s_logo,
  .dhb-nj-homes {
    display: none !important;
  }

  .dhb-corner-villas {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }
  .dhb-corner-villas img {
    position: absolute;
    width: min(24vw, 17.5rem);
    height: auto;
    max-height: 38vh;
    object-fit: contain;
    background: transparent !important;
    filter: drop-shadow(0 12px 22px rgba(6, 54, 112, 0.14));
  }
  .dhb-corner-villas .is-tl {
    top: 4%;
    left: 1.25%;
  }
  .dhb-corner-villas .is-tr {
    top: 4%;
    right: 1.25%;
  }
  .dhb-corner-villas .is-bl {
    bottom: 4%;
    left: 1.25%;
  }
  .dhb-corner-villas .is-br {
    bottom: 4%;
    right: 1.25%;
  }

  .loc-info-s .info-s_lead,
  .loc-info-s .info-s_desc {
    max-width: min(42rem, 50vw);
    margin-left: auto;
    margin-right: auto;
    position: relative;
    z-index: 4;
  }

  /* Intro: keep top villas smaller so they don't fight the layout */
  .loc-intro-w .dhb-corner-villas img {
    width: min(22vw, 15rem);
    max-height: 32vh;
  }

  @media (max-width: 991px) {
    .dhb-corner-villas img {
      width: min(32vw, 9rem);
      max-height: 26vh;
    }
  }
  @media (max-width: 640px) {
    .dhb-corner-villas img {
      width: min(36vw, 6.75rem);
      max-height: 20vh;
    }
  }
</style>`

if (html.includes('id="dhb-villas-css"')) {
  html = html.replace(/<style id="dhb-villas-css">[\s\S]*?<\/style>/, css)
} else {
  html = html.replace('</head>', `${css}</head>`)
}

const used = [...html.matchAll(/\/images\/villas\/(villa-\d+\.png)/g)].map((m) => m[1])
const unique = new Set(used)
const divDiff =
  (html.match(/<div\b/g) || []).length - (html.match(/<\/div>/g) || []).length

fs.writeFileSync(path, html)
console.log({
  divDiff,
  panels: (html.match(/class="dhb-corner-villas"/g) || []).length,
  used,
  uniqueCount: unique.size,
  hasRepeats: used.length !== unique.size,
  fadedExcluded: !used.includes('villa-4.png') && !used.includes('villa-5.png'),
})
