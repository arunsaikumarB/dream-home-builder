import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

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
    gap: 1rem 1.5rem;
    min-height: 52px;
    padding: 0.35rem 1.5rem;
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
    width: 42px;
    height: auto;
    max-height: 42px;
    object-fit: contain;
    background: transparent;
  }
  .dhb-topnav-links {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.85rem 1.55rem;
    margin-left: auto;
  }
  .dhb-topnav a:not(.dhb-topnav-logo) {
    color: #17233b;
    text-decoration: none;
    font-family: "Maison Neue Extended", "Maison Neue", Arial, sans-serif;
    font-size: 0.78rem;
    letter-spacing: 0.02em;
    line-height: 1;
    white-space: nowrap;
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
      min-height: 48px;
      padding: 0.3rem 0.9rem;
    }
    .dhb-topnav-links { display: none; }
    .dhb-topnav-logo img {
      width: 38px;
      max-height: 38px;
    }
  }
</style>`

if (!html.includes('id="dhb-topnav-css"')) {
  console.error('topnav css missing')
  process.exit(1)
}
html = html.replace(/<style id="dhb-topnav-css">[\s\S]*?<\/style>/, topnavCss)

// Update img attributes to smaller intrinsic hint (title still in image)
html = html.replace(
  /<a href="#hero" class="dhb-topnav-logo"[\s\S]*?<\/a>/,
  `<a href="#hero" class="dhb-topnav-logo" aria-label="Dream Home Builder home">
  <img src="/images/dhb-logo.png" alt="Dream Home Builder" width="42" height="42" decoding="async" />
</a>`,
)

// cache-bust logo so transparent version shows after hard refresh issues
html = html.replaceAll('/images/dhb-logo.png"', '/images/dhb-logo.png?v=2"')

fs.writeFileSync(path, html)
console.log('topnav css updated')
console.log('logo size 42px')
console.log('cache bust', html.includes('dhb-logo.png?v=2'))
