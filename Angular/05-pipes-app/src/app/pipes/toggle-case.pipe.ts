import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toggleCase' // 'Fernando' | toggleCase
})

export class ToggleCasePipe implements PipeTransform {
  transform(value: string, upper: boolean = true): string {
    return upper == true ? value.toLocaleUpperCase() : value.toLocaleLowerCase();
  }
}
