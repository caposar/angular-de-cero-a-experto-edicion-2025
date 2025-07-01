import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();
    const url = `${API_URL}/capital/${query}`;
    return this.http.get<RESTCountry[]>(url)
      .pipe(
        map(resp => CountryMapper.toCountries(resp)),
        delay(3000), // Borrar, esta linea solo se usa para pruebas
        // catchError(error => {
        //   console.log('Error fetching:', error);
        //   return throwError(() => new Error(`No se pudo obtener países con ese query ${query}`));
        // })
        catchError(this.handleError(query, 'searchByCapital'))
      );
  }

  searchByCountry(query: string): Observable<Country[]> {
    query = query.toLowerCase();
    const url = `${API_URL}/name/${query}`;
    return this.http.get<RESTCountry[]>(url)
      .pipe(
        map(resp => CountryMapper.toCountries(resp)),
        delay(3000), // Borrar, esta linea solo se usa para pruebas
        catchError(this.handleError(query, 'searchByCountry'))
      );
  }

  searchByRegion(query: string): Observable<Country[]> {
    query = query.toLowerCase();
    const url = `${API_URL}/region/${query}`;
    return this.http.get<RESTCountry[]>(url)
      .pipe(
        map(resp => CountryMapper.toCountries(resp)),
        catchError(this.handleError(query, 'searchByRegion'))
      );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | undefined> {
    const url = `${API_URL}/alpha/${code}`;
    return this.http.get<RESTCountry[]>(url)
      .pipe(
        map(resp => CountryMapper.toCountries(resp)),
        map(countries => countries.at(0)),
        delay(3000), // Borrar, esta linea solo se usa para pruebas
        catchError(error => {
          console.log('Error fetching:', error);
          return throwError(() => new Error(`No se pudo obtener países con ese código ${code}`));
        })
      );
  }

  private handleError(query: string, operation: string) {
    return (error: any) => {
      // Puedes usar un servicio de notificaciones aquí
      console.error(`${operation} failed:`, error);
      return throwError(() => new Error(`No se pudo obtener países con ese query ${query}`));
    };
  }
}
