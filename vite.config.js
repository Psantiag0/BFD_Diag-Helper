import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Dividir dependências externas em chunks separados
          react: ['react', 'react-dom'],
          vendor: ['@vitejs/plugin-react', '@tailwindcss/vite'],
        },
      },
    },
  },
})