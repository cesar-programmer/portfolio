// Única fuente de verdad para la URL base del sitio.
// Para cambiar a dominio propio basta con definir VITE_SITE_URL (en Vercel o en .env).
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://cesar-dev.vercel.app').replace(/\/$/, '')

export const LANGS = ['es', 'en'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'es'

declare const __CV_FILES__: Record<Lang, boolean>

/**
 * Enlace del botón CV: descarga directa si el PDF ya está en public/cv/;
 * mientras no exista, lleva al Modo reclutador (/es/cv o /en/cv).
 */
export function cvLink(lang: Lang): { href: string; download: boolean } {
  return __CV_FILES__[lang] ? { href: `/cv/cesar-cordova-${lang}.pdf`, download: true } : { href: `/${lang}/cv`, download: false }
}
