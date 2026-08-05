import fs from 'node:fs'

const indexPath = 'public/index.html'
let html = fs.readFileSync(indexPath, 'utf8')

const homes = [
  ['/images/projects/elevation/modern-elevation1.jpg', 'Modern New Jersey custom home elevation'],
  ['/images/projects/elevation/modern-elevation2.jpg', 'Luxury villa exterior in New Jersey'],
  ['/images/projects/elevation/modern-elevation3.jpg', 'Custom Dream Home Builder residence'],
  ['/images/projects/elevation/modern-elevation4.jpg', 'Contemporary New Jersey villa'],
  ['/images/home/exterior-modern-1.webp', 'Modern luxury home exterior'],
  ['/images/home/colonial-modern.webp', 'Colonial modern New Jersey home'],
]

const galleryHtml = `
<div class="dhb-nj-homes" aria-label="New Jersey luxury homes and villas">
${homes
  .map(
    ([src, alt]) => `  <figure>
    <img src="${src}" alt="${alt}" loading="lazy" decoding="async" />
  </figure>`,
  )
  .join('\n')}
</div>`

// Insert gallery after the lead headline, before mobile spacer / bottom desc
if (html.includes('class="dhb-nj-homes"')) {
  html = html.replace(/<div class="dhb-nj-homes"[\s\S]*?<\/div>/, galleryHtml.trim())
} else {
  const marker =
    '<div class="grid"><div class="info-s_lead"><h3 data-part="p" class="h4 a-center">New Jersey villas and custom homes'
  const idx = html.indexOf(marker)
  if (idx < 0) {
    console.error('loc-info lead not found')
    process.exit(1)
  }
  // Find end of that grid block: </div></div> after the h3
  const afterLead = html.indexOf('</div></div>', idx)
  if (afterLead < 0) {
    console.error('lead close not found')
    process.exit(1)
  }
  const insertAt = afterLead + '</div></div>'.length
  html = html.slice(0, insertAt) + galleryHtml + html.slice(insertAt)
}

const css = `<style id="dhb-nj-homes-css">
  .dhb-nj-homes {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(0.65rem, 1.4vw, 1.15rem);
    width: min(58rem, 78vw);
    margin: clamp(1.75rem, 3.5vh, 2.75rem) auto 0;
    position: relative;
    z-index: 3;
  }
  .dhb-nj-homes figure {
    margin: 0;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: rgba(6, 54, 112, 0.06);
  }
  .dhb-nj-homes img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .dhb-nj-homes figure:hover img {
    transform: scale(1.04);
  }
  .loc-info-s .info-s_lead,
  .loc-info-s .info-s_desc {
    max-width: min(52rem, 72vw);
    margin-left: auto;
    margin-right: auto;
  }
  .loc-info-s_b {
    margin-top: clamp(1.25rem, 2.5vh, 2rem);
  }
  @media (max-width: 991px) {
    .dhb-nj-homes {
      width: min(92vw, 40rem);
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .dhb-nj-homes figure:nth-child(n + 5) {
      display: none;
    }
  }
  @media (max-width: 560px) {
    .dhb-nj-homes {
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }
  }
</style>`

if (html.includes('id="dhb-nj-homes-css"')) {
  html = html.replace(/<style id="dhb-nj-homes-css">[\s\S]*?<\/style>/, css)
} else {
  html = html.replace('</head>', `${css}</head>`)
}

const divDiff =
  (html.match(/<div\b/g) || []).length - (html.match(/<\/div>/g) || []).length

fs.writeFileSync(indexPath, html)
console.log({
  divDiff,
  gallery: html.includes('dhb-nj-homes'),
  images: (html.match(/dhb-nj-homes[\s\S]*?<\/div>/)[0].match(/<img /g) || []).length,
})
