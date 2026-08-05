import fs from 'node:fs'
import { execSync } from 'node:child_process'

const root = process.cwd()

// 1) Restore clean Era homepage
fs.copyFileSync('era-mirror-backup/index.html', 'public/index.html')
console.log('restored index from backup')

// 2) Re-apply brand + content pipeline in order
const steps = [
  'scripts/inject-dhb.mjs',
  'scripts/rename-brand.mjs',
  'scripts/fix-logo-ring.mjs',
  'scripts/rebuild-home.mjs',
  'scripts/fix-dhb-sections.mjs',
  'scripts/fix-contact-quote.mjs',
]

for (const step of steps) {
  console.log('\n>>', step)
  execSync(`node ${step}`, { stdio: 'inherit', cwd: root })
}

// 3) Carefully remove ONLY Select an Apartment link from header (no greed)
let html = fs.readFileSync('public/index.html', 'utf8')
const before = html
html = html.replace(
  /<a hover-link=""[\s\S]*?<div hover="text" class="h6">Select <br\/>an Apartment<\/div>[\s\S]*?<\/a><div class="u-24"><\/div>/g,
  '',
)
html = html
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
  .split('href="/apartments"')
  .join('href="#services"')

// Inject useful nav links before Contact Us if missing
if (!html.includes('href="#inspired"')) {
  html = html.replace(
    /(<a[^>]*aria-label="Contact Us"[^>]*>)/,
    `<a hover-nav-item="" aria-label="Services" href="#services" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Services</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Services</div></div></div></a><div class="u-4"></div><a hover-nav-item="" aria-label="Get Inspired" href="#inspired" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Get Inspired</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Get Inspired</div></div></div></a><div class="u-4"></div><a hover-nav-item="" aria-label="Testimonials" href="#testimonials" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Testimonials</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Testimonials</div></div></div></a><div class="u-4"></div>$1`,
  )
}

// 4) Preloader failsafe so page can never stay white forever
if (!html.includes('dhb-preloader-failsafe')) {
  html = html.replace(
    '</head>',
    `<style id="dhb-preloader-failsafe">
body.dhb-ready [data-preloader],
body.dhb-ready [data-master-preloader]{
  opacity:0!important;visibility:hidden!important;pointer-events:none!important;
}
</style>
<script id="dhb-preloader-failsafe-js">
(()=>{const ready=()=>document.body&&document.body.classList.add('dhb-ready');
window.addEventListener('load',()=>setTimeout(ready,800));
setTimeout(ready,2500);
})();
</script>
</head>`,
  )
}

fs.writeFileSync('public/index.html', html)

const out = fs.readFileSync('public/index.html', 'utf8')
const opens = (out.match(/<div\b/g) || []).length
const closes = (out.match(/<\/div>/g) || []).length
console.log('\nVERIFY')
console.log('div diff', opens - closes)
console.log('main', out.includes('<main'))
console.log('header-nav', out.includes('header-nav'))
console.log('Select apartment', /Select\s*(<br\s*\/?>)?\s*an Apartment/i.test(out))
console.log('services', out.includes('id="services"'))
console.log('inspired', out.includes('id="inspired"'))
console.log('testimonials', out.includes('id="testimonials"'))
console.log('contact', out.includes('id="contact"'))
console.log('quote', out.includes('id="quote"'))
console.log('failsafe', out.includes('dhb-preloader-failsafe'))
console.log('Dream Home Builder', out.includes('Dream Home Builder'))
const navIdx = out.indexOf('class="header-nav"')
console.log('nav after logo?', out.slice(Math.max(0, navIdx - 120), navIdx + 40).includes('header-logo'))
console.log('nav context', out.slice(Math.max(0, navIdx - 100), navIdx + 60).replace(/\s+/g, ' '))
