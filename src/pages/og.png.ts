import type { APIRoute } from 'astro';
import sharp from 'sharp';

const MOUNTAIN =
  'M40 30 Q42 26 46 26 L58 26 Q62 26 64 30 Q70 60 84 76 Q94 86 98 90 Q100 94 95 94 L9 94 Q4 94 6 90 Q10 86 20 76 Q34 60 40 30 Z';
const LAVA =
  'M38 36 Q38 28 46 28 L58 28 Q66 28 66 36 L70 52 L64 47 L59 54 L53 46 L47 53 L41 47 L35 51 Z';
const INK = '#2A2135';

const tile = (x: number, y: number, rotate: number, fill: string) =>
  `<rect x="${x}" y="${y}" width="110" height="110" rx="26" fill="${INK}" transform="rotate(${rotate} ${x + 55} ${y + 55}) translate(7 9)"/>
   <rect x="${x}" y="${y}" width="110" height="110" rx="26" fill="${fill}" stroke="${INK}" stroke-width="7" transform="rotate(${rotate} ${x + 55} ${y + 55})"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><pattern id="d" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="2" fill="#E9DCC6"/></pattern></defs>
  <rect width="1200" height="630" fill="#FBF3E4"/><rect width="1200" height="630" fill="url(#d)"/>
  ${tile(150, 120, -12, '#F0BB3B')}${tile(150, 300, 6, '#2391E0')}${tile(940, 140, 14, '#E05F51')}${tile(950, 330, -6, '#34A155')}
  <g transform="translate(330 40) scale(5.4)" stroke-linejoin="round" stroke-linecap="round">
    <rect x="8" y="93" width="92" height="4" rx="2" fill="${INK}"/>
    <path d="${MOUNTAIN}" fill="#34A155" stroke="${INK}" stroke-width="3.2"/>
    <path d="${LAVA}" fill="#F0BB3B" stroke="${INK}" stroke-width="3"/>
    <path d="M30 80 Q40 52 45 42" fill="none" stroke="#5CBF7A" stroke-width="3"/>
    <ellipse cx="45" cy="65" rx="3.6" ry="4.4" fill="${INK}"/><ellipse cx="61" cy="65" rx="3.6" ry="4.4" fill="${INK}"/>
    <circle cx="46" cy="63.5" r="1.2" fill="#fff"/><circle cx="62" cy="63.5" r="1.2" fill="#fff"/>
    <path d="M47 73 Q53 79 59 73 Z" fill="#E05F51" stroke="${INK}" stroke-width="2"/>
    <ellipse cx="38" cy="72" rx="4.5" ry="2.8" fill="#E3A08A"/><ellipse cx="68" cy="72" rx="4.5" ry="2.8" fill="#E3A08A"/>
  </g>
</svg>`;

export const GET: APIRoute = async () => {
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
