import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base: './' keeps the build portable — it works at the domain root, under a
// sub-path like /v2/, and from a file:// double-click.
export default defineConfig({
  base: './',
  plugins: [react()],
})
