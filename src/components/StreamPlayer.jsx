import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SakugaButton from './sakuga/SakugaButton'

const SOURCE_STYLES = {
  golf: { bg: '#f4f3fc', text: '#1d1a4a' },
  admin: { bg: '#ff5fa8', text: '#ffffff' },
  echo: { bg: '#b8b3ff', text: '#1d1a4a' },
  alpha: { bg: '#8f8df7', text: '#1d1a4a' },
  bravo: { bg: '#ffd1e6', text: '#1d1a4a' },
  charlie: { bg: '#dcdaf0', text: '#1d1a4a' },
  delta: { bg: '#5a4fd8', text: '#ffffff' },
}

function SourceBadge({ source }) {
  const s = SOURCE_STYLES[source] ?? { bg: '#f4f3fc', text: '#8580b0' }
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full border-[2px] border-[var(--color-paper)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {source}
    </span>
  )
}

function EmptyState({ sessionLabel }) {
  return (
    <div className="sakuga-card flex aspect-video w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border-[2.5px] border-[var(--color-paper)] bg-[var(--color-panel-2)]">
        <svg className="h-6 w-6 text-[var(--color-signal-dim)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </span>
      <div>
        <p className="font-display text-lg font-extrabold text-[var(--color-paper)]">No streams available</p>
        <p className="mt-1 text-xs text-[var(--color-paper-dim)]">
          {sessionLabel
            ? `${sessionLabel} — no active streams found`
            : 'No streams currently available for this event.'}
        </p>
      </div>
    </div>
  )
}

function PlayerOverlay({ stream }) {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-3">
      <div className="flex flex-wrap items-center gap-2 rounded-[15px] border-[2.5px] border-[var(--color-paper)] bg-white px-3 py-2 shadow-[5px_6px_0_var(--color-soft)]">
        <SourceBadge source={stream.source} />
        <span className="text-xs font-bold text-[var(--color-paper)]">{stream.language}</span>
        {stream.hd && (
          <span className="inline-flex items-center rounded-full bg-[var(--color-signal)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
            HD
          </span>
        )}
        {stream.viewerCount > 0 && (
          <span className="ml-auto flex items-center gap-1 text-xs text-[var(--color-paper-dim)]">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            {stream.viewerCount}
          </span>
        )}
      </div>
    </div>
  )
}

export default function StreamPlayer({ feeds, sessionLabel }) {
  const [activeId, setActiveId] = useState(feeds?.[0]?.id ?? null)
  const active = feeds?.find((f) => f.id === activeId) ?? null

  const groups = useMemo(() => {
    if (!feeds || feeds.length === 0) return []
    const map = {}
    for (const f of feeds) {
      const key = f.eventTitle || 'Unknown'
      if (!map[key]) map[key] = []
      map[key].push(f)
    }
    return Object.entries(map)
  }, [feeds])

  if (!feeds || feeds.length === 0) {
    return <EmptyState sessionLabel={sessionLabel} />
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-[18px] border-[3px] border-[var(--color-paper)] bg-[var(--color-ink-2)] shadow-[6px_7px_0_var(--color-soft)]">
          {active?.embedUrl && (
            <iframe
              key={active.id}
              src={active.embedUrl}
              title={active.label}
              className="h-full w-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          )}
          {active && <PlayerOverlay stream={active} />}
        </div>
      </div>

      <div className="space-y-4 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pr-1">
        <div className="flex items-baseline justify-between lg:sticky lg:-top-1 lg:bg-white lg:pt-2">
          <p className="sakuga-eyebrow">Available streams</p>
          <span className="text-[11px] font-semibold text-[var(--color-paper-dim)]">
            {feeds.length} source{feeds.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {groups.map(([event, streams]) => (
              <motion.div
                key={event}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                className="space-y-2"
              >
                {groups.length > 1 && (
                  <p className="px-1 pt-2 pb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-paper-dim)]">
                    {event}
                  </p>
                )}
                {streams.map((f) => {
                  const isActive = f.id === activeId
                  return (
                    <SakugaButton
                      key={f.id}
                      variant="secondary"
                      className="stream-button block w-full"
                      onClick={() => setActiveId(f.id)}
                    >
                      <span className="flex w-full items-center gap-2 text-left">
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[2px] border-[var(--color-paper)] ${
                            isActive ? 'bg-[var(--color-signal)]' : 'bg-white'
                          }`}
                        >
                          {isActive && (
                            <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.751.751 0 01.018-1.042.751.751 0 011.042-.018L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                            </svg>
                          )}
                        </span>
                        <SourceBadge source={f.source} />
                        <span className="truncate text-sm font-semibold text-[var(--color-paper)]">
                          {f.language}
                        </span>
                        {f.hd && (
                          <span className="shrink-0 rounded-full bg-[var(--color-panel-2)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-paper-dim)]">
                            HD
                          </span>
                        )}
                        {f.viewerCount > 0 && (
                          <span className="ml-auto hidden shrink-0 text-[11px] text-[var(--color-paper-dim)] sm:inline">
                            {f.viewerCount}
                          </span>
                        )}
                      </span>
                    </SakugaButton>
                  )
                })}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export function StreamPlayerSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="sakuga-card aspect-video w-full lg:col-span-2" />
      <div className="space-y-2">
        <div className="h-3 w-24 animate-pulse rounded-full bg-[var(--color-soft)]" />
        <div className="sakuga-card h-12" />
        <div className="sakuga-card h-12" />
        <div className="sakuga-card h-12" />
      </div>
    </div>
  )
}
