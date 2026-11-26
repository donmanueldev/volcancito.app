export const site = {
  name: 'Volcancito',
  url: 'https://volcancito.momotombo.dev',
  title: 'Volcancito · Aprender a leer y contar jugando',
  description:
    'App para niños de 3 a 8 años: letras, sílabas, números y Nicaragua, con juegos cortos, stickers y una zona para papás. Sin anuncios.',
  supportEmail: 'hola@momotombo.dev',
  studio: { name: 'Momotombo Devs', url: 'https://momotombo.dev' },
} as const;

export const nav = [
  { href: '/pantallas', label: 'Pantallas' },
  { href: '/ilustraciones', label: 'Ilustraciones' },
  { href: '/ayuda', label: 'Ayuda' },
] as const;
