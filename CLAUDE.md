# Bay State Kitchen Configurator Demo

## What this is
Interactive kitchen configurator sales demo. A standalone Vite + React app deployed to GitHub Pages.
Shows a 6-step kitchen configuration flow with pricing.

## Stack
- Vite 8, React 19, Tailwind CSS v4 (via @tailwindcss/vite)
- lucide-react for icons
- No backend, no API calls - pure frontend mockup

## Structure
- Single-component app at `src/App.jsx` (all 6 steps, bottom bar, header)
- Tailwind theme in `src/index.css` (custom colors: navy, card, cyan-accent, gold, etc.)
- Base path set to `/bay-state-configurator-demo/` for GitHub Pages

## Deployment
- GitHub: zev330-lab/bay-state-configurator-demo
- GitHub Pages via Actions workflow (`.github/workflows/deploy.yml`)
- URL: https://zev330-lab.github.io/bay-state-configurator-demo/

## Build
```bash
npm run build
```

## Dev
```bash
npm run dev
```

## Key Design Decisions
- Dark theme: navy #0f172a background, card #1e293b
- Accent colors: cyan #06b6d4, gold #f59e0b
- Mobile-first, 375px minimum
- Step animations with opacity/translateY
- Price flash animation on selection changes
- All tap targets 44px minimum
