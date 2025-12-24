import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Backend Laravel
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api') // Mantém /api
      },
      '/sanctum': {
        target: 'http://localhost:8000', // Para CSRF
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/sanctum/, '/sanctum')
      },
    },
  },
})