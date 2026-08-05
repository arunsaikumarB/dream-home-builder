import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')

// Show theme override block
const t = h.indexOf('id="dhb-theme-css"')
console.log(h.slice(t, t + 1800))

// Quote/topnav hardcoded colors
for (const id of ['dhb-quote-css', 'dhb-topnav-css', 'dhb-sections-css', 'dhb-tip-images-css']) {
  const i = h.indexOf(`id="${id}"`)
  console.log('\n====', id, i >= 0, '====')
  if (i >= 0) console.log(h.slice(i, i + 900))
}

// Section theme classes used
const themes = [...h.matchAll(/class="[^"]*theme_on-[a-z-]+[^"]*"/g)].map((m) => m[0])
const counts = {}
for (const x of themes) counts[x] = (counts[x] || 0) + 1
console.log('\nthemes', Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 30))

const bgs = [...h.matchAll(/data-bg="([^"]+)"/g)].map((m) => m[1])
const bgCounts = {}
for (const x of bgs) bgCounts[x] = (bgCounts[x] || 0) + 1
console.log('data-bg', bgCounts)
