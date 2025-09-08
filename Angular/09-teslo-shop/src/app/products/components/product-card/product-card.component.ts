import { SlicePipe } from '@angular/common';
import { Component, computed, input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products//interfaces/product.interface';
import { ProductImagePipe } from "../../pipes/product-image.pipe";

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  product = input.required<Product>();

  // public imageUrl: Signal<string> = computed(() => {
  //   const images = this.product().images;
  //   if (!images || images.length === 0) {
  //     return 'assets/images/placeholder.svg';
  //   }

  //   const imageName = images[0];
  //   return `http://localhost:3000/api/files/product/${imageName}`;
  // });
}
