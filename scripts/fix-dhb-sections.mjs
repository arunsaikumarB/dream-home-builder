import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

const styleBlock = `
<style id="dhb-sections-css">
  .dhb-block { width: 100%; }
  .dhb-block .dhb-inner {
    width: min(120rem, calc(100% - 6rem));
    margin: 0 auto;
    padding: 6rem 0 7rem;
  }
  @media (max-width: 991px) {
    .dhb-block .dhb-inner {
      width: calc(100% - 3rem);
      padding: 4.5rem 0 5rem;
    }
  }

  .dhb-head {
    max-width: 52rem;
    margin: 0 auto 4rem;
    text-align: center;
  }
  .dhb-head h2 {
    margin: 0 0 1.2rem;
  }
  .dhb-head p {
    margin: 0 auto;
    max-width: 40rem;
    opacity: 0.72;
  }

  /* Services */
  .dhb-services-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2.4rem 1.6rem;
    align-items: stretch;
  }
  @media (max-width: 991px) {
    .dhb-services-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem 1.2rem; }
  }
  @media (max-width: 640px) {
    .dhb-services-grid { grid-template-columns: 1fr; gap: 2.2rem; }
  }
  .dhb-service {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
  .dhb-service figure {
    margin: 0 0 1.2rem;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    background: rgba(23, 35, 59, 0.06);
  }
  .dhb-service img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 1.1s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .dhb-service:hover img { transform: scale(1.05); }
  .dhb-service h3 {
    margin: 0 0 0.7rem;
  }
  .dhb-service p {
    margin: 0;
    opacity: 0.72;
    flex: 1;
  }

  /* Inspired */
  .dhb-tabs {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.55rem;
    margin: 0 auto 2.4rem;
    max-width: 56rem;
  }
  .dhb-tabs button {
    appearance: none;
    border: 1px solid color-mix(in srgb, currentColor 28%, transparent);
    background: transparent;
    color: inherit;
    padding: 0.75rem 1.1rem;
    cursor: pointer;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.72rem;
    line-height: 1;
    transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease, opacity 0.35s ease;
    opacity: 0.55;
  }
  .dhb-tabs button.is-active,
  .dhb-tabs button:hover {
    opacity: 1;
    background: currentColor;
    color: var(--_colors---other--bg, #f3f3ec);
    border-color: currentColor;
  }
  .dhb-gallery {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }
  @media (max-width: 991px) {
    .dhb-gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.85rem; }
  }
  @media (max-width: 640px) {
    .dhb-gallery { grid-template-columns: 1fr; }
  }
  .dhb-gal-item {
    appearance: none;
    border: 0;
    padding: 0;
    margin: 0;
    background: rgba(23, 35, 59, 0.08);
    aspect-ratio: 4 / 3;
    overflow: hidden;
    cursor: pointer;
    display: none;
  }
  .dhb-gal-item.is-visible { display: block; }
  .dhb-gal-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 1s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .dhb-gal-item:hover img { transform: scale(1.05); }
  .dhb-cta-wrap {
    display: flex;
    justify-content: center;
    margin-top: 2.8rem;
  }
  .dhb-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 3.2rem;
    padding: 0 1.6rem;
    border: 1px solid currentColor;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 0.72rem;
    transition: background 0.35s ease, color 0.35s ease;
  }
  .dhb-cta:hover {
    background: currentColor;
    color: var(--_colors---other--bg, #f3f3ec);
  }

  /* Testimonials */
  .dhb-testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0;
    border-top: 1px solid color-mix(in srgb, currentColor 16%, transparent);
  }
  @media (max-width: 991px) {
    .dhb-testimonials-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 640px) {
    .dhb-testimonials-grid { grid-template-columns: 1fr; }
  }
  .dhb-testimonial {
    padding: 2rem 1.4rem 2.2rem;
    border-bottom: 1px solid color-mix(in srgb, currentColor 16%, transparent);
    border-right: 1px solid color-mix(in srgb, currentColor 16%, transparent);
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
  @media (max-width: 991px) {
    .dhb-testimonial:nth-child(2n) { border-right: 0; }
  }
  @media (min-width: 992px) {
    .dhb-testimonial:nth-child(3n) { border-right: 0; }
  }
  @media (max-width: 640px) {
    .dhb-testimonial { border-right: 0; padding-left: 0; padding-right: 0; }
  }
  .dhb-testimonial .stars {
    letter-spacing: 0.16em;
    font-size: 0.78rem;
    opacity: 0.85;
    margin-bottom: 0.9rem;
  }
  .dhb-testimonial .quote {
    margin: 0;
    flex: 1;
  }
  .dhb-testimonial .who {
    margin-top: 1.2rem;
    opacity: 0.65;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: 0.72rem;
  }
</style>
`

const services = [
  ['New Home Construction', '/images/services/construction.jpeg', 'Building a custom home with Dream Home Builder is a journey of turning your unique vision into a structural masterpiece. Dileep oversees every phase, from sketches to the final walkthrough.'],
  ['House Renovation', '/images/services/renovation.webp', 'Remodeling for homeowners who love their neighborhood but need their space to evolve — kitchens, baths, and whole-home transformations with lasting quality.'],
  ['Architecture Design', '/images/services/architecture.webp', 'Thoughtful plans that balance beauty with structural logic, maximizing natural light and creating an effortless flow throughout the home.'],
  ['Interior Design', '/images/services/interior-design.jpg', 'Premium materials, custom cabinetry, and refined finishes that elevate a house into a home tailored to your lifestyle.'],
  ['Fixing & Support', '/images/services/support.webp', 'Reliable structural repairs, moisture protection, and ongoing maintenance that protect your investment over time.'],
  ['Painting', '/images/services/painting.jpg', 'Professional painting with clean lines, thorough preparation, and premium long-lasting finishes for interiors and exteriors.'],
]

const gallery = {
  elevation: ['modern-elevation1.jpg', 'modern-elevation2.jpg', 'modern-elevation3.jpg', 'modern-elevation4.jpg', 'elevation-10.webp', 'elevation-11.webp'],
  kitchen: ['kitchen-1.jpg', 'kitchen-2.jpg', 'kitchen-3.jpg', 'kitchen-4.jpg', 'kitchen-24.webp', 'kitchen-25.webp'],
  bedroom: ['bedroom-1.jpg', 'bedroom-2.webp', 'bedroom-3.jpg', 'bedroom-4.jpg', 'bedroom-5.jpg', 'bedroom-6.jpg'],
  bathroom: ['bath-1.JPG', 'bath-2.JPG', 'bath-4.jpg', 'bath-5.jpg', 'bath-9.webp', 'bath-11.webp'],
  living: ['living-1.jpg', 'living-2.jpg', 'living-3.jpg', 'living-4.jpg', 'living-5.jpg', 'living-6.jpg'],
  interior: ['interior-1.jpg', 'interior-2.jpg', 'interior-3.jpg', 'interior-5.jpg', 'interior-6.jpg', 'interior-7.jpg'],
  wetbar: ['wetbar1.webp', 'wetbar2.png', 'wetbar3.jpeg', 'wetbar4.webp', 'wetbar5.webp', 'wetbar6.webp'],
}

const labels = {
  elevation: 'Elevations',
  kitchen: 'Kitchens',
  bedroom: 'Bedrooms',
  bathroom: 'Bathrooms',
  living: 'Living Rooms',
  interior: 'Interiors',
  wetbar: 'Wet Bars',
}

const testimonials = [
  ['Dileep’s honesty was refreshing. We did a full kitchen remodel, and he was upfront about costs and timelines from day one.', 'Sarah J.', 'Kitchen Remodel'],
  ['Building a new home is stressful, but Dileep’s responsiveness made it manageable. He always answered his phone.', 'Madhu D.', 'New Construction'],
  ['The fast turnaround on our bathroom upgrade was incredible while maintaining quality.', 'Elena R.', 'Bathroom Upgrade'],
  ['Dileep guided us through our patio upgrade with great care. Communication was top-notch.', 'David L.', 'Outdoor Living'],
  ['He handled engineering and permits seamlessly for our open-concept renovation.', 'Priya K.', 'Structural Renovation'],
  ['Our custom basement finished ahead of schedule. We love the layout he suggested.', 'Linda K.', 'Basement Finishing'],
]

const serviceCards = services
  .map(
    ([title, img, text]) => `
      <article class="dhb-service" data-scroll-reveal="ctn">
        <figure><img src="${img}" alt="${title}" loading="lazy" /></figure>
        <h3 class="h5">${title}</h3>
        <p class="p1">${text}</p>
      </article>`,
  )
  .join('')

const tabs = Object.keys(gallery)
  .map(
    (id, i) =>
      `<button type="button" data-dhb-tab="${id}" class="l1${i === 0 ? ' is-active' : ''}">${labels[id]}</button>`,
  )
  .join('')

const galleryItems = Object.entries(gallery)
  .flatMap(([cat, files]) =>
    files.map(
      (file, idx) =>
        `<button type="button" class="dhb-gal-item${cat === 'elevation' ? ' is-visible' : ''}" data-dhb-cat="${cat}" aria-label="${labels[cat]} ${idx + 1}">
          <img src="/images/projects/${cat}/${file}" alt="" loading="lazy" />
        </button>`,
    ),
  )
  .join('')

const testimonialCards = testimonials
  .map(
    ([quote, name, project]) => `
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“${quote}”</p>
        <div class="who l1">${name} · ${project}</div>
      </article>`,
  )
  .join('')

const sections = `
<section id="services" data-bg="light" class="section clip theme_on-brand dhb-block">
  <div class="dhb-inner">
    <div class="dhb-head">
      <h2 data-scroll-reveal="h" class="h1 a-center">Services</h2>
      <p data-scroll-reveal="p" class="p1 a-center">Make your dream a reality. Let us turn our blueprints into your doorsteps.</p>
    </div>
    <div class="dhb-services-grid">${serviceCards}</div>
  </div>
</section>

<section id="inspired" data-bg="color" class="section clip theme_on-color dhb-block">
  <div class="dhb-inner">
    <div class="dhb-head">
      <h2 data-scroll-reveal="h" class="h1 a-center">Get Inspired</h2>
      <p data-scroll-reveal="p" class="p1 a-center">Seeing is believing. Explore exceptional designs and let new ideas be born.</p>
    </div>
    <div class="dhb-tabs" data-scroll-reveal="ctn" id="dhb-tabs">${tabs}</div>
    <div class="dhb-gallery" id="dhb-gallery">${galleryItems}</div>
    <div class="dhb-cta-wrap">
      <a class="dhb-cta l1" href="#quote">Start Your Project</a>
    </div>
  </div>
</section>

<section id="testimonials" data-bg="dark" class="section clip theme_on-dark dhb-block">
  <div class="dhb-inner">
    <div class="dhb-head">
      <h2 data-scroll-reveal="h" class="h1 a-center">Testimonials</h2>
      <p data-scroll-reveal="p" class="p1 a-center">Action speaks louder than words. Our clients say it even better.</p>
    </div>
    <div class="dhb-testimonials-grid">${testimonialCards}</div>
  </div>
</section>

<script>
(() => {
  const tabs = document.querySelectorAll('#dhb-tabs [data-dhb-tab]');
  const items = document.querySelectorAll('#dhb-gallery .dhb-gal-item');
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('data-dhb-tab');
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      items.forEach((item) => {
        item.classList.toggle('is-visible', item.getAttribute('data-dhb-cat') === id);
      });
    });
  });
})();
</script>
`

function replaceSection(source, id, replacement) {
  const marker = `id="${id}"`
  const startAttr = source.indexOf(marker)
  if (startAttr === -1) throw new Error(`missing ${id}`)
  const start = source.lastIndexOf('<section', startAttr)
  let depth = 0
  let j = start
  while (j < source.length) {
    const open = source.indexOf('<section', j)
    const close = source.indexOf('</section>', j)
    if (close === -1) break
    if (open !== -1 && open < close) {
      depth++
      j = open + 8
    } else {
      depth--
      j = close + 10
      if (depth === 0) {
        return source.slice(0, start) + replacement + source.slice(j)
      }
    }
  }
  throw new Error(`could not close ${id}`)
}

// inject/replace style
if (html.includes('id="dhb-sections-css"')) {
  html = html.replace(/<style id="dhb-sections-css">[\s\S]*?<\/style>/, styleBlock.trim())
} else {
  html = html.replace('</head>', `${styleBlock}</head>`)
}

// replace the three sections as one contiguous block from services through testimonials
const servicesStart = html.lastIndexOf('<section', html.indexOf('id="services"'))
const testimonialsAttr = html.indexOf('id="testimonials"')
let depth = 0
let j = html.lastIndexOf('<section', testimonialsAttr)
let testimonialsEnd = -1
while (j < html.length) {
  const open = html.indexOf('<section', j)
  const close = html.indexOf('</section>', j)
  if (close === -1) break
  if (open !== -1 && open < close) {
    depth++
    j = open + 8
  } else {
    depth--
    j = close + 10
    if (depth === 0) {
      testimonialsEnd = j
      break
    }
  }
}
if (servicesStart < 0 || testimonialsEnd < 0) throw new Error('section bounds not found')

// also remove old inline script that followed testimonials if present
let after = html.slice(testimonialsEnd)
const oldScript = after.match(/^[\s\n]*<script>\s*\(\(\) => \{[\s\S]*?dhb-tab[\s\S]*?<\/script>/)
if (oldScript) {
  after = after.slice(oldScript[0].length)
}

html = html.slice(0, servicesStart) + sections + after

fs.writeFileSync(path, html)
console.log('fixed services / inspired / testimonials')
console.log('has css', html.includes('dhb-sections-css'))
console.log('has 3-col services', html.includes('dhb-services-grid'))
console.log('has gallery visible class', html.includes('is-visible'))
console.log('testimonial count', (html.match(/dhb-testimonial/g) || []).length)
