import artJson from '../generated/art.json';
import namesJson from '../generated/art-names.json';
import paletteJson from '../generated/palette.json';

export type ArtShape =
  | { kind: 'circle'; cx: number; cy: number; r: number; fill: string; stroke: number }
  | { kind: 'oval'; cx: number; cy: number; rx: number; ry: number; fill: string; stroke: number }
  | {
      kind: 'rect';
      x: number;
      y: number;
      w: number;
      h: number;
      r: number;
      fill: string;
      stroke: number;
    }
  | { kind: 'path'; d: string; fill: string; stroke: number };

export const ART = artJson as Record<string, ArtShape[]>;
const PALETTE = paletteJson as Record<string, string>;
const INK = PALETTE.ink ?? '#2A2135';

export const artIds = Object.keys(ART).sort((a, b) => a.localeCompare(b, 'es'));

export function paint(fill: string) {
  return fill === 'none' ? 'none' : (PALETTE[fill] ?? fill);
}

export function outline(stroke: number) {
  return stroke > 0 ? { stroke: INK, 'stroke-width': stroke } : { stroke: 'none' };
}

const NAMES: Record<string, string> = {
  ...(namesJson as Record<string, string>),
  'gallo-pinto': 'Gallo pinto',
  gueguense: 'Güegüense',
  senal: 'Señal',
  'mapa-nicaragua': 'Mapa de Nicaragua',
};

export function artLabel(id: string) {
  const name = NAMES[id] ?? id.replace(/-/g, ' ');
  return name.charAt(0).toUpperCase() + name.slice(1);
}
