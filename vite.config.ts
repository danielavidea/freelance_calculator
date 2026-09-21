import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Two pages: the landing page and the pricing calculators (/calculator.html).
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        calculator: fileURLToPath(new URL('./calculator.html', import.meta.url)),
      },
    },
  },
})
