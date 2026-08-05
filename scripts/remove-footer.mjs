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

function extractSection(html, predicate) {
  const re = /<section\b[^>]*>/g
  let m
  while ((m = re.exec(html))) {
    const start = m.index
    let depth = 0
    let j = start
    while (j < html.length) {
      const open = html.indexOf('<section', j)
      const close = html.indexOf('</section>', j)
      if (close === -1) return null
      if (open !== -1 && open < close) {
        depth++
        j = open + 8
      } else {
        depth--
        j = close + 10
        if (depth === 0) {
          const block = html.slice(start, j)
          if (predicate(block)) return { start, end: j, block }
          break
        }
      }
    }
  }
  return null
}

let updated = 0
for (const file of walk('public')) {
  let html = fs.readFileSync(file, 'utf8')
  if (!html.includes('class="footer-w"') && !html.includes('footer-s_contact')) continue

  const footer = extractSection(
    html,
    (b) => b.includes('class="footer-w"') || (b.includes('footer-s') && b.includes('All rights reserved')),
  )

  if (!footer) {
    console.log('no section match', path.relative('public', file))
    continue
  }

  html = html.slice(0, footer.start) + html.slice(footer.end)
  fs.writeFileSync(file, html)
  updated++
  console.log(
    'removed footer',
    path.relative('public', file),
    'len',
    footer.block.length,
  )
}

const idx = fs.readFileSync('public/index.html', 'utf8')
console.log('files', updated)
console.log('footer-w left', idx.includes('footer-w'))
console.log('To top left', idx.includes('>To top<'))
console.log('All rights reserved', idx.includes('All rights reserved'))
console.log('main', idx.includes('<main'))
console.log(
  'div diff',
  (idx.match(/<div\b/g) || []).length - (idx.match(/<\/div>/g) || []).length,
)
console.log('quote remains', idx.includes('id="quote"'))
