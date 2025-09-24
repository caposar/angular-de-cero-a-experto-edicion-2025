import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarouselComponent } from '@products//components/product-carousel/product-carousel.component';
import { firstValueFrom } from 'rxjs';

import { Product } from '@products//interfaces/product.interface';
import { FormUtils } from '@utils/form-utils';
import { ProductsService } from '@products//services/products.service';

import { FormErrorLabelComponent } from '../../../../shared/components/form-error-label/form-error-label.component';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/components/toast/toast.service';

@Component({
  selector: 'product-details',
  imports: [
    ProductCarouselComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();

  imagesToCarrousel = computed<string[]>(() => {
    const allImages = [...this.product().images, ...this.tempImages()];

    return allImages;
  });

  router = inject(Router);
  fb = inject(FormBuilder);
  private toast = inject(ToastService);
  toastMessage = signal('');

  productsService = inject(ProductsService);
  wasSaved = signal(false);

  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
    // this.productForm.patchValue(formLike as any);
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };

    if (this.product().id === 'new') {
      // Crear Producto
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike, this.imageFileList)
      );

      this.router.navigate(['/admin/products', product.id]);

      // this.showToast('Producto creado correctamente'); // NO MUESTRA ESTE MENSAJE PORQUE EL COMPONENTE SE DESTRUYE LUEGO DE LA REDIRECCION. EL ALERT DEL MENSAJE DEBERIA ESTAR EN EL COMPONENTE PADRE
      this.toast.show('Producto creado correctamente', 'success');
    } else {
      // Actualizar Producto
      await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike, this.imageFileList)
      );

      // this.showToast('Datos actualizados correctamente');
      this.toast.show('Datos actualizados correctamente', 'success');
    }
  }

  async eliminarProducto() {
    try {
      await firstValueFrom(
        this.productsService.deleteProduct(this.product().id)
      );

      this.router.navigateByUrl('/admin/products');
      this.toast.show('Producto eliminado correctamente', 'success');
    } catch (error) {
      console.error(error);
      this.toast.show('Error al eliminar el producto', 'error');
    }
  }

  showToast(mensaje: string, delay: number = 3000) {
    this.toastMessage.set(mensaje);
    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, delay);
  }

  // Images
  onFilesChanged(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;

    const imageUrls = Array.from(fileList ?? []).map((file) =>
      URL.createObjectURL(file)
    );

    this.tempImages.set(imageUrls);
  }
}
