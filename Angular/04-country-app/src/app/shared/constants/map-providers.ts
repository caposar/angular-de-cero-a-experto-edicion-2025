/*
  PROVEEDORES GRATUITOS DE MAPAS PARA LEAFLET

  1. OpenStreetMap
    - Gratis / sin clave
    - Solo para uso personal, educativo o baja carga
    - No permitido para uso comercial en producción
    - Idioma depende del país/región
    - https://www.openstreetmap.org

  2. CartoDB (Carto)
    - Gratis, sin clave (light_all, dark_all, etc.)
    - Solo para proyectos personales / educativos
    - Requiere plan Enterprise para uso comercial
    - https://carto.com/

  3. MapTiler
    - Tiene plan gratuito (requiere API Key)
    - Estilo tipo Google Maps
    - Idioma personalizable (language=es)
    - El plan Free **no permite** uso comercial
    - Plan gratuito: 100k tiles/mes
    - https://www.maptiler.com/cloud/

  4. Esri ArcGIS: Gratis para uso ligero
    - Gratis hasta 2 millones de tiles/mes (requiere API Key)
    - Permite uso comercial (incluye apps públicas y privadas)
    - Requiere mostrar “Powered by Esri” y atribuciones de datos
    - https://www.arcgis.com/

*/

export type MapProviderId = 'openstreetmap' | 'carto' | 'maptiler' | 'esri';

export interface MapProvider {
  name: string;
  tileUrl: string;
  attribution: string;
  requiresApiKey: boolean;
  apiKeyParamName?: string;
  termsUrl: string;
  usageNotes: string;
  showAttribution?: boolean; // opcional, default: false
}

export const MAP_PROVIDERS: Record<MapProviderId, MapProvider> = {
  openstreetmap: {
    name: 'OpenStreetMap',
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    requiresApiKey: false,
    termsUrl: 'https://www.openstreetmap.org/copyright',
    usageNotes: 'Gratis, sin clave. Apto para uso comercial respetando la licencia ODbL. El servidor tile.openstreetmap.org no está pensado para producción comercial de alta carga.',
  },
  carto: {
    name: 'CartoDB (Carto)',
    tileUrl: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> contributors',
    requiresApiKey: false,
    termsUrl: 'https://carto.com/legal/terms/',
    usageNotes: 'Gratis solo para uso personal y educativo. Uso comercial requiere plan Enterprise.',
  },
  maptiler: {
    name: 'MapTiler',
    tileUrl: 'https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors',
    requiresApiKey: true,
    apiKeyParamName: 'key',
    termsUrl: 'https://cloud.maptiler.com/account/plans/',
    usageNotes: 'Plan gratuito (100k tiles/mes) solo para uso no comercial. Requiere API Key y puede personalizar idioma con parámetro "language=es".',
  },
  esri: {
    name: 'Esri ArcGIS',
    tileUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, HERE, Garmin, FAO, NOAA, USGS, EPA, NPS',
    requiresApiKey: false,
    termsUrl: 'https://developers.arcgis.com/terms/',
    usageNotes: 'Gratis hasta 2 millones tiles/mes, permite uso comercial con atribuciones visibles.',
    showAttribution: true, // Obligatorio por términos legales de Esri
  },
};
