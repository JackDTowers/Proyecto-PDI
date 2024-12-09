import { Actividad } from "./actividad";
import { IndicadorPlan } from "./indicadorplan";

export interface PlanDeAccion {
  nombre_plan: string;
  user_id?: number;
  obj_id: number;
  indicadores: IndicadorPlan[];
  actividades: Actividad[];
  fecha_creacion?: Date;
  observaciones?: string;
}