import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {

  transform(value: null | string | string[]): string {

    if (value === null) {
      return 'assets/images/no-image.jpg';
    }

    if (typeof value === 'string') {
      if (value.includes('blob')) {
        return value;
      }
      return `${baseUrl}/files/product/${value}`;
    }

    const image = value.at(0);

    if (image) {
      if (image.includes('blob')) {
        return image;
      }
      return `${baseUrl}/files/product/${image}`;
    }

    return 'assets/images/no-image.jpg';
  }

}
