import { LANGS, type Lang } from './config'

export const SECTIONS = ['projects', 'about', 'skills', 'missions', 'badges', 'contact'] as const
export type Section = (typeof SECTIONS)[number]

const SLUGS: Record<Lang, Record<Section, string>> = {
  es: { projects: 'proyectos', about: 'yo', skills: 'skills', missions: 'misiones', badges: 'medallas', contact: 'contacto' },
  en: { projects: 'projects', about: 'about', skills: 'skills', missions: 'missions', badges: 'badges', contact: 'contact' },
}

export function isLang(value: string | undefined): value is Lang {
  return !!value && (LANGS as readonly string[]).includes(value)
}

export function sectionPath(lang: Lang, section: Section, project?: string) {
  const base = `/${lang}/${SLUGS[lang][section]}`
  return project ? `${base}/${project}` : base
}

export function recruiterPath(lang: Lang) {
  return `/${lang}/cv`
}

export type GameLocation = { lang: Lang; section: Section; project?: string }

/** Interpreta "/es/proyectos/stepable". Devuelve null si la ruta no existe. */
export function parsePath(pathname: string): GameLocation | null {
  const [lang, sectionSlug, project, ...rest] = pathname.split('/').filter(Boolean)
  if (!isLang(lang) || rest.length) return null
  if (!sectionSlug) return { lang, section: 'projects' }
  const section = SECTIONS.find((s) => SLUGS[lang][s] === sectionSlug)
  if (!section) return null
  if (project && section !== 'projects') return null
  return { lang, section, project }
}

/** Misma sección y proyecto en el otro idioma. */
export function translatePath(loc: GameLocation, lang: Lang) {
  return sectionPath(lang, loc.section, loc.project)
}

export function preferredLang(): Lang {
  try {
    return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
  } catch {
    return 'es'
  }
}
