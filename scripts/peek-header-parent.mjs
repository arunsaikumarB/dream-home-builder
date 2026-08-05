import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const start = h.indexOf('class="header-logo w-inline-block"')
// walk back to find parent open
console.log(h.slice(start - 400, start + 200).replace(/\s+/g, ' '))
console.log('\n--- after logo / nav join ---')
const desk = h.indexOf('header-nav_list f-desk')
console.log(h.slice(desk - 50, desk + 100))
