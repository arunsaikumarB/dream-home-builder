import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

const extraCss = `
  /* Contact + Quote */
  .dhb-split {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 3rem 2.4rem;
    align-items: start;
  }
  @media (max-width: 991px) {
    .dhb-split {
      grid-template-columns: 1fr;
      gap: 2.4rem;
    }
  }
  .dhb-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 100%;
  }
  .dhb-panel > .p1 { margin: 0; opacity: 0.78; }
  .dhb-meta {
    display: grid;
    gap: 0.55rem;
    margin: 0.4rem 0 0.2rem;
  }
  .dhb-meta a { text-decoration: none; }
  .dhb-meta a:hover { opacity: 0.7; }
  .dhb-map {
    margin-top: 0.6rem;
    overflow: hidden;
    aspect-ratio: 16 / 10;
    min-height: 240px;
    background: color-mix(in srgb, currentColor 6%, transparent);
  }
  .dhb-map iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }
  .dhb-form {
    display: grid;
    gap: 0.85rem;
    width: 100%;
  }
  .dhb-form .p1 {
    margin: 0 0 0.25rem;
    opacity: 0.78;
  }
  .dhb-form input,
  .dhb-form select,
  .dhb-form textarea {
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 1rem 1.05rem;
    border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
    background: color-mix(in srgb, currentColor 4%, transparent);
    color: inherit;
    font: inherit;
    outline: none;
    appearance: none;
    border-radius: 0;
    transition: border-color 0.3s ease, background 0.3s ease;
  }
  .dhb-form input:focus,
  .dhb-form select:focus,
  .dhb-form textarea:focus {
    border-color: color-mix(in srgb, currentColor 45%, transparent);
    background: color-mix(in srgb, currentColor 7%, transparent);
  }
  .dhb-form textarea {
    min-height: 140px;
    resize: vertical;
  }
  .dhb-form select {
    cursor: pointer;
    background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
      linear-gradient(135deg, currentColor 50%, transparent 50%);
    background-position: calc(100% - 18px) calc(50% - 3px), calc(100% - 12px) calc(50% - 3px);
    background-size: 6px 6px, 6px 6px;
    background-repeat: no-repeat;
    padding-right: 2.4rem;
  }
  .dhb-form button[type="submit"] {
    appearance: none;
    width: 100%;
    min-height: 3.2rem;
    margin-top: 0.25rem;
    border: 1px solid currentColor;
    background: currentColor;
    color: var(--_colors---other--bg, #f3f3ec);
    cursor: pointer;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 0.72rem;
    transition: opacity 0.3s ease;
  }
  .dhb-form button[type="submit"]:hover { opacity: 0.88; }
  .dhb-form [data-status] {
    min-height: 1.2em;
    margin: 0;
    opacity: 0.75;
  }
  .dhb-modes {
    display: flex;
    justify-content: center;
    gap: 0.55rem;
    margin: 0 auto 2.4rem;
  }
  .dhb-modes button {
    appearance: none;
    border: 1px solid color-mix(in srgb, currentColor 28%, transparent);
    background: transparent;
    color: inherit;
    padding: 0.75rem 1.2rem;
    cursor: pointer;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.72rem;
    opacity: 0.55;
    transition: background 0.35s ease, color 0.35s ease, opacity 0.35s ease, border-color 0.35s ease;
  }
  .dhb-modes button.is-active,
  .dhb-modes button:hover {
    opacity: 1;
    background: currentColor;
    color: var(--_colors---other--bg, #f3f3ec);
    border-color: currentColor;
  }
  .dhb-mode-pane { display: none; }
  .dhb-mode-pane.is-active {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`

const contactQuote = `
<section id="contact" data-bg="light" class="section clip theme_on-brand dhb-block">
  <div class="dhb-inner">
    <div class="dhb-head">
      <h2 data-scroll-reveal="h" class="h1 a-center">Contact Us</h2>
      <p data-scroll-reveal="p" class="p1 a-center">In person at our Edison studio, or virtually from anywhere in New Jersey.</p>
    </div>
    <div class="dhb-modes" data-scroll-reveal="ctn" id="dhb-contact-modes">
      <button type="button" class="l1 is-active" data-dhb-mode="in-person">In Person</button>
      <button type="button" class="l1" data-dhb-mode="virtual">Virtual</button>
    </div>
    <div class="dhb-split">
      <div class="dhb-panel" data-scroll-reveal="p">
        <div class="dhb-mode-pane is-active" data-dhb-pane="in-person">
          <p class="p1">Prefer to chat over coffee? Visit us in Edison to discuss your vision.</p>
          <div class="dhb-meta">
            <div class="l1">25 Parker Rd, Edison NJ 08820</div>
            <div class="l1">Mon – Fri: 9am – 6pm</div>
            <div class="l1"><a href="tel:+19087971777">(908) 797-1777</a></div>
          </div>
          <div class="dhb-map">
            <iframe title="Dream Home Builder map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.035345717311!2d-74.3734674!3d40.5407981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3c90710609b1f%3A0xc6c4f8d956b6b3e!2s25%20Parker%20Rd%2C%20Edison%2C%20NJ%2008820!5e0!3m2!1sen!2sus!4v1700000000000"></iframe>
          </div>
        </div>
        <div class="dhb-mode-pane" data-dhb-pane="virtual">
          <p class="p1">Busy schedule? Book a seamless virtual meeting from the comfort of your home.</p>
          <div class="dhb-meta">
            <div class="l1">Zoom or Google Meet</div>
            <div class="l1">Flexible evening slots</div>
            <div class="l1">Operating statewide in NJ</div>
            <div class="l1"><a href="tel:+19087971777">(908) 797-1777</a></div>
          </div>
        </div>
      </div>
      <form class="dhb-form" data-scroll-reveal="ctn" id="dhb-contact-form">
        <p class="p1">Send project details so we can prepare for a productive conversation.</p>
        <input required name="name" placeholder="Full Name" autocomplete="name" />
        <input required type="email" name="email" placeholder="Email Address" autocomplete="email" />
        <input type="tel" name="phone" placeholder="Phone Number" autocomplete="tel" />
        <select name="platform" id="dhb-platform" style="display:none">
          <option value="">Preferred Platform</option>
          <option>Zoom</option>
          <option>Google Meet</option>
          <option>Phone Call</option>
        </select>
        <textarea required name="message" placeholder="Tell us about your project"></textarea>
        <button type="submit" class="l1">Send Message</button>
        <p class="l1 reg" data-status></p>
      </form>
    </div>
  </div>
</section>

<section id="quote" data-bg="color" class="section clip theme_on-color dhb-block">
  <div class="dhb-inner">
    <div class="dhb-head">
      <h2 data-scroll-reveal="h" class="h1 a-center">Request a Quote</h2>
      <p data-scroll-reveal="p" class="p1 a-center">Transparent pricing, no hidden surprises. Tell us about your dream project.</p>
    </div>
    <div class="dhb-split">
      <div class="dhb-panel" data-scroll-reveal="p">
        <p class="p1">A short conversation is enough to understand whether you need a family home, a renovation, or a place you’ll return to for years.</p>
        <div class="dhb-meta">
          <div class="l1"><a href="tel:+19087971777">(908) 797-1777</a></div>
          <div class="l1"><a href="mailto:dreamhomebuildersnj@gmail.com">dreamhomebuildersnj@gmail.com</a></div>
          <div class="l1">25 Parker Rd, Edison NJ 08820</div>
          <div class="l1">Mon – Fri: 9am – 6pm</div>
        </div>
      </div>
      <form class="dhb-form" data-scroll-reveal="ctn" id="dhb-quote-form">
        <select required name="service">
          <option value="" disabled selected>Service Required *</option>
          <option>New Home Construction</option>
          <option>Home Renovation</option>
          <option>Room Extension</option>
          <option>Interior Design</option>
        </select>
        <input required name="budget" placeholder="Approx. Budget (USD) *" />
        <input name="sqft" placeholder="Total Square Footage (Optional)" />
        <input type="date" name="start" aria-label="Desired start date" />
        <textarea required name="description" placeholder="Project Description *"></textarea>
        <input required name="location" placeholder="Location / Address *" />
        <button type="submit" class="l1">Request Detailed Quote</button>
        <p class="l1 reg" data-status></p>
      </form>
    </div>
  </div>
</section>

<script>
(() => {
  const modeBtns = document.querySelectorAll('#dhb-contact-modes [data-dhb-mode]');
  const panes = document.querySelectorAll('[data-dhb-pane]');
  const platform = document.getElementById('dhb-platform');
  const contactForm = document.getElementById('dhb-contact-form');
  const quoteForm = document.getElementById('dhb-quote-form');

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-dhb-mode');
      modeBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      panes.forEach((pane) => {
        pane.classList.toggle('is-active', pane.getAttribute('data-dhb-pane') === mode);
      });
      if (platform) {
        platform.style.display = mode === 'virtual' ? 'block' : 'none';
        platform.required = mode === 'virtual';
        if (mode !== 'virtual') platform.value = '';
      }
    });
  });

  function bindForm(form, message) {
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.querySelector('[data-status]');
      if (status) status.textContent = message;
      form.reset();
      if (platform) platform.style.display = 'none';
    });
  }

  bindForm(contactForm, 'Thanks — we will get back to you shortly.');
  bindForm(quoteForm, 'Quote request received. Our team will follow up soon.');
})();
</script>
`

// Append CSS into existing dhb-sections style block
if (!html.includes('.dhb-split')) {
  html = html.replace('</style>\n\n\n\n<!------', `${extraCss}</style>\n\n\n\n<!------`)
  if (!html.includes('.dhb-split')) {
    html = html.replace(
      /(<style id="dhb-sections-css">[\s\S]*?)(<\/style>)/,
      `$1${extraCss}$2`,
    )
  }
}

// Replace from contact section through quote section (and remove trailing duplicate script if present)
const contactStart = html.lastIndexOf('<section', html.indexOf('id="contact"'))
const quoteAttr = html.indexOf('id="quote"')
let depth = 0
let j = html.lastIndexOf('<section', quoteAttr)
let quoteEnd = -1
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
      quoteEnd = j
      break
    }
  }
}
if (contactStart < 0 || quoteEnd < 0) throw new Error('contact/quote bounds missing')

let after = html.slice(quoteEnd)
// strip old leftover gallery script that uses inline display toggles
after = after.replace(
  /^\s*<script>\s*\(\(\) => \{[\s\S]*?data-dhb-tab[\s\S]*?<\/script>/,
  '',
)

html = html.slice(0, contactStart) + contactQuote + after
fs.writeFileSync(path, html)

const verify = fs.readFileSync(path, 'utf8')
console.log('dhb-split css', verify.includes('.dhb-split'))
console.log('contact modes', verify.includes('dhb-contact-modes'))
console.log('quote form', verify.includes('dhb-quote-form'))
console.log('old inline form styles left', verify.includes('grid _2-columns" style="display:grid'))
