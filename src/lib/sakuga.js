import core from '../vendor/sakuga/core.js?raw'
import button from '../vendor/sakuga/button.js?raw'
import tabs from '../vendor/sakuga/tabs.js?raw'
import toast from '../vendor/sakuga/toast.js?raw'
import tooltip from '../vendor/sakuga/tooltip.js?raw'
import progress from '../vendor/sakuga/progress.js?raw'

for (const source of [core, button, tabs, toast, tooltip, progress]) {
  const script = document.createElement('script')
  script.textContent = source
  document.head.appendChild(script)
}

export const fx = window.SakugaFX
