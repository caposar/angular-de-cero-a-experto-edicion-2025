import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, combineLatest, forkJoin, Observable, of, tap, throwError } from 'rxjs';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private baseUrl = 'https://restcountries.com/v3.1';
  private http = inject(HttpClient);

  private _regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  /**
   * @description Devuelve una copia del array de regiones disponibles.
   * @returns {string[]} Un array de cadenas con los nombres de las regiones.
   */
  get regions(): string[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: string): Observable<Country[]> {
    if (!region) return of([]);
    console.log('Request getCountriesByRegion: ', region);
    const url = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;
    return this.http.get<Country[]>(url).pipe(
      tap((countries) => console.log('Response getCountriesByRegion: ', countries)),
      catchError((error) => {
        console.log('Error fetching:', error);
        return throwError(
          () => new Error(`No se pudo obtener países con esa region ${region}`)
        );
      })
    );
  }

  getCountryByAlphaCode(alphaCode: string): Observable<Country> {
    if (!alphaCode) return of();
    console.log('Request getCountryByAlphaCode', alphaCode);
    const url = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;
    return this.http.get<Country>(url).pipe(
      tap((countries) => console.log('Response getCountryByAlphaCode: ', countries)),
      catchError((error) => {
        console.log('Error fetching:', error);
        return throwError(
          () => new Error(`No se pudo obtener países con ese codigo ${alphaCode}`)
        );
      })
    );
  }

  getCountryNamesByCodeArray(countryCodes: string[]): Observable<Country[]> {
    if (!countryCodes || countryCodes.length === 0) return of([]);
    console.log('Request getCountryNamesByCodeArray: ', countryCodes);

    const countriesRequests: Observable<Country>[] = [];

    countryCodes.forEach( code => {
      const request = this.getCountryByAlphaCode(code);
      countriesRequests.push(request);
    });

    return combineLatest(countriesRequests).pipe(
      tap((countries) => console.log('Response getCountryNamesByCodeArray: ', countries)),
      catchError((error) => {
        console.log('Error fetching:', error);
        return throwError(
          () => new Error(`No se pudo obtener países con ese codigo ${countryCodes}`)
        );
      })
    );
  }

  getCountryBorderByCodes(bordersCodes: string[]): Observable<Country[]> {
    if (!bordersCodes || bordersCodes.length === 0) return of([]);
    console.log('Request getCountryBorderByCodes: ', bordersCodes);

    const requests: Observable<Country>[] = bordersCodes.map(code =>
      this.getCountryByAlphaCode(code)
    );

    return forkJoin(requests).pipe(
      tap(countries => console.log('Response getCountryBorderByCodes: ', countries)),
      catchError(error => {
        console.error('Error fetching:', error);
        return throwError(() => new Error(`No se pudo obtener países con estos códigos: ${bordersCodes}`));
      })
    );
  }

}
