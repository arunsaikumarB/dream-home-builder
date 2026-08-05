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

const files = walk('public')
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8')
  const counts = {
    builders: (h.match(/Dream Home Builders/g) || []).length,
    builder: (h.match(/Dream Home Builder(?!s)/g) || []).length,
    ERA: (h.match(/ERA/g) || []).length,
    Era: (h.match(/Era/g) || []).length,
    Residence: (h.match(/Residence/g) || []).length,
  }
  if (Object.values(counts).some(Boolean)) {
    console.log(f, counts)
  }
}

const idx = fs.readFileSync('public/index.html', 'utf8')
const keys = ['>Era', '>ERA', 'Era<br', 'ERA<br', 'Residence', 'logo_symbol', 'class="h1"', 'Dream Home']
for (const key of keys) {
  let pos = 0
  let c = 0
  while ((pos = idx.indexOf(key, pos)) !== -1 && c < 4) {
    console.log('\nKEY', key, '@', pos)
    console.log(idx.slice(Math.max(0, pos - 60), pos + 160).replace(/\s+/g, ' '))
    pos += key.length
    c++
  }
}

// Extract SVG text content near logo
const logoIdx = idx.indexOf('logo_symbol')
if (logoIdx >= 0) {
  console.log('\nLOGO REGION')
  console.log(idx.slice(logoIdx, logoIdx + 2500).replace(/\s+/g, ' ').slice(0, 1500))
}
