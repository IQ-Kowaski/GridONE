import { useCallback } from 'react'
import { registerToast } from '../../lib/notify'

export default function SakugaToast() {
  const capture = useCallback((el) => {
    registerToast(el)
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50">
      <div className="pointer-events-auto">
        <sakuga-toast ref={capture} />
      </div>
    </div>
  )
}
