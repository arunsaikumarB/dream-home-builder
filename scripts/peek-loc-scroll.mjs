import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const start = h.indexOf('class="loc-scroll-area"')
const endMarker = h.indexOf('class="apart-type-w"')
const chunk = h.slice(start, endMarker)

const texts = [...chunk.matchAll(/>([^<]{3,})</g)]
  .map((m) => m[1].replace(/\s+/g, ' ').trim())
  .filter(
    (t) =>
      t &&
      !t.startsWith('M') &&
      !t.includes('path d=') &&
      !t.includes('circle') &&
      !t.includes('http') &&
      !t.includes('rotate') &&
      !/^[0-9.\s]+$/.test(t),
  )

console.log([...new Set(texts)].join('\n---\n'))
console.log('\nchunk len', chunk.length)
