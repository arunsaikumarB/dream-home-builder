import fs from 'node:fs'
const h = fs.readFileSync('public/index.html', 'utf8')
const keys = [
  'header-logo',
  'logo_symbol header',
  'Back to top',
  'theme_on-color',
  'transition-container',
  'data-barba="container"',
  'data-barba-namespace',
  '<main',
  'id="hero"',
]
for (const k of keys) console.log(k, h.indexOf(k))

// show area around hero
const hero = h.indexOf('id="hero"')
console.log('\nAROUND HERO-2000:')
console.log(h.slice(Math.max(0, hero - 2000), hero + 200).replace(/\s+/g, ' '))

// backup main open context
const b = fs.readFileSync('era-mirror-backup/index.html', 'utf8')
const bm = b.indexOf('<main')
console.log('\nBACKUP MAIN:')
console.log(b.slice(bm, bm + 500).replace(/\s+/g, ' '))
