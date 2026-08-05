import fs from 'node:fs'

const h = fs.readFileSync('public/index.html', 'utf8')
const start = h.indexOf('id="inspired"')
const end = h.indexOf('id="testimonials"')
const slice = h.slice(start, end)
console.log(slice.slice(0, 500))
console.log('---')
console.log(slice.slice(-600))
console.log('open sections', (slice.match(/<section/g) || []).length)
console.log('close sections', (slice.match(/<\/section>/g) || []).length)
console.log('lightbox once', (h.match(/id="dhb-lightbox"/g) || []).length)
console.log('projects js once', (h.match(/dhb-projects\.js/g) || []).length)
