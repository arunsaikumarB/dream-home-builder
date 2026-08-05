import fs from 'node:fs'

const c = fs.readFileSync('scripts/era-colors.tmp.css', 'utf8')
const globals = [...c.matchAll(/--_global-colors---[a-zA-Z0-9_-]+\s*:\s*[^;}{]+/g)].map((m) => m[0])
console.log('globals', globals.length)
console.log([...new Set(globals)].join('\n'))

// theme_on-color / theme_on-dark / theme_on-brand snippets
for (const theme of ['theme_on-color', 'theme_on-dark', 'theme_on-brand', 'theme_on-light', 'data-bg']) {
  const i = c.indexOf('.' + theme)
  console.log('\n====', theme, i, '====')
  if (i >= 0) console.log(c.slice(i, i + 500))
}
