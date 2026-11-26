import { describe, expect, it } from 'vitest';

import {
  collectArtNames,
  normalizeShape,
  parsePalette,
  parseTheme,
  tokensCss,
} from './sync-app.mjs';

const theme = `
export const colors = {
  paper: "#FBF3E4",
  ink: "#2A2135",
  coral: "#E05F51",
} as const;

export const moduleColor: Record<ModuleId, string> = {
  vocales: colors.coral,
};

export const border = 3;
export const radius = { sm: 16, pill: 999 } as const;
`;

describe('parseTheme', () => {
  it('reads colors, module colors, radius and border', () => {
    expect(parseTheme(theme)).toEqual({
      colors: { paper: '#FBF3E4', ink: '#2A2135', coral: '#E05F51' },
      moduleColor: { vocales: '#E05F51' },
      radius: { sm: 16, pill: 999 },
      border: 3,
    });
  });

  it('emits Tailwind theme variables', () => {
    const css = tokensCss(parseTheme(theme));
    expect(css).toContain('--color-paper: #FBF3E4;');
    expect(css).toContain('--color-module-vocales: #E05F51;');
    expect(css).toContain('--radius-app-pill: 999px;');
    expect(css).toContain('--border-app: 3px;');
  });
});

describe('parsePalette', () => {
  it('resolves color references and literals', () => {
    const drawing = `const PALETTE: Record<string, string> = {\n  ink: colors.ink,\n  sky: "#9BD3F5",\n};`;
    expect(parsePalette(drawing, { ink: '#2A2135' })).toEqual({ ink: '#2A2135', sky: '#9BD3F5' });
  });
});

describe('normalizeShape', () => {
  it('expands compact tuples with the default stroke', () => {
    expect(normalizeShape(['o', 40, 32, 12, 16, 'sky'])).toEqual({
      kind: 'oval',
      cx: 40,
      cy: 32,
      rx: 12,
      ry: 16,
      fill: 'sky',
      stroke: 3,
    });
    expect(normalizeShape(['c', 70, 54, 3, 'ink', 0])).toMatchObject({ kind: 'circle', stroke: 0 });
    expect(normalizeShape(['p', 'M0 0 L1 1', 'none', 6])).toEqual({
      kind: 'path',
      d: 'M0 0 L1 1',
      fill: 'none',
      stroke: 6,
    });
  });

  it('rejects unknown kinds', () => {
    expect(() => normalizeShape(['x', 1])).toThrow('Unknown art shape kind');
  });
});

describe('collectArtNames', () => {
  it('takes the first word, name or singular for each art id', () => {
    expect(
      collectArtNames([
        [{ word: 'ratón', art: 'raton' }],
        {
          items: [
            { name: 'Jaguar', art: 'jaguar' },
            { word: 'otro', art: 'raton' },
          ],
        },
        [{ singular: 'estrella', art: 'estrella' }],
      ]),
    ).toEqual({ raton: 'Ratón', jaguar: 'Jaguar', estrella: 'Estrella' });
  });
});
