import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

const before = (html.match(/class="dhb-corner-villas"/g) || []).length

// Remove corner villa layers only
html = html.replace(/<div class="dhb-corner-villas"[\s\S]*?<\/div>\s*/g, '')

// Update CSS: hide any leftover corner villas; keep section text colors
const css = `<style id="dhb-villas-css">
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
  .loc-path-s .a2 {
    color: #B88734 !important;
  }
  .flower video,
  .dhb-villa-rail,
  .flower.dhb-villa-wrap,
  .loc-path-w_flower,
  .loc-info-s .s_logo,
  .dhb-nj-homes,
  .dhb-corner-villas {
    display: none !important;
  }
</style>`

if (html.includes('id="dhb-villas-css"')) {
  html = html.replace(/<style id="dhb-villas-css">[\s\S]*?<\/style>/, css)
} else {
  html = html.replace('</head>', `${css}</head>`)
}

const after = (html.match(/class="dhb-corner-villas"/g) || []).length
const divDiff =
  (html.match(/<div\b/g) || []).length - (html.match(/<\/div>/g) || []).length

fs.writeFileSync(path, html)
console.log({ before, after, divDiff, njHomes: html.includes('New Jersey Homes') })
