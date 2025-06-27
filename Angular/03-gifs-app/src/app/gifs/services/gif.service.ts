import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';

// {
//   'goku': [gif1,gif2,gif3],
//   'saitama': [gif1,gif2,gif3],
//   'dragon ball': [gif1,gif2,gif3],
// }

// record<string, Gif[]>


@Injectable({
  providedIn: 'root'
})
export class GifService {

  private readonly STORAGE_KEY = 'history-gifs';
  private http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  trendingGifs = signal<Gif[]>([]); // [gif,gif,gif,gif,gif,gif,...] Default gallery
  trendingGifsLoading = signal<boolean>(false);
  private trendingPage = signal<number>(0);

  // [[gif,gif,gif],[gif,gif,gif],[gif,gif,gif],...]] Masonry grid
  trendingGifGroup = computed(() => {
    const gifs = this.trendingGifs();
    const groupSize = 3; // Number of gifs per group
    const groups: Gif[][] = [];
    for (let i = 0; i < gifs.length; i += groupSize) {
      groups.push(gifs.slice(i, i + groupSize));
    }

    return groups;
  });

  searchHistory = signal<Record<string, Gif[]>>(
    this.storage.getItem<Record<string, Gif[]>>(this.STORAGE_KEY) ?? {}
  );
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  private readonly saveToLocalStorage = effect(() => {
    const historyGifs = this.searchHistory();
    this.storage.setItem(this.STORAGE_KEY, historyGifs);
  });

  loadTrendingGifs() {

    if (this.trendingGifsLoading()) {
      return; // Already loading or loaded
    }

    this.trendingGifsLoading.set(true);


    const url = `${environment.giphyUrl}/gifs/trending`;
    return this.http.get<GiphyResponse>(url, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        offset: this.trendingPage() * 20,
        rating: 'g'
      }
    }).subscribe((resp)=> {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      // this.trendingGifs.set(gifs);
      this.trendingGifs.update((currentGifs) => [...currentGifs, ...gifs]);
      this.trendingPage.update((page) => page + 1);
      this.trendingGifsLoading.set(false);
    });
  }

  searchGifs(query: string): Observable<Gif[]> {
    const url = `${environment.giphyUrl}/gifs/search`;
    return this.http.get<GiphyResponse>(url, {
      params: {
        api_key: environment.giphyApiKey,
        q: query,
        limit: 20,
        rating: 'g'
      }
    })
    .pipe(
      map(({data}) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

      // Historial
      tap((items) => {
        this.searchHistory.update((history) => ({
          ...history,
          [query.toLowerCase()]: items
        }));
      })
    );

    // .subscribe((resp)=> {
    //   const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
    //   console.log('Mapped Gifs:', gifs);
    // });
  }

  getHistroyGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
