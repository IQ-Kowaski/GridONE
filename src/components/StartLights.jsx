import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { impact } from '../lib/fx'

const LIGHT_COUNT = 5
const STEP_MS = 550

export default function StartLights({ onOut, className = '' }) {
  const reduced = useReducedMotion()
  const [lit, setLit] = useState(0)
  const [phase, setPhase] = useState(reduced ? 'off' : 'red')
  const row = useRef(null)

  useEffect(() => {
    if (reduced) {
      onOut?.()
      return
    }
    const timers = []
    for (let i = 1; i <= LIGHT_COUNT; i++) {
      timers.push(setTimeout(() => setLit(i), i * STEP_MS))
    }
    timers.push(setTimeout(() => setPhase('green'), LIGHT_COUNT * STEP_MS + 700))
    timers.push(
      setTimeout(() => {
        setPhase('off')
        impact(row.current)
        onOut?.()
      }, LIGHT_COUNT * STEP_MS + 1900)
    )
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return (
    <div ref={row} className={`flex items-center gap-3 md:gap-4 ${className}`} aria-hidden="true">
      {Array.from({ length: LIGHT_COUNT }).map((_, i) => {
        const isRed = phase === 'red' && i < lit
        const isGreen = phase === 'green'

        const color = isRed ? '#ff5fa8' : isGreen ? '#5a4fd8' : '#dcdaf0'

        return (
          <div
            key={i}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border-[3px] border-[var(--color-paper)] bg-white shadow-[4px_5px_0_var(--color-soft)] md:h-12 md:w-12"
          >
            <motion.div
              className="h-4 w-4 rounded-full border-2 border-[var(--color-paper)] md:h-6 md:w-6"
              animate={{ backgroundColor: color, scale: isRed || isGreen ? 1.08 : 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
            />
          </div>
        )
      })}
    </div>
  )
}
