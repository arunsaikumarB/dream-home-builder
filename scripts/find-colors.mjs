import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const css = [...h.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1])
console.log('css links', css)

const hexes = [...h.matchAll(/#([0-9a-fA-F]{6})\b/g)].map((m) => '#' + m[1].toLowerCase())
const counts = {}
for (const x of hexes) counts[x] = (counts[x] || 0) + 1
console.log(
  'top hexes',
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50),
)

// Find style tags that define --_colors
const i = h.indexOf('--_colors---')
console.log('\nfirst --_colors context:')
console.log(h.slice(Math.max(0, i - 200), i + 800))

// Search for rgb purple-ish
for (const pat of ['17233b', '4a1c3a', '5c1a3a', '3b1a4a', '6b2d5c', '2c1a3a', 'brand', 'base-1000--primary']) {
  console.log(pat, h.includes(pat), (h.match(new RegExp(pat, 'gi')) || []).length)
}
