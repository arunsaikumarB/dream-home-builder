import fs from 'node:fs'
import path from 'node:path'

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, files)
    else if (e.name.endsWith('.html')) files.push(p)
  }
  return files
}

const keys = [
  'Select an Apartment',
  'Select  an Apartment',
  'SELECT AN APARTMENT',
  'an Apartment',
  'Apartment',
  'header-nav',
  'nav_main',
  'side-nav',
  'fixed-nav',
]

for (const file of walk('public')) {
  const h = fs.readFileSync(file, 'utf8')
  const hits = keys.filter((k) => h.includes(k))
  if (hits.length) console.log(file, hits.join(' | '))
}

const idx = fs.readFileSync('public/index.html', 'utf8')
// find context around Apartment
let pos = 0
let c = 0
while ((pos = idx.indexOf('Apartment', pos)) !== -1 && c < 12) {
  console.log('\n---', pos)
  console.log(idx.slice(Math.max(0, pos - 120), pos + 160).replace(/\s+/g, ' '))
  pos += 9
  c++
}

// look for repeating section nav pattern near Request a Quote stack
const rq = idx.indexOf('Request a Quote')
console.log('\nRequest a Quote context', idx.slice(Math.max(0, rq - 400), rq + 500).replace(/\s+/g, ' '))
