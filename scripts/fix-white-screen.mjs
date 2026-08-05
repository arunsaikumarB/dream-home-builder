import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')
const backup = fs.readFileSync('era-mirror-backup/index.html', 'utf8')

function extractDivBlock(source, startMarker) {
  const start = source.indexOf(startMarker)
  if (start === -1) return null
  let depth = 0
  let i = start
  while (i < source.length) {
    const open = source.indexOf('<div', i)
    const close = source.indexOf('</div>', i)
    if (close === -1) return null
    if (open !== -1 && open < close) {
      depth++
      i = open + 4
    } else {
      depth--
      i = close + 6
      if (depth === 0) return { start, end: i, html: source.slice(start, i) }
    }
  }
  return null
}

function extractAnchorBlock(source, startMarker) {
  const markerIdx = source.indexOf(startMarker)
  if (markerIdx === -1) return null
  const start = source.lastIndexOf('<a', markerIdx)
  if (start === -1) return null
  let depth = 0
  let i = start
  while (i < source.length) {
    const open = source.indexOf('<a', i)
    const close = source.indexOf('</a>', i)
    if (close === -1) return null
    if (open !== -1 && open < close) {
      depth++
      i = open + 2
    } else {
      depth--
      i = close + 4
      if (depth === 0) return { start, end: i, html: source.slice(start, i) }
    }
  }
  return null
}

// 1) Remove ALL misplaced header-nav blocks
while (html.includes('class="header-nav"')) {
  const block = extractDivBlock(html, '<div data-theme="" class="header-nav">')
  if (!block) break
  console.log('removing header-nav at', block.start)
  html = html.slice(0, block.start) + html.slice(block.end)
}

// 2) Build clean nav (no Select an Apartment)
let nav = extractDivBlock(backup, '<div data-theme="" class="header-nav">').html
nav = nav.replace(
  /<a hover-link=""[\s\S]*?<div hover="text" class="h6">Select <br\/>an Apartment<\/div>[\s\S]*?<\/a><div class="u-24"><\/div>/,
  '',
)
nav = nav
  .split('aria-label="Book a call"')
  .join('aria-label="Request a Quote"')
  .split('>Book a call<')
  .join('>Request a Quote<')
  .replace(
    /data-modal-cta-btn="book-a-call" aria-label="Request a Quote" hover-nav-item-l2="" href="#"/g,
    'data-modal-cta-btn="book-a-call" aria-label="Request a Quote" hover-nav-item-l2="" href="#quote"',
  )
  .split('aria-label="Contact"')
  .join('aria-label="Contact Us"')
  .split('>Contact<')
  .join('>Contact Us<')
  .split('href="/contact"')
  .join('href="#contact"')

// Inject home anchors before Contact Us
if (!nav.includes('href="#services"')) {
  nav = nav.replace(
    /(<a[^>]*aria-label="Contact Us"[^>]*>)/,
    `<a hover-nav-item="" aria-label="Services" href="#services" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Services</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Services</div></div></div></a><div class="u-4"></div><a hover-nav-item="" aria-label="Get Inspired" href="#inspired" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Get Inspired</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Get Inspired</div></div></div></a><div class="u-4"></div><a hover-nav-item="" aria-label="Testimonials" href="#testimonials" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Testimonials</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Testimonials</div></div></div></a><div class="u-4"></div>$1`,
  )
}

// 3) Restore <main> if missing by copying structure from backup around container
if (!html.includes('<main')) {
  console.log('main missing — restoring from backup pattern')
  // In current file, find transition-container opening remnant or theme_on-color after wrappers
  // Backup pattern: <main data-barba-namespace="home" data-barba="container" class="transition-container">
  const mainOpen =
    '<main data-barba-namespace="home" data-barba="container" class="transition-container">'
  const mainClose = '</main>'

  // Insert main open before first theme_on-color that contains hero, or before header-logo
  const heroTheme = html.indexOf('<div class="theme_on-color"><a aria-label="Back to top"')
  const altTheme = html.indexOf('class="theme_on-color"')
  const insertMainAt =
    heroTheme !== -1
      ? heroTheme
      : html.indexOf('<a aria-label="Back to top"') !== -1
        ? html.lastIndexOf('<div', html.indexOf('<a aria-label="Back to top"'))
        : altTheme

  if (insertMainAt === -1) throw new Error('cannot find main insert point')

  // Insert main close before scripts at end / floating tips / after footer section
  let closeAt = html.lastIndexOf('</section>')
  // Prefer before floating-tips / modal show / after footer
  const candidates = [
    html.indexOf('<div class="floating-tips'),
    html.indexOf('<div class="modal show'),
    html.lastIndexOf('</section>'),
  ].filter((n) => n > 0)
  closeAt = Math.max(...candidates)
  // If floating tips exists, close main before it
  const tips = html.indexOf('<div class="floating-tips')
  if (tips !== -1) closeAt = tips
  else {
    // after last section close
    closeAt = html.lastIndexOf('</section>') + '</section>'.length
  }

  html = html.slice(0, insertMainAt) + mainOpen + html.slice(insertMainAt)
  // adjust closeAt if insert was before it
  if (insertMainAt < closeAt) closeAt += mainOpen.length
  html = html.slice(0, closeAt) + mainClose + html.slice(closeAt)
  console.log('main restored')
}

// 4) Insert header-nav in the CORRECT place: immediately after header-logo anchor
const logo =
  extractAnchorBlock(html, 'class="header-logo w-inline-block"') ||
  extractAnchorBlock(html, 'class="logo_symbol header"') ||
  extractAnchorBlock(html, 'aria-label="Back to top"')

if (!logo) throw new Error('header logo not found for nav insert')
console.log('inserting nav after logo at', logo.end)
html = html.slice(0, logo.end) + nav + html.slice(logo.end)

// 5) Emergency: ensure preloader can never trap users forever
const killPreloader = `
<style id="dhb-preloader-failsafe">
  body.dhb-ready [data-preloader],
  body.dhb-ready [data-master-preloader] {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
</style>
<script id="dhb-preloader-failsafe-js">
(() => {
  const ready = () => document.body.classList.add('dhb-ready');
  window.addEventListener('load', () => setTimeout(ready, 1200));
  setTimeout(ready, 4000);
})();
</script>
`
if (!html.includes('dhb-preloader-failsafe')) {
  html = html.replace('</head>', `${killPreloader}</head>`)
}

fs.writeFileSync(path, html)

// verify
const out = fs.readFileSync(path, 'utf8')
const opens = (out.match(/<div\b/g) || []).length
const closes = (out.match(/<\/div>/g) || []).length
console.log('div diff', opens - closes)
console.log('main?', out.includes('<main'))
console.log('header-nav count', (out.match(/class="header-nav"/g) || []).length)
console.log('Select apartment?', /Select\s*(<br\s*\/?>)?\s*an Apartment/i.test(out))
const navIdx = out.indexOf('class="header-nav"')
console.log('nav context', out.slice(Math.max(0, navIdx - 180), navIdx + 80).replace(/\s+/g, ' '))
console.log('failsafe?', out.includes('dhb-preloader-failsafe'))
