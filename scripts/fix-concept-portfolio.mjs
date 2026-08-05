import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

const replacements = [
  // Panel 1 — Concept → Portfolio (Get Inspired style)
  ['>The concept<', '>Portfolio<'],
  [
    '>Dream Home Builder is a custom luxury builder designed around privacy, craftsmanship and timeless New Jersey living<',
    '>A living gallery of custom homes, renovations and interiors — crafted around privacy, quality and timeless New Jersey living<',
  ],
  [
    '>Inspired by enduring craftsmanship, every project combines contemporary architecture with warm materials, smart layouts and carefully curated finishes.<',
    '>Seeing is believing. Explore exceptional elevations, kitchens, bedrooms and living spaces — and let new ideas be born.<',
  ],

  // Panel 2 — Era “New Golden Mile” → project categories
  [
    '<span class="loc-intro-s_title_line is-1">New </span><span class="loc-intro-s_title_line is-2 mob_a-right">Golden </span><span class="loc-intro-s_title_line">Mile</span>',
    '<span class="loc-intro-s_title_line is-1">Our </span><span class="loc-intro-s_title_line is-2 mob_a-right">Best </span><span class="loc-intro-s_title_line">Work</span>',
  ],
  [
    '>From new construction to renovations and interiors, we combine privacy with effortless collaboration. A process designed not around transactions — but around homes you’ll return to every day.<',
    '>From new construction to kitchens, baths and full interiors — every project in our portfolio is built to feel personal, polished and ready to live in.<',
  ],

  // Panel 3 — Era coast line → portfolio invite
  [
    '<span data-scroll-reveal="h" class="loc-path-s_title_line">The coast you wanted </span><span data-scroll-reveal="a" class="loc-path-s_title_a a2">yours </span><span data-scroll-reveal="h" class="loc-path-s_title_line">this year</span>',
    '<span data-scroll-reveal="h" class="loc-path-s_title_line">The home you imagined </span><span data-scroll-reveal="a" class="loc-path-s_title_a a2">yours </span><span data-scroll-reveal="h" class="loc-path-s_title_line">this year</span>',
  ],
]

let changed = 0
for (const [from, to] of replacements) {
  if (!html.includes(from)) {
    console.log('MISSING:', from.slice(0, 80))
    continue
  }
  html = html.replace(from, to)
  changed++
  console.log('ok:', to.replace(/<[^>]+>/g, '').slice(0, 60))
}

fs.writeFileSync(path, html)
console.log('replacements applied', changed)
