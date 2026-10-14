import { useGame } from '../store/game'

// Efectos chiptune con Web Audio: onda cuadrada, sin archivos de audio.
type Note = [freq: number, duration: number]

const SOUNDS = {
  cursor: [[880, 0.035]],
  confirm: [
    [660, 0.05],
    [990, 0.08],
  ],
  cancel: [
    [440, 0.05],
    [330, 0.08],
  ],
  tab: [[1320, 0.03]],
  achievement: [
    [523, 0.08],
    [659, 0.08],
    [784, 0.08],
    [1047, 0.2],
  ],
  power: [
    [988, 0.07],
    [1319, 0.2],
  ],
} satisfies Record<string, Note[]>

export type Sfx = keyof typeof SOUNDS

let ctx: AudioContext | null = null

export function play(name: Sfx) {
  if (!useGame.getState().sound) return
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    let t = ctx.currentTime
    for (const [freq, duration] of SOUNDS[name]) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.06, t)
      gain.gain.setValueAtTime(0, t + duration)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + duration + 0.01)
      t += duration
    }
  } catch {
    // Sin Web Audio: el sitio funciona igual, en silencio.
  }
}
