import { motion } from 'framer-motion'
import StartLights from './StartLights'

export default function Hero({ nextRace, children }) {
  const spring = { type: 'spring', stiffness: 260, damping: 22 }

  return (
    <section className="relative overflow-hidden border-b-[1.5px] border-[var(--color-hairline)] bg-white">
      <div
        className="sk-float pointer-events-none absolute -right-20 -top-20 hidden h-72 w-72 rounded-full border-[3px] border-[var(--color-soft)] md:block"
        aria-hidden="true"
      />
      <div
        className="sk-float pointer-events-none absolute right-[18%] top-28 hidden h-10 w-10 rotate-12 rounded-[10px] border-[3px] border-[var(--color-signal)] md:block"
        style={{ animationDelay: '-3s' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-none px-6 pb-14 pt-12 md:px-10 md:pb-20 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
          <div>
            <StartLights className="mb-8 md:mb-10" />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="sakuga-eyebrow mb-3"
            >
              {nextRace ? `Round ${nextRace.round} · ${nextRace.country}` : 'Formula 1 · Live season'}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={spring}
              className="text-5xl leading-[0.95] text-[var(--color-paper)] sm:text-6xl md:text-7xl"
            >
              {nextRace ? nextRace.name.replace(' Grand Prix', '') : 'Race Control'}
              <span className="block text-[var(--color-signal)]">Grand&nbsp;Prix</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 }}
              className="mt-5 max-w-xl text-base text-[var(--color-paper-dim)] md:text-lg"
            >
              Live session countdown, the full race calendar, and championship points —
              refreshed automatically as the season moves.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.15 }}
            className="sakuga-card p-5 md:p-6"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
