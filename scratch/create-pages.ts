import fs from 'fs'
import path from 'path'

const publicRoutes = ['about', 'live-scores', 'gallery', 'team']
const adminRoutes = [
  'events', 'registrations', 'fixtures', 'live-scores', 
  'results', 'certificates', 'gallery', 'team', 'notices', 'users'
]

const basePath = path.join(process.cwd(), 'app')

// Helper to create directory and file
function createPage(routePath: string, title: string, isAdmin: boolean) {
  const dir = path.dirname(routePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const content = `
export default function ${title.replace(/ /g, '')}Page() {
  return (
    <div style={{ padding: '2rem', minHeight: '80vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '4rem', color: '#4CAF50', letterSpacing: '4px', marginBottom: '1rem' }}>
        ${title}
      </h1>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(165,214,167,0.7)', fontSize: '1.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
        🚧 Section under development 🚧
      </p>
    </div>
  )
}
`
  if (!fs.existsSync(routePath)) {
    fs.writeFileSync(routePath, content.trim())
    console.log(`Created: ${routePath}`)
  } else {
    console.log(`Exists: ${routePath}`)
  }
}

// Public pages
publicRoutes.forEach(route => {
  const routePath = path.join(basePath, '(public)', route, 'page.tsx')
  const title = route.replace('-', ' ').toUpperCase()
  createPage(routePath, title, false)
})

// Admin pages
adminRoutes.forEach(route => {
  const routePath = path.join(basePath, 'admin', '(dashboard)', route, 'page.tsx')
  const title = 'MANAGE ' + route.replace('-', ' ').toUpperCase()
  createPage(routePath, title, true)
})
