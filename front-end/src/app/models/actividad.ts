import { Avance } from "./avance";
import { PlanDeAccion } from "./plan";

export interface Actividad {
  act_id?: string;
  desc_act: string; //antes: nombre_actividad
  responsable: string;
  plazo: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  plan?: PlanDeAccion;
  avances?: Avance[];
}