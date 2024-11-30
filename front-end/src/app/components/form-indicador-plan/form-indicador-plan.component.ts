import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';
import { MyErrorStateMatcher } from '../crear-usuario/crear-usuario.component';

@Component({
  selector: 'app-form-indicador-plan',
  templateUrl: './form-indicador-plan.component.html',
  styleUrls: ['./form-indicador-plan.component.css']
})
export class FormIndicadorPlanComponent {
  @Input() esIndicador = true;
  planForm : FormGroup;
  matcher = new MyErrorStateMatcher();
  inputLabel1 = "indicador de cumplimiento";
  inputLabel2 = "formula";
  inputLabel3 = "meta/plazo";
  errorLabel1 = "El indicador de cumplimiento es requerido";
  errorLabel2 = "La fórmula es requerida";
  errorLabel3 = "La meta o plazo es requerido";

  constructor( 
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router: Router,
    private pdiService: PdiService
  ) {
    this.planForm = this.formBuilder.group({
      indicador_plan: ['', Validators.required],
      formula: ['', Validators.required],
      meta: ['', Validators.required],
      responsable: ['', Validators.required],
      plazo: ['', Validators.required],
      actividad: ['', Validators.required],
      carrera: ['', Validators.required],
      ini_ind: ['', Validators.required],
      fin_ind: ['', Validators.required],
      ini_act: ['', Validators.required],
      fin_act: ['', Validators.required],
    })

  }

  ngOnInit(): void{
    this.esIndicadorr();
  }

  esIndicadorr(){
    if (this.esIndicador == false){
      this.inputLabel1 = "nombre de actividad"
      this.inputLabel2 = "responsable"
      this.inputLabel3 = "plazo"
      this.errorLabel1 = "El nombre de actividad es requerido"
      this.errorLabel2 = "El responsable es requerido"
      this.errorLabel3 = "El plazo es requerido"
    }
  }

}
