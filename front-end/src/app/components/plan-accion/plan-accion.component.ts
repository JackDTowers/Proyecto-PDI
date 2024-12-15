import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanDeAccion } from 'src/app/models/plan';
import { PdiService } from 'src/app/services/pdi.service';

@Component({
  selector: 'app-plan-accion',
  templateUrl: './plan-accion.component.html',
  styleUrls: ['./plan-accion.component.css']
})
export class PlanAccionComponent {
  id: string | null;
  plan: PlanDeAccion | null = null;

  constructor(
    private aRouter: ActivatedRoute,
    private pdiService: PdiService,
  ){
    this.id = this.aRouter.snapshot.paramMap.get('id');
    const parsedId = parseInt(this.id!);
    this.pdiService.getPlan(parsedId).subscribe((plan) => {
      this.plan = plan
    })
  }
}
