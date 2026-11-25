import { motion } from 'framer-motion'
import { useState } from 'react'
import StartLights from './StartLights'

export default function Hero({ nextRace, children }) {
  const [revealed, setRevealed] = useState(false)
  const spring = { type: 'spring', stiffness: 260, damping: 22 }

  return (
    <section className="relative overflow-hidden border-b-[1.5px] border-[var(--color-hairline)] bg-white">
      <div
        className="pointer-events-none absolute -right-20 -top-20 hidden h-72 w-72 rounded-full border-[3px] border-[var(--color-soft)] md:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-14 md:px-8 md:pb-20 md:pt-20">
        <StartLights onOut={() => setRevealed(true)} className="mb-8 md:mb-10" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="sakuga-eyebrow mb-3"
        >
          {nextRace ? `Round ${nextRace.round} · ${nextRace.country}` : 'Formula 1 · Live season'}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={revealed ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={spring}
          className="max-w-3xl text-5xl leading-[0.95] text-[var(--color-paper)] sm:text-6xl md:text-7xl"
        >
          {nextRace ? nextRace.name.replace(' Grand Prix', '') : 'Race Control'}
          <span className="block text-[var(--color-signal)]">Grand&nbsp;Prix</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="mt-5 max-w-xl text-base text-[var(--color-paper-dim)] md:text-lg"
        >
          Live session countdown, the full race calendar, and championship points —
          refreshed automatically as the season moves.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.2 }}
          className="mt-9"
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
