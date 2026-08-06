// One-off migration: converts the homepage's #quote section into a "Contact Us"
// tabbed panel (In Person / Virtual), marks the real "Request a Quote" CTAs so
// they open the shared popup instead of navigating, and injects that popup.
// Run once: node scripts/apply-contact-redesign.mjs
import fs from 'node:fs'
import path from 'node:path'
import { contactTabsHTML, CONTACT_TABS_JS } from './contact-tabs-partial.mjs'
import { QUOTE_MODAL_HTML, QUOTE_MODAL_MARKER } from './quote-modal-partial.mjs'

const p = path.join(process.cwd(), 'public', 'index.html')
let h = fs.readFileSync(p, 'utf8')
const before = h.length

const must = (cond, label) => {
  if (!cond) throw new Error('FAILED: ' + label)
}

// ---------- 1. link the shared subpages stylesheet (holds the tabs CSS) ----------
const cssLink = '<link href="/css/dhb-site.shared.min.css" rel="stylesheet" type="text/css"/>'
must(h.includes(cssLink), 'shared css link anchor')
if (!h.includes('/css/dhb-subpages.css')) {
  h = h.replace(cssLink, cssLink + '<link href="/css/dhb-subpages.css" rel="stylesheet" type="text/css"/>')
}

// ---------- 2. mark the real "Request a Quote" CTAs to open the popup ----------
const ctaSwaps = [
  ['<a href="/contact" class="is-cta">Request Quote</a>', '<a href="/contact" class="is-cta" data-open-quote>Request Quote</a>'],
  ['<a href="/contact" data-modal-close="menu" class="l1 dhb-mob-cta">Request Quote</a>', '<a href="/contact" data-modal-close="menu" class="l1 dhb-mob-cta" data-open-quote>Request Quote</a>'],
  ['<a class="dhb-footer-btn" href="/contact">Request a quote', '<a class="dhb-footer-btn" href="/contact" data-open-quote>Request a quote'],
  ['<a href="/contact">Request a Quote</a>', '<a href="/contact" data-open-quote>Request a Quote</a>'],
  ['<a class="dhb-cta l1" href="/contact">Start Your Project</a>', '<a class="dhb-cta l1" href="/contact" data-open-quote>Start Your Project</a>'],
]
for (const [from, to] of ctaSwaps) {
  must(h.includes(from), 'CTA swap source: ' + from.slice(0, 50))
  h = h.replace(from, to)
}

// ---------- 3. replace the #quote section with the Contact Us tabs ----------
const qStart = h.indexOf('<section id="quote"')
const qEnd = h.indexOf('</section>', qStart) + '</section>'.length
must(qStart > 0 && qEnd > qStart, '#quote section bounds')
const oldQuoteSection = h.slice(qStart, qEnd)
const mapSrc = (oldQuoteSection.match(/src="(https:\/\/www\.google\.com\/maps\/embed[^"]+)"/) || [])[1]
must(mapSrc, 'map src extracted from old #quote section')

const newQuoteSection = `<section id="quote" data-bg="dark" class="section clip theme_on-dark dhb-block dhb-navy-panel">
  <div class="dhb-inner">
    <div class="dhb-head">
      <h2 data-scroll-reveal="h" class="h1 a-center">Contact Us</h2>
      <p data-scroll-reveal="p" class="p1 a-center">In person at our Edison studio, or virtually from anywhere in New Jersey.</p>
    </div>
    ${contactTabsHTML({ mapSrc })}
  </div>
</section>`

h = h.slice(0, qStart) + newQuoteSection + h.slice(qEnd)

// ---------- 4. drop the now-redundant quote-form submit script ----------
// (the shared modal partial supplies its own copy of this same logic)
const scriptStart = h.indexOf("const quoteForm = document.getElementById('dhb-quote-form')")
must(scriptStart > 0, 'old quote-form script start')
const scriptOpenTag = h.lastIndexOf('<script>', scriptStart)
const scriptEnd = h.indexOf('</script>', scriptStart) + '</script>'.length
must(scriptOpenTag > 0 && scriptEnd > scriptOpenTag, 'old quote-form script bounds')
h = h.slice(0, scriptOpenTag) + h.slice(scriptEnd)

// ---------- 5. drop the old split-panel quote CSS (superseded by dhb-navy-panel + dhb-ctabs) ----------
const cssStart = h.indexOf('<style id="dhb-quote-css">')
must(cssStart > 0, 'old quote css start')
const cssEnd = h.indexOf('</style>', cssStart) + '</style>'.length
h = h.slice(0, cssStart) + h.slice(cssEnd)

// ---------- 6. inject the shared quote-modal popup + contact-tabs JS before </body> ----------
must(!h.includes(QUOTE_MODAL_MARKER), 'quote modal not already present')
const bodyClose = h.lastIndexOf('</body>')
must(bodyClose > 0, '</body> found')
h = h.slice(0, bodyClose) + QUOTE_MODAL_HTML + '\n' + CONTACT_TABS_JS + '\n' + h.slice(bodyClose)

fs.writeFileSync(p, h)
console.log('index.html: ' + before + ' -> ' + h.length + ' chars (' + (h.length - before) + ')')
console.log('CTAs marked data-open-quote:', ctaSwaps.length)
console.log('map src carried over:', mapSrc.slice(0, 50) + '...')
console.log('done')
