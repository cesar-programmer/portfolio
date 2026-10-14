import { existsSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// ¿Ya están los PDF del CV en public/cv/? Si no, los botones CV llevan a /cv.
// Se revisa al iniciar dev o al compilar: subir los archivos y recompilar basta.
const cvFiles = {
  es: existsSync('public/cv/cesar-cordova-es.pdf'),
  en: existsSync('public/cv/cesar-cordova-en.pdf'),
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __CV_FILES__: JSON.stringify(cvFiles),
  },
  build: {
    manifest: true,
  },
})
