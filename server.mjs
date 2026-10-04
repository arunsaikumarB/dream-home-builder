import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const root = fs.realpathSync(path.join(__dirname, 'public'))
const PORT = Number(process.env.PORT) || 5180

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
}

function isInsideRoot(candidate) {
  const resolved = path.resolve(candidate)
  const rel = path.relative(root, resolved)
  if (rel === '') return true
  if (rel === '..' || rel.startsWith(`..${path.sep}`) || rel.startsWith('../') || rel.startsWith('..\\')) {
    return false
  }
  return !path.isAbsolute(rel)
}

function decodeRequestPath(urlPath) {
  const raw = String(urlPath ?? '/')
  const pathOnly = raw.split('#')[0].split('?')[0]
  if (pathOnly.includes('\0') || /%00/i.test(pathOnly)) return { error: 403 }

  let decoded
  try {
    decoded = decodeURIComponent(pathOnly)
  } catch {
    return { error: 400 }
  }
  if (decoded.includes('\0')) return { error: 403 }

  decoded = decoded.split('\\').join('/')
  if (!decoded.startsWith('/')) decoded = `/${decoded}`
  return { pathname: decoded }
}

function isMissing(err) {
  return err?.code === 'ENOENT' || err?.code === 'ENOTDIR'
}

function lookupFile(candidate) {
  if (!isInsideRoot(candidate)) return { kind: 'escape' }

  const chain = []
  let cursor = path.resolve(candidate)
  while (cursor !== root) {
    chain.push(cursor)
    const parent = path.dirname(cursor)
    if (parent === cursor) break
    cursor = parent
  }

  for (const entry of chain.reverse()) {
    let st
    try {
      st = fs.lstatSync(entry)
    } catch (err) {
      if (isMissing(err)) return { kind: 'missing' }
      return { kind: 'escape' }
    }
    if (!st.isSymbolicLink()) continue

    let linkTarget
    try {
      linkTarget = fs.readlinkSync(entry)
    } catch {
      return { kind: 'escape' }
    }
    if (!isInsideRoot(path.resolve(path.dirname(entry), linkTarget))) return { kind: 'escape' }

    try {
      const real = fs.realpathSync(entry)
      if (!isInsideRoot(real)) return { kind: 'escape' }
    } catch (err) {
      if (isMissing(err)) return { kind: 'missing' }
      return { kind: 'escape' }
    }
  }

  let real
  try {
    real = fs.realpathSync(candidate)
  } catch (err) {
    if (isMissing(err)) return { kind: 'missing' }
    return { kind: 'escape' }
  }
  if (!isInsideRoot(real)) return { kind: 'escape' }

  let realStat
  try {
    realStat = fs.statSync(real)
  } catch (err) {
    if (isMissing(err)) return { kind: 'missing' }
    return { kind: 'escape' }
  }
  if (!realStat.isFile()) return { kind: 'missing' }
  return { kind: 'file', file: real }
}

function notFoundResult() {
  const found = lookupFile(path.join(root, '404.html'))
  if (found.kind === 'file') return { status: 404, file: found.file }
  return { status: 404, file: null }
}

export function resolveRequest(urlPath) {
  const decoded = decodeRequestPath(urlPath)
  if (decoded.error) return { status: decoded.error, file: null }

  const relative = decoded.pathname.replace(/^\/+/, '')
  const primary = relative === '' ? path.join(root, 'index.html') : path.resolve(root, relative)
  if (!isInsideRoot(primary)) return { status: 403, file: null }

  const candidates = relative === ''
    ? [primary]
    : [
        primary,
        path.resolve(root, `${relative}.html`),
        path.resolve(root, relative, 'index.html'),
      ]

  for (const candidate of candidates) {
    if (!isInsideRoot(candidate)) return { status: 403, file: null }
    const found = lookupFile(candidate)
    if (found.kind === 'escape') return { status: 403, file: null }
    if (found.kind !== 'file') continue

    const askedFor404 = /(?:^|\/)404(?:\.html)?\/?$/i.test(decoded.pathname)
    const isNotFoundPage = path.resolve(found.file) === path.resolve(root, '404.html')
    return {
      status: isNotFoundPage && !askedFor404 ? 404 : 200,
      file: found.file,
    }
  }

  return notFoundResult()
}

function sendText(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  res.end(body)
}

export const server = http.createServer((req, res) => {
  let result
  try {
    result = resolveRequest(req.url || '/')
  } catch {
    sendText(res, 500, 'Server error')
    return
  }

  if (!result.file) {
    if (result.status === 400) sendText(res, 400, 'Bad request')
    else if (result.status === 404) sendText(res, 404, 'Not found')
    else sendText(res, 403, 'Forbidden')
    return
  }

  fs.readFile(result.file, (err, data) => {
    if (err) {
      sendText(res, 500, 'Server error')
      return
    }
    const ext = path.extname(result.file).toLowerCase()
    res.writeHead(result.status, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    })
    res.end(data)
  })
})

const entry = process.argv[1]
if (entry && import.meta.url === pathToFileURL(path.resolve(entry)).href) {
  server.listen(PORT, () => {
    console.log(`Dream Home Builder — local site`)
    console.log(`→ http://localhost:${PORT}/`)
    console.log(`→ http://localhost:${PORT}/apartments`)
    console.log(`→ http://localhost:${PORT}/contact`)
  })
}
