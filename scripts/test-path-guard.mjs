import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import test from 'node:test'
import { resolveRequest, root, server } from '../server.mjs'

const repoRoot = path.resolve(root, '..')
const secretMarker = 'Dream Home Builder — local site'

function get(port, urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: '127.0.0.1', port, path: urlPath, method: 'GET' },
      (res) => {
        const chunks = []
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            body: Buffer.concat(chunks).toString('utf8'),
          })
        })
      },
    )
    req.on('error', reject)
    req.end()
  })
}

test('serves files inside public/', () => {
  const home = resolveRequest('/')
  assert.equal(home.status, 200)
  assert.equal(home.file, path.join(root, 'index.html'))

  const contact = resolveRequest('/contact?tab=visit')
  assert.equal(contact.status, 200)
  assert.equal(contact.file, path.join(root, 'contact.html'))

  const apartment = resolveRequest('/apartments/011')
  assert.equal(apartment.status, 200)
  assert.equal(apartment.file, path.join(root, 'apartments', '011.html'))

  const css = resolveRequest('/css/dhb-pages.css')
  assert.equal(css.status, 200)
  assert.equal(css.file, path.join(root, 'css', 'dhb-pages.css'))
})

test('missing pages inside public/ are 404', () => {
  const missing = resolveRequest('/no-such-page')
  assert.equal(missing.status, 404)
  assert.equal(missing.file, path.join(root, '404.html'))

  const explicit = resolveRequest('/404')
  assert.equal(explicit.status, 200)
  assert.equal(explicit.file, path.join(root, '404.html'))
})

test('rejects traversal, encoded dots, null bytes, and backslashes', () => {
  const attacks = [
    '/../server.mjs',
    '/../../etc/passwd',
    '/css/../../package.json',
    '/%2e%2e/server.mjs',
    '/%2E%2E/%2E%2E/package.json',
    '/%2e%2e%2fserver.mjs',
    '/images/%2e%2e/%2e%2e/server.mjs',
    '/..\\..\\server.mjs',
    '/%2e%2e%5c%2e%2e%5cserver.mjs',
    '/index.html%00.png',
    '/%00/../server.mjs',
    '/contact%00.html',
  ]

  for (const attack of attacks) {
    const result = resolveRequest(attack)
    assert.equal(result.status, 403, attack)
    assert.equal(result.file, null, attack)
  }

  assert.equal(resolveRequest('/%c0%ae%c0%ae/server.mjs').status, 400)
})

test('single-decoded percent names stay inside public/', () => {
  const doubled = resolveRequest('/%252e%252e%252fserver.mjs')
  assert.equal(doubled.status, 404)
  assert.equal(doubled.file, path.join(root, '404.html'))
  assert.ok(!String(doubled.file).includes(`${path.sep}server.mjs`))
})

test('symlinks may stay inside public/ and may not leave it', () => {
  const insideLink = path.join(root, '.path-guard-inside')
  const outsideLink = path.join(root, '.path-guard-outside')
  const brokenOutside = path.join(root, '.path-guard-broken')
  const outsideDir = path.join(root, '.path-guard-dir')
  const created = [insideLink, outsideLink, brokenOutside, outsideDir]

  try {
    fs.symlinkSync(path.join(root, 'index.html'), insideLink)
    fs.symlinkSync(path.join(repoRoot, 'server.mjs'), outsideLink)
    fs.symlinkSync(path.join(repoRoot, 'missing-outside.txt'), brokenOutside)
    fs.symlinkSync(repoRoot, outsideDir, 'dir')

    const inside = resolveRequest('/.path-guard-inside')
    assert.equal(inside.status, 200)
    assert.equal(inside.file, path.join(root, 'index.html'))

    for (const attack of ['/.path-guard-outside', '/.path-guard-broken', '/.path-guard-dir/server.mjs', '/.path-guard-dir/package.json']) {
      const result = resolveRequest(attack)
      assert.equal(result.status, 403, attack)
      assert.equal(result.file, null, attack)
    }
  } finally {
    for (const link of created) {
      try {
        fs.unlinkSync(link)
      } catch {
        // already gone
      }
    }
  }
})

test('HTTP server refuses escaped paths and still serves the site', async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address()
  try {
    const home = await get(port, '/')
    assert.equal(home.status, 200)
    assert.match(home.body, /Dream Home Builder/)

    const contact = await get(port, '/contact')
    assert.equal(contact.status, 200)
    assert.match(contact.body, /Contact Us/)

    const css = await get(port, '/css/dhb-pages.css')
    assert.equal(css.status, 200)
    assert.match(css.body, /dhb-/)

    const missing = await get(port, '/no-such-page')
    assert.equal(missing.status, 404)
    assert.match(missing.body, /Page Not Found/)

    for (const attack of ['/../server.mjs', '/%2e%2e/package.json', '/css/../../server.mjs']) {
      const blocked = await get(port, attack)
      assert.equal(blocked.status, 403, attack)
      assert.equal(blocked.body, 'Forbidden')
      assert.equal(blocked.body.includes(secretMarker), false)
      assert.equal(blocked.body.includes('"name": "dream-home-builders"'), false)
    }
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())))
  }
})

test('Azure config sets CSP, frame protection, and HSTS', () => {
  const configPath = path.join(root, 'staticwebapp.config.json')
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  const headers = config.globalHeaders
  const csp = headers['Content-Security-Policy']

  assert.equal(headers['X-Content-Type-Options'], 'nosniff')
  assert.equal(headers['X-Frame-Options'], 'DENY')
  assert.match(headers['Strict-Transport-Security'], /max-age=31536000/)
  assert.match(csp, /frame-ancestors 'none'/)
  assert.match(csp, /https:\/\/www\.googletagmanager\.com/)
  assert.match(csp, /https:\/\/formspree\.io/)
  assert.match(csp, /https:\/\/cdn\.jsdelivr\.net/)
  assert.match(csp, /https:\/\/unpkg\.com/)
  assert.match(csp, /https:\/\/www\.google\.com/)
  assert.match(csp, /'unsafe-inline'/)
})
