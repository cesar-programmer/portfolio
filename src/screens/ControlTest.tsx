import { useState } from 'react'
import type { Action } from '../console/input'
import { useControls } from '../console/useControls'
import { getContent } from '../content'
import { useGame } from '../store/game'
import { Menu } from '../ui/Menu'
import { Window } from '../ui/Window'

const LABELS: Record<Action, string> = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  a: 'A',
  b: 'B',
  start: 'START',
  select: 'SELECT',
}

/** Pantalla temporal de la fase 1: comprueba controles, contenido e idioma. */
export function ControlTest() {
  const lang = useGame((s) => s.lang)
  const { ui } = getContent(lang)
  const [last, setLast] = useState<Action | null>(null)
  const [chosen, setChosen] = useState<string | null>(null)
  const entries = Object.entries(ui.menu.items)
  const [cursor, setCursor] = useState(0)

  // Handler de fondo: registra toda entrada sin consumirla.
  useControls((action) => {
    setLast(action)
    return false
  })

  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <h1 className="text-px8">{ui.phase1.heading}</h1>
      <div className="flex min-h-0 flex-1 gap-2">
        <Window className="min-w-0 flex-1 font-body text-px9 leading-tight">
          <p>
            {ui.phase1.lastInput}: <strong className="font-pixel text-px8">{last ? LABELS[last] : ui.phase1.none}</strong>
          </p>
          <p className="mt-2">{chosen ? `▶ ${chosen}` : ui.phase1.help}</p>
        </Window>
        <Window className="shrink-0 text-px6">
          <Menu
            label={ui.menu.heading}
            items={entries.map(([id, item]) => ({ id, label: item.label, onSelect: () => setChosen(item.label) }))}
            onCursorChange={setCursor}
            itemClassName="py-0.5"
          />
        </Window>
      </div>
      <Window className="font-body text-px9 leading-tight">{entries[cursor][1].description}</Window>
    </div>
  )
}
