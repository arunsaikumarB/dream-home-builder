import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

const tips = [
  {
    id: 'crafted-to-endure',
    title: 'Living Room',
    text: 'Open living spaces with warm materials, natural light and finishes designed for everyday New Jersey living.',
    img: '/images/projects/living/living-1.jpg',
    alt: 'Custom living room interior',
  },
  {
    id: 'light-flow',
    title: 'Kitchen',
    text: 'Expansive openings and carefully planned layouts create bright kitchens that flow into dining and living areas.',
    img: '/images/home/interior-kitchen-1.webp',
    alt: 'Custom kitchen interior',
  },
  {
    id: 'your-private-sanctuary',
    title: 'Interior Detail',
    text: 'Every interior is tailored — from millwork and lighting to curated finishes that feel personal, not production.',
    img: '/images/projects/interior/interior-2.jpg',
    alt: 'Custom home interior detail',
  },
]

const css = `<style id="dhb-tip-images-css">
  .floating-tip-card .dhb-tip-img {
    width: 100%;
    margin: 0 0 1rem;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    background: rgba(23, 35, 59, 0.06);
  }
  .floating-tip-card .dhb-tip-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .floating-tip-card_b {
    display: flex;
    flex-direction: column;
  }
  /* Modal tip variants if present */
  [data-modal-tip] .dhb-tip-img,
  .modal_tip .dhb-tip-img {
    width: 100%;
    margin: 0 0 1rem;
    overflow: hidden;
    aspect-ratio: 4 / 3;
  }
  [data-modal-tip] .dhb-tip-img img,
  .modal_tip .dhb-tip-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
</style>`

for (const tip of tips) {
  const marker = `floating-tip="${tip.id}"`
  const start = html.indexOf(marker)
  if (start === -1) {
    console.log('MISSING tip', tip.id)
    continue
  }

  // Replace title inside this tip card
  const titleRe = new RegExp(
    `(floating-tip="${tip.id}"[\\s\\S]*?<div class="floating-tip-card_t"><h1 class="h5">)[^<]+(</h1></div>)`,
  )
  if (titleRe.test(html)) {
    html = html.replace(titleRe, `$1${tip.title}$2`)
    console.log('title', tip.id, '->', tip.title)
  } else {
    console.log('title miss', tip.id)
  }

  // Replace body paragraph and inject image
  const bodyRe = new RegExp(
    `(floating-tip="${tip.id}"[\\s\\S]*?<div class="floating-tip-card_b">)\\s*<p class="p1">[\\s\\S]*?</p>`,
  )
  const bodyHtml = `$1<div class="dhb-tip-img"><img src="${tip.img}" alt="${tip.alt}" loading="lazy"/></div><p class="p1">${tip.text}</p>`
  if (bodyRe.test(html)) {
    html = html.replace(bodyRe, bodyHtml)
    console.log('body+img', tip.id)
  } else {
    console.log('body miss', tip.id)
  }
}

// Also update any duplicate title strings that might appear in modal tips elsewhere
const plainReplacements = [
  ['>Crafted to Endure<', '>Living Room<'],
  ['>Light &amp; Flow<', '>Kitchen<'],
  ['>Light & Flow<', '>Kitchen<'],
  ['>Your Private Sanctuary<', '>Interior Detail<'],
  [
    'Natural stone façades were selected for their timeless appearance, durability and ease of maintenance, allowing the architecture to age beautifully over time',
    tips[0].text,
  ],
  [
    'Terraces, rooftop solariums and expansive openings maximize natural light while creating a seamless indoor outdoor lifestyle.',
    tips[1].text,
  ],
  [
    'Instead of one-size-fits-all plans, every detail is tailored — making each project feel like a private residence, not a standard apartment building.',
    tips[2].text,
  ],
]

for (const [from, to] of plainReplacements) {
  if (html.includes(from)) {
    // only replace remaining occurrences outside already-updated cards if any
    const count = html.split(from).length - 1
    html = html.split(from).join(to)
    console.log('replace x' + count, from.slice(0, 40))
  }
}

if (html.includes('id="dhb-tip-images-css"')) {
  html = html.replace(/<style id="dhb-tip-images-css">[\s\S]*?<\/style>/, css)
} else {
  html = html.replace('</head>', `${css}</head>`)
}

fs.writeFileSync(path, html)

for (const tip of tips) {
  console.log(
    tip.id,
    'img?',
    html.includes(tip.img),
    'title?',
    html.includes(`>${tip.title}<`),
  )
}
console.log(
  'div diff',
  (html.match(/<div\b/g) || []).length - (html.match(/<\/div>/g) || []).length,
)
