# Grid Watch

A live Formula 1 dashboard: session countdowns, race calendar, results, championship standings, and stream listings. Built with React, Vite, Tailwind CSS, and framer-motion. Data comes from the [Jolpica F1 API](https://github.com/jolpica/jolpica-f1).

## Visual theme

The interface uses the Sakuga VFX look: white paper, indigo ink, lavender lines, pink accents, hard offset shadows, italic rounded headings, and canvas-drawn anime effects on interactions. The effect components are vendored unchanged from [finktheartist/sakuga-vfx](https://github.com/finktheartist/sakuga-vfx) under `src/vendor/sakuga/` (MIT license in `src/vendor/sakuga/LICENSE`). They are injected as classic scripts by `src/lib/sakuga.js` so the production build stays a single HTML file.

Colors can be adjusted through the `--sk-*` and `--color-*` CSS variables in `src/index.css`. Effects are disabled automatically when the visitor prefers reduced motion.

## License

All rights reserved. No permission is granted to use this project without prior written permission from IQ-Kowaski. See [LICENSE](LICENSE). Included third-party components keep their own licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Commands

```sh
npm install
npm run dev
npm run lint
npm run build
```
