import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Osing Explore',
    short_name: 'OsingExplore',
    description: 'Platform Rekomendasi Wisata dan Kuliner Berbasis Rute Banyuwangi',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F3EE',
    theme_color: '#0D8A82',
    icons: [
      {
        src: '/icons/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/icon-maskable.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
