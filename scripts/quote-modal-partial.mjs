// Single source of truth for the "Request a Quote" popup: markup + styles + JS.
// Injected once into index.html (via scripts/inject-shared-partials.mjs) and
// appended to every generated inner page by build-pages.mjs, so there is only
// ever one copy of the quote form on any given page - inside this modal.

export const QUOTE_MODAL_MARKER = '<!-- dhb-quote-modal:start -->'
export const QUOTE_MODAL_END = '<!-- dhb-quote-modal:end -->'

export const QUOTE_MODAL_HTML = `${QUOTE_MODAL_MARKER}
<style id="dhb-quote-modal-css">
  .dhb-modal {
    position: fixed;
    inset: 0;
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0.3s;
  }
  .dhb-modal.is-open { visibility: visible; opacity: 1; }
  .dhb-modal-overlay {
    position: absolute;
    inset: 0;
    background: rgba(6, 20, 40, 0.6);
    backdrop-filter: blur(3px);
  }
  .dhb-modal-panel {
    position: relative;
    width: 100%;
    max-width: 34rem;
    max-height: min(92vh, 46rem);
    overflow-y: auto;
    background: #f3f3ec;
    border: 1px solid rgba(6, 54, 112, 0.14);
    border-top: 3px solid #e8bc5e;
    box-shadow: 0 30px 70px -20px rgba(6, 20, 40, 0.45);
    padding: clamp(2rem, 5vw, 3rem);
    transform: translateY(14px) scale(0.98);
    transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .dhb-modal.is-open .dhb-modal-panel { transform: none; }
  .dhb-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2.1rem;
    height: 2.1rem;
    display: grid;
    place-items: center;
    border: 1px solid rgba(6, 54, 112, 0.2);
    background: transparent;
    color: #063670;
    font-size: 1.2rem;
    line-height: 1;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .dhb-modal-close:hover { background: #063670; color: #f3f3ec; }
  .dhb-qm-eyebrow {
    display: block;
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #b88734;
  }
  .dhb-qm-title {
    margin: 0.9rem 0 0;
    font-family: var(--_fonts---font-display, Georgia, serif);
    font-size: clamp(1.7rem, 4vw, 2.2rem);
    font-weight: 400;
    line-height: 1.08;
    text-transform: uppercase;
    color: #063670;
  }
  .dhb-qm-title em { font-style: italic; }
  .dhb-qm-intro { margin: 0.8rem 0 0; font-size: 0.9rem; line-height: 1.55; color: rgba(6, 54, 112, 0.72); }
  .dhb-qm-form { margin-top: 1.8rem; display: grid; gap: 1.25rem; }
  .dhb-qm-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.1rem; }
  @media (max-width: 480px) { .dhb-qm-row { grid-template-columns: 1fr; } }
  .dhb-qm-field { position: relative; display: block; }
  .dhb-qm-flabel {
    display: block;
    margin-bottom: 0.45rem;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: #063670;
  }
  .dhb-qm-optional { font-weight: 400; color: rgba(6, 54, 112, 0.5); text-transform: none; letter-spacing: 0; }
  .dhb-qm-field input,
  .dhb-qm-field select,
  .dhb-qm-field textarea {
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 0.85rem 1rem;
    background: #ffffff;
    border: 1px solid rgba(6, 54, 112, 0.22);
    border-radius: 3px;
    color: #063670;
    font: inherit;
    font-size: 0.92rem;
    outline: none;
    appearance: none;
    transition: border-color 0.25s ease;
  }
  .dhb-qm-field textarea { resize: vertical; min-height: 5.5rem; }
  .dhb-qm-field input:focus,
  .dhb-qm-field select:focus,
  .dhb-qm-field textarea:focus { border-color: #b88734; }
  .dhb-qm-field select {
    background-image: linear-gradient(45deg, transparent 50%, #063670 50%), linear-gradient(135deg, #063670 50%, transparent 50%);
    background-position: calc(100% - 1.15rem) center, calc(100% - 0.8rem) center;
    background-size: 6px 6px, 6px 6px;
    background-repeat: no-repeat;
    padding-right: 2.25rem;
  }
  .dhb-qm-field select:invalid { color: rgba(6, 54, 112, 0.5); }
  .dhb-qm-field input[type="date"] { color-scheme: light; }
  .dhb-qm-submit {
    margin-top: 0.3rem;
    padding: 1.05rem 1.5rem;
    border: 0;
    background: #063670;
    color: #f3f3ec;
    font-family: var(--_fonts---font-display, Georgia, serif);
    font-size: 0.95rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  .dhb-qm-submit:hover { background: #b88734; }
  .dhb-qm-submit:disabled { opacity: 0.6; cursor: default; }
  .dhb-qm-status { margin: 0; text-align: center; font-size: 0.78rem; color: #b88734; }
  body.dhb-modal-open { overflow: hidden; }
</style>

<div class="dhb-modal" id="dhb-quote-modal" aria-hidden="true">
  <div class="dhb-modal-overlay" data-modal-close></div>
  <div class="dhb-modal-panel" role="dialog" aria-modal="true" aria-labelledby="dhb-quote-modal-title">
    <button type="button" class="dhb-modal-close" data-modal-close aria-label="Close">&times;</button>
    <span class="dhb-qm-eyebrow">Get started</span>
    <h2 id="dhb-quote-modal-title" class="dhb-qm-title">Request a <em>quote</em></h2>
    <p class="dhb-qm-intro">Transparent pricing, no hidden surprises! Tell us about your dream project and we'll provide a detailed estimate.</p>
    <form class="dhb-qm-form" id="dhb-quote-form" action="https://formspree.io/f/mjgowdwe" method="POST">
      <div class="dhb-qm-row">
        <label class="dhb-qm-field">
          <span class="dhb-qm-flabel">Service Required *</span>
          <select required name="service_required">
            <option value="" disabled selected>Choose a service...</option>
            <option>New Home Construction</option>
            <option>House Renovation</option>
            <option>Architecture Design</option>
            <option>Interior Design</option>
            <option>Fixing &amp; Support</option>
            <option>Painting</option>
          </select>
        </label>
        <label class="dhb-qm-field">
          <span class="dhb-qm-flabel">Approx. Budget (USD) *</span>
          <input required name="budget" placeholder="e.g. 50000" />
        </label>
      </div>
      <div class="dhb-qm-row">
        <label class="dhb-qm-field">
          <span class="dhb-qm-flabel">Total Square Footage <span class="dhb-qm-optional">(Optional)</span></span>
          <input name="sq_ft" placeholder="e.g. 2,500 sq ft" />
        </label>
        <label class="dhb-qm-field">
          <span class="dhb-qm-flabel">Desired Start Date <span class="dhb-qm-optional">(Optional)</span></span>
          <input type="date" name="start_date" />
        </label>
      </div>
      <label class="dhb-qm-field">
        <span class="dhb-qm-flabel">Project Description *</span>
        <textarea required name="description" rows="3" placeholder="Briefly describe your vision..."></textarea>
      </label>
      <label class="dhb-qm-field">
        <span class="dhb-qm-flabel">Location / Address *</span>
        <input required name="location" placeholder="Where is the project located?" />
      </label>
      <button type="submit" class="dhb-qm-submit">Request Detailed Quote</button>
      <p class="dhb-qm-status l1 reg" data-status></p>
    </form>
  </div>
</div>

<script id="dhb-quote-modal-js">
(function () {
  var modal = document.getElementById('dhb-quote-modal');
  if (!modal) return;
  var lastFocused = null;

  function open(e) {
    if (e) {
      // This site runs barba.js, which delegates its own click listener on
      // document to drive AJAX page transitions. preventDefault() alone stops
      // the anchor's native navigation but does not stop that separate
      // listener from also firing and navigating anyway - stop the bubble.
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('dhb-modal-open');
    var firstField = modal.querySelector('input,textarea');
    if (firstField) firstField.focus();
  }
  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('dhb-modal-open');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  document.querySelectorAll('[data-open-quote]').forEach(function (btn) {
    btn.addEventListener('click', open);
  });
  modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
    el.addEventListener('click', close);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });

  var form = document.getElementById('dhb-quote-form');
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
})();
</script>
${QUOTE_MODAL_END}`
