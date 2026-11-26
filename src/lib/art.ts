import artJson from '../generated/art.json';
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

export function paint(fill: string) {
  return fill === 'none' ? 'none' : (PALETTE[fill] ?? fill);
}

export function outline(stroke: number) {
  return stroke > 0 ? { stroke: INK, 'stroke-width': stroke } : { stroke: 'none' };
}
