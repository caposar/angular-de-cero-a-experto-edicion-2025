import { MapProviderId } from "../app/shared/constants/map-providers";

export const environment = {
  production: false,
  mapProviderId: 'maptiler' as MapProviderId,
  mapApiKeys: {
    maptiler: 'MB2esNUXUl6tMxDR5nS6',
    carto: '',           // Si algún día exige clave
    esri: '',            // Si usás su SDK autenticado
    openstreetmap: '',   // Generalmente no se usa
  } satisfies Partial<Record<MapProviderId, string>>,
};
