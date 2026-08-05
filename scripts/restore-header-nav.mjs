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

function extractHeaderNav(html) {
  const start = html.indexOf('<div data-theme="" class="header-nav">')
  if (start === -1) return null
  // find matching close for this div by depth counting from start
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
      if (depth === 0) return html.slice(start, i)
    }
  }
  return null
}

function stripSelectApartmentLink(navHtml) {
  // Precise: only the desktop "Select an Apartment" link + spacer after it
  return navHtml
    .replace(
      /<a hover-link=""[^>]*>[\s\S]*?<div hover="text" class="h6">Select <br\/>an Apartment<\/div>[\s\S]*?<\/a>\s*<div class="u-24"><\/div>/g,
      '',
    )
    .replace(
      /<a hover-link=""[^>]*>[\s\S]*?Select <br\/>an Apartment[\s\S]*?<\/a>\s*<div class="u-24"><\/div>/g,
      '',
    )
}

function customizeNav(navHtml, { isHome = false } = {}) {
  let nav = stripSelectApartmentLink(navHtml)

  // Normalize quote / contact labels and hrefs for homepage-style anchors when on index
  nav = nav
    .replace(/aria-label="Request a quote"/g, 'aria-label="Request a Quote"')
    .replace(/aria-label="Request a Quote" href="#"/g, 'aria-label="Request a Quote" href="#quote"')
    .replace(/>Request a quote</g, '>Request a Quote<')

  if (isHome) {
    // Ensure useful anchors exist; keep existing Get Inspired / Testimonials if already injected
    if (!nav.includes('href="#services"') && !nav.includes('href="#inspired"')) {
      // no-op; index already had custom links before corruption in cookies area separately
    }
    nav = nav
      .replace(/href="\/apartments"/g, 'href="#services"')
      .replace(/href="\/contact"/g, 'href="#contact"')
      .replace(/aria-label="Contact"/g, 'aria-label="Contact Us"')
      .replace(/>Contact</g, '>Contact Us<')

    // If Get Inspired / Testimonials missing after Select removal, inject before Contact Us
    if (!nav.includes('href="#inspired"')) {
      nav = nav.replace(
        /(<a[^>]*aria-label="Contact Us" href="#contact"[^>]*>)/,
        `<a hover-nav-item="" aria-label="Get Inspired" href="#inspired" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Get Inspired</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Get Inspired</div></div></div></a><a hover-nav-item="" aria-label="Testimonials" href="#testimonials" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Testimonials</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Testimonials</div></div></div></a>$1`,
      )
    }

    // Add Services link at start of desk list if missing
    if (!nav.includes('href="#services"')) {
      nav = nav.replace(
        /(<div class="header-nav_list f-desk">)/,
        `$1<a hover-nav-item="" aria-label="Services" href="#services" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Services</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Services</div></div></div></a><div class="u-4"></div>`,
      )
    }
  } else {
    // Other pages: keep routes, just no Select Apartment
    nav = nav
      .replace(/aria-label="View Projects"/g, 'aria-label="Services"')
      .replace(/href="\/apartments"/g, 'href="/#services"')
      .replace(/aria-label="Contact"/g, 'aria-label="Contact Us"')
      .replace(/>Contact</g, '>Contact Us<')
      .replace(/href="\/contact"/g, 'href="/#contact"')
      .replace(/aria-label="Request a Quote" href="#"/g, 'aria-label="Request a Quote" href="/#quote"')
  }

  return nav
}

const backupNav = extractHeaderNav(fs.readFileSync('era-mirror-backup/index.html', 'utf8'))
if (!backupNav) throw new Error('backup header-nav not found')

let count = 0
for (const file of walk('public')) {
  let html = fs.readFileSync(file, 'utf8')
  const isHome = path.basename(file) === 'index.html'
  const current = extractHeaderNav(html)
  const restored = customizeNav(backupNav, { isHome })

  if (current) {
    html = html.replace(current, restored)
  } else {
    // insert after header-logo block if nav missing
    const logoEnd = html.indexOf('</a>', html.indexOf('header-logo'))
    if (logoEnd === -1) {
      console.log('SKIP no insert point', file)
      continue
    }
    // find end of header-logo anchor more safely
    const logoStart = html.indexOf('<a aria-label="Back to top"')
    if (logoStart === -1) {
      console.log('SKIP no logo', file)
      continue
    }
    let depth = 0
    let i = logoStart
    let end = -1
    while (i < html.length) {
      const openA = html.indexOf('<a', i)
      const closeA = html.indexOf('</a>', i)
      if (closeA === -1) break
      if (openA !== -1 && openA < closeA) {
        depth++
        i = openA + 2
      } else {
        depth--
        i = closeA + 4
        if (depth === 0) {
          end = i
          break
        }
      }
    }
    if (end === -1) {
      console.log('SKIP logo end', file)
      continue
    }
    html = html.slice(0, end) + restored + html.slice(end)
  }

  // Also purge any leftover Select apartment strings
  html = html
    .replace(/Select <br\/>an Apartment/g, '')
    .replace(/Select an Apartment/g, '')
    .replace(/Select  an Apartment/g, '')

  fs.writeFileSync(file, html)
  count++
  console.log('restored nav', path.relative('public', file), 'hasSelect', /Select\s*(<br\s*\/?>)?\s*an Apartment/i.test(html))
}

const idx = fs.readFileSync('public/index.html', 'utf8')
console.log('\nVERIFY index')
console.log('header-nav', idx.includes('header-nav'))
console.log('Select an Apartment', /Select\s*(<br\s*\/?>)?\s*an Apartment/i.test(idx))
console.log('Services', idx.includes('href="#services"'))
console.log('Get Inspired', idx.includes('href="#inspired"'))
console.log('Testimonials', idx.includes('href="#testimonials"'))
console.log('Contact', idx.includes('href="#contact"'))
console.log('Quote', idx.includes('href="#quote"') || idx.includes('Request a Quote'))
const i = idx.indexOf('header-nav_list f-desk')
console.log('desk nav:', idx.slice(i, i + 700).replace(/\s+/g, ' '))
