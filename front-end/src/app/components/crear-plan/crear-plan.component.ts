import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { Observable, of, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

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
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  filteredUsers: Observable<User[]> = of([])

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
    private toastr: ToastrService,
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
      observaciones: [''],
    })
    this.id = this.aRouter.snapshot.paramMap.get('id')
    this.pdiService.getUsuarios().subscribe((users) => {
      this.usuarios = users;
      this.filteredUsers = of(this.usuarios); //Asignamos observable a la lista para filtrar en autocompletado
    })
    this.pdiService.getObjetivos().subscribe((objetivos) => {
      this.objetivos = objetivos;
      if(this.id != null){
        const objetivo = this.objetivos.find(o => o.cod_obj == this.id);
        if (!objetivo){
          this.router.navigate(['/mapa-estrategico']);
        }
        this.planForm.get('codigo_obj')?.setValue(objetivo?.cod_obj, { emitEvent: false });
        this.planForm.get('objetivo')?.setValue(objetivo?.nombre_obj, { emitEvent: false });
      }
    })
  }

  ngOnInit(): void{
    this.esEditar();
    // Sincronizar selects objetivo
    this.planForm.get('codigo_obj')?.valueChanges.subscribe(codigo => {
      this.actualizarNombrePorCodigo(codigo);
    });

    this.planForm.get('objetivo')?.valueChanges.subscribe(nombre => {
      this.actualizarCodigoPorNombre(nombre);
    });
    // Validar cuando cambia el valor en el input
    this.planForm.get('responsable_plan')?.valueChanges.subscribe(value => {
      this.validateUser(value);
    });
  }
  
  esEditar(){
    if (this.id != null){
      this.titulo = "Edición Plan de Acción"
    }
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

  // Función para validar si el valor ingresado está en la lista de usuarios
  validateUser(value: string | User): void {
    // Verificar si el valor es una cadena o un objeto User
    const userName = typeof value === 'string' ? value : value?.nombre;
    // Si userName es válido, realizamos la búsqueda
    if (userName) {
      const user = this.usuarios.find(u => u.nombre.toLowerCase() === userName.toLowerCase());
      if (user) {
        // Si es un usuario válido, removemos el error
        this.planForm.get('responsable_plan')?.setErrors(null);
      } else {
        // Si no es un usuario válido, mostramos un error
        this.planForm.get('responsable_plan')?.setErrors({ invalidUser: true });
      }
    } else {
      // Si no se puede extraer el nombre del usuario, mostramos un error
      this.planForm.get('responsable_plan')?.setErrors({ invalidUser: true });
    }
  }

  //Para filtro de autocomplete
  displayFn(user: User): string {
    return user && user.nombre ? user.nombre : '';
  }

  //Para filtro de autocomplete
  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    if (!filterValue) {
      this.filteredUsers = of([]);  // Si se borra todo, no hay opciones
    } else {
      this.filteredUsers = of(this.usuarios.filter(u =>
        u.nombre.toLowerCase().includes(filterValue)
      ));  // Convertimos el array filtrado a un observable
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

  ingresar(){
    this.planForm.disable();//Desactiva formulario para desactivar botón.
    this.planForm.updateValueAndValidity();
    let indicadoresextra: IndicadorPlan[] = [];
    let actividadesextra: Actividad[] = [];
    const responsable : User = this.planForm.get('responsable_plan')?.value;
    const user_id = responsable.id_cuenta
    const objetivo = this.objetivos.find(o => o.cod_obj === this.planForm.get('codigo_obj')?.value);
    const obj_id = objetivo?.obj_id
    //Recuperación de valores de indicador y actividad obligatorios del planForm
    const indicador: IndicadorPlan = {
      desc_indicaplan: this.planForm.get('indicador_plan')?.value,
      form_calculo: this.planForm.get('formula')?.value,
      meta_plazo: this.planForm.get('meta')?.value,
      fecha_inicio: this.planForm.get('ini_ind')?.value,
      fecha_fin: this.planForm.get('fin_ind')?.value,
    }
    const actividad: Actividad = {
      desc_act: this.planForm.get('actividad')?.value,
      responsable: this.planForm.get('responsable')?.value,
      plazo: this.planForm.get('plazo')?.value,
      fecha_inicio: this.planForm.get('ini_act')?.value,
      fecha_fin: this.planForm.get('fin_act')?.value,
    }
    //Recuperación de los valores de los formArray indicadores y actividades
    const indicadoresform: any[] = this.planForm.get('indicadores')?.value
    const actividadesform: any[] = this.planForm.get('actividades')?.value
    //Llenado de lista indicadoresextra con formato de objeto indicador
    indicadoresform.map((indicador) => {
      indicadoresextra.push({
        desc_indicaplan: indicador.dindicador_plan,
        form_calculo: indicador.dformula,
        meta_plazo: indicador.dmeta,
        fecha_inicio: indicador.dini_ind,
        fecha_fin: indicador.dfin_ind
      })
    })
    //Llenado de lista actividadesextra con formato de objeto actividad
    actividadesform.map((actividad) => {
      actividadesextra.push({
        desc_act: actividad.dactividad,
        responsable: actividad.dresponsable,
        plazo: actividad.dplazo,
        fecha_inicio: actividad.dini_act,
        fecha_fin: actividad.dfin_act
      })
    })
    //Creación de listas de indicadores y actividades
    const indicadores: IndicadorPlan[] = [...[indicador], ...indicadoresextra]
    const actividades: Actividad[] = [...[actividad], ...actividadesextra]
    //Objeto plan de acción con los datos necesarios para post (creacion)
    const PLAN: PlanDeAccion = {
      nombre_plan: this.planForm.get('nombre')?.value,
      user_id: user_id,
      obj_id: obj_id!,
      indica_plan: indicadores,
      actividades: actividades,
      observaciones: this.planForm.get('observaciones')?.value,
    }
    this.pdiService.crearPlan(PLAN).pipe(
      catchError((error) => {
        //Manejar errores
        //console.error('Error al crear el plan de acción:', error);
        this.toastr.error('Ha ocurrido un error', 'Plan de Acción no creado');
        this.router.navigate(['/mapa-estrategico']);
        return EMPTY; // Retornamos un observable vacío para manejar el error y continuar el flujo
      })
    ).subscribe((resultados) => {
      //console.log(resultados);
      this.toastr.success('Datos ingresados correctamente', 'Plan de Acción Creado!');
      this.router.navigate(['/mapa-estrategico']);
    });
  }

  cargarComponente() {
    if (this.actContainerr){
      const viewContainerRef = this.actContainerr;
      //viewContainerRef.clear();  // Limpia cualquier componente previo
      viewContainerRef.createComponent(FormIndicadorPlanComponent);  // Carga el componente
      
    }
  }

}
