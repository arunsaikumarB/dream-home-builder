import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

html = html.replace(/\n?<div class="dhb-villa-rail" aria-hidden="true">[\s\S]*?<\/div>\n?/g, '')
html = html.replace(/<div class="flower loc-info dhb-villa-wrap">[\s\S]*?<\/div><\/div>/g, '')
html = html.replace(/<div class="flower loc-intro dhb-villa-wrap">[\s\S]*?<\/div><\/div>/g, '')
html = html.replace(
  /<div class="loc-path-w_flower"><div class="flower loc-path dhb-villa-wrap">[\s\S]*?<\/div><\/div><\/div>/g,
  '',
)

// Remove decorative flower motif under the NJ Homes description
html = html.replace(
  /(<p data-part="p" class="p1 a-center">Seeing is believing[\s\S]*?<\/p>)<div class="u-32"><\/div><div class="s_logo">[\s\S]*?<\/svg><\/div><\/div><\/div>/,
  '$1',
)

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
  .flower video { display: none !important; }
  .dhb-villa-rail,
  .flower.dhb-villa-wrap,
  .loc-path-w_flower,
  .loc-info-s .s_logo {
    display: none !important;
  }
</style>`

html = html.replace(/<style id="dhb-villas-css">[\s\S]*?<\/style>/, css)

const divDiff =
  (html.match(/<div\b/g) || []).length - (html.match(/<\/div>/g) || []).length

fs.writeFileSync(path, html)

console.log({
  divDiff,
  villasLeft: (html.match(/\/images\/villas\//g) || []).length,
  railLeft: html.includes('class="dhb-villa-rail"'),
  wrapLeft: html.includes('dhb-villa-wrap'),
  seeingOk: html.includes('Seeing is believing'),
})
