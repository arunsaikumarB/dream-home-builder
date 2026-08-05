import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, 'public')
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

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0])
  if (clean === '/' || clean === '') return path.join(root, 'index.html')

  const relative = clean.replace(/^\/+/, '')
  const candidates = [
    path.join(root, relative),
    path.join(root, `${relative}.html`),
    path.join(root, relative, 'index.html'),
  ]

  for (const file of candidates) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return file
  }
  return path.join(root, '404.html')
}

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url || '/')
  const ext = path.extname(file).toLowerCase()
  const status = file.endsWith(`${path.sep}404.html`) && !req.url?.includes('404') ? 404 : 200

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(500)
      res.end('Server error')
      return
    }
    res.writeHead(status, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    })
    res.end(data)
  })
})

server.listen(PORT, () => {
  console.log(`Dream Home Builder — local site`)
  console.log(`→ http://localhost:${PORT}/`)
  console.log(`→ http://localhost:${PORT}/apartments`)
  console.log(`→ http://localhost:${PORT}/contact`)
})
