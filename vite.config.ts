import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  optimizeDeps: {
    // Com o default (true), o Vite segura os ficheiros de `node_modules/.vite/deps/`
    // até acabar o crawl de imports — no browser parece "pendente" em react.js, lucide, etc.
    holdUntilCrawlEnd: false,
    include: [
      'react',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'lucide-react',
      'clsx',
    ],
  },
  server: {
    // Escuta em IPv4; só [::1] faz o http://127.0.0.1:5173/ não responder no browser.
    // (Evite `host: true` aqui se o Node falhar ao listar interfaces — ex.: alguns sandboxes.)
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    warmup: {
      clientFiles: ['./index.html', './src/main.tsx'],
    },
    // Não usar usePolling aqui: em macOS nativo poluir o watcher deixa o 1º load do dev
    // absurdamente lento (aba parece carregar para sempre).
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
