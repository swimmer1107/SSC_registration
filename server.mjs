import { createServer } from 'https'
import { readFileSync } from 'fs'
import { parse } from 'url'
import next from 'next'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = next({ dev: false, dir: __dirname })
const handle = app.getRequestHandler()

const httpsOptions = {
  key: readFileSync(resolve(__dirname, 'certificates/localhost-key.pem')),
  cert: readFileSync(resolve(__dirname, 'certificates/localhost.pem')),
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(3000, '0.0.0.0', () => {
    console.log('▲ Next.js HTTPS server running at:')
    console.log('  https://localhost:3000')
    console.log('  https://192.168.31.219:3000')
  })
})
