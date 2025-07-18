import { Pipe, type PipeTransform } from '@angular/core';
import { Creator } from 'app/interfaces/hero.interface';

@Pipe({
  name: 'heroCreator',
})
export class HeroCreatorPipe implements PipeTransform {

  transform(value: Creator): string | undefined {
    return Creator[value] || 'Unknown Creator';
  }

}
