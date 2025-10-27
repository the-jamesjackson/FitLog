import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/itp303-submissions-the-jamesjackson/final_project/completed_final/final/dist/',
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
