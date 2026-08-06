// Idempotent: (re)syncs index.html's embedded copy of the contact-tabs
// component (inside #quote) with the current output of contact-tabs-partial.mjs.
// Finds the matching closing </div> by depth-counting rather than guessing
// whitespace, so it survives structural changes to the component.
import fs from 'node:fs'
import path from 'node:path'
import { contactTabsHTML } from './contact-tabs-partial.mjs'

const p = path.join(process.cwd(), 'public', 'index.html')
let h = fs.readFileSync(p, 'utf8')

const qAt = h.indexOf('id="quote"')
if (qAt < 0) throw new Error('#quote section not found')

const s = h.indexOf('<div class="dhb-ctabs"', qAt)
if (s < 0) throw new Error('.dhb-ctabs block not found inside #quote')

// depth-count divs from s to find this element's own matching </div>
const tagRe = /<div\b[^>]*>|<\/div>/g
tagRe.lastIndex = s
let depth = 0
let end = -1
let m
while ((m = tagRe.exec(h))) {
  if (m[0].startsWith('</div>')) {
    depth--
    if (depth === 0) { end = m.index + m[0].length; break }
  } else {
    depth++
  }
}
if (end < 0) throw new Error('could not find matching close for .dhb-ctabs')

const oldBlock = h.slice(s, end)
const mapSrc = (oldBlock.match(/src="(https:\/\/www\.google\.com\/maps\/embed[^"]+)"/) || [])[1]
if (!mapSrc) throw new Error('map src not found in existing ctabs block')

const fresh = contactTabsHTML({ mapSrc })
h = h.slice(0, s) + fresh + h.slice(end)

fs.writeFileSync(p, h)
console.log('contact-tabs block replaced in index.html (' + oldBlock.length + ' -> ' + fresh.length + ' chars)')
console.log('map src preserved:', mapSrc.slice(0, 50) + '...')
