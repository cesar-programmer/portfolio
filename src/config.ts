// Única fuente de verdad para la URL base del sitio.
// Para cambiar a dominio propio basta con definir VITE_SITE_URL en Vercel.
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://cesar-dev.vercel.app').replace(/\/$/, '')

export const LANGS = ['es', 'en'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'es'
