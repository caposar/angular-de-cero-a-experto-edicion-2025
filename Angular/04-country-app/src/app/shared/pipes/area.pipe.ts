import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'area'
})

export class AreaPipe implements PipeTransform {
  transform(value: number, locale: string = 'es-AR', useMillions: boolean = false): string {
    if (useMillions && value >= 1_000_000) {
      const millones = value / 1_000_000;
      const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(millones);
      return `${formatted} millones km²`;
    }

    const formatted = new Intl.NumberFormat(locale).format(value);
    return `${formatted} km²`;
  }
}
