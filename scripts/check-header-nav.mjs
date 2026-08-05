import fs from 'node:fs'
const h = fs.readFileSync('public/index.html', 'utf8')
console.log('header-nav', h.includes('header-nav'))
console.log('header-nav_list f-desk', h.includes('header-nav_list f-desk'))
console.log('Select an Apartment', /Select\s*(<br\s*\/?>)?\s*an Apartment/i.test(h))
const i = h.indexOf('header-nav_list f-desk')
console.log('desk nav:', i >= 0 ? h.slice(i, i + 900).replace(/\s+/g, ' ') : 'MISSING')
