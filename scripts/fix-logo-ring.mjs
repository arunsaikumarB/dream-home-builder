import fs from 'node:fs'
import path from 'node:path'

const deskSvg = `<svg width="100%" height="100%" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="dhb-ring-desk" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
  </defs>
  <circle cx="60" cy="60" r="52" stroke="currentColor" stroke-width="1" fill="none" opacity="0.35"/>
  <text fill="currentColor" font-family="Maison Neue Extended, Arial, sans-serif" font-size="7.2" letter-spacing="2.2">
    <textPath href="#dhb-ring-desk" startOffset="0%">DREAM HOME BUILDER · DREAM HOME BUILDER ·</textPath>
  </text>
</svg>`

const mobSvg = `<svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="dhb-ring-mob" d="M40,40 m-30,0 a30,30 0 1,1 60,0 a30,30 0 1,1 -60,0" />
  </defs>
  <circle cx="40" cy="40" r="35" stroke="currentColor" stroke-width="1" fill="none" opacity="0.35"/>
  <text fill="currentColor" font-family="Maison Neue Extended, Arial, sans-serif" font-size="5.2" letter-spacing="1.4">
    <textPath href="#dhb-ring-mob" startOffset="0%">DREAM HOME BUILDER · DREAM HOME BUILDER ·</textPath>
  </text>
</svg>`

function replaceLogoBg(html) {
  return html
    .replace(
      /(<div class="header-logo_bg b-desk w-embed">)<svg[\s\S]*?<\/svg>(<\/div>)/,
      `$1${deskSvg}$2`,
    )
    .replace(
      /(<div class="header-logo_bg b-mob w-embed">)<svg[\s\S]*?<\/svg>(<\/div>)/,
      `$1${mobSvg}$2`,
    )
}

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, files)
    else if (e.name.endsWith('.html')) files.push(p)
  }
  return files
}

let count = 0
for (const file of walk('public')) {
  const before = fs.readFileSync(file, 'utf8')
  if (!before.includes('header-logo_bg')) continue
  const after = replaceLogoBg(before)
  if (after !== before) {
    fs.writeFileSync(file, after)
    count++
    console.log('logo ring updated', file)
  }
}

// final brand sweep (safe, targeted)
const brandFixes = [
  ['Dream Home Builders', 'Dream Home Builder'],
  ['Select an Apartment', 'View Projects'],
  ['Select  an Apartment', 'View Projects'],
  ['SELECT AN APARTMENT', 'VIEW PROJECTS'],
  ['>Costa</div>', '>New</div>'],
  ['>del Sol</div>', '>Jersey</div>'],
]

for (const file of walk('public')) {
  let html = fs.readFileSync(file, 'utf8')
  const before = html
  for (const [from, to] of brandFixes) html = html.split(from).join(to)
  if (html !== before) {
    fs.writeFileSync(file, html)
    console.log('brand sweep', file)
  }
}

const idx = fs.readFileSync('public/index.html', 'utf8')
console.log('files with new ring:', count)
console.log('ring text present:', idx.includes('DREAM HOME BUILDER ·'))
console.log('hero:', (idx.match(/class="h1 a-center">[\s\S]{0,40}/) || [])[0])
console.log('builders plural left:', idx.includes('Dream Home Builders'))
console.log('select apartment left:', /Select\s+an\s+Apartment/i.test(idx))
