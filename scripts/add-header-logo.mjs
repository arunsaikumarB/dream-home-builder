import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const srcLogo =
  'C:\\Users\\LSITC210\\.cursor\\projects\\c-Users-LSITC210-Downloads-Luxury-home-builder-V2\\assets\\c__Users_LSITC210_AppData_Roaming_Cursor_User_workspaceStorage_b15ed1725c488a8fe97b1a31556085bd_images_Gemini_Generated_Image_4gx46o4gx46o4gx4-0f57f6e4-e981-423d-891e-230a109abae1.png'

const destDir = path.join(root, 'public', 'images')
const destLogo = path.join(destDir, 'dhb-logo.png')

if (!fs.existsSync(srcLogo)) {
  console.error('SOURCE LOGO MISSING:', srcLogo)
  process.exit(1)
}

fs.mkdirSync(destDir, { recursive: true })
fs.copyFileSync(srcLogo, destLogo)
console.log('copied logo ->', path.relative(root, destLogo), fs.statSync(destLogo).size, 'bytes')

const htmlPath = path.join(root, 'public', 'index.html')
let html = fs.readFileSync(htmlPath, 'utf8')

const logoLink = `<a href="#hero" class="dhb-topnav-logo" aria-label="Dream Home Builder home">
  <img src="/images/dhb-logo.png" alt="Dream Home Builder" width="72" height="72" decoding="async" />
</a>`

const topnavMarkup = `<nav class="dhb-topnav" aria-label="Primary">
  ${logoLink}
  <div class="dhb-topnav-links">
  <a href="#hero">Home</a>
  <a href="#services">Services</a>
  <a href="#inspired">Get Inspired</a>
  <a href="#testimonials">Testimonials</a>
  <a href="#contact">Contact Us</a>
  <a href="#quote" class="is-cta">Request Quote</a>
  </div>
</nav>`

const topnavCss = `<style id="dhb-topnav-css">
  .dhb-topnav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 120;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.25rem 2rem;
    padding: 0.55rem 1.75rem;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(23, 35, 59, 0.06);
  }
  .dhb-topnav-logo {
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
    line-height: 0;
    text-decoration: none;
  }
  .dhb-topnav-logo img {
    display: block;
    width: 68px;
    height: auto;
    max-height: 68px;
    object-fit: contain;
  }
  .dhb-topnav-links {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.4rem 2rem;
    margin-left: auto;
  }
  .dhb-topnav a:not(.dhb-topnav-logo) {
    color: #17233b;
    text-decoration: none;
    font-family: "Maison Neue Extended", "Maison Neue", Arial, sans-serif;
    font-size: 0.82rem;
    letter-spacing: 0.02em;
    line-height: 1;
    transition: opacity 0.25s ease, color 0.25s ease;
  }
  .dhb-topnav a:not(.dhb-topnav-logo):hover { opacity: 0.65; }
  .dhb-topnav a.is-cta {
    color: #c4a035;
    font-weight: 600;
  }
  .dhb-topnav a.is-cta:hover {
    opacity: 1;
    color: #a88720;
  }
  @media (max-width: 991px) {
    .dhb-topnav {
      display: flex;
      padding: 0.45rem 1rem;
    }
    .dhb-topnav-links { display: none; }
    .dhb-topnav-logo img {
      width: 56px;
      max-height: 56px;
    }
  }
</style>`

// Replace existing topnav block exactly once
const topnavRe = /<nav class="dhb-topnav"[\s\S]*?<\/nav>/
if (!topnavRe.test(html)) {
  console.error('dhb-topnav not found — aborting to avoid mistakes')
  process.exit(1)
}
html = html.replace(topnavRe, topnavMarkup)

if (!html.includes('id="dhb-topnav-css"')) {
  console.error('dhb-topnav-css missing — aborting')
  process.exit(1)
}
html = html.replace(/<style id="dhb-topnav-css">[\s\S]*?<\/style>/, topnavCss)

// Also show logo in mobile menu header area if present
if (html.includes('class="dhb-mob-nav"') && !html.includes('dhb-mob-logo')) {
  html = html.replace(
    '<div class="dhb-mob-nav">',
    `<div class="dhb-mob-logo"><img src="/images/dhb-logo.png" alt="Dream Home Builder" width="96" height="96" decoding="async" /></div><div class="dhb-mob-nav">`,
  )
}

const mobCssExtra = `
  .dhb-mob-logo {
    display: flex;
    justify-content: center;
    margin: 1rem auto 0.5rem;
  }
  .dhb-mob-logo img {
    width: 96px;
    height: auto;
    object-fit: contain;
  }
`

if (html.includes('id="dhb-mob-nav-css"')) {
  html = html.replace(
    /<style id="dhb-mob-nav-css">([\s\S]*?)<\/style>/,
    (m, body) => {
      if (body.includes('dhb-mob-logo')) return m
      return `<style id="dhb-mob-nav-css">${body}${mobCssExtra}</style>`
    },
  )
}

fs.writeFileSync(htmlPath, html)

// Verify
const out = fs.readFileSync(htmlPath, 'utf8')
const checks = {
  logoFile: fs.existsSync(destLogo),
  logoInNav: out.includes('dhb-topnav-logo') && out.includes('/images/dhb-logo.png'),
  linksWrap: out.includes('dhb-topnav-links'),
  home: out.includes('href="#hero">Home</a>'),
  quote: out.includes('is-cta">Request Quote</a>'),
  singleTopnav: (out.match(/class="dhb-topnav"/g) || []).length === 1,
  divBalance:
    (out.match(/<div\b/g) || []).length - (out.match(/<\/div>/g) || []).length === 0,
}
console.log(checks)
if (!Object.values(checks).every(Boolean)) {
  console.error('VERIFICATION FAILED')
  process.exit(1)
}
console.log('OK — logo added to header navbar')
