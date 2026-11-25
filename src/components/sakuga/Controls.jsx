import { useEffect, useRef } from 'react'

function useEvent(ref, type, handler) {
  const latest = useRef(handler)
  latest.current = handler
  useEffect(() => {
    const el = ref.current
    const listener = (event) => latest.current?.(event)
    el.addEventListener(type, listener)
    return () => el.removeEventListener(type, listener)
  }, [type, ref])
}

export function SakugaToggle({ label, checked, onChange }) {
  const ref = useRef(null)
  useEvent(ref, 'change', () => onChange?.(ref.current.checked))
  useEffect(() => { ref.current.checked = checked }, [checked])
  return <sakuga-toggle ref={ref} label={label} />
}

export function SakugaCheckbox({ checked, onChange, children }) {
  const ref = useRef(null)
  useEvent(ref, 'change', () => onChange?.(ref.current.checked))
  useEffect(() => { ref.current.checked = checked }, [checked])
  return <sakuga-checkbox ref={ref}>{children}</sakuga-checkbox>
}

export function SakugaInput({ label, placeholder, value = '', onChange }) {
  const ref = useRef(null)
  useEvent(ref, 'input', () => onChange?.(ref.current.value))
  useEffect(() => { if (ref.current.value !== value) ref.current.value = value }, [value])
  return <sakuga-input ref={ref} label={label} placeholder={placeholder} />
}

export function SakugaRadio({ label, options, value, onChange }) {
  const ref = useRef(null)
  useEvent(ref, 'change', () => onChange?.(ref.current.value))
  useEffect(() => { if (ref.current.value !== value) ref.current.value = value }, [value])
  const markup = options.map((o) => `<option value="${o.value}">${o.label}</option>`).join('')
  return <sakuga-radio ref={ref} label={label} dangerouslySetInnerHTML={{ __html: markup }} />
}

export function SakugaSlider({ label, min = 1, max = 23, step = 1, value, unit = '', onChange }) {
  const ref = useRef(null)
  useEvent(ref, 'input', () => onChange?.(Number(ref.current.value)))
  useEffect(() => { if (Number(ref.current.value) !== value) ref.current.value = value }, [value])
  return <sakuga-slider ref={ref} label={label} min={min} max={max} step={step} unit={unit} />
}

export function SakugaRating({ label, value, onChange }) {
  const ref = useRef(null)
  useEvent(ref, 'change', () => onChange?.(Number(ref.current.value)))
  useEffect(() => { if (Number(ref.current.value) !== value) ref.current.value = value }, [value])
  return <sakuga-rating ref={ref} label={label} />
}
