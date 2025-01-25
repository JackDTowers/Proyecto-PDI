import { Pipe, PipeTransform } from '@angular/core';

const esNumerico = (cadena: string): boolean => {
  return !isNaN(parseFloat(cadena)) && isFinite(Number(cadena));
};

@Pipe({
  name: 'percent'
})
export class PercentPipe implements PipeTransform {

  transform(value: string): string {
    if (esNumerico(value) && !value.includes('%')){
      return value + '%';
    }
    return value;
  }

}
