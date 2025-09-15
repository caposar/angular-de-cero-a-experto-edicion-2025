import { Component, computed, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

// Interfaz para el data de las rutas
interface RouteData {
  title?: string;
}

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {
  private router = inject(Router);

  // Signal que se actualiza cada vez que hay un ActivationEnd
  private childRouteData = toSignal<RouteData | undefined>(
    this.router.events.pipe(
      filter((e): e is ActivationEnd => e instanceof ActivationEnd),
      map(event => {
        let route = event.snapshot.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.data as RouteData | undefined;
      })
    ),
    { initialValue: undefined }
  );

  public pageTitle = computed(() => this.childRouteData()?.title ?? '');
}
