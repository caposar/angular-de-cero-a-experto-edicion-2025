import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTableComponent } from '@products//components/product-table/product-table.component';
import { ProductsService } from '@products//services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  products = computed(() => this.productsResource.value()?.products);
  // productsPerPage = signal(10);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      // productsPerPage: this.productsPerPage(),
      productsPerPage: this.paginationService.productsPerPage(),
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        // offset: request.page * 9,
        offset: request.page * request.productsPerPage,
        limit: request.productsPerPage,
      });
    },
  });

  // Este efecto actualiza el total de páginas de manera segura.
  // Evita el "flicker" asegurando que solo se le pase un valor al servicio
  // cuando la data ya no está en estado de carga.
  private updatePaginationPages = effect(() => {
    if (!this.productsResource.isLoading()) {
      const pages = this.productsResource.value()?.pages ?? 0;
      this.paginationService.setTotalPages(pages);
    }
  });

  setPageSize(pageSize: number) {
    // Al cambiar el tamaño de la página, volvemos a la página 1.
    this.paginationService.updatePagination(1, pageSize);
  }
}
