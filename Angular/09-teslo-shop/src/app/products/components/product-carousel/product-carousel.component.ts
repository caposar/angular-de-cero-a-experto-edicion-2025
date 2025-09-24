import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';
// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '../../pipes/product-image.pipe';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styles: `
    .swiper {
      width: 100%;
      height: 500px;
    }

  `,
})
export class ProductCarouselComponent implements AfterViewInit, OnDestroy {
  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  private swiperInstance: Swiper | null = null;

  private imagesEffect = effect(() => {
    // Escucha la señal 'images' para forzar la reactividad.
    const currentImages = this.images();

    // Si la instancia ya existe, la destruimos para recrearla.
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }

    // Usamos una microtarea para esperar a que Angular actualice el DOM.
    // Luego inicializamos Swiper.
    queueMicrotask(() => {
      this.swiperInit();
    });
  });

  ngAfterViewInit(): void {
    // La inicialización inicial se maneja en el `effect`.
  }

  private swiperInit() {
    if (this.swiperInstance) return;

    const element = this.swiperDiv().nativeElement;
    if (!element) return;

    this.swiperInstance = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: this.images().length > 1,
      grabCursor: this.images().length > 1,
      // configure Swiper to use modules
      modules: [Navigation, Pagination],
      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }

  ngOnDestroy(): void {
    this.swiperInstance?.destroy(true, true);
  }
}
