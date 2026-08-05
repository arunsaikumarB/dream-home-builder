import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const idx = []
let i = -1
while ((i = h.indexOf('class="header', i + 1)) !== -1) {
  idx.push(i)
  console.log(i, h.slice(i, i + 80).replace(/\n/g, ' '))
}
const j = h.indexOf('textPath')
console.log('\ntextPath', j, h.slice(j - 200, j + 300).replace(/\s+/g, ' '))
