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

const css = `<style id="dhb-hide-scroll-ui">
  /* Hide left-side scroll indicator + progress chrome */
  .s-down,
  .s-bar-w,
  [data-theme].s-down,
  [data-s-bar],
  .s-bar {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
</style>`

let updated = 0
for (const file of walk('public')) {
  let html = fs.readFileSync(file, 'utf8')
  const before = html

  if (html.includes('id="dhb-hide-scroll-ui"')) {
    html = html.replace(/<style id="dhb-hide-scroll-ui">[\s\S]*?<\/style>/, css)
  } else if (html.includes('</head>')) {
    html = html.replace('</head>', `${css}</head>`)
  }

  if (html !== before) {
    fs.writeFileSync(file, html)
    updated++
    console.log('updated', path.relative('public', file))
  }
}

console.log('files', updated)
console.log(
  'index has css',
  fs.readFileSync('public/index.html', 'utf8').includes('dhb-hide-scroll-ui'),
)
