import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const i = h.indexOf('data-theme="" class="header')
console.log(h.slice(i, i + 1800))
