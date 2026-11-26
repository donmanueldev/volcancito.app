# Volcancito web

Marketing site for the Volcancito app, served at <https://volcancito.momotombo.dev>. Astro 7 static
build, Tailwind v4, deployed as static assets on Cloudflare Workers.

## Commands

```bash
pnpm install
pnpm dev          # local dev server
pnpm sync         # copy tokens, art, legal text, fonts and icons from ../volcancito
pnpm verify       # lint, format check, astro check, unit tests, build
pnpm test:e2e     # Playwright smoke tests (desktop + mobile)
```

## Sharing with the app

The app repo is the source of truth for the look and the content. `scripts/sync-app.mjs` reads
`../volcancito` (or `VOLCANCITO_APP_DIR`) and writes versioned files to `src/generated/`,
`src/assets/fonts/` and `public/`:

- `src/theme.ts` → `tokens.css` (Tailwind `@theme` colors, module colors, radius, border)
- `src/content/data/art.json` + the `PALETTE` in `src/components/drawing.tsx` → SVG illustrations
- `legal.json`, `nicaragua.json`, `stickers.json`, module names and art names

Run `pnpm sync` after changing any of those in the app, and commit the result. Never edit
`src/generated/` by hand.

Screenshots in `src/assets/screens/` come from a real Android device: open the screen in the app
and run `scripts/capture-screens.sh <name>` (needs `adb` and ImageMagick). Use a demo profile, not
a real child's name.

## Deploy

`wrangler.jsonc` serves `dist/` with the custom domain `volcancito.momotombo.dev`. Deploying and
attaching the domain are manual steps.
