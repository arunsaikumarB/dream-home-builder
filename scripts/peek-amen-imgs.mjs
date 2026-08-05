import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const start = h.indexOf('class="amen-scroll-area"')
const end = h.indexOf('id="services"', start)
const slice = h.slice(start, end > 0 ? end : start + 8000)

const imgs = [...slice.matchAll(/src="([^"]+)"/g)].map((m) => m[1])
console.log('amen images:')
imgs.forEach((s, i) => console.log(i, s))

const elev = fs.readdirSync('public/images/projects/elevation').filter((f) =>
  /\.(jpe?g|webp|avif|png)$/i.test(f),
)
console.log('\nelev sample', elev.slice(0, 12))
