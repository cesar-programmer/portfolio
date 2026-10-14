import type { UiText } from '../content'
import { useGame } from '../store/game'
import { ConsoleButton } from './ConsoleButton'

export function ABButtons({ ui }: { ui: UiText['console'] }) {
  return (
    <div className="ab">
      <div className="ab__item">
        <ConsoleButton action="b" label={ui.b} className="ab__btn" />
        <span aria-hidden="true">B</span>
      </div>
      <div className="ab__item">
        <ConsoleButton action="a" label={ui.a} className="ab__btn" />
        <span aria-hidden="true">A</span>
      </div>
    </div>
  )
}

export function StartSelect({ ui }: { ui: UiText['console'] }) {
  return (
    <div className="pills">
      <div className="pills__item">
        <ConsoleButton action="select" label={ui.select} className="pills__btn" />
        <span aria-hidden="true">SELECT</span>
      </div>
      <div className="pills__item">
        <ConsoleButton action="start" label={ui.start} className="pills__btn" />
        <span aria-hidden="true">START</span>
      </div>
    </div>
  )
}

export function Speaker({ ui }: { ui: UiText['console'] }) {
  const sound = useGame((s) => s.sound)
  const toggleSound = useGame((s) => s.toggleSound)
  const label = sound ? ui.soundOn : ui.soundOff
  return (
    <button
      type="button"
      className="speaker shell-btn"
      data-gb-button="sound"
      aria-label={label}
      aria-pressed={sound}
      title={label}
      onClick={toggleSound}
    >
      <svg className="speaker__icon" viewBox="0 0 9 9" shapeRendering="crispEdges" aria-hidden="true">
        <path fill="currentColor" d="M0 3h2v3H0zM2 2h1v5H2zM3 1h1v7H3z" />
        {sound ? (
          <path fill="currentColor" d="M5 3h1v3H5zM7 2h1v5H7z" />
        ) : (
          <path fill="currentColor" d="M5 3h1v1H5zM6 4h1v1H6zM7 5h1v1H7zM7 3h1v1H7zM5 5h1v1H5z" />
        )}
      </svg>
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className="speaker__slot" aria-hidden="true" />
      ))}
    </button>
  )
}
