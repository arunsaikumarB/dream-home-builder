import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')

function findSections(html) {
  const starts = []
  const re = /<section\b[^>]*>/g
  let m
  while ((m = re.exec(html))) starts.push({ i: m.index, tag: m[0] })
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
          blocks.push({
            start,
            end: j,
            tag: starts[i].tag,
            preview: html.slice(start, start + 180).replace(/\s+/g, ' '),
            textHit: [
              'Three reasons',
              'Architecture Team',
              'Homes range',
              'Developer',
              'License obtained',
              'Perfect',
              'sea views',
              'The concept',
              'Services',
              'amen-',
              'interior',
              'footer',
            ].filter((t) => html.slice(start, j).includes(t)),
          })
          break
        }
      }
    }
  }
  return blocks
}

const blocks = findSections(h)
blocks.forEach((b, i) => {
  console.log(`\n#${i} ${b.start}-${b.end} (${b.end - b.start} chars)`)
  console.log(b.tag)
  console.log('hits:', b.textHit.join(', ') || '(none)')
  console.log(b.preview)
})
