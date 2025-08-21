// Filename: osm-humanitarian-style.ts
import { StyleSpecification } from 'maplibre-gl';

export const OSM_HUMANITARIAN_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    humanitarian: {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Humanitarian style',
    },
  },
  layers: [
    {
      id: 'humanitarian-layer',
      type: 'raster',
      source: 'humanitarian',
    },
  ],
} as const;
