import fs from 'node:fs'

const path = 'public/index.html'
let html = fs.readFileSync(path, 'utf8')

function findSections(source) {
  const starts = []
  const re = /<section\b[^>]*>/g
  let m
  while ((m = re.exec(source))) starts.push(m.index)
  const blocks = []
  for (const start of starts) {
    let depth = 0
    let j = start
    while (j < source.length) {
      const open = source.indexOf('<section', j)
      const close = source.indexOf('</section>', j)
      if (close === -1) break
      if (open !== -1 && open < close) {
        depth++
        j = open + 8
      } else {
        depth--
        j = close + 10
        if (depth === 0) {
          blocks.push({ start, end: j, html: source.slice(start, j) })
          break
        }
      }
    }
  }
  return blocks
}

const blocks = findSections(html)
const remove = []

blocks.forEach((b, i) => {
  const chunk = b.html
  const isSpaceToLive =
    chunk.includes('interior-w') ||
    (chunk.includes('The<br/>space<br/>to') && chunk.includes('Live in')) ||
    (chunk.includes('The<br>space<br>to') && chunk.includes('Live in'))
  const isArchitecture =
    chunk.includes('arch-scroll-area') ||
    (chunk.includes('Architecture') && chunk.includes('arch-intro')) ||
    (chunk.includes('>Architecture<') && chunk.includes('theme'))

  if (isSpaceToLive || isArchitecture) {
    remove.push(i)
    console.log('REMOVE', i, isSpaceToLive ? 'space-to-live' : 'architecture', chunk.slice(0, 140).replace(/\s+/g, ' '))
  }
})

if (!remove.length) {
  // fallback string search
  for (const key of ['interior-w', 'arch-scroll-area', 'The<br/>space<br/>to', '>Architecture<']) {
    console.log(key, html.includes(key))
  }
  throw new Error('No matching sections found')
}

;[...remove].sort((a, b) => b - a).forEach((i) => {
  const b = blocks[i]
  html = html.slice(0, b.start) + html.slice(b.end)
})

fs.writeFileSync(path, html)

const verify = fs.readFileSync(path, 'utf8')
console.log('interior-w left', verify.includes('interior-w'))
console.log('arch-scroll-area left', verify.includes('arch-scroll-area'))
console.log('The space to left', verify.includes('The<br/>space<br/>to') || verify.includes('space<br/>to'))
console.log('Architecture heading left', /class="h1[^"]*"[^>]*>\s*Architecture/.test(verify) || verify.includes('>Architecture</'))
console.log('done length', verify.length)
