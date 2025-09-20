import { effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

/**
 * Servicio de paginación que gestiona el estado de la paginación a través
 * de señales y la URL. Sincroniza la página y el tamaño de la página con los
 * query parameters de la URL para crear una navegación robusta.
 */
@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  /**
   * Propiedad privada para el tamaño de página por defecto.
   * Esto elimina los "números mágicos" del código.
   */
  private readonly DEFAULT_PAGE_SIZE = 10;

  /**
   * Señal que almacena el total de páginas disponibles.
   * Se actualiza con el valor devuelto por la API.
   */
  totalPages = signal(0);

  /**
   * Señal que obtiene la página actual de la URL.
   * Por defecto es 1 si el parámetro 'page' no existe, no es un número o es negativo.
   */
  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((params) => {
        const page = params.get('page') ? +params.get('page')! : 1;
        if (isNaN(page) || page <= 0) {
          console.warn('URL: El parámetro "page" es inválido. Redirigiendo a la página 1.');
          return 1;
        }
        return page;
      })
    ),
    {
      initialValue: 1,
    }
  );

  /**
   * Señal que obtiene el tamaño de la página (productos por página) de la URL.
   * Por defecto es 10 si el parámetro 'pageSize' no existe, no es un número o es negativo.
   */
  productsPerPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((params) => {
        const size = params.get('pageSize') ? +params.get('pageSize')! : this.DEFAULT_PAGE_SIZE;
        if (isNaN(size) || size <= 0) {
          console.warn(`URL: El parámetro "pageSize" es inválido. Redirigiendo al tamaño por defecto de ${this.DEFAULT_PAGE_SIZE}.`);
          return this.DEFAULT_PAGE_SIZE;
        }
        return size;
      })
    ),
    {
      initialValue: this.DEFAULT_PAGE_SIZE,
    }
  );

  /**
   * Este effect actúa como un guardián de la URL.
   * Redirige automáticamente a una URL limpia si detecta valores
   * inválidos (no numéricos o negativos) en los parámetros de la URL.
   */
  private autoRedirect = effect(() => {
    const currentPageValue = this.currentPage();
    const productsPerPageValue = this.productsPerPage();

    const pageInUrl = this.activatedRoute.snapshot.queryParamMap.get('page');
    const pageSizeInUrl = this.activatedRoute.snapshot.queryParamMap.get('pageSize');

    if (
      (pageInUrl !== null && isNaN(+pageInUrl)) ||
      (pageInUrl !== null && +pageInUrl <= 0) ||
      (pageSizeInUrl !== null && isNaN(+pageSizeInUrl)) ||
      (pageSizeInUrl !== null && +pageSizeInUrl <= 0)
    ) {
      this.updatePagination(currentPageValue, productsPerPageValue);
    }
  });

  /**
   * Actualiza el total de páginas.
   * @param pages El número total de páginas.
   */
  setTotalPages(pages: number): void {
    this.totalPages.set(pages);
  }

  /**
   * Actualiza la URL con los nuevos parámetros de paginación.
   * Esto dispara el flujo de datos que actualiza la lista de productos.
   * @param page El número de página a navegar.
   * @param pageSize El tamaño de la página a utilizar.
   */
  updatePagination(page: number, pageSize: number): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page, pageSize },
      queryParamsHandling: 'merge',
    });
  }
}
