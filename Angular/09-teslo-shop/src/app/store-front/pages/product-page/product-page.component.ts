import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products//services/products.service';
import { ProductCarouselComponent } from "../../../products/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  productsServise = inject(ProductsService);
  private activatedRoute = inject(ActivatedRoute);

  productIdSlug = this.activatedRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    request: () => ({isSlug: this.productIdSlug}),
    loader: ({request}) => {
      return this.productsServise.getProductByIdSlug(request.isSlug);
    }
  });

  product = computed(() => this.productResource.value());
}
