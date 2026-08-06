// Idempotent: (re)syncs index.html's copy of the quote-modal partial with the
// current content of quote-modal-partial.mjs. Safe to run repeatedly.
import fs from 'node:fs'
import path from 'node:path'
import { QUOTE_MODAL_HTML, QUOTE_MODAL_MARKER, QUOTE_MODAL_END } from './quote-modal-partial.mjs'

const p = path.join(process.cwd(), 'public', 'index.html')
let h = fs.readFileSync(p, 'utf8')

const s = h.indexOf(QUOTE_MODAL_MARKER)
const e = h.indexOf(QUOTE_MODAL_END)

if (s < 0 || e < 0) {
  const bodyClose = h.lastIndexOf('</body>')
  if (bodyClose < 0) throw new Error('</body> not found and no existing modal to replace')
  h = h.slice(0, bodyClose) + QUOTE_MODAL_HTML + '\n' + h.slice(bodyClose)
  console.log('inserted fresh quote-modal block')
} else {
  const end = e + QUOTE_MODAL_END.length
  h = h.slice(0, s) + QUOTE_MODAL_HTML + h.slice(end)
  console.log('replaced existing quote-modal block')
}

fs.writeFileSync(p, h)
console.log('markers present exactly once:', (h.match(new RegExp(QUOTE_MODAL_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length === 1)
