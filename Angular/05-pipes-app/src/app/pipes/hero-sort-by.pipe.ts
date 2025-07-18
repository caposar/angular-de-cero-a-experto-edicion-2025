import { Pipe, type PipeTransform } from '@angular/core';
import { Hero } from 'app/interfaces/hero.interface';

@Pipe({
  name: 'heroSortBy',
})
export class HeroSortByPipe implements PipeTransform {
  // Versión 1 - Simple, sin control de dirección
  // Ordena por campo indicado, siempre de forma ascendente.
  // Ventaja: Muy clara, pero limitada.
  // Desventaja: No permite ordenar descendente.
  // transform(value: Hero[], sortBy: keyof Hero | null): Hero[] {
  //   if (!sortBy) return value;

  //   switch (sortBy) {
  //     case 'name':
  //       return [...value].sort((a, b) => a.name.localeCompare(b.name));
  //     case 'canFly':
  //       return [...value].sort((a, b) => Number(a.canFly) - Number(b.canFly));
  //     case 'color':
  //       return [...value].sort((a, b) => a.color - b.color);
  //     case 'creator':
  //       return [...value].sort((a, b) => a.creator - b.creator);
  //     default:
  //       return value;
  //   }
  // }

  // Versión 2 - Usa sort + reverse
  // Ordena ascendente, y luego revierte si se pide descendente.
  // Ventaja: Más simple que la siguiente.
  // Desventaja: Menos eficiente porque hace 2 pasos: sort + reverse.
  // transform(
  //   value: Hero[],
  //   sortBy: keyof Hero | null,
  //   direction: 'asc' | 'desc' = 'asc'
  // ): Hero[] {
  //   if (!sortBy) return value;

  //   const sorted = [...value].sort((a, b) => {
  //     switch (sortBy) {
  //       case 'name':
  //         return a.name.localeCompare(b.name);
  //       case 'canFly':
  //         return Number(a.canFly) - Number(b.canFly);
  //       case 'color':
  //         return a.color - b.color;
  //       case 'creator':
  //         return a.creator - b.creator;
  //       default:
  //         return 0;
  //     }
  //   });

  //   return direction === 'desc' ? sorted.reverse() : sorted;
  // }

  // Versión 3 - Usa multiplicador para dirección
  // Ordena en una sola pasada usando un factor (+1 o -1).
  // Ventaja: Más eficiente que la anterior (una sola operación sort).
  // Dessventaja: Un poco más compleja visualmente.
  transform(
    value: Hero[],
    sortBy: keyof Hero | null,
    direction: 'asc' | 'desc' = 'asc' // Valor por defecto: ascendente
  ): Hero[] {
    // Si no se proporciona campo de ordenamiento, se retorna el array original
    if (!sortBy) return value;

    // Multiplicador según la dirección: 1 para ascendente, -1 para descendente
    const directionMultiplier = direction === 'asc' ? 1 : -1;

    // Declaramos la función comparadora que se definirá según el campo
    let compareFn: (a: Hero, b: Hero) => number;

    // Elegimos el campo por el cual ordenar y asignamos la función adecuada
    switch (sortBy) {
      case 'name':
        // Para strings usamos localeCompare para orden alfabético
        compareFn = (a, b) => a.name.localeCompare(b.name);
        break;
      case 'canFly':
        // Para booleans se convierten a 0 (false) y 1 (true)
        compareFn = (a, b) => Number(a.canFly) - Number(b.canFly);
        break;
      case 'color':
        // color es un enum, se ordena por su valor numérico
        compareFn = (a, b) => a.color - b.color;
        break;
      case 'creator':
        // creator también es un enum (DC o Marvel), mismo tratamiento
        compareFn = (a, b) => a.creator - b.creator;
        break;
      default:
        // Si el campo no es reconocido, se retorna el array original
        return value;
    }

    // Se retorna una copia del array ordenado aplicando el comparador
    // multiplicado por la dirección (1 o -1) para asc o desc
    return [...value].sort((a, b) => compareFn(a, b) * directionMultiplier);
  }
}
