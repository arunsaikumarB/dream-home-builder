import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

function extractSection(source, predicate) {
  const re = /<section\b[^>]*>/g
  let m
  while ((m = re.exec(source))) {
    const start = m.index
    let depth = 0
    let j = start
    while (j < source.length) {
      const open = source.indexOf('<section', j)
      const close = source.indexOf('</section>', j)
      if (close === -1) return null
      if (open !== -1 && open < close) {
        depth++
        j = open + 8
      } else {
        depth--
        j = close + 10
        if (depth === 0) {
          const block = source.slice(start, j)
          if (predicate(block)) return { start, end: j, block }
          break
        }
      }
    }
  }
  return null
}

// 1) Restore Edison location captions on the full-bleed scene
html = html.replace(
  '<h3 data-scroll-reveal="p" class="l1">Exterior & Interior</h3><div class="u-32"></div><h4 data-scroll-reveal="p" class="p1">Building work</h4><div class="u-32"></div><h5 data-scroll-reveal="p" class="p1">New Jersey</h5>',
  '<h3 data-scroll-reveal="p" class="l1">Edison, New Jersey</h3><div class="u-32"></div><h4 data-scroll-reveal="p" class="p1">New Jersey</h4><div class="u-32"></div><h5 data-scroll-reveal="p" class="p1">USA</h5>',
)

// Also fix if still the older Edison set (no-op) or partial states
if (!html.includes('>Edison, New Jersey<') && html.includes('class="loc-s_desc"')) {
  html = html.replace(
    /(<div class="loc-s_desc"><div class="b-desk"><div class="loc-s_desc_line"><div data-scroll-reveal="line" class="line-v"><\/div><\/div>)<h3 data-scroll-reveal="p" class="l1">[\s\S]*?<\/h5>/,
    `$1<h3 data-scroll-reveal="p" class="l1">Edison, New Jersey</h3><div class="u-32"></div><h4 data-scroll-reveal="p" class="p1">New Jersey</h4><div class="u-32"></div><h5 data-scroll-reveal="p" class="p1">USA</h5>`,
  )
}

// 2) Set full-bleed background to the matching wood/stone elevation
{
  const i = html.indexOf('class="loc-w_bg"')
  if (i !== -1) {
    const imgWrap = html.indexOf('<div class="img-w h-auto">', i)
    const imgStart = html.indexOf('<img ', imgWrap)
    const imgEnd = html.indexOf('>', imgStart) + 1
    if (imgStart !== -1 && imgEnd > imgStart) {
      html =
        html.slice(0, imgStart) +
        `<img src="/images/projects/elevation/modern-elevation3.jpg" loading="eager" sizes="(max-width: 1920px) 100vw, 1920px" srcset="/images/projects/elevation/modern-elevation3.jpg 500w, /images/projects/elevation/modern-elevation3.jpg 800w, /images/projects/elevation/modern-elevation3.jpg 1080w, /images/projects/elevation/modern-elevation3.jpg 1920w" alt="Custom Dream Home Builder residence in Edison, New Jersey" class="img h-auto"/>` +
        html.slice(imgEnd)
    }
  }
}

// 3) Tag the section
html = html.replace(
  '<section data-bg="color" class="section clip theme_on-color"><div class="container"><div data-parallax="w" class="loc-w">',
  '<section id="portfolio-scene" data-bg="color" class="section clip theme_on-color"><div class="container"><div data-parallax="w" class="loc-w">',
)
html = html.replace(
  '<section id="portfolio-scene" data-bg="color" class="section clip theme_on-color"><div class="container"><div data-parallax="w" class="loc-w">',
  '<section id="portfolio-scene" data-bg="color" class="section clip theme_on-color"><div class="container"><div data-parallax="w" class="loc-w">',
)

// 4) Ensure it comes immediately after the horizontal scroll section
const locW = extractSection(html, (b) => b.includes('class="loc-w"'))
const locScroll = extractSection(html, (b) => b.includes('loc-scroll-area'))

if (locW && locScroll) {
  const immediatelyAfter =
    html.slice(locScroll.end, locScroll.end + 80).includes('portfolio-scene') ||
    html.slice(locScroll.end, locScroll.end + 120).includes('class="loc-w"')

  if (locW.start !== locScroll.end) {
    // Remove from current place and insert right after scroll
    html = html.slice(0, locW.start) + html.slice(locW.end)
    const scroll = extractSection(html, (b) => b.includes('loc-scroll-area'))
    const block = locW.block.includes('id="portfolio-scene"')
      ? locW.block
      : locW.block.replace('<section ', '<section id="portfolio-scene" ')
    html = html.slice(0, scroll.end) + block + html.slice(scroll.end)
    console.log('placed portfolio-scene immediately after loc-scroll')
  } else if (!immediatelyAfter) {
    console.log('adjacent already')
  } else {
    console.log('loc-w already immediately after loc-scroll')
  }
}

fs.writeFileSync(path, html)

const scroll = extractSection(html, (b) => b.includes('loc-scroll-area'))
const scene = extractSection(html, (b) => b.includes('id="portfolio-scene"') || b.includes('class="loc-w"'))
console.log('edison', html.includes('>Edison, New Jersey<'))
console.log('elevation3', html.includes('modern-elevation3.jpg'))
console.log('portfolio-scene', html.includes('id="portfolio-scene"'))
console.log('immediately after scroll', scroll && scene && scene.start === scroll.end)
console.log(
  'div diff',
  (html.match(/<div\b/g) || []).length - (html.match(/<\/div>/g) || []).length,
)
