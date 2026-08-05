import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

// Curated labels + related project images (exterior / build / elevation / interior mix)
const images = [
  { src: '/images/home/exterior-modern-1.webp', label: 'Exterior', alt: 'Custom home exterior with landscaped entry' },
  { src: '/images/projects/elevation/modern-elevation2.jpg', label: 'Build', alt: 'Completed custom home exterior at dusk' },
  { src: '/images/projects/elevation/modern-elevation1.jpg', label: 'Elevation', alt: 'Modern luxury home elevation' },
  { src: '/images/home/interior-modern-1.webp', label: 'Interior', alt: 'Bright finished interior detail' },
  { src: '/images/projects/elevation/modern-elevation3.jpg', label: 'Exterior', alt: 'Contemporary home facade' },
  { src: '/images/services/construction.jpeg', label: 'Build', alt: 'Building work in progress' },
  { src: '/images/projects/elevation/modern-elevation4.jpg', label: 'Elevation', alt: 'Architectural elevation view' },
  { src: '/images/projects/interior/interior-2.jpg', label: 'Interior', alt: 'Custom interior living detail' },
  { src: '/images/projects/kitchen/kitchen-2.jpg', label: 'Kitchen', alt: 'Custom kitchen interior' },
  { src: '/images/projects/living/living-1.jpg', label: 'Living', alt: 'Finished living room' },
]

const galleryInner = images
  .map(
    (img) => `<figure class="dhb-work-card">
  <div class="img-w"><img loading="eager" src="${img.src}" alt="${img.alt}" class="img"/></div>
  <figcaption class="l1">${img.label}</figcaption>
</figure>`,
  )
  .join('')

const gallery = `<div class="loc-path-s_path scrollbar-none dhb-work-path" data-dhb-work-path>
<div class="dhb-work-track">
${galleryInner}
</div>
</div>`

const css = `<style id="dhb-work-path-css">
  /* Wide image strip inside Era horizontal scroll — no native scrollbar */
  .loc-path-w {
    width: max-content !important;
    min-width: 100vw;
  }
  .loc-path-s {
    width: max-content !important;
    max-width: none !important;
  }
  /* Keep the headline in a normal viewport while images extend the track */
  .loc-path-s_c,
  .loc-path-s_t {
    width: 100vw !important;
    max-width: 100vw !important;
  }
  .loc-path-s_b,
  .loc-path-s_b > .grid {
    width: max-content !important;
    max-width: none !important;
  }
  .dhb-work-path {
    width: max-content !important;
    max-width: none !important;
    overflow: visible !important;
    padding: 1rem 0 2rem;
  }
  .dhb-work-track {
    display: flex;
    gap: 2.5rem;
    width: max-content;
    padding: 0 8vw 0.5rem 4vw;
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
  .dhb-work-path,
  .dhb-work-path * {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
  .dhb-work-path::-webkit-scrollbar,
  .dhb-work-track::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }

  @media (max-width: 991px) {
    /* Mobile: pin + scrub horizontal with page scroll (desktop uses Era loc-scroll) */
    .loc-path-w,
    .loc-path-s,
    .loc-path-s_b,
    .loc-path-s_b > .grid {
      width: 100% !important;
      min-width: 0 !important;
    }
    .dhb-work-path {
      width: 100% !important;
      overflow: hidden !important;
    }
    .dhb-work-track {
      gap: 1.25rem;
      padding: 0 1.25rem 0.5rem;
      will-change: transform;
    }
    .dhb-work-card { width: min(18rem, 78vw); }
    .dhb-work-card:nth-child(even) { width: min(15rem, 70vw); margin-bottom: 1.5rem; }
  }
</style>`

const script = `<script id="dhb-work-path-js">
(function () {
  function refreshScroll() {
    var area = document.querySelector('.loc-scroll-area');
    var track = area && area.querySelector('.loc-scroll-area_track');
    if (area && track && window.matchMedia('(min-width: 992px)').matches) {
      area.style.height = track.scrollWidth + 'px';
    }
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  function initDhbWorkPathMobile() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    var path = document.querySelector('[data-dhb-work-path]');
    var strip = path && path.querySelector('.dhb-work-track');
    if (!path || !strip) return;

    ScrollTrigger.getAll().forEach(function (st) {
      if (st.vars && st.vars.id === 'dhb-work-path-mobile') st.kill();
    });
    gsap.set(strip, { clearProps: 'transform' });

    gsap.matchMedia().add('(max-width: 991px)', function () {
      var distance = Math.max(0, strip.scrollWidth - path.clientWidth);
      if (distance < 8) return;
      gsap.to(strip, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          id: 'dhb-work-path-mobile',
          trigger: path.closest('.loc-path-w') || path,
          start: 'top 65%',
          end: function () { return '+=' + Math.round(distance * 1.2); },
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      });
    });
  }

  function boot() {
    initDhbWorkPathMobile();
    refreshScroll();
    // Images can widen the track after decode
    var imgs = document.querySelectorAll('[data-dhb-work-path] img');
    var left = imgs.length;
    if (!left) return;
    imgs.forEach(function (img) {
      if (img.complete) {
        if (--left === 0) refreshScroll();
      } else {
        img.addEventListener('load', function () {
          if (--left === 0) refreshScroll();
        }, { once: true });
      }
    });
  }

  if (document.readyState === 'complete') {
    setTimeout(boot, 500);
  } else {
    window.addEventListener('load', function () { setTimeout(boot, 500); });
  }
})();
</script>`

// Replace existing gallery block
const galleryRe =
  /<div class="loc-path-s_path scrollbar-none dhb-work-path"[\s\S]*?<\/div>\s*<\/div>(?=<\/div><div class="u-48"><\/div><\/div><\/div><div class="loc-path-w_flower">)/

if (!galleryRe.test(html)) {
  // fallback: looser match
  const loose = /<div class="loc-path-s_path scrollbar-none dhb-work-path[\s\S]*?<div class="dhb-work-track">[\s\S]*?<\/div>\s*<\/div>/
  if (!loose.test(html)) {
    console.error('gallery block not found')
    process.exit(1)
  }
  html = html.replace(loose, gallery)
} else {
  html = html.replace(galleryRe, gallery)
}

if (html.includes('id="dhb-work-path-css"')) {
  html = html.replace(/<style id="dhb-work-path-css">[\s\S]*?<\/style>/, css)
} else {
  html = html.replace('</head>', `${css}</head>`)
}

if (html.includes('id="dhb-work-path-js"')) {
  html = html.replace(/<script id="dhb-work-path-js">[\s\S]*?<\/script>/, script)
} else {
  html = html.replace('</body>', `${script}</body>`)
}

fs.writeFileSync(path, html)

console.log('images', images.length)
console.log('gallery', html.includes('data-dhb-work-path'))
console.log('css', html.includes('dhb-work-path-css'))
console.log('js', html.includes('dhb-work-path-js'))
console.log('overflow auto gone', !/dhb-work-path\s*\{[^}]*overflow-x:\s*auto/.test(html))
console.log(
  'div diff',
  (html.match(/<div\b/g) || []).length - (html.match(/<\/div>/g) || []).length,
)
