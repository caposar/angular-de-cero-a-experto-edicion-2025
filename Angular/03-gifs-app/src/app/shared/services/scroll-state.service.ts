import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollStateService {

  trendingScrollPosition = signal<number>(0);

  // pageScrollPosition: Record<string, number> = {
  //   'page1': 0,
  //   'page2': 0,
  //   'aboutPage': 0,
  //   'page20': 0,
  // }
}
