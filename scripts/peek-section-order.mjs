import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')

function findSections(html) {
  const starts = []
  const re = /<section\b[^>]*>/g
  let m
  while ((m = re.exec(html))) starts.push({ i: m.index, tag: m[0].slice(0, 180) })
  const blocks = []
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i].i
    let depth = 0
    let j = start
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
          const body = html.slice(start, j)
          const id = (body.match(/id="([^"]+)"/) || [])[1] || ''
          const clue = [
            'loc-scroll-area',
            'loc-w',
            'dhb-work',
            'apart-type',
            'amen-',
            'id="services"',
            'id="inspired"',
            'id="hero"',
          ]
            .filter((k) => body.includes(k))
            .join(', ')
          blocks.push({ start, end: j, id, clue, tag: starts[i].tag })
          break
        }
      }
    }
  }
  return blocks
}

const blocks = findSections(h)
blocks.forEach((b, i) => {
  console.log(
    String(i).padStart(2),
    'start',
    b.start,
    'id=',
    b.id || '-',
    '|',
    b.clue || b.tag.replace(/\s+/g, ' ').slice(0, 100),
  )
})

// Check if loc-w is immediately after loc-scroll close
const scrollEnd = h.indexOf('</section>', h.indexOf('loc-scroll-area'))
// find the correct end of the section containing loc-scroll-area
const locScrollIdx = h.indexOf('loc-scroll-area')
const secStart = h.lastIndexOf('<section', locScrollIdx)
let depth = 0
let j = secStart
let secEnd = -1
while (j < h.length) {
  const open = h.indexOf('<section', j)
  const close = h.indexOf('</section>', j)
  if (close === -1) break
  if (open !== -1 && open < close) {
    depth++
    j = open + 8
  } else {
    depth--
    j = close + 10
    if (depth === 0) {
      secEnd = j
      break
    }
  }
}
console.log('\nloc-scroll section ends at', secEnd)
console.log('next 300 chars:', h.slice(secEnd, secEnd + 300).replace(/\s+/g, ' '))
console.log('loc-w index', h.indexOf('class="loc-w"'))
console.log('loc-w after scroll?', h.indexOf('class="loc-w"') > secEnd)
