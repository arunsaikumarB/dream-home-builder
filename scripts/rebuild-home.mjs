import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

function findSections(source) {
  const starts = []
  const re = /<section\b[^>]*>/g
  let m
  while ((m = re.exec(source))) starts.push(m.index)
  const blocks = []
  for (const start of starts) {
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
          blocks.push({ start, end: j, html: source.slice(start, j) })
          break
        }
      }
    }
  }
  return blocks
}

const blocks = findSections(html)
const removeIndexes = new Set()

blocks.forEach((b, i) => {
  const chunk = b.html
  const shouldRemove =
    chunk.includes('Three reasons') ||
    chunk.includes('benefits-intro-w') ||
    chunk.includes('benefits-w') ||
    chunk.includes('Architecture Team') ||
    chunk.includes('quote-w') ||
    chunk.includes('Homes range from') ||
    chunk.includes('apart-info-w') ||
    chunk.includes('License obtained') ||
    chunk.includes('other-w') ||
    (chunk.includes('Perfect') && chunk.includes('sea views')) ||
    chunk.includes('cta-w')
  if (shouldRemove) {
    removeIndexes.add(i)
    console.log('REMOVE', i, chunk.slice(0, 120).replace(/\s+/g, ' '))
  }
})

// Remove from end to start
;[...removeIndexes].sort((a, b) => b - a).forEach((i) => {
  const b = blocks[i]
  html = html.slice(0, b.start) + html.slice(b.end)
})

const services = [
  {
    title: 'New Home Construction',
    img: '/images/services/construction.jpeg',
    text: 'Building a custom home with Dream Home Builder is a journey of turning your unique vision into a structural masterpiece. Dileep oversees every phase, from the initial architectural sketches to the final walkthrough.',
  },
  {
    title: 'House Renovation',
    img: '/images/services/renovation.webp',
    text: 'Remodeling for homeowners who love their neighborhood but need their living space to evolve. We specialize in transformative kitchen and bathroom renovations with modern function and classic character.',
  },
  {
    title: 'Architecture Design',
    img: '/images/services/architecture.webp',
    text: 'Thoughtful plans that balance aesthetic beauty with structural logic — maximizing natural light and creating an effortless flow throughout the home.',
  },
  {
    title: 'Interior Design',
    img: '/images/services/interior-design.jpg',
    text: 'The fine details elevate a house into a home. We help you select premium materials, custom cabinetry, and high-end flooring that reflects your personal style.',
  },
  {
    title: 'Fixing & Support',
    img: '/images/services/support.webp',
    text: 'Reliable solutions for structural repairs, moisture protection, and general maintenance — expert care that protects your investment over time.',
  },
  {
    title: 'Painting',
    img: '/images/services/painting.jpg',
    text: 'Professional-grade painting with clean lines, thorough preparation, and premium long-lasting finishes for interiors and exteriors.',
  },
]

const gallery = {
  elevation: [
    'modern-elevation1.jpg',
    'modern-elevation2.jpg',
    'modern-elevation3.jpg',
    'modern-elevation4.jpg',
    'elevation-10.webp',
    'elevation-11.webp',
  ],
  kitchen: ['kitchen-1.jpg', 'kitchen-2.jpg', 'kitchen-3.jpg', 'kitchen-4.jpg', 'kitchen-24.webp', 'kitchen-25.webp'],
  bedroom: ['bedroom-1.jpg', 'bedroom-2.webp', 'bedroom-3.jpg', 'bedroom-4.jpg'],
  bathroom: ['bath-1.JPG', 'bath-2.JPG', 'bath-4.jpg', 'bath-9.webp'],
  living: ['living-1.jpg', 'living-2.jpg', 'living-3.jpg', 'living-4.jpg'],
  interior: ['interior-1.jpg', 'interior-2.jpg', 'interior-3.jpg', 'interior-5.jpg'],
  wetbar: ['wetbar1.webp', 'wetbar2.png', 'wetbar3.jpeg', 'wetbar4.webp'],
}

const testimonials = [
  ['Dileep’s honesty was refreshing. We did a full kitchen remodel, and he was upfront about costs and timelines from day one.', 'Sarah J.', 'Kitchen Remodel'],
  ['Building a new home is stressful, but Dileep’s responsiveness made it manageable. He always answered his phone.', 'Madhu D.', 'New Construction'],
  ['The fast turnaround on our bathroom upgrade was incredible while maintaining quality.', 'Elena R.', 'Bathroom Upgrade'],
  ['Dileep guided us through our patio upgrade with great care. Communication was top-notch.', 'David L.', 'Outdoor Living'],
  ['He handled engineering and permits seamlessly for our open-concept renovation.', 'Priya K.', 'Structural Renovation'],
  ['Our custom basement finished ahead of schedule. We love the layout he suggested.', 'Linda K.', 'Basement Finishing'],
  ['Professional, clean, and reliable. Our siding and roof look brand new again.', 'Robert P.', 'Exterior Remodel'],
]

const serviceCards = services
  .map(
    (s) => `
<div class="grid _6-columns" style="margin-bottom:3rem">
  <div class="span-3">
    <div data-scroll-reveal="slide" class="img-w"><img class="img" src="${s.img}" alt="${s.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;aspect-ratio:4/3"/></div>
  </div>
  <div class="span-3" style="display:flex;flex-direction:column;justify-content:center;gap:1rem;padding:0 1rem">
    <h3 data-scroll-reveal="h" class="h4">${s.title}</h3>
    <p data-scroll-reveal="p" class="p1">${s.text}</p>
  </div>
</div>`,
  )
  .join('')

const galleryButtons = Object.keys(gallery)
  .map((id, i) => {
    const label = id === 'wetbar' ? 'Wet Bars' : id.charAt(0).toUpperCase() + id.slice(1) + (id === 'living' ? ' Rooms' : id.endsWith('room') || id === 'kitchen' || id === 'bedroom' || id === 'bathroom' || id === 'interior' || id === 'elevation' ? (id === 'elevation' ? 's' : id === 'kitchen' ? 's' : id === 'bedroom' ? 's' : id === 'bathroom' ? 's' : id === 'interior' ? 's' : '') : '')
    const pretty = {
      elevation: 'Elevations',
      kitchen: 'Kitchens',
      bedroom: 'Bedrooms',
      bathroom: 'Bathrooms',
      living: 'Living Rooms',
      interior: 'Interiors',
      wetbar: 'Wet Bars',
    }[id]
    return `<button type="button" data-dhb-tab="${id}" class="l1${i === 0 ? ' is-active' : ''}" style="appearance:none;border:1px solid currentColor;background:transparent;padding:.7rem 1rem;cursor:pointer;margin:.25rem;opacity:${i === 0 ? '1' : '.45'}">${pretty}</button>`
  })
  .join('')

const allGalleryImgs = Object.entries(gallery)
  .flatMap(([cat, files]) =>
    files.map(
      (file, idx) =>
        `<button type="button" data-dhb-cat="${cat}" data-dhb-src="/images/projects/${cat}/${file}" class="dhb-gal-item" style="display:${cat === 'elevation' ? 'block' : 'none'};border:0;padding:0;background:transparent;cursor:pointer;aspect-ratio:4/3;overflow:hidden"><img src="/images/projects/${cat}/${file}" alt="${cat} ${idx + 1}" loading="lazy" style="width:100%;height:100%;object-fit:cover"/></button>`,
    ),
  )
  .join('')

const testimonialCards = testimonials
  .map(
    ([quote, name, project]) => `
<div data-scroll-reveal="p" style="padding:1.5rem 0;border-top:1px solid color-mix(in srgb, currentColor 15%, transparent)">
  <div class="l1" style="margin-bottom:.75rem;letter-spacing:.15em">★★★★★</div>
  <p class="h5" style="margin:0">“${quote}”</p>
  <div class="l1 reg" style="margin-top:1rem;opacity:.7">${name}, ${project}</div>
</div>`,
  )
  .join('')

const newSections = `
<section id="services" data-bg="light" class="section clip theme_on-brand">
  <div class="container">
    <div class="u-48"></div>
    <div class="grid"><div class="s_title"><h2 data-scroll-reveal="h" class="h1 a-center">Services</h2></div></div>
    <div class="u-32"></div>
    <div class="grid"><div class="s_title"><p data-scroll-reveal="p" class="p1 a-center">Make your dream a reality. Let us turn our blueprints into your doorsteps.</p></div></div>
    <div class="u-96"></div>
    ${serviceCards}
    <div class="u-48"></div>
  </div>
</section>

<section id="inspired" data-bg="color" class="section clip theme_on-color">
  <div class="container">
    <div class="u-48"></div>
    <div class="grid"><div class="s_title"><h2 data-scroll-reveal="h" class="h1 a-center">Get Inspired</h2></div></div>
    <div class="u-32"></div>
    <div class="grid"><div class="s_title"><p data-scroll-reveal="p" class="p1 a-center">Seeing is believing. Explore exceptional designs and let new ideas be born.</p></div></div>
    <div class="u-48"></div>
    <div data-scroll-reveal="ctn" class="a-center" id="dhb-tabs" style="display:flex;flex-wrap:wrap;justify-content:center">${galleryButtons}</div>
    <div class="u-48"></div>
    <div id="dhb-gallery" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">${allGalleryImgs}</div>
    <div class="u-64"></div>
    <div class="a-center"><a href="#quote" class="btn-circle_link w-inline-block" aria-label="Start Your Project" style="display:inline-flex;align-items:center;justify-content:center;min-height:3rem;padding:0 1.5rem;border:1px solid currentColor"><span class="l1">Start Your Project</span></a></div>
    <div class="u-48"></div>
  </div>
</section>

<section id="testimonials" data-bg="dark" class="section clip theme_on-dark">
  <div class="container">
    <div class="u-48"></div>
    <div class="grid"><div class="s_title"><h2 data-scroll-reveal="h" class="h1 a-center">Testimonials</h2></div></div>
    <div class="u-32"></div>
    <div class="grid"><div class="s_title"><p data-scroll-reveal="p" class="p1 a-center">Action speaks louder than words. Our work speaks for itself — our clients say it even better.</p></div></div>
    <div class="u-64"></div>
    <div class="grid _2-columns" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem 2rem">${testimonialCards}</div>
    <div class="u-48"></div>
  </div>
</section>

<section id="contact" data-bg="light" class="section clip theme_on-brand">
  <div class="container">
    <div class="u-48"></div>
    <div class="grid"><div class="s_title"><h2 data-scroll-reveal="h" class="h1 a-center">Contact Us</h2></div></div>
    <div class="u-32"></div>
    <div class="grid"><div class="s_title"><p data-scroll-reveal="p" class="p1 a-center">In person at our Edison studio, or virtually from anywhere in New Jersey.</p></div></div>
    <div class="u-64"></div>
    <div class="grid _2-columns" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem">
      <div data-scroll-reveal="p">
        <p class="p1">Prefer to chat over coffee? Visit us in Edison to discuss your vision.</p>
        <div class="u-24"></div>
        <p class="l1">25 Parker Rd, Edison NJ 08820</p>
        <p class="l1">Mon – Fri: 9am – 6pm</p>
        <p class="l1"><a href="tel:+19087971777">(908) 797-1777</a></p>
        <div class="u-32"></div>
        <div style="overflow:hidden;min-height:260px;background:rgba(0,0,0,.04)">
          <iframe title="Dream Home Builder map" loading="lazy" style="width:100%;height:260px;border:0" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.035345717311!2d-74.3734674!3d40.5407981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3c90710609b1f%3A0xc6c4f8d956b6b3e!2s25%20Parker%20Rd%2C%20Edison%2C%20NJ%2008820!5e0!3m2!1sen!2sus!4v1700000000000"></iframe>
        </div>
      </div>
      <form data-scroll-reveal="ctn" onsubmit="event.preventDefault();this.querySelector('[data-status]').textContent='Thanks — we will get back to you shortly.';this.reset();" style="display:grid;gap:.85rem">
        <p class="p1">Send project details so we can prepare for a productive conversation.</p>
        <input required name="name" placeholder="Full Name" style="padding:1rem;border:1px solid color-mix(in srgb, currentColor 15%, transparent);background:transparent"/>
        <input required type="email" name="email" placeholder="Email Address" style="padding:1rem;border:1px solid color-mix(in srgb, currentColor 15%, transparent);background:transparent"/>
        <input type="tel" name="phone" placeholder="Phone Number" style="padding:1rem;border:1px solid color-mix(in srgb, currentColor 15%, transparent);background:transparent"/>
        <textarea required name="message" placeholder="Tell us about your project" style="min-height:140px;padding:1rem;border:1px solid color-mix(in srgb, currentColor 15%, transparent);background:transparent"></textarea>
        <button type="submit" class="l1" style="min-height:3rem;border:1px solid currentColor;background:currentColor;color:var(--_colors---other--bg);cursor:pointer">Send Message</button>
        <p class="l1 reg" data-status></p>
      </form>
    </div>
    <div class="u-48"></div>
  </div>
</section>

<section id="quote" data-bg="color" class="section clip theme_on-color">
  <div class="container">
    <div class="u-48"></div>
    <div class="grid"><div class="s_title"><h2 data-scroll-reveal="h" class="h1 a-center">Request a Quote</h2></div></div>
    <div class="u-32"></div>
    <div class="grid"><div class="s_title"><p data-scroll-reveal="p" class="p1 a-center">Transparent pricing, no hidden surprises. Tell us about your dream project.</p></div></div>
    <div class="u-64"></div>
    <div class="grid _2-columns" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem">
      <div data-scroll-reveal="p">
        <p class="p1">A short conversation is enough to understand whether you need a family home, a renovation, or a place you’ll return to for years.</p>
        <div class="u-24"></div>
        <p class="l1"><a href="tel:+19087971777">(908) 797-1777</a></p>
        <p class="l1"><a href="mailto:dreamhomebuildersnj@gmail.com">dreamhomebuildersnj@gmail.com</a></p>
        <p class="l1">25 Parker Rd, Edison NJ 08820</p>
      </div>
      <form data-scroll-reveal="ctn" onsubmit="event.preventDefault();this.querySelector('[data-status]').textContent='Quote request received. Our team will follow up soon.';this.reset();" style="display:grid;gap:.85rem">
        <select required name="service" style="padding:1rem;border:1px solid color-mix(in srgb, currentColor 15%, transparent);background:transparent">
          <option value="" disabled selected>Service Required *</option>
          <option>New Home Construction</option>
          <option>Home Renovation</option>
          <option>Room Extension</option>
          <option>Interior Design</option>
        </select>
        <input required name="budget" placeholder="Approx. Budget (USD) *" style="padding:1rem;border:1px solid color-mix(in srgb, currentColor 15%, transparent);background:transparent"/>
        <input name="sqft" placeholder="Total Square Footage (Optional)" style="padding:1rem;border:1px solid color-mix(in srgb, currentColor 15%, transparent);background:transparent"/>
        <input type="date" name="start" aria-label="Desired start date" style="padding:1rem;border:1px solid color-mix(in srgb, currentColor 15%, transparent);background:transparent"/>
        <textarea required name="description" placeholder="Project Description *" style="min-height:120px;padding:1rem;border:1px solid color-mix(in srgb, currentColor 15%, transparent);background:transparent"></textarea>
        <input required name="location" placeholder="Location / Address *" style="padding:1rem;border:1px solid color-mix(in srgb, currentColor 15%, transparent);background:transparent"/>
        <button type="submit" class="l1" style="min-height:3rem;border:1px solid currentColor;background:currentColor;color:var(--_colors---other--bg);cursor:pointer">Request Detailed Quote</button>
        <p class="l1 reg" data-status></p>
      </form>
    </div>
    <div class="u-48"></div>
  </div>
</section>

<script>
(() => {
  const tabs = document.querySelectorAll('[data-dhb-tab]');
  const items = document.querySelectorAll('.dhb-gal-item');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('data-dhb-tab');
      tabs.forEach((t) => {
        t.style.opacity = t === tab ? '1' : '.45';
        t.classList.toggle('is-active', t === tab);
      });
      items.forEach((item) => {
        item.style.display = item.getAttribute('data-dhb-cat') === id ? 'block' : 'none';
      });
    });
  });
})();
</script>
`

// Insert new sections before footer section
const footerIdx = html.indexOf('<section data-bg="dark" class="section theme_on-dark">')
if (footerIdx === -1) throw new Error('footer section not found')
html = html.slice(0, footerIdx) + newSections + html.slice(footerIdx)

// Update top nav labels/hrefs to the five page anchors
html = html
  .replace(/href="\/apartments"/g, 'href="#services"')
  .replace(/href="\/contact"/g, 'href="#contact"')
  .replace(/href="\/apartments\?type=[^"]+"/g, 'href="#services"')
  .replace(/aria-label="View Projects"/g, 'aria-label="Services"')
  .replace(/>View Projects</g, '>Services<')
  .replace(/aria-label="Request a quote"/g, 'aria-label="Request a Quote"')
  .replace(/aria-label="Request a Quote" href="#"/g, 'aria-label="Request a Quote" href="#quote"')
  .replace(/Select an Apartment/g, 'Services')
  .replace(/Select  an Apartment/g, 'Services')
  .replace(/>Explore our projects</g, '>Get Inspired<')
  .replace(/>Explore construction</g, '>Services<')
  .replace(/>Explore renovation</g, '>Services<')
  .replace(/>Explore interiors</g, '>Services<')
  .replace(/aria-label="Contact" href="#contact"/g, 'aria-label="Contact Us" href="#contact"')
  .replace(/>Contact</g, '>Contact Us<')

html = html.replace(
  /(<a[^>]*aria-label="Contact Us" href="#contact"[^>]*>)/,
  '<a hover-nav-item="" aria-label="Get Inspired" href="#inspired" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Get Inspired</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Get Inspired</div></div></div></a><a hover-nav-item="" aria-label="Testimonials" href="#testimonials" class="nav-item w-inline-block"><div class="nav-item_label"><div class="nav-item_label_text"><div hover="text" class="l1">Testimonials</div></div><div class="nav-item_label_text is-2"><div hover="text" class="l1">Testimonials</div></div></div></a>$1',
)

fs.writeFileSync(path, html)

const verify = fs.readFileSync(path, 'utf8')
const checks = [
  'Three reasons',
  'Architecture Team',
  'Homes range from',
  'License obtained',
  'sea views',
  'id="services"',
  'id="inspired"',
  'id="testimonials"',
  'id="contact"',
  'id="quote"',
]
for (const c of checks) console.log(c, verify.includes(c))
console.log('done, length', verify.length)
