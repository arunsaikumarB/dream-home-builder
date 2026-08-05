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

for (const file of walk('public')) {
  let h = fs.readFileSync(file, 'utf8')
  const before = h
  const isHome = path.basename(file) === 'index.html'
  h = h
    .split('aria-label="Book a call"')
    .join('aria-label="Request a Quote"')
    .split('>Book a call<')
    .join('>Request a Quote<')

  if (isHome) {
    h = h.replace(
      /data-modal-cta-btn="book-a-call" aria-label="Request a Quote" hover-nav-item-l2="" href="#"/g,
      'data-modal-cta-btn="book-a-call" aria-label="Request a Quote" hover-nav-item-l2="" href="#quote"',
    )
  } else {
    h = h.replace(
      /data-modal-cta-btn="book-a-call" aria-label="Request a Quote" hover-nav-item-l2="" href="#"/g,
      'data-modal-cta-btn="book-a-call" aria-label="Request a Quote" hover-nav-item-l2="" href="/#quote"',
    )
  }

  if (h !== before) {
    fs.writeFileSync(file, h)
    console.log('fixed', path.relative('public', file))
  }
}

const idx = fs.readFileSync('public/index.html', 'utf8')
console.log('Book a call left', idx.includes('Book a call'))
console.log('Select left', /Select\s*(<br\s*\/?>)?\s*an Apartment/i.test(idx))
