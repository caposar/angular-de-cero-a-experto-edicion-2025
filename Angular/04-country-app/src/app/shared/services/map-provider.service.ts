import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MapProviderId, MAP_PROVIDERS } from '../constants/map-providers';

@Injectable({
  providedIn: 'root'
})
export class MapProviderService {
  private mapProviderId: MapProviderId = environment.mapProviderId;

  getProvider(): (typeof MAP_PROVIDERS)[MapProviderId] {
    return MAP_PROVIDERS[this.mapProviderId];
  }

  getTileUrl(): string | null {
    const provider = this.getProvider();
    let tileUrl = provider.tileUrl;

    if (provider.requiresApiKey) {
      const apiKey = environment.mapApiKeys[this.mapProviderId];
      if (!apiKey) {
        console.warn(`Faltó la API key para el proveedor "${this.mapProviderId}"`);
        return null;
      }
      const sep = tileUrl.includes('?') ? '&' : '?';
      tileUrl += `${sep}${provider.apiKeyParamName}=${apiKey}`;
    }

    return tileUrl;
  }
}
