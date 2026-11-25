import { fx } from './sakuga'

let running = false

function beat() {
  if (!fx) return
  if (!fx.calm) {
    const edge = Math.floor(Math.random() * 4)
    const right = edge % 2 === 1
    const x = scrollX + (right ? innerWidth - 72 : 72)
    const y = scrollY + (edge < 2 ? 90 + Math.random() * 70 : innerHeight - 100 - Math.random() * 70)
    const pick = Math.random()

    if (pick < 0.45) {
      fx.puff(x, y, { size: 7, n: 3, vx: right ? -20 : 20, vy: -14, life: 0.9 })
    } else if (pick < 0.75) {
      fx.kira(x, y, { r: 8, life: 0.65 })
    } else {
      fx.lines(x, y, { n: 3, dir: right ? Math.PI : 0, len: 30, spread: 11, life: 0.36 })
    }
  }
  fx.later(1900 + Math.random() * 1300, beat)
}

export function startAmbient() {
  if (running || !fx) return
  running = true
  fx.later(1600, beat)
}
