import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

const quoteCss = `
  /* Quote section UI fixes */
  #quote.dhb-block {
    color: #f3f3ec;
  }
  #quote .dhb-head {
    max-width: min(72rem, 100%);
    margin-bottom: 3.2rem;
    overflow: visible;
  }
  #quote .dhb-head h2,
  #quote .dhb-quote-title {
    margin: 0 0 1.4rem;
    line-height: 1.05 !important;
    white-space: nowrap;
    overflow: visible;
    letter-spacing: 0.01em;
  }
  #quote .dhb-head p {
    position: relative;
    z-index: 1;
    margin-top: 0.35rem;
    max-width: 42rem;
    color: rgba(243, 243, 236, 0.78);
    opacity: 1;
  }
  @media (max-width: 991px) {
    #quote .dhb-head h2,
    #quote .dhb-quote-title {
      white-space: normal;
      font-size: clamp(2.4rem, 9vw, 4.5rem);
      line-height: 1.08 !important;
    }
  }
  #quote .dhb-panel,
  #quote .dhb-meta,
  #quote .dhb-meta a {
    color: #f3f3ec;
  }
  #quote .dhb-panel > .p1 {
    opacity: 0.82;
  }
  #quote .dhb-form {
    color: #f3f3ec;
    visibility: visible !important;
    opacity: 1 !important;
    transform: none !important;
  }
  #quote .dhb-form input,
  #quote .dhb-form select,
  #quote .dhb-form textarea {
    color: #f3f3ec !important;
    caret-color: #f3f3ec;
    background: rgba(243, 243, 236, 0.08) !important;
    border: 1px solid rgba(243, 243, 236, 0.38) !important;
    -webkit-text-fill-color: #f3f3ec;
  }
  #quote .dhb-form input::placeholder,
  #quote .dhb-form textarea::placeholder {
    color: rgba(243, 243, 236, 0.55) !important;
    opacity: 1;
    -webkit-text-fill-color: rgba(243, 243, 236, 0.55);
  }
  #quote .dhb-form select {
    background-color: rgba(243, 243, 236, 0.08) !important;
    background-image: linear-gradient(45deg, transparent 50%, #f3f3ec 50%),
      linear-gradient(135deg, #f3f3ec 50%, transparent 50%) !important;
    background-position: calc(100% - 18px) calc(50% - 3px), calc(100% - 12px) calc(50% - 3px) !important;
    background-size: 6px 6px, 6px 6px !important;
    background-repeat: no-repeat !important;
  }
  #quote .dhb-form select option {
    color: #17233b;
    background: #f3f3ec;
  }
  #quote .dhb-form input:focus,
  #quote .dhb-form select:focus,
  #quote .dhb-form textarea:focus {
    border-color: rgba(243, 243, 236, 0.85) !important;
    background: rgba(243, 243, 236, 0.12) !important;
  }
  #quote .dhb-form input[type="date"] {
    color-scheme: dark;
  }
  #quote .dhb-form input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.85;
    cursor: pointer;
  }
  #quote .dhb-form button[type="submit"] {
    border: 1px solid #f3f3ec !important;
    background: #f3f3ec !important;
    color: #17233b !important;
    -webkit-text-fill-color: #17233b;
  }
  #quote .dhb-form [data-status] {
    color: rgba(243, 243, 236, 0.8);
  }
`

// Inject / replace quote CSS
if (html.includes('id="dhb-quote-css"')) {
  html = html.replace(/<style id="dhb-quote-css">[\s\S]*?<\/style>/, `<style id="dhb-quote-css">${quoteCss}</style>`)
} else {
  html = html.replace('</style><style id="dhb-hide-sticky-nav">', `</style><style id="dhb-quote-css">${quoteCss}</style><style id="dhb-hide-sticky-nav">`)
  if (!html.includes('id="dhb-quote-css"')) {
    html = html.replace('</head>', `<style id="dhb-quote-css">${quoteCss}</style></head>`)
  }
}

// Fix quote heading markup: single-line title, no colliding reveal overflow
const oldQuoteHead = `<div class="dhb-head">
      <h2 data-scroll-reveal="h" class="h1 a-center">Request a Quote</h2>
      <p data-scroll-reveal="p" class="p1 a-center">Transparent pricing, no hidden surprises. Tell us about your dream project.</p>
    </div>`

const newQuoteHead = `<div class="dhb-head">
      <h2 class="h2 a-center dhb-quote-title">Request a Quote</h2>
      <p class="p1 a-center">Transparent pricing. No hidden surprises. Tell us about your dream project.</p>
    </div>`

if (html.includes(oldQuoteHead)) {
  html = html.replace(oldQuoteHead, newQuoteHead)
} else if (html.includes('>Request a Quote</h2>')) {
  html = html.replace(
    /<div class="dhb-head">\s*<h2[^>]*>Request a Quote<\/h2>\s*<p[^>]*>[\s\S]*?<\/p>\s*<\/div>/,
    newQuoteHead,
  )
}

// Make form always visible (remove stuck scroll-reveal hide)
html = html.replace(
  '<form class="dhb-form" data-scroll-reveal="ctn" id="dhb-quote-form">',
  '<form class="dhb-form" id="dhb-quote-form">',
)
html = html.replace(
  '<div class="dhb-panel" data-scroll-reveal="p">\n        <p class="p1">A short conversation is enough',
  '<div class="dhb-panel">\n        <p class="p1">A short conversation is enough',
)

// Keep plum/brand color background; contrast is forced in #quote CSS above

fs.writeFileSync(path, html)

console.log('quote css', html.includes('id="dhb-quote-css"'))
console.log('single-line class', html.includes('dhb-quote-title'))
console.log('form no reveal', html.includes('<form class="dhb-form" id="dhb-quote-form">'))
console.log('keeps color theme', html.includes('id="quote" data-bg="color"'))
console.log(
  'div diff',
  (html.match(/<div\b/g) || []).length - (html.match(/<\/div>/g) || []).length,
)
