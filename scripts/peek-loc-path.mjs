import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const start = h.indexOf('class="loc-path-w"')
const end = h.indexOf('class="apart-type-w"')
const chunk = h.slice(start, end)
console.log(chunk.slice(0, 4000))
console.log('\n---MID---\n')
console.log(chunk.slice(4000, 8000))
console.log('\n---END---\n')
console.log(chunk.slice(-3000))
console.log('\nlen', chunk.length)
console.log('Gibraltar', chunk.includes('Gibraltar') || chunk.includes('GIBRALTAR'))
console.log('pins', (chunk.match(/pins-cms|pin_|loc-path|loc-w_bg/g) || []).slice(0, 20))
