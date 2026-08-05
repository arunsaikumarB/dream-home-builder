import fs from 'node:fs'
import path from 'node:path'

const elev = fs.readdirSync('public/images/projects/elevation')
const home = fs.readdirSync('public/images/home').filter((f) => !fs.statSync(path.join('public/images/home', f)).isDirectory())
const villas = fs.existsSync('public/images/villas') ? fs.readdirSync('public/images/villas') : []
console.log({ elev: elev.length, home, villas, elevSample: elev.slice(0, 10) })

const h = fs.readFileSync('public/index.html', 'utf8')
const a = h.indexOf('class="loc-info-w"')
const b = h.indexOf('class="loc-intro-w"')
const slice = h.slice(a, b)
fs.writeFileSync('scripts/_loc-info-slice.txt', slice)
console.log('slice length', slice.length)
console.log(slice.slice(0, 800))
