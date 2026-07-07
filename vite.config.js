import path from 'path'
import { createRequire } from 'module'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { RAW_PROJECTS } from './src/utils/projectdata.js'

const require = createRequire(import.meta.url)
const vitePrerender = require('vite-plugin-prerender')

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const prerenderRoutes = [
  '/',
  '/projects',
  ...RAW_PROJECTS.map((project) => `/projects/${slugify(project.title)}`),
]

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vitePrerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: prerenderRoutes,
      captureAfterDocumentEvent: 'prerender-ready',
      renderer: {
        headless: true,
      },
    }),
  ],
})