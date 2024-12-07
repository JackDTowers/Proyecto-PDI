import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';
import { MyErrorStateMatcher } from '../crear-usuario/crear-usuario.component';
import { FormIndicadorPlanComponent } from '../form-indicador-plan/form-indicador-plan.component';
import { ContainerpdiDirective } from 'src/app/directives/containerpdi.directive';
import { Objetivo } from 'src/app/models/objetivo';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-crear-plan',
  templateUrl: './crear-plan.component.html',
  styleUrls: ['./crear-plan.component.css']
})
export class CrearPlanComponent{
  titulo = 'Creación Plan de Acción';
  id: string | null;
  planForm : FormGroup
  usuarios : User[] = []
  objetivos : Objetivo[] = []
  matcher = new MyErrorStateMatcher();
  @ViewChild('actContainer', {read: ViewContainerRef, static: true}) actContainerr!: ViewContainerRef;

  get indicadores() {
    return this.planForm.controls["indicadores"] as FormArray<FormGroup>;
  }

  get actividades() {
    return this.planForm.controls["actividades"] as FormArray<FormGroup>;
  }

  constructor( 
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router: Router,
    private pdiService: PdiService,
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
      ini_ind: ['', Validators.required],
      fin_ind: ['', Validators.required],
      ini_act: ['', Validators.required],
      fin_act: ['', Validators.required],
      indicadores: this.formBuilder.array([]),
      actividades: this.formBuilder.array([]),
    })
    this.id = this.aRouter.snapshot.paramMap.get('id')
    this.pdiService.getUsuarios().subscribe((users) => {
      this.usuarios = users;
    })
    this.pdiService.getObjetivos().subscribe((objetivos) => {
      this.objetivos = objetivos;
    })
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

  agregarIndicador(){
    const indicadorForm = this.formBuilder.group({
      dindicador_plan: ['', Validators.required],
      dformula: ['', Validators.required],
      dmeta: ['', Validators.required],
      dini_ind: ['', Validators.required],
      dfin_ind: ['', Validators.required],
    })
    this.indicadores.push(indicadorForm);
  }

  agregarActividad(){
    const actividadForm = this.formBuilder.group({
      dresponsable: ['', Validators.required],
      dplazo: ['', Validators.required],
      dactividad: ['', Validators.required],
      dini_act: ['', Validators.required],
      dfin_act: ['', Validators.required],
    })
    this.actividades.push(actividadForm);
  }

  eliminarIndicador(indicadorIndex: number) {
    this.indicadores.removeAt(indicadorIndex);
  }

  eliminarActividad(actividadIndex: number) {
    this.actividades.removeAt(actividadIndex);
  }


  cargarComponente() {
    if (this.actContainerr){
      const viewContainerRef = this.actContainerr;
      //viewContainerRef.clear();  // Limpia cualquier componente previo
      viewContainerRef.createComponent(FormIndicadorPlanComponent);  // Carga el componente
      
    }
  }

}
