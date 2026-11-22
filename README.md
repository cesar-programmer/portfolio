# CESAR.DEV

Portafolio de Cesar Cordova Contreras — AI & Backend Developer — con estilo de consola portátil retro.
Sitio: https://cesarcordova.dev · Especificación: [`docs/SPEC.md`](docs/SPEC.md).

```bash
npm install
npm run dev         # desarrollo
npm run build       # typecheck + build + prerender (HTML estático por ruta, sitemap, robots)
npm run preview     # sirve dist/ como lo haría Vercel (incluye 404 real) en :4173
npm run lint
npm run og          # regenera las imágenes Open Graph (public/og/)
npm run test:a11y   # auditoría axe de todas las rutas (después de build)
```

- Textos: `src/content/{es,en}/*.json` · metadatos sin idioma: `src/content/shared/`.
- URL pública: `https://cesarcordova.dev` por defecto; se puede cambiar con `VITE_SITE_URL` (ver `.env.example` y `src/config.ts`).
- CV: al poner `public/cv/cesar-cordova-es.pdf` y `public/cv/cesar-cordova-en.pdf` y recompilar, los botones CV descargan directo; mientras no existan, llevan a `/es/cv` o `/en/cv`.
- Controles: clic o toque en cualquier opción; flechas/WASD, Enter/Z (A), Esc/X/Backspace (B), Q/E o L/R (pestañas), M (menú), I (idioma), F (Modo TV).

## Despliegue (Vercel)

`vercel.json` ya define build, salida y caché. Cada ruta se sirve como HTML estático prerenderizado; las rutas inexistentes devuelven `404.html` con estado 404. Node 24 (`engines` en `package.json`).
