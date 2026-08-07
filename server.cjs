const https = require('https')
const fs = require('fs')
const path = require('path')

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certificates', 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certificates', 'localhost.pem')),
}

// Dynamically import Next.js
async function main() {
  const { default: next } = await import('next')
  const { parse } = await import('url')

  const app = next({ dev: false, dir: __dirname })
  const handle = app.getRequestHandler()

  await app.prepare()

  https.createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(3000, '0.0.0.0', (err) => {
    if (err) throw err
    console.log('▲ Next.js HTTPS server running:')
    console.log('  https://localhost:3000')
    console.log('  https://192.168.31.219:3000')
  })
}

main().catch(console.error)
