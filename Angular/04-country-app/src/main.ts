import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import * as L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
import { LeafletModule } from '@bluehalo/ngx-leaflet';

//  Fix global para los íconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/marker-icon-2x.png',
  iconUrl: 'leaflet/marker-icon.png',
  shadowUrl: 'leaflet/marker-shadow.png',
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
