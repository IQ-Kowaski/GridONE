export default function SakugaTooltip({ text, label, children }) {
  return (
    <sakuga-tooltip text={text} label={label}>
      {children}
    </sakuga-tooltip>
  )
}
