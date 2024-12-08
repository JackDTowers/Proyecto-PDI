import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';
import { MyErrorStateMatcher } from '../crear-usuario/crear-usuario.component';
import { FormIndicadorPlanComponent } from '../form-indicador-plan/form-indicador-plan.component';
import { ContainerpdiDirective } from 'src/app/directives/containerpdi.directive';
import { Objetivo } from 'src/app/models/objetivo';
import { User } from 'src/app/models/user';
import { PlanDeAccion } from 'src/app/models/plan';
import { IndicadorPlan } from 'src/app/models/indicadorplan';
import { Actividad } from 'src/app/models/actividad';

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
      codigo_obj: ['', Validators.required],
      objetivo: ['', Validators.required],
      indicador_plan: ['', Validators.required],
      formula: ['', Validators.required],
      meta: ['', Validators.required],
      responsable: ['', Validators.required],
      plazo: ['', Validators.required],
      actividad: ['', Validators.required],
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
    // Sincronizar selects
    this.planForm.get('codigo_obj')?.valueChanges.subscribe(codigo => {
      this.actualizarNombrePorCodigo(codigo);
    });

    this.planForm.get('objetivo')?.valueChanges.subscribe(nombre => {
      this.actualizarCodigoPorNombre(nombre);
    });
  }

  ingresar(){
    const responsable = this.usuarios.find(u => u.nombre === this.planForm.get('responsable_plan')?.value);
    const user_id = responsable?.id_cuenta
    const objetivo = this.objetivos.find(o => o.cod_obj === this.planForm.get('codigo_obj')?.value);
    const obj_id = objetivo?.obj_id
    const indicador: IndicadorPlan = {
      nombre_indicador: this.planForm.get('indicador_plan')?.value,
      formula: this.planForm.get('formula')?.value,
      meta_plazo: this.planForm.get('meta')?.value,
      fecha_inicio: this.planForm.get('ini_ind')?.value,
      fecha_fin: this.planForm.get('fin_ind')?.value,
    }
    const actividad: Actividad = {
      nombre_actividad: this.planForm.get('actividad')?.value,
      responsable: this.planForm.get('responsable')?.value,
      plazo: this.planForm.get('plazo')?.value,
      fecha_inicio: this.planForm.get('ini_act')?.value,
      fecha_fin: this.planForm.get('fin_act')?.value,
    }
    const indicadoresextra: IndicadorPlan[] = this.planForm.get('indicadores')?.value
    const activividadesextra: Actividad[] = this.planForm.get('actividades')?.value
    const indicadores: IndicadorPlan[] = [...[indicador], ...indicadoresextra]
    const actividades: Actividad[] = [...[actividad], ...activividadesextra]

    const PLAN: PlanDeAccion = {
      nombre_plan: this.planForm.get('nombre')?.value,
      user_id: user_id,
      obj_id: obj_id!,
      indicadores: indicadores,
      actividades: actividades
    }
    //console.log(this.planForm)
    //console.log(PLAN)
    this.pdiService.crearPlan(PLAN).subscribe((resultados) => {
      console.log(resultados)
    })
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
      dactividad: ['', Validators.required],
      dresponsable: ['', Validators.required],
      dplazo: ['', Validators.required],
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

  // Actualizar el select de nombre según el código seleccionado
  actualizarNombrePorCodigo(codigo: string) {
    const objetivo = this.objetivos.find(o => o.cod_obj === codigo);
    if (objetivo) {
      this.planForm.get('objetivo')?.setValue(objetivo.nombre_obj, { emitEvent: false });
    }
  }

  // Actualizar el select de código según el nombre seleccionado
  actualizarCodigoPorNombre(nombre: string) {
    const objetivo = this.objetivos.find(o => o.nombre_obj === nombre);
    if (objetivo) {
      this.planForm.get('codigo_obj')?.setValue(objetivo.cod_obj, { emitEvent: false });
    }
  }

  cargarComponente() {
    if (this.actContainerr){
      const viewContainerRef = this.actContainerr;
      //viewContainerRef.clear();  // Limpia cualquier componente previo
      viewContainerRef.createComponent(FormIndicadorPlanComponent);  // Carga el componente
      
    }
  }

}
