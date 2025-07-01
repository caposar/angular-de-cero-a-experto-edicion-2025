export interface Country {
  cca2: string;
  flag: string;
  flagSvg: string;
  name: string;
  nameSpanish: string;
  capital: string;
  population: number;
  latlng: [number, number];
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  area: number;
  region: string;
  subRegion: string;
}
