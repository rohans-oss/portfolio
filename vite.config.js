import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

// Serves api/chat.js locally during `npm run dev` and `npm run preview`,
// so the AI chat behaves the same on your machine as it does on Vercel.
// Put your key in a .env file (see .env.example). No key = offline answers.
function localApi() {
  const handler = async (req, res, next) => {
    if (!req.url?.startsWith('/api/chat')) return next()
    try {
      const chunks = []
      for await (const c of req) chunks.push(c)
      const request = new Request(`http://localhost${req.url}`, {
        method: req.method,
        headers: { 'content-type': 'application/json', 'x-forwarded-for': req.socket.remoteAddress || 'local' },
        body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
      })
      const { POST } = await import(`${pathToFileURL(resolve(process.cwd(), 'api/chat.js')).href}?t=${Date.now()}`)
      const response = req.method === 'POST' ? await POST(request) : new Response('Method not allowed', { status: 405 })
      res.statusCode = response.status
      response.headers.forEach((v, k) => res.setHeader(k, v))
      res.end(await response.text())
    } catch (e) {
      console.error('[api/chat]', e)
      res.statusCode = 500
      res.end(JSON.stringify({ error: 'Local API error' }))
    }
  }
  return {
    name: 'local-api',
    configureServer(s) {
      s.middlewares.use(handler)
    },
    configurePreviewServer(s) {
      s.middlewares.use(handler)
    },
  }
}

export default defineConfig(({ mode }) => {
  // Expose .env values (including non-VITE_ keys) to the local API only.
  // They are never bundled into the browser code.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return {
    plugins: [react(), localApi()],
    server: { port: 5173, open: true },
    preview: { port: 4173 },
  }
})
