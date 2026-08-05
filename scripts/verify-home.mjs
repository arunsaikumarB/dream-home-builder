import fs from 'node:fs'
const h = fs.readFileSync('public/index.html', 'utf8')
const keys = [
  'Contact Us Us',
  'Services',
  'Get Inspired',
  'Testimonials',
  'Request a Quote',
  '#services',
  '#inspired',
  '#testimonials',
  '#contact',
  '#quote',
  'Three reasons',
  'Architecture Team',
  'Homes range from',
  'License obtained',
  'sea views',
]
for (const k of keys) console.log(k, h.includes(k))
