# CESAR.DEV

Portafolio de Cesar Cordova Contreras — AI & Backend Developer — con estilo de consola portátil de 8 bits.
La especificación completa está en [`docs/SPEC.md`](docs/SPEC.md).

```bash
npm install
npm run dev      # desarrollo
npm run build    # typecheck + build de producción
npm run lint
```

- Textos: `src/content/{es,en}/*.json` · metadatos sin idioma: `src/content/shared/`.
- URL pública: variable `VITE_SITE_URL` (ver `.env.example` y `src/config.ts`).
- Controles: flechas/WASD, Enter/Z (A), Esc/X/Backspace (B), M (START), L (SELECT), o clic/toque en la carcasa.
