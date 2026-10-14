import type { Lang } from '../config'
import sharedProjects from './shared/projects.json'
import sharedSkills from './shared/skills.json'
import esUi from './es/ui.json'
import enUi from './en/ui.json'
import esProfile from './es/profile.json'
import enProfile from './en/profile.json'
import esProjects from './es/projects.json'
import enProjects from './en/projects.json'
import esSkills from './es/skills.json'
import enSkills from './en/skills.json'
import esExperience from './es/experience.json'
import enExperience from './en/experience.json'
import esBadges from './es/badges.json'
import enBadges from './en/badges.json'

export type UiText = typeof esUi
export type Profile = typeof esProfile
export type Experience = typeof esExperience
export type Badges = typeof esBadges

type ProjectMeta = {
  slug: string
  zone: string
  stars: number
  zoneBoss: boolean
  bonus: boolean
  year: string | null
  nodeShape?: string
  stack: string[]
  image: { kind: 'screenshot' | 'illustration' | 'pending'; src: string | null; gallery: string[] }
  links: { demo: string | null; code: string | null; codeFront?: string; caseStudy: string | null }
  codePrivate: boolean
  production: boolean
  medal: string | null
}
type ProjectText = {
  name: string
  subtitle?: string
  role: string
  tag: string
  mission: string
  did: string[]
  boss: string
  fact?: string
  note?: string
  imageAlt: string
  galleryAlt?: string[]
}

export type ZoneId = 'lab' | 'city' | 'workshop'
export type Project = Omit<ProjectMeta, 'zone'> & ProjectText & { zone: ZoneId }
export type Zone = { id: ZoneId; name: string; tagline: string; projects: Project[] }
export type ClassicProject = { id: string; url: string; year: string; name: string; description: string }

export type SkillItem = {
  id: string
  label: string
  note?: string
  projects: string[]
  experience: string[]
  badges: string[]
}
export type Pocket = { id: string; name: string; items: SkillItem[] }

export type Content = {
  lang: Lang
  ui: UiText
  profile: Profile
  projects: Project[]
  zones: Zone[]
  classic: ClassicProject[]
  recruiterHighlights: Project[]
  pockets: Pocket[]
  skillsText: typeof esSkills
  techLabel: (id: string) => string
  experience: Experience
  badges: Badges
}

const raw = {
  es: { ui: esUi, profile: esProfile, projects: esProjects, skills: esSkills, experience: esExperience, badges: esBadges },
  en: { ui: enUi, profile: enProfile, projects: enProjects, skills: enSkills, experience: enExperience, badges: enBadges },
} as const

const tech: Record<string, string> = sharedSkills.tech

function build(lang: Lang): Content {
  const r = raw[lang]
  const texts = r.projects.projects as Record<string, ProjectText>

  const projects: Project[] = (sharedProjects.projects as ProjectMeta[]).map((meta) => {
    const text = texts[meta.slug]
    if (!text) throw new Error(`Falta el texto del proyecto "${meta.slug}" en ${lang}`)
    return { ...meta, ...text, zone: meta.zone as ZoneId }
  })
  const bySlug = new Map(projects.map((p) => [p.slug, p]))

  const zoneTexts = r.projects.zones as Record<string, { name: string; tagline: string }>
  const zones: Zone[] = sharedProjects.zones.map((z) => ({
    id: z.id as ZoneId,
    ...zoneTexts[z.id],
    projects: z.projects.map((slug) => bySlug.get(slug)!),
  }))

  const classicTexts = r.projects.classic as Record<string, { name: string; description: string }>
  const classic = sharedProjects.classic.map((c) => ({ ...c, ...classicTexts[c.id] }))

  const pocketNames = r.skills.pockets as Record<string, string>
  const notes = r.skills.notes as Record<string, string>
  type RawItem = { id: string; projects: string[]; experience?: string[]; badges?: string[] }
  const pockets: Pocket[] = sharedSkills.pockets.map((p) => ({
    id: p.id,
    name: pocketNames[p.id],
    items: (p.items as RawItem[]).map((i) => ({
      id: i.id,
      label: tech[i.id] ?? i.id,
      note: notes[i.id],
      projects: i.projects,
      experience: i.experience ?? [],
      badges: i.badges ?? [],
    })),
  }))

  return {
    lang,
    ui: r.ui,
    profile: r.profile,
    projects,
    zones,
    classic,
    recruiterHighlights: sharedProjects.recruiterHighlights.map((s) => bySlug.get(s)!),
    pockets,
    skillsText: r.skills,
    techLabel: (id) => tech[id] ?? id,
    experience: r.experience,
    badges: r.badges,
  }
}

const cache: Partial<Record<Lang, Content>> = {}
export function getContent(lang: Lang): Content {
  return (cache[lang] ??= build(lang))
}
