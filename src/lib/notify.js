let toast = null
let lastMessage = ''
let lastAt = 0

export function registerToast(el) {
  toast = el
}

export function notify(message) {
  const now = Date.now()
  if (message === lastMessage && now - lastAt < 1800) return
  lastMessage = message
  lastAt = now
  toast?.show(message)
}
