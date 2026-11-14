import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative paths, so the build works at a domain root and under a
  // sub-path such as GitHub Pages' /<repo>/.
  base: './',
  plugins: [react()],
  test: { environment: 'node' },
})
