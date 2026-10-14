import { create } from 'zustand'
import { readJSON, writeJSON } from './storage'

export type Palette = 'arcade' | 'classic' | 'pocket'
export type ShellColor = 'indigo' | 'silver' | 'black'
export type TextSpeed = 'slow' | 'normal' | 'instant'

type Settings = { sound: boolean; palette: Palette; shell: ShellColor; textSpeed: TextSpeed }

const SETTINGS_KEY = 'cesardev:settings'
const VISITED_KEY = 'cesardev:visited'
const SEEN_KEY = 'cesardev:seen'

const defaults: Settings = { sound: false, palette: 'arcade', shell: 'indigo', textSpeed: 'normal' }
const PALETTES: Palette[] = ['arcade', 'classic', 'pocket']
const SHELLS: ShellColor[] = ['indigo', 'silver', 'black']

function loadSettings(): Settings {
  const s = { ...defaults, ...readJSON<Partial<Settings>>(SETTINGS_KEY, {}) }
  // Valores guardados por versiones anteriores del sitio.
  if (!PALETTES.includes(s.palette)) s.palette = defaults.palette
  if (!SHELLS.includes(s.shell)) s.shell = defaults.shell
  return s
}

/** Cosas que solo deben pasar en la primera visita. */
type Seen = { boot?: boolean; tip?: boolean; lid?: boolean }

type GameState = Settings & {
  visited: string[]
  seen: Seen
  optionsOpen: boolean
  tv: boolean
  toast: string | null
  /** Último proyecto señalado en la lista y filtro activo (para volver al mismo lugar). */
  projectCursor: string | null
  projectFilter: string
  setProjectCursor: (slug: string | null) => void
  setProjectFilter: (filter: string) => void
  toggleSound: () => void
  setPalette: (palette: Palette) => void
  setShell: (shell: ShellColor) => void
  setTextSpeed: (speed: TextSpeed) => void
  markVisited: (slug: string) => string[]
  markSeen: (key: keyof Seen) => void
  setOptionsOpen: (open: boolean) => void
  setTv: (tv: boolean) => void
  showToast: (text: string | null) => void
}

export const useGame = create<GameState>((set, get) => {
  const saveSettings = () => {
    const { sound, palette, shell, textSpeed } = get()
    writeJSON(SETTINGS_KEY, { sound, palette, shell, textSpeed })
  }
  return {
    ...loadSettings(),
    visited: readJSON<string[]>(VISITED_KEY, []),
    seen: readJSON<Seen>(SEEN_KEY, {}),
    optionsOpen: false,
    tv: false,
    toast: null,
    projectCursor: null,
    projectFilter: 'all',
    setProjectCursor: (projectCursor) => set({ projectCursor }),
    setProjectFilter: (projectFilter) => set({ projectFilter }),
    toggleSound: () => {
      set({ sound: !get().sound })
      saveSettings()
    },
    setPalette: (palette) => {
      set({ palette })
      saveSettings()
    },
    setShell: (shell) => {
      set({ shell })
      saveSettings()
    },
    setTextSpeed: (textSpeed) => {
      set({ textSpeed })
      saveSettings()
    },
    markVisited: (slug) => {
      const current = get().visited
      if (current.includes(slug)) return current
      const visited = [...current, slug]
      set({ visited })
      writeJSON(VISITED_KEY, visited)
      return visited
    },
    markSeen: (key) => {
      if (get().seen[key]) return
      const seen = { ...get().seen, [key]: true }
      set({ seen })
      writeJSON(SEEN_KEY, seen)
    },
    setOptionsOpen: (optionsOpen) => set({ optionsOpen }),
    setTv: (tv) => set({ tv }),
    showToast: (toast) => set({ toast }),
  }
})
