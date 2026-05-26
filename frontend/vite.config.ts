import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// GitHub Pages serves từ https://nhannt95.github.io/logistic-hub/
// → base path '/logistic-hub/' khi build production; '/' khi dev local.
const BASE = process.env.GITHUB_PAGES === 'true' ? '/logistic-hub/' : '/'

export default defineConfig({
  base: BASE,
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'spline-viewer',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
