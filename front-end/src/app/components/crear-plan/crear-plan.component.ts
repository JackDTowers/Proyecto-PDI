import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';
import { MyErrorStateMatcher } from '../crear-usuario/crear-usuario.component';

@Component({
  selector: 'app-crear-plan',
  templateUrl: './crear-plan.component.html',
  styleUrls: ['./crear-plan.component.css']
})
export class CrearPlanComponent {
  titulo = 'Creación Plan de Acción';
  id: string | null;
  planForm : FormGroup
  objetivos = []
  matcher = new MyErrorStateMatcher();

  constructor( 
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router: Router,
    private pdiService: PdiService
  ) {
    this.planForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      responsable_plan: ['', Validators.required],
      objetivo: ['', Validators.required],
      indicador_plan: ['', Validators.required],
      formula: ['', Validators.required],
      meta: ['', Validators.required],
      responsable: ['', Validators.required],
      plazo: ['', Validators.required],
      actividad: ['', Validators.required],
      carrera: ['', Validators.required],
    })
    this.id = this.aRouter.snapshot.paramMap.get('id')
  }

  ngOnInit(): void{
    this.esEditar();
  }

  ingresar(){

  }

  esEditar(){
    if (this.id != null){
      this.titulo = "Edición Plan de Acción"
    }
  }

}
