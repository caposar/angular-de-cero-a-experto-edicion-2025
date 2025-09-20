import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '@products//components/product-card/product-card.component';
import { ProductsService } from '@products//services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  // activatedRoute = inject(ActivatedRoute);

  // currentPage = toSignal(
  //   this.activatedRoute.queryParamMap.pipe(
  //     map((params) => (params.get('page') ? +params.get('page')! : 1)),
  //     map((page) => (isNaN(page) ? 1 : page))
  //   ),
  //   {
  //     initialValue: 1,
  //   }
  // );

  products = computed(() => this.productsResource.value()?.products);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      productsPerPage: this.paginationService.productsPerPage(),
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        limit: request.productsPerPage,
        offset: request.page * request.productsPerPage,
      });
    },
  });
}
