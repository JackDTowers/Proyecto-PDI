import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ContainerPdi]'
})
export class ContainerpdiDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
