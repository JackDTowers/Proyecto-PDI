import { Actividad } from "./actividad";
import { IndicadorPlan } from "./indicadorplan";
import { Objetivo } from "./objetivo";
import { User } from "./user";

export interface PlanDeAccion {
  plan_id?: number;
  nombre_plan: string;
  user_id?: number;
  obj_id: number;
  indica_plan: IndicadorPlan[];
  actividades: Actividad[];
  fecha_creacion?: Date;
  updatedAt?: Date;
  observaciones?: string;
  responsable?: User;
  objetivo?: Objetivo;
  estado?: string;
}