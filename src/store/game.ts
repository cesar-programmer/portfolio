import { create } from 'zustand'
import { DEFAULT_LANG, type Lang } from '../config'
import { readJSON, writeJSON } from './storage'

export type Palette = 'classic' | 'pocket' | 'color'
export type TextSpeed = 'slow' | 'normal' | 'instant'

type Settings = { sound: boolean; palette: Palette; textSpeed: TextSpeed }

const SETTINGS_KEY = 'cesardev:settings'
const VISITED_KEY = 'cesardev:visited'

const defaults: Settings = { sound: false, palette: 'classic', textSpeed: 'normal' }
const saved = { ...defaults, ...readJSON<Partial<Settings>>(SETTINGS_KEY, {}) }

type GameState = Settings & {
  lang: Lang
  visited: string[]
  setLang: (lang: Lang) => void
  toggleLang: () => void
  toggleSound: () => void
  setPalette: (palette: Palette) => void
  setTextSpeed: (speed: TextSpeed) => void
  markVisited: (slug: string) => void
}

function persistSettings(s: Settings) {
  writeJSON(SETTINGS_KEY, { sound: s.sound, palette: s.palette, textSpeed: s.textSpeed })
}

export const useGame = create<GameState>((set, get) => ({
  ...saved,
  lang: DEFAULT_LANG,
  visited: readJSON<string[]>(VISITED_KEY, []),
  setLang: (lang) => set({ lang }),
  toggleLang: () => set({ lang: get().lang === 'es' ? 'en' : 'es' }),
  toggleSound: () => {
    set({ sound: !get().sound })
    persistSettings(get())
  },
  setPalette: (palette) => {
    set({ palette })
    persistSettings(get())
  },
  setTextSpeed: (textSpeed) => {
    set({ textSpeed })
    persistSettings(get())
  },
  markVisited: (slug) => {
    if (get().visited.includes(slug)) return
    const visited = [...get().visited, slug]
    set({ visited })
    writeJSON(VISITED_KEY, visited)
  },
}))
