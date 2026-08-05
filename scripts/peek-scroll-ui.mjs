import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
for (const m of ['class="s-down"', 'class="s-bar', '>Scroll<', '>SCROLL<', 's-down_arrow', 'data-s-bar']) {
  const i = h.indexOf(m)
  console.log(String(i).padStart(8), m)
}
const i = h.indexOf('class="s-down"')
console.log('\n--- s-down ---')
console.log(h.slice(i, i + 600))
const j = h.indexOf('class="s-bar-w"')
console.log('\n--- s-bar ---')
console.log(h.slice(j, j + 500))
