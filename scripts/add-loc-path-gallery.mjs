import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

const images = [
  { src: '/images/home/exterior-modern-1.webp', label: 'Exterior', alt: 'Modern custom home exterior' },
  { src: '/images/services/construction.jpeg', label: 'Build', alt: 'Home construction work in progress' },
  { src: '/images/projects/elevation/modern-elevation1.jpg', label: 'Elevation', alt: 'Modern home elevation' },
  { src: '/images/home/interior-modern-1.webp', label: 'Interior', alt: 'Modern interior living space' },
  { src: '/images/home/interior-kitchen-1.webp', label: 'Kitchen', alt: 'Custom kitchen interior' },
  { src: '/images/services/renovation.webp', label: 'Renovation', alt: 'Home renovation work scene' },
  { src: '/images/projects/living/living-1.jpg', label: 'Living', alt: 'Finished living room interior' },
  { src: '/images/projects/elevation/modern-elevation3.jpg', label: 'Exterior', alt: 'Luxury home exterior facade' },
  { src: '/images/projects/interior/interior-2.jpg', label: 'Interior', alt: 'Finished interior details' },
  { src: '/images/projects/kitchen/kitchen-2.jpg', label: 'Kitchen', alt: 'Custom kitchen craftsmanship' },
]

const gallery = `<div class="loc-path-s_path scrollbar-none dhb-work-path">
<div class="dhb-work-track">
${images
  .map(
    (img) => `<figure class="dhb-work-card">
  <div class="img-w"><img loading="eager" src="${img.src}" alt="${img.alt}" class="img"/></div>
  <figcaption class="l1">${img.label}</figcaption>
</figure>`,
  )
  .join('')}
</div>
</div>`

const css = `<style id="dhb-work-path-css">
  .dhb-work-path {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    padding: 0.5rem 0 1rem;
  }
  .dhb-work-track {
    display: flex;
    gap: 1.25rem;
    width: max-content;
    padding: 0 2rem 0.5rem;
    align-items: flex-end;
  }
  .dhb-work-card {
    margin: 0;
    flex: 0 0 auto;
    width: min(22rem, 70vw);
  }
  .dhb-work-card:nth-child(even) {
    width: min(18rem, 62vw);
    margin-bottom: 2.5rem;
  }
  .dhb-work-card .img-w {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: color-mix(in srgb, currentColor 6%, transparent);
  }
  .dhb-work-card .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .dhb-work-card figcaption {
    margin-top: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.75;
  }
  @media (max-width: 991px) {
    .dhb-work-track { gap: 0.85rem; padding-inline: 1rem; }
    .dhb-work-card { width: min(16rem, 78vw); }
    .dhb-work-card:nth-child(even) { width: min(14rem, 70vw); margin-bottom: 1.5rem; }
  }
</style>`

// Replace the Era location path SVGs with the image gallery
const pathRe =
  /<div class="loc-path-s_path scrollbar-none">[\s\S]*?<\/div><\/div><\/div><div class="u-48"><\/div><\/div><\/div><div class="loc-path-w_flower">/

if (!pathRe.test(html)) {
  console.error('loc-path block not found')
  process.exit(1)
}

html = html.replace(
  pathRe,
  `${gallery}</div><div class="u-48"></div></div></div><div class="loc-path-w_flower">`,
)

// Also refresh the big background image under this scroll to a strong exterior
html = html.replace(
  'src="/images/projects/elevation/modern-elevation2.jpg" loading="eager" sizes="(max-width: 1920px) 100vw, 1920px" srcset="/images/projects/elevation/modern-elevation2.jpg 500w, /images/projects/elevation/modern-elevation2.jpg 800w, /images/projects/elevation/modern-elevation2.jpg 1080w, /images/projects/elevation/modern-elevation2.jpg 1920w" alt="Coastal residential complex with pools, beachfront, roads, and distant mountains under clear blue sky."',
  'src="/images/home/exterior-modern-1.webp" loading="eager" sizes="(max-width: 1920px) 100vw, 1920px" srcset="/images/home/exterior-modern-1.webp 500w, /images/home/exterior-modern-1.webp 800w, /images/home/exterior-modern-1.webp 1080w, /images/home/exterior-modern-1.webp 1920w" alt="Custom Dream Home Builder exterior"',
)

if (html.includes('id="dhb-work-path-css"')) {
  html = html.replace(/<style id="dhb-work-path-css">[\s\S]*?<\/style>/, css)
} else {
  html = html.replace('</head>', `${css}</head>`)
}

fs.writeFileSync(path, html)

console.log('gallery cards', images.length)
console.log('has gallery', html.includes('dhb-work-track'))
console.log('has css', html.includes('dhb-work-path-css'))
console.log('old svg gone', !html.includes('loc_path_labels.svg'))
console.log('bg exterior', html.includes('/images/home/exterior-modern-1.webp'))
