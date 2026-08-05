import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const i = h.indexOf('class="header-nav"')
console.log(h.slice(i, i + 2500))
console.log('\n--- hide css ---')
const c = h.indexOf('dhb-hide-sticky-nav')
console.log(h.slice(c, c + 200))
console.log('\nf-desk empty?', h.includes('<div class="header-nav_list f-desk"></div>'))
console.log('book a call', h.includes('Book a call') || h.includes('Request a Quote'))
