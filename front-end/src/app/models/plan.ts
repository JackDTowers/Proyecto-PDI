import { Actividad } from "./actividad";
import { IndicadorPlan } from "./indicadorplan";
import { Objetivo } from "./objetivo";
import { User } from "./user";

export interface PlanDeAccion {
  nombre_plan: string;
  user_id?: number;
  obj_id: number;
  indica_plan: IndicadorPlan[];
  actividades: Actividad[];
  fecha_creacion?: Date;
  observaciones?: string;
  responsable?: User;
  objetivo?: Objetivo;
}