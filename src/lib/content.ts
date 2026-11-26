import legalJson from '../generated/legal.json';
import modulesJson from '../generated/modules.json';
import nicaraguaJson from '../generated/nicaragua.json';
import stickersJson from '../generated/stickers.json';
import vowelsJson from '../generated/vowels.json';

export type LegalDoc = { title: string; updated: string; summary: string[]; html: string };
export type AppModule = { id: string; name: string; color: string };
export type NicaItem = {
  id: string;
  name: string;
  category: 'animal' | 'planta';
  art: string;
  tag?: string;
  facts: string[];
};
export type Sticker = { id: string; label: string; name: string; module: string };

export const legal = legalJson as { terms: LegalDoc; privacy: LegalDoc };
export const modules = modulesJson as AppModule[];
export const nicaragua = nicaraguaJson as NicaItem[];
export const stickers = stickersJson as Sticker[];
export const vowels = vowelsJson as Record<
  'a' | 'e' | 'i' | 'o' | 'u',
  { word: string; art: string }[]
>;

export const moduleGlyph: Record<string, string> = {
  vocales: 'aeiou',
  abecedario: 'Abc',
  numeros: '123',
  silabas: 'ma',
  nicaragua: 'Nica',
  sumas: '2+3',
  memoria: 'a=a',
  trazar: 'a 1',
  oraciones: 'el oso',
};

export const moduleBlurb: Record<string, string> = {
  vocales: 'Escuchar y reconocer a, e, i, o, u con dibujos.',
  abecedario: 'De la a a la z, con la ñ incluida.',
  numeros: 'Contar objetos y reconocer los números.',
  silabas: 'Juntar letras para completar palabras.',
  nicaragua: 'Animales y plantas de nuestro país.',
  sumas: 'Primeras sumas con cosas que se pueden contar.',
  memoria: 'Encontrar parejas de vocales, letras y números.',
  trazar: 'Seguir con el dedo el trazo de las vocales y los números.',
  oraciones: 'Ordenar palabras para armar oraciones cortas.',
};

export const faq = [
  {
    q: '¿Para qué edad es Volcancito?',
    a: 'Para niñas y niños de 3 a 8 años. Se puede jugar sin saber leer todavía: cada letra y palabra tiene dibujo y voz.',
  },
  {
    q: '¿Cómo agrego a otro niño?',
    a: 'En la Zona de papás, baja hasta Perfiles y toca «+ Agregar niño». Cada niño tiene su propio progreso.',
  },
  {
    q: '¿Cómo cambio el tiempo de juego?',
    a: 'En la Zona de papás, en «Límite diario», elige 15, 30 o 45 minutos, o sin límite. También puedes activar la hora de descanso.',
  },
  {
    q: '¿Funciona sin internet?',
    a: 'Sí. Los juegos y el progreso se guardan en el teléfono, así que se puede jugar sin conexión.',
  },
  {
    q: '¿La app tiene anuncios?',
    a: 'No. Volcancito no muestra anuncios ni enlaces de compra a los niños.',
  },
  {
    q: '¿Cómo borro los datos?',
    a: 'Para borrar a un niño, entra a Editar perfil. Para borrar todo, ve a Cuenta y toca «Borrar cuenta».',
  },
];
