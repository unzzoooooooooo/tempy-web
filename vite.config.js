import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production is served from the root of https://tempy.studio/.
const pagesBase = '/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? pagesBase : '/',
  plugins: [
    react(),
    {
      name: 'pages-public-image-paths',
      apply: 'build',
      enforce: 'pre',
      // Vite handles CSS/HTML assets, but not image strings in JS/JSX.
      // Include path-prefix checks so existing image-selection logic stays consistent.
      transform(code, id) {
        if (!/\/src\/.*\.[jt]sx?$/.test(id)) return null
        return {
          code: code.replace(/(["'`])\/images\//g, `$1${pagesBase}images/`),
          map: null,
        }
      },
    },
  ],
}))
