import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE=/portfolio/ for GitHub Pages; defaults to / for Vercel or custom domains.
export default defineConfig({
  base: process.env.BASE || '/',
  plugins: [react()],
})
