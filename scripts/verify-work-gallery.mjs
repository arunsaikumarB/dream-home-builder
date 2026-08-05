import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const opens = (h.match(/<div\b/g) || []).length
const closes = (h.match(/<\/div>/g) || []).length
console.log('div open/close', opens, closes, 'diff', opens - closes)
console.log('gallery', h.includes('dhb-work-track'))
console.log('spain svg', h.includes('loc_path_labels.svg'))
console.log('construction', h.includes('/images/services/construction.jpeg'))
console.log('renovation', h.includes('/images/services/renovation.webp'))

const cards = (h.match(/dhb-work-card/g) || []).length
console.log('cards', cards)

// Update location captions under the hero image to match work scenes
let html = h
html = html.replace(
  '<h3 data-scroll-reveal="p" class="l1">Edison, New Jersey</h3><div class="u-32"></div><h4 data-scroll-reveal="p" class="p1">New Jersey</h4><div class="u-32"></div><h5 data-scroll-reveal="p" class="p1">USA</h5>',
  '<h3 data-scroll-reveal="p" class="l1">Exterior & Interior</h3><div class="u-32"></div><h4 data-scroll-reveal="p" class="p1">Building work</h4><div class="u-32"></div><h5 data-scroll-reveal="p" class="p1">New Jersey</h5>',
)
if (html !== h) {
  fs.writeFileSync('public/index.html', html)
  console.log('updated loc captions')
}
