/**
 * Sync content/images from dhbuilders/dhb into the Era-styled public site
 * WITHOUT importing old CSS/HTML layout.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const root = process.cwd()
const src = path.join(root, '_dhb_source')
const pub = path.join(root, 'public')
const indexPath = path.join(pub, 'index.html')

if (!fs.existsSync(src)) {
  console.error('Missing _dhb_source — clone https://github.com/dhbuilders/dhb.git first')
  process.exit(1)
}

// ── 1. Copy images (projects, services, home, logos) ─────────────────────────
function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true })
}

function copyTree(from, to, { skipNames = [] } = {}) {
  if (!fs.existsSync(from)) return 0
  ensureDir(to)
  let n = 0
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (skipNames.includes(entry.name)) continue
    if (entry.name === '.DS_Store') continue
    const a = path.join(from, entry.name)
    const b = path.join(to, entry.name)
    if (entry.isDirectory()) {
      n += copyTree(a, b, { skipNames })
    } else {
      fs.copyFileSync(a, b)
      n++
    }
  }
  return n
}

const copiedProjects = copyTree(
  path.join(src, 'images', 'projects'),
  path.join(pub, 'images', 'projects'),
)
const copiedServices = copyTree(
  path.join(src, 'images', 'services'),
  path.join(pub, 'images', 'services'),
)
const copiedHome = copyTree(path.join(src, 'images', 'home'), path.join(pub, 'images', 'home'), {
  skipNames: ['old'],
})

// Logos
ensureDir(path.join(pub, 'images'))
for (const logo of ['dhb.png', 'dhb1.png', 'dhb1-cropped.png', 'dhb1-nobg.png']) {
  const a = path.join(src, 'images', logo)
  if (fs.existsSync(a)) fs.copyFileSync(a, path.join(pub, 'images', logo))
}

console.log({ copiedProjects, copiedServices, copiedHome })

// ── 2. Write public/js/dhb-projects.js (gallery from inventory) ───────────────
ensureDir(path.join(pub, 'js'))
const inventorySrc = fs.readFileSync(path.join(src, 'js', 'projects.js'), 'utf8')
const invMatch = inventorySrc.match(/const projectInventory = \{[\s\S]*?\n\};/)
if (!invMatch) {
  console.error('Could not parse projectInventory')
  process.exit(1)
}

const galleryJs = `${invMatch[0]}

(() => {
  const gallery = document.getElementById('dhb-gallery');
  const tabs = document.querySelectorAll('#dhb-tabs [data-dhb-tab]');
  const lightbox = document.getElementById('dhb-lightbox');
  const lightboxImg = document.getElementById('dhb-lightbox-img');
  if (!gallery || !tabs.length) return;

  let currentCategory = 'elevation';
  let currentIndex = 0;

  const labels = {
    elevation: 'Elevations',
    kitchen: 'Kitchens',
    bedroom: 'Bedrooms',
    bathroom: 'Bathrooms',
    living: 'Living Rooms',
    interior: 'Interiors',
    wetbar: 'Wet Bars',
  };

  function render(category) {
    currentCategory = category;
    const files = projectInventory[category] || [];
    gallery.innerHTML = '';
    files.forEach((file, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dhb-gal-item is-visible';
      btn.setAttribute('data-dhb-cat', category);
      btn.setAttribute('aria-label', (labels[category] || category) + ' ' + (index + 1));
      const img = document.createElement('img');
      img.src = '/images/projects/' + category + '/' + file;
      img.alt = '';
      img.loading = 'lazy';
      btn.appendChild(img);
      btn.addEventListener('click', () => openLightbox(index));
      gallery.appendChild(btn);
    });
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    currentIndex = index;
    const files = projectInventory[currentCategory] || [];
    lightboxImg.src = '/images/projects/' + currentCategory + '/' + files[currentIndex];
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function showOffset(delta) {
    const files = projectInventory[currentCategory] || [];
    if (!files.length) return;
    currentIndex = (currentIndex + delta + files.length) % files.length;
    lightboxImg.src = '/images/projects/' + currentCategory + '/' + files[currentIndex];
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('data-dhb-tab');
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      render(id);
    });
  });

  if (lightbox) {
    lightbox.querySelector('[data-dhb-lightbox-close]')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('[data-dhb-lightbox-prev]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      showOffset(-1);
    });
    lightbox.querySelector('[data-dhb-lightbox-next]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      showOffset(1);
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showOffset(-1);
      if (e.key === 'ArrowRight') showOffset(1);
    });
  }

  render('elevation');
})();
`

fs.writeFileSync(path.join(pub, 'js', 'dhb-projects.js'), galleryJs)

// ── 3. Patch index.html content (keep Era structure) ─────────────────────────
let html = fs.readFileSync(indexPath, 'utf8')

// Full service copy from DHB
const servicesInner = `  <div class="dhb-inner">
    <div class="dhb-head">
      <h2 data-scroll-reveal="h" class="h1 a-center">Services</h2>
      <p data-scroll-reveal="p" class="p1 a-center">Make your dream a reality! Let us turn our blueprints into your doorsteps.</p>
    </div>
    <div class="dhb-services-grid">
      <article class="dhb-service" data-scroll-reveal="ctn">
        <figure><img src="/images/services/construction.jpeg" alt="New Home Construction" loading="lazy" /></figure>
        <h3 class="h5">New Home Construction</h3>
        <p class="p1">Building a custom home with Dream Home Builders is a journey of turning your unique vision into a structural masterpiece. Dileep oversees every phase, from the initial architectural sketches to the final walkthrough, ensuring every beam and brick meets our rigorous quality standards.</p>
      </article>
      <article class="dhb-service" data-scroll-reveal="ctn">
        <figure><img src="/images/services/renovation.webp" alt="House Renovation" loading="lazy" /></figure>
        <h3 class="h5">House Renovation</h3>
        <p class="p1">Our remodeling services are designed for homeowners who love their neighborhood but need their living space to evolve with their changing lifestyle. We specialize in transformative kitchen and bathroom renovations that blend modern functionality with the classic character of your home.</p>
      </article>
      <article class="dhb-service" data-scroll-reveal="ctn">
        <figure><img src="/images/services/architecture.webp" alt="Architecture Design" loading="lazy" /></figure>
        <h3 class="h5">Architecture Design</h3>
        <p class="p1">Great construction begins with a thoughtful plan that balances aesthetic beauty with structural logic. Our architecture design service focuses on maximizing your property’s potential, utilizing natural light and smart layouts to create an effortless flow throughout the home.</p>
      </article>
      <article class="dhb-service" data-scroll-reveal="ctn">
        <figure><img src="/images/services/interior-design.jpg" alt="Interior Design" loading="lazy" /></figure>
        <h3 class="h5">Interior Design</h3>
        <p class="p1">The fine details are what truly elevate a house into a home, and our interior design approach focuses on those sophisticated finishing touches. We help you select premium materials, from crown molding and custom cabinetry to high-end flooring that reflects your personal style.</p>
      </article>
      <article class="dhb-service" data-scroll-reveal="ctn">
        <figure><img src="/images/services/support.webp" alt="Fixing & Support" loading="lazy" /></figure>
        <h3 class="h5">Fixing & Support</h3>
        <p class="p1">A home is a living investment that requires expert care to maintain its value and safety over time. Our fixing and support service provides homeowners with reliable solutions for structural repairs, moisture protection, and general maintenance.</p>
      </article>
      <article class="dhb-service" data-scroll-reveal="ctn">
        <figure><img src="/images/services/painting.jpg" alt="Painting" loading="lazy" /></figure>
        <h3 class="h5">Painting</h3>
        <p class="p1">A fresh coat of paint is the ultimate finishing touch that defines the mood and quality of your interior and exterior spaces. We provide professional-grade painting services that prioritize clean lines, thorough surface preparation, and premium, long-lasting finishes.</p>
      </article></div>
  </div>`

html = html.replace(
  /(<section id="services"[^>]*>)[\s\S]*?(<\/section>\s*\n\s*<section id="inspired")/,
  `$1\n${servicesInner}\n$2`,
)

// Inspired: empty gallery shell + lightbox + script tag (replace static gallery + old tab script)
const inspiredInner = `  <div class="dhb-inner">
    <div class="dhb-head">
      <h2 data-scroll-reveal="h" class="h1 a-center">Get Inspired</h2>
      <p data-scroll-reveal="p" class="p1 a-center">Seeing is believing! Get inspired from these exceptional designs and let new ideas be born.</p>
    </div>
    <div class="dhb-tabs" data-scroll-reveal="ctn" id="dhb-tabs"><button type="button" data-dhb-tab="elevation" class="l1 is-active">Elevations</button><button type="button" data-dhb-tab="kitchen" class="l1">Kitchens</button><button type="button" data-dhb-tab="bedroom" class="l1">Bedrooms</button><button type="button" data-dhb-tab="bathroom" class="l1">Bathrooms</button><button type="button" data-dhb-tab="living" class="l1">Living Rooms</button><button type="button" data-dhb-tab="interior" class="l1">Interiors</button><button type="button" data-dhb-tab="wetbar" class="l1">Wet Bars</button></div>
    <div class="dhb-gallery" id="dhb-gallery"></div>
    <div class="dhb-cta-wrap">
      <a class="dhb-cta l1" href="#contact">Start Your Project</a>
    </div>
  </div>
</section>

<div id="dhb-lightbox" class="dhb-lightbox" hidden>
  <button type="button" class="dhb-lightbox-close" data-dhb-lightbox-close aria-label="Close">&times;</button>
  <button type="button" class="dhb-lightbox-nav is-prev" data-dhb-lightbox-prev aria-label="Previous">&#10094;</button>
  <button type="button" class="dhb-lightbox-nav is-next" data-dhb-lightbox-next aria-label="Next">&#10095;</button>
  <img id="dhb-lightbox-img" alt="" />
</div>

<script src="/js/dhb-projects.js" defer></script>

`

// Only replace inspired block up to (but not past) testimonials/contact
if (html.includes('id="dhb-gallery"></div>') || html.includes('id="dhb-gallery">\n')) {
  // already synced gallery shell
} else if (/id="dhb-gallery">[\s\S]*?dhb-gal-item/.test(html)) {
  html = html.replace(
    /(<section id="inspired"[^>]*>)[\s\S]*?(?=<section id="testimonials"|<section id="contact")/,
    `$1\n${inspiredInner}`,
  )
}

const testimonialsSection = `<section id="testimonials" data-bg="dark" class="section clip theme_on-dark dhb-block">
  <div class="dhb-inner">
    <div class="dhb-head">
      <h2 data-scroll-reveal="h" class="h1 a-center">Testimonials</h2>
      <p data-scroll-reveal="p" class="p1 a-center">Action speaks louder than the words! Our work speaks for itself, but our clients say it even better.</p>
    </div>
    <div class="dhb-testimonials-grid">
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“Dileep’s honesty was refreshing. We did a full kitchen remodel, and he was upfront about costs and timelines from day one. Highly recommend!”</p>
        <div class="who l1">Sarah J. · Kitchen Remodel</div>
      </article>
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“Building a new home is stressful, but Dileep’s responsiveness made it manageable. He always answered his phone, even for the smallest questions.”</p>
        <div class="who l1">Madhu D. · New Construction</div>
      </article>
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“The fast turnaround on our bathroom upgrade was incredible. Dileep's dedication to finishing on schedule while maintaining quality was impressive.”</p>
        <div class="who l1">Elena R. · Bathroom Upgrade</div>
      </article>
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“Dileep is a true professional. He guided us through our patio upgrade with great care. His communication was top-notch throughout the process.”</p>
        <div class="who l1">David L. · Outdoor Living</div>
      </article>
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“We needed a major structural wall removed to create an open concept. Dileep handled the engineering and permits seamlessly. Truly expert work.”</p>
        <div class="who l1">Priya K. · Structural Renovation</div>
      </article>
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“Our custom basement finished ahead of schedule. Dileep has a great eye for detail and suggested a layout we hadn't even considered. We love it!”</p>
        <div class="who l1">Linda K. · Basement Finishing</div>
      </article>
      <article class="dhb-testimonial" data-scroll-reveal="p">
        <div class="stars" aria-label="5 stars">★★★★★</div>
        <p class="h5 quote">“Professional, clean, and reliable. Dream Home Builders transformed our old siding and roof. The house looks brand new again. Exceptional value.”</p>
        <div class="who l1">Robert P. · Exterior Remodel</div>
      </article></div>
  </div>
</section>`

if (html.includes('id="testimonials"')) {
  html = html.replace(/<section id="testimonials"[\s\S]*?<\/section>/, testimonialsSection)
} else {
  html = html.replace(
    /(<script src="\/js\/dhb-projects\.js" defer><\/script>\s*)/,
    `$1\n${testimonialsSection}\n`,
  )
}

// Contact copy + Formspree actions on forms
html = html.replace(
  /Prefer to chat over coffee\? Visit us in Edison to discuss your vision\./,
  "Prefer to chat over coffee? We'd love to host you at our Edison location to discuss your vision.",
)
html = html.replace(
  /Busy schedule\? Book a seamless virtual meeting from the comfort of your home\./,
  'Busy schedule? We offer seamless virtual meetings to discuss your dream home from the comfort of your couch.',
)
html = html.replace(
  /Send project details so we can prepare for a productive conversation\./,
  'We value your time. If you prefer, send us details of your project so we can be better prepared for a productive conversation.',
)

html = html.replace(
  /Transparent pricing\. No hidden surprises\. Tell us about your dream project\./,
  "Transparent pricing, no hidden surprises! Tell us about your dream project and we'll provide a detailed estimate.",
)

// Wire Formspree on contact + quote forms
html = html.replace(
  /<form class="dhb-form" data-scroll-reveal="ctn" id="dhb-contact-form">/,
  '<form class="dhb-form" data-scroll-reveal="ctn" id="dhb-contact-form" action="https://formspree.io/f/xykpgpzk" method="POST">',
)
html = html.replace(
  /<form class="dhb-form" id="dhb-quote-form">/,
  '<form class="dhb-form" id="dhb-quote-form" action="https://formspree.io/f/mjgowdwe" method="POST">',
)

// Align quote field names with Formspree / DHB
html = html.replace(
  /name="service"/,
  'name="service_required"',
)
html = html.replace(/name="sqft"/, 'name="sq_ft"')
html = html.replace(/name="start"/, 'name="start_date"')
html = html.replace(
  /name="message"/,
  'name="project_details"',
)
html = html.replace(
  /name="platform"/,
  'name="meeting_mode"',
)

// Replace fake form handlers with Formspree fetch + virtual endpoint switch
const formsScript = `<script>
(() => {
  const modeBtns = document.querySelectorAll('#dhb-contact-modes [data-dhb-mode]');
  const panes = document.querySelectorAll('[data-dhb-pane]');
  const platform = document.getElementById('dhb-platform');
  const contactForm = document.getElementById('dhb-contact-form');
  const quoteForm = document.getElementById('dhb-quote-form');
  const CONTACT_IN_PERSON = 'https://formspree.io/f/xykpgpzk';
  const CONTACT_VIRTUAL = 'https://formspree.io/f/mqeyarzv';

  let contactMode = 'in-person';

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-dhb-mode');
      contactMode = mode;
      modeBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      panes.forEach((pane) => {
        pane.classList.toggle('is-active', pane.getAttribute('data-dhb-pane') === mode);
      });
      if (platform) {
        platform.style.display = mode === 'virtual' ? 'block' : 'none';
        platform.required = mode === 'virtual';
        if (mode !== 'virtual') platform.value = '';
      }
      if (contactForm) {
        contactForm.action = mode === 'virtual' ? CONTACT_VIRTUAL : CONTACT_IN_PERSON;
        const submit = contactForm.querySelector('button[type="submit"]');
        if (submit) submit.textContent = mode === 'virtual' ? 'Schedule Call' : 'Send Message';
      }
    });
  });

  async function submitFormspree(form) {
    const status = form.querySelector('[data-status]');
    const button = form.querySelector('button[type="submit"]');
    const original = button ? button.textContent : '';
    if (button) {
      button.disabled = true;
      button.textContent = 'Sending...';
    }
    if (status) status.textContent = '';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        if (status) status.textContent = 'Thanks! Your message has been sent successfully.';
        form.reset();
        if (platform) {
          platform.style.display = contactMode === 'virtual' ? 'block' : 'none';
          platform.required = contactMode === 'virtual';
        }
        if (button) button.textContent = 'Sent!';
        setTimeout(() => {
          if (button) {
            button.disabled = false;
            button.textContent = original;
          }
        }, 1800);
      } else {
        if (status) status.textContent = 'Oops! There was a problem. Please try again.';
        if (button) {
          button.disabled = false;
          button.textContent = original;
        }
      }
    } catch (err) {
      if (status) status.textContent = 'Connection error. Please check your internet.';
      if (button) {
        button.disabled = false;
        button.textContent = original;
      }
    }
  }

  function bindForm(form) {
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitFormspree(form);
    });
  }

  bindForm(contactForm);
  bindForm(quoteForm);
})();
</script>`

html = html.replace(
  /<script>\s*\(\(\) => \{\s*const modeBtns = document\.querySelectorAll\('#dhb-contact-modes[\s\S]*?<\/script>/,
  formsScript,
)

// Lightbox + footer CSS (append to dhb-sections or new style block)
const extraCss = `<style id="dhb-content-sync-css">
  .dhb-lightbox {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(6, 54, 112, 0.88);
    padding: 2rem;
  }
  .dhb-lightbox[hidden] { display: none !important; }
  .dhb-lightbox img {
    max-width: min(96vw, 1100px);
    max-height: 86vh;
    object-fit: contain;
    box-shadow: 0 24px 60px rgba(0,0,0,0.35);
  }
  .dhb-lightbox-close,
  .dhb-lightbox-nav {
    position: absolute;
    border: 0;
    background: transparent;
    color: #fff;
    cursor: pointer;
    font-size: 2rem;
    line-height: 1;
    padding: 0.5rem;
  }
  .dhb-lightbox-close { top: 1rem; right: 1.25rem; font-size: 2.4rem; }
  .dhb-lightbox-nav.is-prev { left: 1rem; }
  .dhb-lightbox-nav.is-next { right: 1rem; }
  .dhb-site-footer {
    background: #063670;
    color: #D9E8F4;
    padding: 3.5rem 1.5rem 2rem;
  }
  .dhb-site-footer .dhb-footer-grid {
    max-width: 72rem;
    margin: 0 auto;
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .dhb-site-footer h3,
  .dhb-site-footer h4 {
    color: #E8BC5E;
    margin-bottom: 0.85rem;
  }
  .dhb-site-footer a { color: inherit; text-decoration: none; }
  .dhb-site-footer a:hover { color: #E8BC5E; }
  .dhb-site-footer ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.45rem; }
  .dhb-site-footer .dhb-footer-bottom {
    max-width: 72rem;
    margin: 2.5rem auto 0;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(217, 232, 244, 0.25);
    font-size: 0.9rem;
    opacity: 0.85;
  }
  @media (max-width: 800px) {
    .dhb-site-footer .dhb-footer-grid { grid-template-columns: 1fr; }
  }
</style>`

if (html.includes('id="dhb-content-sync-css"')) {
  html = html.replace(/<style id="dhb-content-sync-css">[\s\S]*?<\/style>/, extraCss)
} else {
  html = html.replace('</head>', `${extraCss}</head>`)
}

// Insert site footer before closing body if missing
const footerHtml = `
<footer class="dhb-site-footer" id="dhb-site-footer">
  <div class="dhb-footer-grid">
    <div>
      <h3 class="h5">Dream Home Builders</h3>
      <p class="p1">Building excellence since 2015.</p>
    </div>
    <div>
      <h4 class="l1">Quick Links</h4>
      <ul>
        <li><a href="#hero">Home</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#inspired">Get Inspired</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#quote">Request a Quote</a></li>
      </ul>
    </div>
    <div>
      <h4 class="l1">Contact Info</h4>
      <ul>
        <li><a href="tel:+19087971777">Call Us · (908) 797-1777</a></li>
        <li><a href="#contact">Send A Quick Note</a></li>
        <li><a href="mailto:dreamhomebuildersnj@gmail.com">Email Us</a></li>
        <li><a href="https://maps.app.goo.gl/qYnY5QVnExpty1Wa7" target="_blank" rel="noopener noreferrer">25 Parker Rd, Edison NJ 08820</a></li>
      </ul>
    </div>
  </div>
  <div class="dhb-footer-bottom">
    <p>&copy; 2026 Dream Home Builders. All rights reserved.</p>
  </div>
</footer>
`

if (!html.includes('id="dhb-site-footer"')) {
  html = html.replace('</body>', `${footerHtml}</body>`)
}

const divDiff =
  (html.match(/<div\b/g) || []).length - (html.match(/<\/div>/g) || []).length
fs.writeFileSync(indexPath, html)

// ── 4. success.html (Era-token styled thank-you) ─────────────────────────────
const successHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Message Sent | Dream Home Builders</title>
  <style>
    :root {
      --navy: #063670;
      --gold: #B88734;
      --cream: #F7F3EC;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: Georgia, "Times New Roman", serif;
      background: linear-gradient(160deg, var(--cream), #D9E8F4 70%);
      color: var(--navy);
      padding: 2rem;
      text-align: center;
    }
    .card {
      max-width: 28rem;
    }
    .mark {
      width: 3.5rem;
      height: 3.5rem;
      margin: 0 auto 1.25rem;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: var(--gold);
      color: #fff;
      font-size: 1.6rem;
      font-family: system-ui, sans-serif;
    }
    h1 { font-size: clamp(2rem, 4vw, 2.75rem); margin: 0 0 0.75rem; }
    p { line-height: 1.55; margin: 0 0 1.75rem; opacity: 0.9; }
    a {
      display: inline-block;
      padding: 0.85rem 1.4rem;
      background: var(--navy);
      color: #fff;
      text-decoration: none;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-family: system-ui, sans-serif;
      font-size: 0.85rem;
    }
    a:hover { background: var(--gold); }
  </style>
</head>
<body>
  <div class="card">
    <div class="mark" aria-hidden="true">✓</div>
    <h1>Success!</h1>
    <p>Your message has been sent to the Dream Home Builders team.</p>
    <a href="/">Return Home</a>
  </div>
</body>
</html>
`
fs.writeFileSync(path.join(pub, 'success.html'), successHtml)

// Ignore clone folder
const gi = path.join(root, '.gitignore')
if (fs.existsSync(gi)) {
  let g = fs.readFileSync(gi, 'utf8')
  if (!g.includes('_dhb_source')) {
    g += '\n_dhb_source/\n'
    fs.writeFileSync(gi, g)
  }
}

console.log({
  divDiff,
  hasGalleryJs: fs.existsSync(path.join(pub, 'js', 'dhb-projects.js')),
  hasSuccess: fs.existsSync(path.join(pub, 'success.html')),
  hasFooter: html.includes('dhb-site-footer'),
  hasLightbox: html.includes('dhb-lightbox'),
  formspree: (html.match(/formspree\.io/g) || []).length,
  robert: html.includes('Robert P.'),
})
