import { Component, signal } from '@angular/core';
import { heroes } from 'app/data/heroes.data';
import { CanFlyPipe } from 'app/pipes/can-fly.pipe';
import { HeroColorPipe } from 'app/pipes/hero-color.pipe';
import { ToggleCasePipe } from 'app/pipes/toggle-case.pipe';
import { ColorMap, Color, Hero } from 'app/interfaces/hero.interface';
import { HeroTextColorPipe } from 'app/pipes/hero-text-color.pipe';
import { TitleCasePipe } from '@angular/common';
import { HeroCreatorPipe } from 'app/pipes/hero-creator.pipe';
import { HeroSortByPipe } from 'app/pipes/hero-sort-by.pipe';
import { HeroFilterPipe } from 'app/pipes/hero-filter.pipe';

@Component({
  selector: 'app-custom-page',
  imports: [
    ToggleCasePipe,
    CanFlyPipe,
    HeroColorPipe,
    HeroTextColorPipe,
    TitleCasePipe,
    HeroCreatorPipe,
    HeroSortByPipe,
    HeroFilterPipe,
  ],
  templateUrl: './custom-page.component.html',
})
export class CustomPageComponent {
  name = signal<string>('Cesar Paredes');

  upperCase = signal<boolean>(true);

  onToggle() {
    this.upperCase.set(!this.upperCase());
  }

  heroes = signal(heroes);

  readonly sortBy = signal<keyof Hero | null>(null);
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  searchQuery = signal<string>('');

  // colorTexto(colorNum: Color): string | undefined {
  //   if (colorNum in ColorMap) {
  //     return ColorMap[colorNum];
  //   }
  //   return undefined;
  // }

  // colorTexto(colorNum: Color): string | undefined {
  //   return ColorMap[colorNum];
  // }
}
