import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const start = h.indexOf('class="floating-tips')
const end = h.indexOf('</div></div>', h.indexOf('floating-tip="your-private-sanctuary"')) + 2000
const chunk = h.slice(start, Math.min(start + 12000, h.length))

// Extract each tip's title and body start
for (const id of ['crafted-to-endure', 'light-flow', 'your-private-sanctuary']) {
  const i = chunk.indexOf(`floating-tip="${id}"`)
  console.log('\n====', id, '====')
  console.log(chunk.slice(i, i + 900).replace(/\s+/g, ' '))
}

// Also check modal tip variants
const m = h.indexOf('data-modal-tip=')
console.log('\nmodal tips count', (h.match(/data-modal-tip=/g) || []).length)
console.log('modal tip sample', h.slice(m, m + 400))
