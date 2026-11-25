import { fx } from './sakuga'

export function hit(el, word = 'kachi') {
  if (!fx || fx.calm || !el) return
  const c = fx.at(el)
  fx.ticks(c.x + c.w / 2 - 8, c.y - c.h / 2 - 4, { dir: -1.05, n: 3, r: 5, len: 16, fan: 0.42, life: 0.42 })
  fx.sfx(word, c.x + 34, c.y - 52, { size: 88, rot: -0.12, life: 0.8, ...fx.hollow() })
}

export function impact(el) {
  if (!fx || fx.calm || !el) return
  const c = fx.at(el)
  fx.burst(c.x, c.y, { r: 58, life: 0.38 })
  fx.puff(c.x - c.w / 2, c.y - 6, { size: 10, n: 4, vx: -24, vy: -14, life: 0.75 })
  fx.puff(c.x + c.w / 2, c.y - 6, { size: 10, n: 4, vx: 24, vy: -14, life: 0.75 })
  fx.sfx('don', c.x + 12, c.y - 66, { size: 112, life: 0.85, ...fx.hollow() })
}
