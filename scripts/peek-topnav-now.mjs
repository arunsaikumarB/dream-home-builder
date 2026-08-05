import fs from 'node:fs'
const h = fs.readFileSync('public/index.html', 'utf8')
const i = h.indexOf('id="dhb-topnav-css"')
console.log(h.slice(i, i + 1400))
const j = h.indexOf('class="dhb-topnav"')
console.log('---HTML---')
console.log(h.slice(j, j + 650))
