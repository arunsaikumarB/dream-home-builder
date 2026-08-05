import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

function navItem(label, href, extraClass = '') {
  const cls = extraClass ? ` class="${extraClass}"` : ''
  return `<a href="${href}"${cls}>${label}</a>`
}

const topnav = `<nav class="dhb-topnav" aria-label="Primary">
  ${navItem('Home', '#hero')}
  ${navItem('Services', '#services')}
  ${navItem('Get Inspired', '#inspired')}
  ${navItem('Testimonials', '#testimonials')}
  ${navItem('Contact Us', '#contact')}
  ${navItem('Request Quote', '#quote', 'is-cta')}
</nav>`

const css = `<style id="dhb-topnav-css">
  .dhb-topnav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 120;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.6rem 2.1rem;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(23, 35, 59, 0.06);
  }
  .dhb-topnav a {
    color: #17233b;
    text-decoration: none;
    font-family: "Maison Neue Extended", "Maison Neue", Arial, sans-serif;
    font-size: 0.82rem;
    letter-spacing: 0.02em;
    line-height: 1;
    transition: opacity 0.25s ease, color 0.25s ease;
  }
  .dhb-topnav a:hover { opacity: 0.65; }
  .dhb-topnav a.is-cta {
    color: #c4a035;
    font-weight: 600;
  }
  .dhb-topnav a.is-cta:hover {
    opacity: 1;
    color: #a88720;
  }
  /* Keep Era circular logo below the bar */
  .header-logo {
    top: 4.25rem !important;
  }
  @media (max-width: 991px) {
    .dhb-topnav {
      display: none;
    }
    .header-logo {
      top: unset !important;
    }
  }
</style>`

// Desk nav list — also fill with Era-style items as backup for right rail (hidden on purpose earlier)
const deskLinks = [
  ['Home', '#hero'],
  ['Services', '#services'],
  ['Get Inspired', '#inspired'],
  ['Testimonials', '#testimonials'],
  ['Contact Us', '#contact'],
  ['Request Quote', '#quote'],
]
  .map(([label, href]) => {
    const isCta = label === 'Request Quote'
    return `<a hover-nav-item="" aria-label="${label}" href="${href}" class="nav-item w-inline-block${isCta ? ' dhb-nav-cta' : ''}"><div class="nav-item_label"><div hover="text" class="nav-item_label_text"><div class="l1">${label}</div></div><div hover="text" class="nav-item_label_text is-2"><div class="l1">${label}</div></div></div></a>`
  })
  .join('<div class="u-4"></div>')

// 1) Insert / replace topnav after header-logo block start area — place before header-nav
if (html.includes('class="dhb-topnav"')) {
  html = html.replace(/<nav class="dhb-topnav"[\s\S]*?<\/nav>/, topnav)
} else {
  html = html.replace(
    '<div data-theme="" class="header-nav">',
    `${topnav}<div data-theme="" class="header-nav">`,
  )
}

// 2) Fill f-desk (keep hidden — topnav is primary; desk remains available if needed)
html = html.replace(
  '<div class="header-nav_list f-desk"></div>',
  `<div class="header-nav_list f-desk">${deskLinks}</div>`,
)

// 3) CSS: show topnav, keep vertical desk nav hidden, style CTA
const hideCss = `<style id="dhb-hide-sticky-nav">
  /* Era vertical sticky rail stays hidden — horizontal topnav is the primary nav */
  .header-nav_list.f-desk{display:none!important}
  .header-nav_list.f-desk .dhb-nav-cta .l1{color:#c4a035}
</style>`

if (html.includes('id="dhb-hide-sticky-nav"')) {
  html = html.replace(/<style id="dhb-hide-sticky-nav">[\s\S]*?<\/style>/, hideCss)
}

if (html.includes('id="dhb-topnav-css"')) {
  html = html.replace(/<style id="dhb-topnav-css">[\s\S]*?<\/style>/, css)
} else {
  html = html.replace('</head>', `${css}</head>`)
}

// 4) Update mobile menu links if a simple list exists
const menuReplacements = [
  ['href="/apartments"', 'href="#inspired"'],
  ['>Apartments<', '>Get Inspired<'],
  ['aria-label="Apartments"', 'aria-label="Get Inspired"'],
]
for (const [from, to] of menuReplacements) {
  if (html.includes(from)) html = html.split(from).join(to)
}

// Inject mobile menu extras near Contact if missing Get Inspired / Testimonials
if (html.includes('data-modal-menu="mob"') && !html.includes('href="#inspired"')) {
  // try add after a contact menu link inside modal
  html = html.replace(
    /(data-modal-menu="mob"[\s\S]*?href="#contact"[^>]*>)/,
    `$1`,
  )
}

fs.writeFileSync(path, html)

console.log('topnav', html.includes('class="dhb-topnav"'))
console.log('cta', html.includes('is-cta">Request Quote'))
console.log('css', html.includes('dhb-topnav-css'))
console.log('desk filled', html.includes('header-nav_list f-desk"><a'))
console.log(
  'div diff',
  (html.match(/<div\b/g) || []).length - (html.match(/<\/div>/g) || []).length,
)
