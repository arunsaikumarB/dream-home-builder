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

function emptyDeskNav(html) {
  const marker = '<div class="header-nav_list f-desk">'
  const start = html.indexOf(marker)
  if (start === -1) return html
  let depth = 0
  let i = start
  while (i < html.length) {
    const open = html.indexOf('<div', i)
    const close = html.indexOf('</div>', i)
    if (close === -1) break
    if (open !== -1 && open < close) {
      depth++
      i = open + 4
    } else {
      depth--
      i = close + 6
      if (depth === 0) {
        return html.slice(0, start) + '<div class="header-nav_list f-desk"></div>' + html.slice(i)
      }
    }
  }
  return html
}

const css = `<style id="dhb-hide-sticky-nav">
  .header-nav_list.f-desk{display:none!important}
</style>`

let updated = 0
for (const file of walk('public')) {
  let html = fs.readFileSync(file, 'utf8')
  const before = html

  html = emptyDeskNav(html)

  if (html.includes('id="dhb-hide-sticky-nav"')) {
    html = html.replace(/<style id="dhb-hide-sticky-nav">[\s\S]*?<\/style>/, css)
  } else if (html.includes('</head>')) {
    html = html.replace('</head>', `${css}</head>`)
  }

  if (html !== before) {
    fs.writeFileSync(file, html)
    updated++
    console.log('updated', path.relative('public', file))
  }
}

const idx = fs.readFileSync('public/index.html', 'utf8')
console.log('files updated', updated)
console.log('css', idx.includes('dhb-hide-sticky-nav'))
console.log('empty f-desk', idx.includes('<div class="header-nav_list f-desk"></div>'))
console.log('main', idx.includes('<main'))
console.log(
  'div diff',
  (idx.match(/<div\b/g) || []).length - (idx.match(/<\/div>/g) || []).length,
)
console.log(
  'desk still has Request a Quote text inside f-desk?',
  /header-nav_list f-desk">[^]*Request a Quote/.test(idx),
)
