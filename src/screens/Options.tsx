import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { play } from '../audio/sfx'
import { useControls } from '../console/useControls'
import type { Lang } from '../config'
import type { Content } from '../content'
import { recruiterPath } from '../routes'
import { useGame, type Palette, type ShellColor, type TextSpeed } from '../store/game'
import { PixelIcon } from '../ui/PixelIcon'

type Row = { id: string; label: string; value: string; change?: (dir: 1 | -1) => void; go?: () => void }

function cycle<T>(list: readonly T[], current: T, dir: 1 | -1) {
  return list[(list.indexOf(current) + dir + list.length) % list.length]
}

/** Ventana de Opciones (START / MENÚ). */
export function Options({ content, onLang }: { content: Content; onLang: (lang: Lang) => void }) {
  const { lang, ui } = content
  const o = ui.options
  const navigate = useNavigate()
  const g = useGame()
  const [cursor, setCursor] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])
  const close = () => {
    play('cancel')
    g.setOptionsOpen(false)
  }

  const palettes: Palette[] = ['arcade', 'classic', 'pocket']
  const shells: ShellColor[] = ['classic', 'indigo', 'silver', 'black']
  const speeds: TextSpeed[] = ['slow', 'normal', 'instant']

  const rows: Row[] = [
    { id: 'lang', label: o.language, value: lang === 'es' ? 'Español' : 'English', change: () => onLang(lang === 'es' ? 'en' : 'es') },
    { id: 'sound', label: o.sound, value: g.sound ? o.on : o.off, change: () => g.toggleSound() },
    { id: 'palette', label: o.palette, value: o.palettes[g.palette], change: (d) => g.setPalette(cycle(palettes, g.palette, d)) },
    { id: 'shell', label: o.shell, value: o.shells[g.shell], change: (d) => g.setShell(cycle(shells, g.shell, d)) },
    { id: 'speed', label: o.textSpeed, value: o.speeds[g.textSpeed], change: (d) => g.setTextSpeed(cycle(speeds, g.textSpeed, d)) },
    {
      id: 'recruiter',
      label: o.recruiter,
      value: '',
      go: () => {
        g.setOptionsOpen(false)
        navigate(recruiterPath(lang))
      },
    },
  ]

  const activate = (row: Row, dir: 1 | -1 = 1) => {
    play('confirm')
    if (row.change) row.change(dir)
    else row.go?.()
  }

  const move = (i: number) => {
    const n = (i + rows.length) % rows.length
    setCursor(n)
    refs.current[n]?.focus()
    play('cursor')
  }

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  // Encima de todo: mientras está abierta, consume las acciones.
  useControls((action) => {
    const row = rows[cursor]
    switch (action) {
      case 'up':
        move(cursor - 1)
        break
      case 'down':
        move(cursor + 1)
        break
      case 'left':
        if (row.change) activate(row, -1)
        break
      case 'right':
        if (row.change) activate(row, 1)
        break
      case 'a':
        activate(row)
        break
      case 'b':
      case 'start':
        close()
        break
      default:
        return false
    }
    return true
  })

  return (
    <div className="options-backdrop" onClick={close}>
      <div role="dialog" aria-modal="true" aria-label={o.heading} className="options px-box" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex items-center justify-between gap-4">
          <h2 className="scr-title text-title m-0">{o.heading}</h2>
          <button type="button" className="px-btn" onClick={close}>
            {o.close} ✕
          </button>
        </div>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {rows.map((row, i) => (
            <li key={row.id}>
              <button
                ref={(el) => {
                  refs.current[i] = el
                }}
                type="button"
                data-menu-item
                className={`options__row ${i === cursor ? "is-selected" : ""}`}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setCursor(i)}
                onFocus={() => setCursor(i)}
                onClick={() => {
                  setCursor(i)
                  activate(row)
                }}
              >
                <PixelIcon name="cursor" className={i === cursor ? 'text-scr-title' : 'invisible'} />
                <span className="flex-1 text-left">{row.label}</span>
                {row.value && (
                  <span className="text-scr-title flex items-center gap-2">
                    <PixelIcon name="left" size="sm" />
                    {row.value}
                    <PixelIcon name="right" size="sm" />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
