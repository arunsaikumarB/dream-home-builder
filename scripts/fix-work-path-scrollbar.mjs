import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

const css = `<style id="dhb-work-path-css">
  /* Image strip has its OWN horizontal scroll + minimal bottom scrollbar */
  .loc-path-w,
  .loc-path-s,
  .loc-path-s_b,
  .loc-path-s_b > .grid {
    width: 100vw !important;
    max-width: 100vw !important;
    min-width: 0 !important;
  }
  .loc-path-s_c,
  .loc-path-s_t {
    width: 100vw !important;
    max-width: 100vw !important;
  }

  .dhb-work-path {
    width: 100% !important;
    max-width: 100vw !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    padding: 1rem 0 1.35rem;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
    scrollbar-width: thin;
    scrollbar-color: #063670 rgba(6, 54, 112, 0.1);
  }
  .dhb-work-path::-webkit-scrollbar {
    height: 4px;
    display: block !important;
    width: auto !important;
  }
  .dhb-work-path::-webkit-scrollbar-track {
    background: rgba(6, 54, 112, 0.08);
    border-radius: 999px;
    margin: 0 4vw;
  }
  .dhb-work-path::-webkit-scrollbar-thumb {
    background: #063670;
    border-radius: 999px;
  }
  .dhb-work-path::-webkit-scrollbar-thumb:hover {
    background: #0F5E9A;
  }

  .dhb-work-track {
    display: flex;
    gap: 2.5rem;
    width: max-content;
    min-width: 100%;
    padding: 0 4vw 0.75rem;
    align-items: flex-end;
  }
  .dhb-work-card {
    margin: 0;
    flex: 0 0 auto;
    width: min(28rem, 42vw);
  }
  .dhb-work-card:nth-child(even) {
    width: min(24rem, 36vw);
    margin-bottom: 3rem;
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
    margin-top: 0.9rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  @media (max-width: 991px) {
    .dhb-work-track {
      gap: 1.25rem;
      padding: 0 1.25rem 0.75rem;
    }
    .dhb-work-card { width: min(18rem, 78vw); }
    .dhb-work-card:nth-child(even) {
      width: min(15rem, 70vw);
      margin-bottom: 1.5rem;
    }
  }
</style>`

if (!html.includes('id="dhb-work-path-css"')) {
  console.error('missing work-path css')
  process.exit(1)
}
html = html.replace(/<style id="dhb-work-path-css">[\s\S]*?<\/style>/, css)

// Allow overflow scroll class (drop scrollbar-none)
html = html.replace(
  'class="loc-path-s_path scrollbar-none dhb-work-path"',
  'class="loc-path-s_path dhb-work-path"',
)

const js = `<script id="dhb-work-path-js">
(function () {
  function refreshLocScrollHeight() {
    var area = document.querySelector('.loc-scroll-area');
    var track = area && area.querySelector('.loc-scroll-area_track');
    if (area && track && window.matchMedia('(min-width: 992px)').matches) {
      area.style.height = track.scrollWidth + 'px';
    }
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  function bindIndependentStripScroll() {
    var path = document.querySelector('[data-dhb-work-path]');
    if (!path) return;

    // Kill old page-scrubbed mobile tween so this strip scrolls on its own
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(function (st) {
        if (st.vars && st.vars.id === 'dhb-work-path-mobile') st.kill();
      });
    }
    var strip = path.querySelector('.dhb-work-track');
    if (strip && typeof gsap !== 'undefined') {
      gsap.set(strip, { clearProps: 'transform' });
    }

    // Wheel / trackpad: convert vertical wheel to horizontal when hovering the strip
    path.addEventListener(
      'wheel',
      function (e) {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        if (path.scrollWidth <= path.clientWidth + 2) return;
        e.preventDefault();
        path.scrollLeft += e.deltaY;
      },
      { passive: false },
    );
  }

  function boot() {
    bindIndependentStripScroll();
    refreshLocScrollHeight();
    var imgs = document.querySelectorAll('[data-dhb-work-path] img');
    var left = imgs.length;
    if (!left) return;
    imgs.forEach(function (img) {
      var done = function () {
        if (--left === 0) refreshLocScrollHeight();
      };
      if (img.complete) done();
      else img.addEventListener('load', done, { once: true });
    });
  }

  if (document.readyState === 'complete') {
    setTimeout(boot, 400);
  } else {
    window.addEventListener('load', function () {
      setTimeout(boot, 400);
    });
  }
})();
</script>`

html = html.replace(/<script id="dhb-work-path-js">[\s\S]*?<\/script>/, js)

fs.writeFileSync(path, html)
console.log({
  cssOk: html.includes('scrollbar-width: thin'),
  noScrollbarNone: !html.includes('scrollbar-none dhb-work-path'),
  jsIndependent: html.includes('bindIndependentStripScroll'),
})
