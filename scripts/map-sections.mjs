import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const markers = [
  'Three reasons',
  'benefits-intro',
  'benefits-cms',
  'quote-s',
  'Architecture Team',
  'Homes range from',
  'apart-info',
  'info-s_lead',
  'Developer',
  'Sales & Marketing',
  'License obtained',
  'Perfect',
  'sea views',
  'other-card',
  'footer-s',
  'amen-',
  'apart-type',
  'interior-w',
  'arch-',
  'id="hero"',
  '</main>',
]

for (const m of markers) {
  console.log(String(h.indexOf(m)).padStart(7), m)
}

const secs = [...h.matchAll(/<section[^>]*class="([^"]+)"/g)].map((x) => x[1])
console.log('\nsections count', secs.length)
secs.forEach((s, i) => console.log(i, s))

// find nav items
const navMatches = [...h.matchAll(/aria-label="([^"]+)"[^>]*href="([^"]+)"/g)].slice(0, 30)
console.log('\nnav-ish')
for (const m of navMatches) console.log(m[1], '->', m[2])
