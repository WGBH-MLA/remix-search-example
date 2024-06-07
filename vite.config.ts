/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'


export default defineConfig({
  plugins: [
    remix(),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
    fs: {
      strict: true,
    },
    hmr: { overlay: false },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist',
  },
  publicDir: 'assets',

})
