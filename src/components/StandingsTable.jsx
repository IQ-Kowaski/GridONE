import { motion } from 'framer-motion'

export default function StandingsTable({ title, rows, renderPrimary, renderSecondary, caption }) {
  const leader = rows[0]?.points ?? 0

  return (
    <section aria-labelledby={`${title}-heading`} className="relative">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h3 id={`${title}-heading`} className="text-2xl text-[var(--color-paper)] md:text-3xl">
          {title}
        </h3>
        {caption && <p className="text-xs text-[var(--color-paper-dim)]">{caption}</p>}
      </div>

      <div className="sakuga-card overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-[1.5px] border-[var(--color-hairline)] bg-[var(--color-panel-2)] text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-paper-dim)]">
              <th scope="col" className="w-14 px-3 py-2.5 md:px-4">
                Pos
              </th>
              <th scope="col" className="px-3 py-2.5 md:px-4">
                {title === 'Drivers' ? 'Driver' : 'Constructor'}
              </th>
              <th scope="col" className="hidden px-3 py-2.5 sm:table-cell md:px-4">
                Wins
              </th>
              <th scope="col" className="px-3 py-2.5 text-right md:px-4">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const share = leader > 0 ? Math.max(4, (row.points / leader) * 100) : 0
              return (
                <motion.tr
                  key={row.driverId || row.constructorId}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26, delay: i * 0.025 }}
                  className="border-b-[1.5px] border-[var(--color-hairline)] last:border-b-0 odd:bg-white even:bg-[var(--color-panel-2)]"
                >
                  <td className="px-3 py-3 md:px-4">
                    <span
                      className={`tnum inline-flex h-7 w-7 items-center justify-center rounded-lg text-sm font-extrabold ${
                        row.position === 1
                          ? 'bg-[var(--color-signal)] text-white'
                          : 'border-2 border-[var(--color-hairline)] bg-white text-[var(--color-paper)]'
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>
                  <td className="px-3 py-3 md:px-4">
                    <div className="font-bold text-[var(--color-paper)]">{renderPrimary(row)}</div>
                    <div className="text-xs text-[var(--color-paper-dim)]">{renderSecondary(row)}</div>
                  </td>
                  <td className="tnum hidden px-3 py-3 text-[var(--color-paper-dim)] sm:table-cell md:px-4">
                    {row.wins}
                  </td>
                  <td className="px-3 py-3 md:px-4">
                    <div className="flex items-center justify-end gap-2">
                      <div className="hidden h-2 w-16 overflow-hidden rounded-full border-[1.5px] border-[var(--color-hairline)] bg-white sm:block">
                        <div
                          className="h-full rounded-full bg-[var(--color-signal-dim)]"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                      <span className="tnum w-12 text-right font-bold text-[var(--color-paper)]">
                        {row.points}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
