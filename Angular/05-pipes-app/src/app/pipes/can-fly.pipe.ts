import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'canfly',
})
export class CanFlyPipe implements PipeTransform {

  transform(value: boolean): 'Puede volar' | 'No puede volar' {
    return value ? 'Puede volar' : 'No puede volar';
  }

}
