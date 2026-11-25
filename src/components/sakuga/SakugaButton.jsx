import { useEffect, useRef } from 'react'

export default function SakugaButton({ children, variant, onClick, className = '', ...rest }) {
  const ref = useRef(null)
  const callback = useRef(onClick)
  callback.current = onClick

  useEffect(() => {
    const el = ref.current
    const handler = (event) => callback.current?.(event)
    el.addEventListener('click', handler)
    return () => el.removeEventListener('click', handler)
  }, [])

  return (
    <sakuga-button ref={ref} variant={variant} className={className} {...rest}>
      {children}
    </sakuga-button>
  )
}
