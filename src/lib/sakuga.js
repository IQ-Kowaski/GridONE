import core from '../vendor/sakuga/core.js?raw'
import button from '../vendor/sakuga/button.js?raw'
import tabs from '../vendor/sakuga/tabs.js?raw'
import toast from '../vendor/sakuga/toast.js?raw'
import tooltip from '../vendor/sakuga/tooltip.js?raw'
import progress from '../vendor/sakuga/progress.js?raw'
import toggle from '../vendor/sakuga/toggle.js?raw'
import checkbox from '../vendor/sakuga/checkbox.js?raw'
import radio from '../vendor/sakuga/radio.js?raw'
import input from '../vendor/sakuga/input.js?raw'
import slider from '../vendor/sakuga/slider.js?raw'
import rating from '../vendor/sakuga/rating.js?raw'

for (const source of [core, button, tabs, toast, tooltip, progress, toggle, checkbox, radio, input, slider, rating]) {
  const script = document.createElement('script')
  script.textContent = source
  document.head.appendChild(script)
}

export const fx = window.SakugaFX
