import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<string, Country[]>();

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    if (this.queryCacheCapital.has(query)) {
      const cached = this.queryCacheCapital.get(query);
      return of(cached ?? []);
    }

    const url = `${API_URL}/capital/${query}`;
    return this.http.get<RESTCountry[]>(url).pipe(
      map((resp) => CountryMapper.toCountries(resp)),
      tap((countries) => this.queryCacheCapital.set(query, countries)),
      catchError(this.handleError(query, 'searchByCapital'))
    );
  }

  searchByCountry(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    if (this.queryCacheCountry.has(query)) {
      const cached = this.queryCacheCountry.get(query);
      return of(cached ?? []);
    }

    console.log(`Llegando al servidor por ${query}`);

    const url = `${API_URL}/name/${query}`;
    return this.http.get<RESTCountry[]>(url).pipe(
      map((resp) => CountryMapper.toCountries(resp)),
      tap((countries) => this.queryCacheCountry.set(query, countries)),
      catchError(this.handleError(query, 'searchByCountry'))
    );
  }

  searchByRegion(region: string): Observable<Country[]> {
    if (this.queryCacheRegion.has(region)) {
      const cached = this.queryCacheRegion.get(region);
      return of(cached ?? []);
    }

    console.log(`Llegando al servidor por ${region}`);

    const url = `${API_URL}/region/${region}`;
    return this.http.get<RESTCountry[]>(url).pipe(
      map((resp) => CountryMapper.toCountries(resp)),
      tap((countries) => this.queryCacheRegion.set(region, countries)),
      catchError((error) => {
        console.log('Error fetching:', error);
        return throwError(
          () => new Error(`No se pudo obtener países con esa region ${region}`)
        );
      })
    );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | undefined> {
    const url = `${API_URL}/alpha/${code}`;
    return this.http.get<RESTCountry[]>(url).pipe(
      map((resp) => CountryMapper.toCountries(resp)),
      map((countries) => countries.at(0)),
      catchError((error) => {
        console.log('Error fetching:', error);
        return throwError(
          () => new Error(`No se pudo obtener países con ese código ${code}`)
        );
      })
    );
  }

  private handleError(query: string, operation: string) {
    return (error: any) => {
      // Puedes usar un servicio de notificaciones aquí
      console.error(`${operation} failed:`, error);
      return throwError(
        () => new Error(`No se pudo obtener países con ese query ${query}`)
      );
    };
  }
}
