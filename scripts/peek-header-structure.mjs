import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
// Find header wrapper
const markers = ['class="header"', 'header_logo', 'header-nav', 'btn-circle', 'Book a call', 'data-theme="" class="header']
for (const m of markers) {
  const i = h.indexOf(m)
  console.log(String(i).padStart(8), m)
}
const i = Math.max(h.indexOf('class="header '), h.indexOf('data-theme="" class="header"'), h.indexOf('<div class="header'))
// try find header root
let start = h.indexOf('class="header-w"')
if (start < 0) start = h.indexOf('class="header ')
if (start < 0) start = h.indexOf('header_logo')
console.log('\ncontext around header:')
console.log(h.slice(Math.max(0, start - 100), start + 800).replace(/\s+/g, ' '))

// mobile menu links
const mi = h.indexOf('modal_menu')
console.log('\nmenu links sample:')
const chunk = h.slice(mi, mi + 5000)
for (const label of ['Home', 'Services', 'Get Inspired', 'Testimonials', 'Contact', 'Quote', 'Apartments', 'Book']) {
  console.log(label, chunk.includes(label))
}
