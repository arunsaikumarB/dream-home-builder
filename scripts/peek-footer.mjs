import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const i = h.indexOf('class="footer-w"')
console.log(h.slice(i, i + 4500))
console.log('\n---TEXTS---')
const chunk = h.slice(i, i + 8000)
const texts = [...chunk.matchAll(/>([^<]{2,})</g)]
  .map((m) => m[1].replace(/\s+/g, ' ').trim())
  .filter((t) => t && !t.startsWith('M') && !t.includes('path') && !/^[\d.]+$/.test(t))
console.log([...new Set(texts)].join('\n'))
