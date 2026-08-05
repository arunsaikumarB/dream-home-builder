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

const css = `<style id="dhb-hide-logo-ring">
  /* Hide circular DREAM HOME BUILDER badge across all sections */
  .header-logo,
  a.header-logo,
  .header-logo_bg,
  .logo_symbol.header {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
</style>`

let updated = 0
for (const file of walk('public')) {
  let html = fs.readFileSync(file, 'utf8')
  const before = html

  if (html.includes('id="dhb-hide-logo-ring"')) {
    html = html.replace(/<style id="dhb-hide-logo-ring">[\s\S]*?<\/style>/, css)
  } else if (html.includes('</head>')) {
    html = html.replace('</head>', `${css}</head>`)
  }

  // Drop topnav offset that only existed for the floating logo
  html = html.replace(
    /\s*\/\* Keep Era circular logo below the bar \*\/\s*\.header-logo\s*\{[^}]*\}\s*@media \(max-width: 991px\) \{\s*\.dhb-topnav \{\s*display: none;\s*\}\s*\.header-logo \{\s*top: unset !important;\s*\}\s*\}/m,
    `
  @media (max-width: 991px) {
    .dhb-topnav { display: none; }
  }`,
  )

  if (html !== before) {
    fs.writeFileSync(file, html)
    updated++
    console.log('updated', path.relative('public', file))
  }
}

const idx = fs.readFileSync('public/index.html', 'utf8')
console.log('files', updated)
console.log('css', idx.includes('dhb-hide-logo-ring'))
console.log('header-logo hide', idx.includes('.header-logo,'))
