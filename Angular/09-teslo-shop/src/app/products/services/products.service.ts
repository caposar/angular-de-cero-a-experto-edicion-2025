import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import { User } from '@auth/interfaces/user.interface';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 10, offset = 0, gender = '' } = options;

    console.log(this.productsCache.entries());

    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.productsCache.set(key, resp))
      );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
      tap((resp) => console.log(resp)),
      tap((product) => this.productCache.set(idSlug, product))
    );
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProduct);
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      tap((resp) => console.log(resp)),
      tap((product) => this.productCache.set(id, product))
    );
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...productLike,
        images: [...currentImages, ...imageNames],
      })),
      switchMap((updatedProduct) =>
        this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
      ),
      tap((product) => this.updateProductCache(product))
    );
  }

  createProduct(
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {

    return this.uploadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...productLike,
        images: [...imageNames],
      })),
      switchMap((newProduct) =>
        this.http.post<Product>(`${baseUrl}/products`, newProduct)
      ),
      tap((product) => this.addProductToCache(product))
    );
  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach((productsResponse) => {
      productsResponse.products = productsResponse.products.map(
        (currentProduct) => {
          return currentProduct.id === productId ? product : currentProduct;
        }
      );
    });

    console.log('Caché de producto individual y de listas actualizados');
  }

  private addProductToCache(product: Product) {
    this.productCache.set(product.id, product);
    this.productsCache.clear();
    console.log(
      'Nuevo producto agregado al cache individual y caché de listas borrado'
    );
  }

  // Tome un FileList y lo suba
  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFile) =>
      this.uploadImage(imageFile)
    );

    return forkJoin(uploadObservables).pipe(
      tap((imageNames) => console.log({ imageNames }))
    );
  }

  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http
      .post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(map((resp) => resp.fileName));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/products/${id}`).pipe(
      tap((resp) => console.log(resp)),
      tap((product) => this.removeProductFromCache(id))
    );
  }

  private removeProductFromCache(id: string) {
    // // 1. Eliminar del caché de productos individuales
    // this.productCache.delete(id);

    // // 2. Eliminar de las listas de productos en el caché
    // // Recorre todos los "pages" o "listas" que están en el caché de listas.
    // this.productsCache.forEach((productsResponse) => {
    //   // Filtra el array de productos para crear uno nuevo sin el producto eliminado.
    //   productsResponse.products = productsResponse.products.filter(
    //     (product) => product.id !== id
    //   );
    // });

    // console.log('Producto eliminado de los cachés individual y de listas.');

    this.productCache.clear();
    this.productsCache.clear();
    console.log('Todos los cachés de productos han sido limpiados.');
  }
}
