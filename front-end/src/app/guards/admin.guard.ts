import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { PdiService } from "../services/pdi.service";

export const adminGuard = () => {
  const pdiService = inject(PdiService);
  const router = inject(Router);
  if (pdiService.isAdmin()){
    return true;
  }
  else{
    router.navigate(['/mapa-estrategico']);
    return false;
  }
}