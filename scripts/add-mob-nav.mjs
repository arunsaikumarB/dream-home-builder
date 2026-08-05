import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

const modalStart = html.indexOf('data-modal-menu="mob"')
if (modalStart === -1) {
  console.log('no mobile modal')
  process.exit(0)
}

// Find a reasonable chunk of the menu
const chunk = html.slice(modalStart, modalStart + 12000)
const labels = [...chunk.matchAll(/class="l1"[^>]*>([^<]+)</g)].map((m) => m[1])
console.log('menu l1 labels:', [...new Set(labels)].join(' | '))
const hrefs = [...chunk.matchAll(/href="([^"]+)"/g)].map((m) => m[1])
console.log('hrefs:', [...new Set(hrefs)].join(' | '))

// Build a clean mobile nav list to inject if we find modal_menu_nav or similar
const mobileNav = `
<div class="dhb-mob-nav">
  <a href="#hero" data-modal-close="menu" class="l1">Home</a>
  <a href="#services" data-modal-close="menu" class="l1">Services</a>
  <a href="#inspired" data-modal-close="menu" class="l1">Get Inspired</a>
  <a href="#testimonials" data-modal-close="menu" class="l1">Testimonials</a>
  <a href="#contact" data-modal-close="menu" class="l1">Contact Us</a>
  <a href="#quote" data-modal-close="menu" class="l1 dhb-mob-cta">Request Quote</a>
</div>`

const mobCss = `<style id="dhb-mob-nav-css">
  .dhb-mob-nav {
    display: grid;
    gap: 1rem;
    justify-items: center;
    margin: 2rem auto 1rem;
  }
  .dhb-mob-nav a {
    text-decoration: none;
    color: inherit;
  }
  .dhb-mob-nav .dhb-mob-cta { color: #c4a035; }
</style>`

// Insert mobile nav into modal after title if not present
if (!html.includes('class="dhb-mob-nav"')) {
  if (html.includes('data-part="h" class="h1 a-center">Menu</div>')) {
    html = html.replace(
      'data-part="h" class="h1 a-center">Menu</div>',
      `data-part="h" class="h1 a-center">Menu</div>${mobileNav}`,
    )
    console.log('injected mob nav after Menu title')
  } else {
    console.log('Menu title marker not found; skipping mob inject')
  }
}

if (html.includes('id="dhb-mob-nav-css"')) {
  html = html.replace(/<style id="dhb-mob-nav-css">[\s\S]*?<\/style>/, mobCss)
} else {
  html = html.replace('</head>', `${mobCss}</head>`)
}

fs.writeFileSync(path, html)
console.log('mob nav', html.includes('dhb-mob-nav'))
