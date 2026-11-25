import { useEffect, useRef } from 'react'

export default function SakugaProgress({ label = 'Loading' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    let value = 0.04
    el.set(value, true)
    const id = setInterval(() => {
      value = Math.min(0.9, value + (0.9 - value) * 0.08 + 0.01)
      el.set(value)
    }, 340)
    return () => {
      clearInterval(id)
      el.reset()
    }
  }, [])

  return <sakuga-progress ref={ref} label={label} />
}
