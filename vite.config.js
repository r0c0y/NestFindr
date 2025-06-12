import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  base: '/NestFindr/', // ✅ for GitHub Pages
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          csp: `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; font-src 'self' data: https:; script-src 'self' https:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.firebaseapp.com https://*.gstatic.com; style-src 'self' 'unsafe-inline' https:;">`
        }
      }
    })
  ]
})
