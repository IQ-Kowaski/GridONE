let enabled = true
const listeners = new Set()

export function isRefreshEnabled() {
  return enabled
}

export function setRefreshEnabled(value) {
  enabled = !!value
  listeners.forEach((fn) => fn(enabled))
}

export function onRefreshChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
