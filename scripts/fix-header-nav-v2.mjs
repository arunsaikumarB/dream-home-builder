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

function extractBetween(html, startMarker) {
  const start = html.indexOf(startMarker)
  if (start === -1) return null
  let depth = 0
  let i = start
  while (i < html.length) {
    const open = html.indexOf('<div', i)
    const close = html.indexOf('</div>', i)
    if (close === -1) return null
    if (open !== -1 && open < close) {
      depth++
      i = open + 4
    } else {
      depth--
      i = close + 6
      if (depth === 0) return { start, end: i, html: html.slice(start, i) }
    }
  }
  return null
}

const backup = fs.readFileSync('era-mirror-backup/index.html', 'utf8')
const backupNav = extractBetween(backup, '<div data-theme="" class="header-nav">')
if (!backupNav) throw new Error('backup nav missing')

function buildNav(isHome) {
  let nav = backupNav.html
  // Remove ONLY the Select an Apartment desktop link + spacer
  nav = nav.replace(
    /<a hover-link=""[\s\S]*?<div hover="text" class="h6">Select <br\/>an Apartment<\/div>[\s\S]*?<\/a><div class="u-24"><\/div>/,
    '',
  )

  // Clean labels
  nav = nav
    .replace(/aria-label="Request a quote"/g, 'aria-label="Request a Quote"')
    .replace(/>Request a quote</g, '>Request a Quote<')
    .replace(/aria-label="Contact"/g, 'aria-label="Contact Us"')
    .replace(/>Contact</g, '>Contact Us<')

  if (isHome) {
    nav = nav
      .replace(/href="#"(?=[^>]*aria-label="Request a Quote")/g, 'href="#quote"')
      .replace(/aria-label="Request a Quote" href="#"/g, 'aria-label="Request a Quote" href="#quote"')
      .replace(/href="\/contact"/g, 'href="#contact"')

    // Rewrite Request quote href more reliably
    nav = nav.replace(
      /(<a data-modal-cta-btn="book-a-call" aria-label="Request a Quote"[^>]*href=")([^"]*)(")/,
      '$1#quote$3',
    )

    // Inject Services / Inspired / Testimonials before Contact Us
    if (!nav.includes('href="#inspired"')) {
      nav = nav.replace(
        /(<a[^>]*aria-label="Contact Us"[^>]*>)/,
        `<a hover-nav-item="" aria-label="Services" href="#services" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Services</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Services</div></div></div></a><div class="u-4"></div><a hover-nav-item="" aria-label="Get Inspired" href="#inspired" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Get Inspired</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Get Inspired</div></div></div></a><div class="u-4"></div><a hover-nav-item="" aria-label="Testimonials" href="#testimonials" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Testimonials</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Testimonials</div></div></div></a><div class="u-4"></div>$1`,
      )
    }
  } else {
    nav = nav
      .replace(
        /(<a data-modal-cta-btn="book-a-call" aria-label="Request a Quote"[^>]*href=")([^"]*)(")/,
        '$1/#quote$3',
      )
      .replace(/href="\/contact"/g, 'href="/#contact"')
  }

  return nav
}

function findInsertPoint(html) {
  // Prefer after header-logo anchor
  const markers = [
    'class="header-logo w-inline-block"',
    'class="logo_symbol header"',
    'aria-label="Back to top"',
  ]
  for (const marker of markers) {
    const idx = html.indexOf(marker)
    if (idx === -1) continue
    // walk back to nearest <a
    const aStart = html.lastIndexOf('<a', idx)
    if (aStart === -1) continue
    let depth = 0
    let i = aStart
    while (i < html.length) {
      const open = html.indexOf('<a', i)
      const close = html.indexOf('</a>', i)
      if (close === -1) break
      if (open !== -1 && open < close) {
        depth++
        i = open + 2
      } else {
        depth--
        i = close + 4
        if (depth === 0) return i
      }
    }
  }

  // fallback: before header-cramps or main content
  for (const marker of ['class="header-cramps"', 'data-barba="container"', '<main']) {
    const idx = html.indexOf(marker)
    if (idx !== -1) return idx
  }
  return -1
}

let ok = 0
for (const file of walk('public')) {
  let html = fs.readFileSync(file, 'utf8')
  const isHome = path.basename(file) === 'index.html'
  const nav = buildNav(isHome)

  const existing = extractBetween(html, '<div data-theme="" class="header-nav">')
  if (existing) {
    html = html.slice(0, existing.start) + nav + html.slice(existing.end)
  } else {
    const point = findInsertPoint(html)
    if (point === -1) {
      console.log('FAIL insert', file)
      continue
    }
    html = html.slice(0, point) + nav + html.slice(point)
  }

  // ensure no Select apartment leftovers
  if (/Select\s*(<br\s*\/?>)?\s*an Apartment/i.test(html)) {
    html = html
      .replace(/Select <br\/>an Apartment/g, 'Services')
      .replace(/Select an Apartment/g, 'Services')
  }

  fs.writeFileSync(file, html)
  ok++
  console.log(
    'OK',
    path.relative('public', file),
    'nav',
    html.includes('header-nav'),
    'select?',
    /Select\s*(<br\s*\/?>)?\s*an Apartment/i.test(html),
  )
}

const idx = fs.readFileSync('public/index.html', 'utf8')
console.log('\nINDEX')
console.log('header-nav', idx.includes('header-nav'))
console.log('Select?', /Select\s*(<br\s*\/?>)?\s*an Apartment/i.test(idx))
const i = idx.indexOf('header-nav_list f-desk')
console.log(idx.slice(i, i + 900).replace(/\s+/g, ' '))
