import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

const css = `<style id="dhb-villas-css">
  /* NJ villa cutouts — framed layout (override Era flower chrome) */
  .loc-info-w,
  .loc-intro-w,
  .loc-path-w {
    position: relative;
    color: #063670;
  }
  .container.loc,
  .loc-scroll-area {
    color: #063670;
  }
  .loc-info-s,
  .loc-intro-s,
  .loc-path-s {
    position: relative;
    z-index: 3;
  }

  .flower video { display: none !important; }

  .flower.dhb-villa-wrap {
    pointer-events: none !important;
    z-index: 1 !important;
    width: auto !important;
    height: auto !important;
    max-width: none !important;
    inset: auto !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    margin: 0 !important;
    transform: none !important;
    position: absolute !important;
  }
  .flower.dhb-villa-wrap * {
    transform: none !important;
  }

  .dhb-villa {
    width: 100%;
    line-height: 0;
    filter: drop-shadow(0 16px 28px rgba(6, 54, 112, 0.16));
  }
  .dhb-villa img {
    width: 100%;
    height: auto;
    display: block;
    background: transparent !important;
    object-fit: contain;
  }

  /* Panel 1: left villa + right rail frame the centered copy */
  .flower.loc-info.dhb-villa-wrap {
    left: 1.5% !important;
    bottom: 5% !important;
    width: min(27vw, 21rem) !important;
  }
  .dhb-villa-rail {
    position: absolute;
    right: 1.5%;
    bottom: 5%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.85rem;
    width: min(27vw, 21rem);
    margin: 0;
    pointer-events: none;
  }
  .dhb-villa-rail img {
    width: 100%;
    height: auto;
    background: transparent;
    filter: drop-shadow(0 14px 24px rgba(6, 54, 112, 0.14));
  }
  .dhb-villa-rail img:nth-child(2) {
    width: 78%;
  }

  /* Panel 2 */
  .flower.loc-intro.dhb-villa-wrap {
    left: 2% !important;
    bottom: 6% !important;
    width: min(24vw, 19rem) !important;
  }

  /* Panel 3 */
  .loc-path-w_flower {
    position: absolute !important;
    right: 2% !important;
    bottom: 6% !important;
    left: auto !important;
    top: auto !important;
    width: min(26vw, 20rem) !important;
    margin: 0 !important;
    z-index: 1;
    pointer-events: none;
  }
  .flower.loc-path.dhb-villa-wrap {
    position: static !important;
    width: 100% !important;
    transform: none !important;
  }

  .loc-info-s .l1,
  .loc-info-s .h4,
  .loc-info-s .p1,
  .loc-info-s .h1,
  .loc-intro-s .h1,
  .loc-intro-s .c1,
  .loc-intro-s .p1,
  .loc-intro-s .l1,
  .loc-path-s .h3,
  .loc-path-s .a2,
  .loc-path-s .l1 {
    color: #063670 !important;
  }
  .loc-path-s .a2 {
    color: #B88734 !important;
  }

  .loc-info-s .info-s_lead,
  .loc-info-s .info-s_desc {
    max-width: min(52rem, 54vw);
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 991px) {
    .flower.loc-info.dhb-villa-wrap,
    .flower.loc-intro.dhb-villa-wrap,
    .loc-path-w_flower,
    .dhb-villa-rail {
      width: min(36vw, 9.5rem) !important;
    }
    .dhb-villa-rail img:nth-child(2) {
      display: none;
    }
    .loc-info-s .info-s_lead,
    .loc-info-s .info-s_desc {
      max-width: 72vw;
    }
  }

  @media (max-width: 640px) {
    .flower.loc-info.dhb-villa-wrap,
    .flower.loc-intro.dhb-villa-wrap,
    .loc-path-w_flower,
    .dhb-villa-rail {
      width: min(42vw, 7.5rem) !important;
      bottom: 3% !important;
    }
    .dhb-villa-rail {
      bottom: 3%;
    }
  }
</style>`

if (!html.includes('id="dhb-villas-css"')) {
  console.error('missing dhb-villas-css')
  process.exit(1)
}

html = html.replace(/<style id="dhb-villas-css">[\s\S]*?<\/style>/, css)

// Ensure rail is a sibling of loc-info content, not inside the title grid
if (html.includes('s_title"><h2 data-part="p" class="l1 a-center">New Jersey Homes</h2></div>\n<div class="dhb-villa-rail"')) {
  html = html.replace(
    /<div class="grid"><div class="s_title"><h2 data-part="p" class="l1 a-center">New Jersey Homes<\/h2><\/div>\s*<div class="dhb-villa-rail" aria-hidden="true">[\s\S]*?<\/div><\/div>/,
    '<div class="grid"><div class="s_title"><h2 data-part="p" class="l1 a-center">New Jersey Homes</h2></div></div>',
  )
}

if (!html.includes('class="dhb-villa-rail"')) {
  html = html.replace(
    /(<div class="flower loc-info dhb-villa-wrap">[\s\S]*?<\/div><\/div>)/,
    `$1
<div class="dhb-villa-rail" aria-hidden="true">
  <img src="/images/villas/villa-3.png" alt="" loading="lazy" />
  <img src="/images/villas/villa-5.png" alt="" loading="lazy" />
</div>`,
  )
}

html = html.replace(/data-parallax="[^"]*"\s+(?=class="flower[^"]*dhb-villa-wrap")/g, '')

fs.writeFileSync(path, html)
console.log('ok', html.includes('dhb-villa-rail'), !html.includes('data-parallax="ctn-down" class="flower loc-info'))
