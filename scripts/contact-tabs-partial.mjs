// Shared "Contact Us" tabbed panel (In Person / Virtual), restored from the
// previous live site: each mode has its own info column plus its own direct
// message form (distinct from the detailed "Request a Quote" popup elsewhere
// on the site). Used on the homepage (pasted statically into index.html) and
// generated fresh for the /contact page.

const ICONS = {
  pin: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 18s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="8" r="2.1" stroke="currentColor" stroke-width="1.4"/></svg>',
  clock: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.3" stroke="currentColor" stroke-width="1.4"/><path d="M10 6v4.2l2.8 1.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  phone: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 3.2 8 6.7 6.3 8.6c.6 1.5 2.3 3.2 3.9 3.9l1.8-1.7 3.5 2v2.2c0 1-.9 1.7-1.8 1.5-6-1-9.7-4.7-10.7-10.7C2.8 4.9 3.6 4 4.5 4h1.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  video: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.2" y="5.4" width="11" height="9.2" rx="1.2" stroke="currentColor" stroke-width="1.4"/><path d="m13.2 8.6 4.6-2.6v8l-4.6-2.6" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  calendar: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="4" width="15" height="13.5" rx="1.3" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 8h15M6.3 2.5v3M13.7 2.5v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  globe: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.3" stroke="currentColor" stroke-width="1.4"/><path d="M2.7 10h14.6M10 2.7c2 2 2 12.6 0 14.6M10 2.7c-2 2-2 12.6 0 14.6" stroke="currentColor" stroke-width="1.4"/></svg>',
}
const ico = (name) => `<span class="dhb-ct-ico">${ICONS[name]}</span>`

const altQuoteNote = `<p class="dhb-ctab-alt">Ready for a detailed estimate instead? <button type="button" class="dhb-ctab-altlink" data-open-quote>Request a quote &rarr;</button></p>`

// Real endpoints already configured for these two forms before the Contact
// section was folded into Quote earlier in this project - restored, not new.
const CONTACT_IN_PERSON_ENDPOINT = 'https://formspree.io/f/xykpgpzk'
const CONTACT_VIRTUAL_ENDPOINT = 'https://formspree.io/f/mqeyarzv'

export function contactTabsHTML({ mapSrc } = {}) {
  return `<div class="dhb-ctabs" data-scroll-reveal="ctn">
  <div class="dhb-ctabs-nav" role="tablist">
    <button type="button" class="dhb-ctab is-active" data-ctab="person" role="tab" aria-selected="true">${ico('pin')}In Person</button>
    <button type="button" class="dhb-ctab" data-ctab="virtual" role="tab" aria-selected="false">${ico('video')}Virtual</button>
  </div>
  <div class="dhb-ctabs-body">

    <div class="dhb-ctab-pane is-active" data-cpane="person">
      <div class="dhb-ctab-grid">
        <div class="dhb-ctab-info">
          <p class="dhb-ctab-copy">Prefer to chat over coffee? We'd love to host you at our Edison location to discuss your vision.</p>
          <ul class="dhb-ctab-list">
            <li>${ico('pin')}<a href="https://maps.app.goo.gl/qYnY5QVnExpty1Wa7" target="_blank" rel="noopener noreferrer">25 Parker Rd, Edison NJ 08820</a></li>
            <li>${ico('clock')}<span>Mon &ndash; Fri: 9am &ndash; 6pm</span></li>
            <li>${ico('phone')}<a href="tel:+19087971777">(908) 797-1777</a></li>
          </ul>
          <div class="dhb-ctab-map">
            <iframe title="Dream Home Builders — 25 Parker Rd, Edison NJ" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${mapSrc}"></iframe>
          </div>
        </div>
        <div class="dhb-ctab-formcol">
          <p class="dhb-ctab-copy">We value your time. If you prefer, send us details of your project so we can be better prepared for a productive conversation.</p>
          <form class="dhb-ctab-form" id="dhb-inperson-form" action="${CONTACT_IN_PERSON_ENDPOINT}" method="POST">
            <input required name="name" placeholder="Full Name" autocomplete="name" />
            <input required type="email" name="email" placeholder="Email Address" autocomplete="email" />
            <textarea required name="project_details" rows="3" placeholder="Tell us about your project..."></textarea>
            <button type="submit" class="dhb-ctab-submit">Send Message</button>
            <p class="dhb-ctab-status" data-status></p>
          </form>
          ${altQuoteNote}
        </div>
      </div>
    </div>

    <div class="dhb-ctab-pane" data-cpane="virtual">
      <div class="dhb-ctab-grid">
        <div class="dhb-ctab-info">
          <p class="dhb-ctab-copy">Busy schedule? We offer seamless virtual meetings to discuss your dream home from the comfort of your couch.</p>
          <ul class="dhb-ctab-list">
            <li>${ico('video')}<span>Zoom or Google Meet</span></li>
            <li>${ico('calendar')}<span>Flexible evening slots</span></li>
            <li>${ico('globe')}<span>Operating statewide in NJ</span></li>
            <li>${ico('phone')}<a href="tel:+19087971777">(908) 797-1777</a></li>
          </ul>
        </div>
        <div class="dhb-ctab-formcol">
          <p class="dhb-ctab-copy">We value your time. If you prefer, send us details of your project so we can be better prepared for a productive conversation.</p>
          <form class="dhb-ctab-form" id="dhb-virtual-form" action="${CONTACT_VIRTUAL_ENDPOINT}" method="POST">
            <input required name="name" placeholder="Full Name" autocomplete="name" />
            <input required type="email" name="email" placeholder="Email Address" autocomplete="email" />
            <select name="meeting_mode">
              <option value="" selected>Preferred Platform</option>
              <option>Zoom</option>
              <option>Google Meet</option>
              <option>Phone Call</option>
            </select>
            <textarea required name="proposed_time" rows="3" placeholder="Proposed date and time..."></textarea>
            <button type="submit" class="dhb-ctab-submit">Schedule Call</button>
            <p class="dhb-ctab-status" data-status></p>
          </form>
          ${altQuoteNote}
        </div>
      </div>
    </div>

  </div>
</div>`
}

export const CONTACT_TABS_JS = `<script id="dhb-contact-tabs-js">
(function () {
  document.querySelectorAll('.dhb-ctabs').forEach(function (root) {
    var tabs = [].slice.call(root.querySelectorAll('[data-ctab]'));
    var panes = [].slice.call(root.querySelectorAll('[data-cpane]'));
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var key = t.getAttribute('data-ctab');
        tabs.forEach(function (x) { x.classList.toggle('is-active', x === t); x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
        panes.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-cpane') === key); });
      });
    });
  });

  function bindContactForm(form) {
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var status = form.querySelector('[data-status]');
      var button = form.querySelector('button[type="submit"]');
      var original = button ? button.textContent : '';
      if (button) { button.disabled = true; button.textContent = 'Sending...'; }
      if (status) status.textContent = '';
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(function (res) {
          if (res.ok) {
            if (status) status.textContent = 'Thanks! Your message has been sent successfully.';
            form.reset();
            if (button) button.textContent = 'Sent!';
            setTimeout(function () {
              if (button) { button.disabled = false; button.textContent = original; }
            }, 1800);
          } else {
            if (status) status.textContent = 'Oops! There was a problem. Please try again.';
            if (button) { button.disabled = false; button.textContent = original; }
          }
        })
        .catch(function () {
          if (status) status.textContent = 'Connection error. Please check your internet.';
          if (button) { button.disabled = false; button.textContent = original; }
        });
    });
  }
  bindContactForm(document.getElementById('dhb-inperson-form'));
  bindContactForm(document.getElementById('dhb-virtual-form'));
})();
</script>`
