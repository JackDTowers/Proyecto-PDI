import { Actividad } from "./actividad";
import { IndicadorPlan } from "./indicadorplan";

export interface PlanDeAccion {
  nombre_plan: string;
  responsable_plan: string;
  codigo_obj: string;
  indicadores: IndicadorPlan[];
  actividades: Actividad[];
}