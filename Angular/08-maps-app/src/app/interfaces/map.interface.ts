export interface MapService {
  initMap(containerId: string, options?: { lat: number, lng: number, zoom: number }): void;
  setCenter(lat: number, lng: number): void;
  addMarker(lat: number, lng: number): void;
}
