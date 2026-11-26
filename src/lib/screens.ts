import type { ImageMetadata } from 'astro';
import nicaDetail from '../assets/screens/nica-detail.png';
import nicaGrid from '../assets/screens/nica-grid.png';
import nicaragua from '../assets/screens/nicaragua.png';
import oraciones from '../assets/screens/oraciones.png';
import play from '../assets/screens/play.png';
import trazar from '../assets/screens/trazar.png';
import vowels from '../assets/screens/vowels.png';

export type Screen = { id: string; src: ImageMetadata; caption: string; alt: string };

export const screens: Screen[] = [
  {
    id: 'vowels',
    src: vowels,
    caption: 'Cada vocal con dibujo y voz',
    alt: 'Pantalla de Vocales: la letra A grande, una abeja y la palabra Abeja con botón para escuchar.',
  },
  {
    id: 'play',
    src: play,
    caption: 'Rondas cortas de cinco preguntas',
    alt: 'Juego de vocales: un racimo de uvas, la palabra «?va» y tres botones con las vocales e, u, a.',
  },
  {
    id: 'trazar',
    src: trazar,
    caption: 'Trazar con el dedo',
    alt: 'Pantalla Trazar: el número 1 con línea punteada para seguir y teclas con números y vocales.',
  },
  {
    id: 'oraciones',
    src: oraciones,
    caption: 'Armar oraciones',
    alt: 'Juego de oraciones: un volcán y las palabras «El volcán echa humo» ordenadas.',
  },
  {
    id: 'nicaragua',
    src: nicaragua,
    caption: 'Conocé Nicaragua',
    alt: 'Pantalla Nicaragua con el mapa, animales y plantas, volcanes, comidas y fiestas.',
  },
  {
    id: 'nica-grid',
    src: nicaGrid,
    caption: 'Animales y plantas del país',
    alt: 'Fichas de Guardabarranco, Sacuanjoche, Madroño y Mono congo.',
  },
  {
    id: 'nica-detail',
    src: nicaDetail,
    caption: 'Fichas con datos para escuchar',
    alt: 'Ficha del Guardabarranco, ave nacional, con dos datos cortos y botón para escuchar.',
  },
];
