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

// Remove the big "Select an Apartment" header link (+ following spacer) everywhere
const patterns = [
  /<a[^>]*class="link w-inline-block[^"]*"[^>]*>[\s\S]*?Select\s*<br\s*\/?>\s*an Apartment[\s\S]*?<\/a>\s*<div class="u-24"><\/div>/gi,
  /<a[^>]*class="link w-inline-block[^"]*"[^>]*>[\s\S]*?Select\s*<br\s*\/?>\s*an Apartment[\s\S]*?<\/a>/gi,
  /Select\s*<br\s*\/?>\s*an Apartment/gi,
  /Select\s+an Apartment/gi,
  /Select\s{2,}an Apartment/gi,
]

let updated = 0
for (const file of walk('public')) {
  let html = fs.readFileSync(file, 'utf8')
  const before = html
  for (const re of patterns) html = html.replace(re, '')
  // clean leftover double spacers in header nav
  html = html.replace(
    /(<div class="header-nav_list f-desk">)\s*(<div class="u-24"><\/div>\s*)+/g,
    '$1',
  )
  if (html !== before) {
    fs.writeFileSync(file, html)
    updated++
    console.log('updated', path.relative('public', file))
  }
}

console.log('files updated', updated)

// verify
let left = 0
for (const file of walk('public')) {
  const h = fs.readFileSync(file, 'utf8')
  if (/Select\s*(<br\s*\/?>)?\s*an Apartment/i.test(h)) {
    left++
    console.log('STILL HAS', file)
  }
}
console.log('remaining files with Select an Apartment:', left)
