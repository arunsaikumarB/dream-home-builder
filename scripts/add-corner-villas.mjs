/**
 * Corner NJ villa cutouts for the whole loc-scroll section.
 * Removes center gallery; places transparent houses in corners only.
 */
import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

function corners(imgs) {
  const [tl, tr, bl, br] = imgs
  return `<div class="dhb-corner-villas" aria-hidden="true">
  <img class="is-tl" src="${tl}" alt="" loading="lazy" decoding="async" />
  <img class="is-tr" src="${tr}" alt="" loading="lazy" decoding="async" />
  <img class="is-bl" src="${bl}" alt="" loading="lazy" decoding="async" />
  <img class="is-br" src="${br}" alt="" loading="lazy" decoding="async" />
</div>`
}

const infoCorners = corners([
  '/images/villas/villa-1.png',
  '/images/villas/villa-2.png',
  '/images/villas/villa-3.png',
  '/images/villas/villa-4.png',
])
const introCorners = corners([
  '/images/villas/villa-5.png',
  '/images/villas/villa-6.png',
  '/images/villas/villa-7.png',
  '/images/villas/villa-8.png',
])
const pathCorners = corners([
  '/images/villas/villa-2.png',
  '/images/villas/villa-4.png',
  '/images/villas/villa-1.png',
  '/images/villas/villa-6.png',
])

// Remove center gallery
html = html.replace(/\n?<div class="dhb-nj-homes"[\s\S]*?<\/div>\n?/g, '\n')
html = html.replace(/<style id="dhb-nj-homes-css">[\s\S]*?<\/style>/g, '')

// Remove any previous corner layers
html = html.replace(/<div class="dhb-corner-villas"[\s\S]*?<\/div>\n?/g, '')

// Inject corners as first child inside each panel wrapper
function injectCorners(className, block) {
  const needle = `class="${className}"`
  const i = html.indexOf(needle)
  if (i < 0) {
    console.error('missing', className)
    process.exit(1)
  }
  const gt = html.indexOf('>', i)
  html = html.slice(0, gt + 1) + block + html.slice(gt + 1)
}

injectCorners('loc-info-w', infoCorners)
injectCorners('loc-intro-w', introCorners)
injectCorners('loc-path-w', pathCorners)

const css = `<style id="dhb-villas-css">
  /* NJ Homes scroll section — transparent villa cutouts in corners */
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
    width: min(26vw, 19rem);
    height: auto;
    max-height: 42vh;
    object-fit: contain;
    background: transparent !important;
    filter: drop-shadow(0 14px 26px rgba(6, 54, 112, 0.16));
  }
  .dhb-corner-villas .is-tl {
    top: 3%;
    left: 1.5%;
  }
  .dhb-corner-villas .is-tr {
    top: 3%;
    right: 1.5%;
  }
  .dhb-corner-villas .is-bl {
    bottom: 3%;
    left: 1.5%;
  }
  .dhb-corner-villas .is-br {
    bottom: 3%;
    right: 1.5%;
  }

  /* Keep copy clear in the middle */
  .loc-info-s .info-s_lead,
  .loc-info-s .info-s_desc,
  .loc-info-s .s_title {
    position: relative;
    z-index: 4;
  }
  .loc-info-s .info-s_lead,
  .loc-info-s .info-s_desc {
    max-width: min(44rem, 52vw);
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 991px) {
    .dhb-corner-villas img {
      width: min(34vw, 9.5rem);
      max-height: 28vh;
    }
  }
  @media (max-width: 640px) {
    .dhb-corner-villas img {
      width: min(38vw, 7.25rem);
      max-height: 22vh;
    }
    .dhb-corner-villas .is-tl,
    .dhb-corner-villas .is-tr {
      top: 2%;
    }
    .dhb-corner-villas .is-bl,
    .dhb-corner-villas .is-br {
      bottom: 2%;
    }
  }
</style>`

if (html.includes('id="dhb-villas-css"')) {
  html = html.replace(/<style id="dhb-villas-css">[\s\S]*?<\/style>/, css)
} else {
  html = html.replace('</head>', `${css}</head>`)
}

const divDiff =
  (html.match(/<div\b/g) || []).length - (html.match(/<\/div>/g) || []).length

fs.writeFileSync(path, html)
console.log({
  divDiff,
  corners: (html.match(/dhb-corner-villas/g) || []).length,
  centerGone: !html.includes('class="dhb-nj-homes"'),
  centerCssGone: !html.includes('dhb-nj-homes-css'),
})
