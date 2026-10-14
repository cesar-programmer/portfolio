import { Link } from 'react-router'
import { play } from '../audio/sfx'
import type { Lang } from '../config'
import { getContent, type UiText } from '../content'
import { sectionPath } from '../routes'
import { useGame } from '../store/game'
import { ConsoleButton } from './ConsoleButton'

type ConsoleUi = UiText['console']

const ARROWS = { up: '▲', down: '▼', left: '◀', right: '▶' } as const

export function DPad({ ui }: { ui: ConsoleUi }) {
  return (
    <div className="dpad" role="group" aria-label="D-pad">
      {(['up', 'left', 'right', 'down'] as const).map((dir) => (
        <ConsoleButton key={dir} action={dir} label={ui.dpad[dir]} className={`dpad__btn dpad__btn--${dir}`}>
          <span aria-hidden="true">{ARROWS[dir]}</span>
        </ConsoleButton>
      ))}
      <span className="dpad__center" aria-hidden="true" />
    </div>
  )
}

export function ABButtons({ ui }: { ui: ConsoleUi }) {
  return (
    <div className="ab">
      <div className="ab__item ab__item--b">
        <ConsoleButton action="b" label={ui.b} className="ab__btn">
          <span aria-hidden="true">B</span>
        </ConsoleButton>
      </div>
      <div className="ab__item ab__item--a">
        <ConsoleButton action="a" label={ui.a} className="ab__btn">
          <span aria-hidden="true">A</span>
        </ConsoleButton>
      </div>
    </div>
  )
}

export function StartSelect({ ui }: { ui: ConsoleUi }) {
  return (
    <div className="pills">
      <div className="pills__item">
        <ConsoleButton action="select" label={ui.select} className="pills__btn" />
        <span aria-hidden="true">{ui.labels.select}</span>
      </div>
      <div className="pills__item">
        <ConsoleButton action="start" label={ui.start} className="pills__btn" />
        <span aria-hidden="true">{ui.labels.start}</span>
      </div>
    </div>
  )
}

export function Shoulder({ side, ui }: { side: 'l' | 'r'; ui: ConsoleUi }) {
  return (
    <ConsoleButton action={side} label={ui[side]} className={`shoulder shoulder--${side}`}>
      <span aria-hidden="true">{ui.labels[side]}</span>
    </ConsoleButton>
  )
}

/** CV, Contacto y Modo TV: atajos físicos, siempre visibles. */
export function ShellKeys({ lang, ui }: { lang: Lang; ui: ConsoleUi }) {
  const cv = getContent(lang).profile.cv[lang]
  return (
    <div className="keys">
      <a className="shell-key" href={cv} download aria-label={ui.cv} title={ui.cv} onClick={() => play('confirm')}>
        {ui.labels.cv}
      </a>
      <Link
        className="shell-key shell-key--wide"
        to={sectionPath(lang, 'contact')}
        aria-label={ui.contact}
        title={ui.contact}
        onClick={() => play('confirm')}
      >
        {ui.labels.contact}
      </Link>
      <ConsoleButton action="tv" label={ui.tv} className="shell-key shell-key--icon">
        <span aria-hidden="true">{ui.labels.tv}</span>
      </ConsoleButton>
    </div>
  )
}

export function Speaker({ ui }: { ui: ConsoleUi }) {
  const sound = useGame((s) => s.sound)
  const toggleSound = useGame((s) => s.toggleSound)
  const label = sound ? ui.soundOn : ui.soundOff
  return (
    <button
      type="button"
      className="speaker shell-btn"
      aria-label={label}
      aria-pressed={sound}
      title={label}
      onClick={() => {
        toggleSound()
        play('confirm')
      }}
    >
      <span className="speaker__grille" aria-hidden="true" />
      <svg className="speaker__icon" viewBox="0 0 9 9" shapeRendering="crispEdges" aria-hidden="true">
        <path fill="currentColor" d="M0 3h2v3H0zM2 2h1v5H2zM3 1h1v7H3z" />
        {sound ? (
          <path fill="currentColor" d="M5 3h1v3H5zM7 2h1v5H7z" />
        ) : (
          <path fill="currentColor" d="M5 3h1v1H5zM6 4h1v1H6zM7 5h1v1H7zM7 3h1v1H7zM5 5h1v1H5z" />
        )}
      </svg>
    </button>
  )
}

export function Brand() {
  return (
    <div className="brand" aria-hidden="true">
      CESAR<span>.DEV</span>
    </div>
  )
}
