import { Pipe, PipeTransform } from '@angular/core';
//New line to br
@Pipe({
  name: 'pipeNewLine'
})
export class PipeNewLinePipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/\n/g, '<br/>');
  }

}