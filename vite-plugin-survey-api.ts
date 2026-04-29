import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

type Next = (err?: unknown) => void

/**
 * Dev / preview: POST /api/survey — log no terminal Node e resposta 200.
 * Em produção estática, configure um backend ou serverless com o mesmo path.
 */
function surveyApiMiddleware(req: IncomingMessage, res: ServerResponse, next: Next): void {
  const path = req.url?.split('?')[0] ?? ''
  if (path !== '/api/survey') {
    next()
    return
  }
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end()
    return
  }

  let raw = ''
  req.on('data', (chunk: Buffer | string) => {
    raw += typeof chunk === 'string' ? chunk : chunk.toString('utf8')
  })
  req.on('end', () => {
    try {
      const parsed = raw ? JSON.parse(raw) : {}
      console.log('[api/survey] POST', JSON.stringify(parsed))
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: true }))
    } catch {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }))
    }
  })
}

export function surveyApiPlugin(): Plugin {
  return {
    name: 'survey-api',
    configureServer(server) {
      server.middlewares.use(surveyApiMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(surveyApiMiddleware)
    },
  }
}
