// Minimal static server for site/ that disables browser caching, so edits and pulls show up on a plain reload.
// Usage: node serve.mjs [port]   (default 8000)
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), 'site')
const port = Number(process.argv[2] ?? process.env.PORT ?? 8000)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
}

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const file = normalize(join(root, path === '/' ? 'index.html' : path))
  if (!file.startsWith(root)) {
    res.writeHead(403).end()
    return
  }
  try {
    const body = await readFile(file)
    res.writeHead(200, {
      'Content-Type': types[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    })
    res.end(body)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found')
  }
}).listen(port, () => console.log(`Serving site/ at http://localhost:${port}  (Ctrl+C to stop)`))
