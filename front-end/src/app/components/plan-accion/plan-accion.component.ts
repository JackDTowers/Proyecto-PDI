import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanDeAccion } from 'src/app/models/plan';
import { PdiService } from 'src/app/services/pdi.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-plan-accion',
  templateUrl: './plan-accion.component.html',
  styleUrls: ['./plan-accion.component.css']
})
export class PlanAccionComponent {
  id: string | null;
  plan: PlanDeAccion | null = null;
  obsForm : FormGroup
  isLoggedAdmin = false;
  isOwner = false;
  editingObs = false;
  fetching = false;

  constructor(
    private aRouter: ActivatedRoute,
    private pdiService: PdiService,
    private formBuilder: FormBuilder,
  ){
    this.id = this.aRouter.snapshot.paramMap.get('id');
    const parsedId = parseInt(this.id!);
    this.pdiService.getPlan(parsedId).subscribe((plan) => {
      this.plan = plan
      if (this.plan.user_id){
        this.isOwner = this.pdiService.isOwner(this.plan.user_id);
      }
      this.isLoggedAdmin = this.pdiService.isAdmin();
    })
    this.obsForm = this.formBuilder.group({
      observaciones: [''],
    })
  }

  addObs(){
    this.editingObs = true;
    this.obsForm.setValue({observaciones: this.plan?.observaciones});
  }

  saveObs(){
    this.fetching = true;
    this.obsForm.disable();
    this.obsForm.updateValueAndValidity();
    this.pdiService.editarObservaciones( parseInt(this.id!), this.obsForm.value.observaciones).subscribe(() => {
      this.pdiService.getPlan(parseInt(this.id!)).subscribe((plan) => {
        this.plan = plan;
        this.editingObs = false;
        this.fetching = false;
        this.obsForm.enable();
      })
    })
  }

  cancelObs(){
    this.editingObs = false;
  }
}
