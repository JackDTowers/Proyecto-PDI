export interface IndicadorPlan {
  ind_plan_id?: number;
  desc_indicaplan: string; //antes nombre_indicador
  form_calculo: string; //antes formula
  meta_plazo: string;
  fecha_inicio: Date;
  fecha_fin: Date;
}