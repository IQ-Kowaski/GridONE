import { motion } from 'framer-motion'

export default function LiveBadge({ label = 'LIVE' }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-[var(--color-paper)] bg-[var(--color-signal)] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
      <span className="relative flex h-2.5 w-2.5">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-white"
          animate={{ scale: [1, 2.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
        />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
      </span>
      {label}
    </span>
  )
}
