import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const pins = [...h.matchAll(/\[data-pin='([^']+)'\]\s*\{([^}]+)\}/g)]
for (const m of pins) {
  console.log('---', m[1])
  console.log(m[2].trim())
}

// Also find hero vs portfolio-scene pins
const heroIdx = h.indexOf('id="hero"')
const portIdx = h.indexOf('id="portfolio-scene"')
console.log('\npin style blocks near portfolio:', h.slice(portIdx, portIdx + 50))

// Extract pin styles that appear after portfolio-scene or in hero
const all = [...h.matchAll(/<style>\s*\[data-pin='([^']+)'\]\s*\{([\s\S]*?)\}\s*<\/style>/g)]
console.log('\nall pin styles count', all.length)
all.forEach((m, i) => {
  const idx = m.index
  const section = idx > portIdx && portIdx > 0 ? 'after-portfolio-start' : idx > heroIdx ? 'in-hero-area' : 'early'
  console.log(i, m[1], section, m[2].replace(/\s+/g, ' ').trim())
})
