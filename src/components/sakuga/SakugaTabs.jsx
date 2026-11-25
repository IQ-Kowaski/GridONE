import { useEffect, useRef } from 'react'

export default function SakugaTabs({ label, options, selected = 0, onChange, className }) {
  const ref = useRef(null)
  const callback = useRef(onChange)
  callback.current = onChange

  useEffect(() => {
    const el = ref.current
    const handler = (event) => callback.current?.(event.detail)
    el.addEventListener('change', handler)
    return () => el.removeEventListener('change', handler)
  }, [])

  const markup = options.map((o) => `<option value="${o.value}">${o.label}</option>`).join('')

  return (
    <sakuga-tabs
      ref={ref}
      className={className}
      label={label}
      selected={selected}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}
