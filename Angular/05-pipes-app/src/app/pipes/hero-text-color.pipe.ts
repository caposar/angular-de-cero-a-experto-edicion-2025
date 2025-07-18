import { Pipe, type PipeTransform } from '@angular/core';
import { Color, ColorMap } from 'app/interfaces/hero.interface';

@Pipe({
  name: 'heroTextColor',
})
export class HeroTextColorPipe implements PipeTransform {

  transform(value: Color): string | undefined {
    return ColorMap[value];
  }

}
