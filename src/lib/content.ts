import legalJson from '../generated/legal.json';
import vowelsJson from '../generated/vowels.json';

export type LegalDoc = { title: string; updated: string; summary: string[]; html: string };
export type Vowel = 'a' | 'e' | 'i' | 'o' | 'u';

export const legal = legalJson as { terms: LegalDoc; privacy: LegalDoc };
export const vowels = vowelsJson as Record<Vowel, { word: string; art: string }[]>;

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
