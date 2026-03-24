import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/bay-state-configurator-demo/',
  plugins: [react(), tailwindcss()],
})
