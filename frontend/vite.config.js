import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/FED2024Asg2_P04_Team4/',
  plugins: [
    tailwindcss(),
    react(),
  ]
})
