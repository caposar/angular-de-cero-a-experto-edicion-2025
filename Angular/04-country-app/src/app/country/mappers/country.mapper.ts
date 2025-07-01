import type { Country } from "../interfaces/country.interface";
import type { RESTCountry } from "../interfaces/rest-countries.interface";

export class CountryMapper {
  // static RESTCountry => Country
  static toCountry(country: RESTCountry): Country {
    return {
      cca2: country.cca2 ?? '',
      flag: country.flag ?? '',
      flagSvg: country.flags?.svg ?? '',
      name: country.name?.common ?? 'Desconocido',
      nameSpanish: country.translations?.['spa']?.common ?? 'No Spanish Name',
      capital: Array.isArray(country.capital) && country.capital.length > 0 ? country.capital.join(',') : 'Sin capital',
      population: country.population ?? 0,
      latlng: this.resolveLatLng(country),
      maps: this.resolveMaps(country),
      area: country.area ?? 0,
      region: country.region ?? '',
      subRegion: country.subregion ?? ''
    };
  }

  // static RESTCountry[] => Country[]
  static toCountries(countries: RESTCountry[]): Country[] {
    return countries.map(country => this.toCountry(country));
  }

  // Asegura que la latlng sea una tupla [number, number]
  private static resolveLatLng(country: RESTCountry): [number, number] {
    const coords = country.capitalInfo?.latlng ?? country.latlng;
    return Array.isArray(coords) && coords.length === 2
      ? [coords[0], coords[1]]
      : [0, 0];
  }

  // Asegura que maps tenga strings válidos
  private static resolveMaps(country: RESTCountry): Country["maps"] {
    return {
      googleMaps: typeof country.maps?.googleMaps === 'string'
        ? country.maps.googleMaps
        : '',
      openStreetMaps: typeof country.maps?.openStreetMaps === 'string'
        ? country.maps.openStreetMaps
        : '',
    };
  }
}
