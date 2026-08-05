import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')

const markers = [
  'loc-path-w',
  'dhb-work-track',
  'class="loc-w"',
  'loc-w_bg',
  'Exterior & Interior',
  'Edison, New Jersey',
  'Building work',
  'apart-type-w',
  'id="services"',
]

for (const m of markers) {
  const i = h.indexOf(m)
  console.log(String(i).padStart(8), m)
}

const start = h.indexOf('class="loc-w"')
const end = h.indexOf('class="apart-type-w"')
console.log('\n--- loc-w section snippet ---')
console.log(h.slice(start, Math.min(start + 2500, end)))
console.log('\n--- captions area ---')
const c = h.indexOf('loc-s_desc')
console.log(h.slice(c, c + 1200))
