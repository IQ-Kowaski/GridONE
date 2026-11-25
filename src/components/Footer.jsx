export default function Footer() {
  return (
    <footer className="border-t-[1.5px] border-[var(--color-hairline)] bg-[var(--color-panel-2)]">
      <div className="mx-auto max-w-6xl px-5 py-8 text-xs text-[var(--color-paper-dim)] md:px-8">
        <p>
          Schedule and championship data via the{' '}
          <a
            className="font-semibold text-[var(--color-signal-dim)] underline decoration-[var(--color-signal)] decoration-2 underline-offset-2 hover:text-[var(--color-signal)]"
            href="https://github.com/jolpica/jolpica-f1"
            target="_blank"
            rel="noreferrer"
          >
            Jolpica F1 API
          </a>
          . Grid Watch is an independent fan dashboard, not affiliated with Formula 1, the FIA,
          or any team. This site does not host or link to any broadcast or video stream.
        </p>
      </div>
    </footer>
  )
}
