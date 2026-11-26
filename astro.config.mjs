// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://volcancito.momotombo.dev',
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  markdown: { syntaxHighlight: false },
  build: {
    inlineStylesheets: 'always',
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Lexend',
      cssVariable: '--font-lexend',
      display: 'swap',
      formats: ['ttf'],
      weights: ['400', '500', '600', '700'],
      styles: ['normal'],
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          { weight: '400', style: 'normal', src: ['./src/assets/fonts/Lexend_400Regular.ttf'] },
          { weight: '500', style: 'normal', src: ['./src/assets/fonts/Lexend_500Medium.ttf'] },
          { weight: '600', style: 'normal', src: ['./src/assets/fonts/Lexend_600SemiBold.ttf'] },
          { weight: '700', style: 'normal', src: ['./src/assets/fonts/Lexend_700Bold.ttf'] },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Andika',
      cssVariable: '--font-andika',
      display: 'swap',
      formats: ['ttf'],
      weights: ['400', '700'],
      styles: ['normal'],
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          { weight: '400', style: 'normal', src: ['./src/assets/fonts/Andika_400Regular.ttf'] },
          { weight: '700', style: 'normal', src: ['./src/assets/fonts/Andika_700Bold.ttf'] },
        ],
      },
    },
  ],
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
        "img-src 'self' data:",
        "font-src 'self' data:",
      ],
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
