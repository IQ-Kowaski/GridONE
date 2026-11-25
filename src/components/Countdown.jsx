import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { splitCountdown, pad2 } from '../lib/format'

function Digit({ value, unit }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="sakuga-outline relative h-14 w-14 overflow-hidden md:h-20 md:w-20">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="tnum absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-[var(--color-paper)] md:text-4xl"
          >
            {pad2(value)}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-paper-dim)] md:text-xs">
        {unit}
      </span>
    </div>
  )
}

export default function Countdown({ target }) {
  const [ticks, setTicks] = useState(() => splitCountdown(target))

  useEffect(() => {
    const id = setInterval(() => setTicks(splitCountdown(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (ticks.isPast) {
    return (
      <p className="font-display text-lg font-extrabold text-[var(--color-live)]" role="status">
        Lights out — session underway
      </p>
    )
  }

  return (
    <div className="flex items-start gap-2 md:gap-4" role="timer" aria-live="polite">
      <Digit value={ticks.days} unit="days" />
      <span className="mt-3 font-display text-2xl font-extrabold text-[var(--color-signal)] md:mt-5 md:text-3xl">:</span>
      <Digit value={ticks.hours} unit="hrs" />
      <span className="mt-3 font-display text-2xl font-extrabold text-[var(--color-signal)] md:mt-5 md:text-3xl">:</span>
      <Digit value={ticks.minutes} unit="min" />
      <span className="mt-3 font-display text-2xl font-extrabold text-[var(--color-signal)] md:mt-5 md:text-3xl">:</span>
      <Digit value={ticks.seconds} unit="sec" />
    </div>
  )
}
