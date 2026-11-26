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
- `legal.json` (privacy and terms) and `vowels.json` (the words behind the vowel keyboard)

Run `pnpm sync` after changing any of those in the app, and commit the result. Never edit
`src/generated/` by hand.

Screenshots in `src/assets/screens/` come from a real Android device: open the screen in the app
and run `scripts/capture-screens.sh <name>` (needs `adb` and ImageMagick). Use a demo profile, not
a real child's name.

## Vowel audio

The vowel keyboard plays recorded clips from `public/audio/vowels/` (`a-0.mp3` = "A de abeja.")
and falls back to the browser's speech voice when a clip is missing. The clips are generated with
ElevenLabs (`eleven_multilingual_v2`):

1. Put `ELEVENLABS_API_KEY=...` in `.env.elevenlabs` (ignored by git).
2. `pnpm audio --list-voices` lists the Spanish voices on the account.
3. `pnpm audio <voice-id>` writes the 15 clips and `voice.json` with the voice used.

## Deploy

`wrangler.jsonc` serves `dist/` with the custom domain `volcancito.momotombo.dev`. Deploying and
attaching the domain are manual steps.
