import { Routes } from "@angular/router";
import { GestionVacantesComponent } from "./pages/gestion-vacantes/gestion-vacantes.component/gestion-vacantes.component";
import { RevisionCandidatosComponent } from "./pages/revision-candidatos/revision-candidatos/revision-candidatos.component";
import { NuevaVacanteComponent } from "./pages/nueva-vacante/nueva-vacante/nueva-vacante.component";
import { DashboardHrComponent } from "./pages/dashboard-hr/dashboard-hr/dashboard-hr.component";

export const HUMAN_RESOURCES_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard_hr', component: DashboardHrComponent},
      { path: 'gestion_vacantes', component: GestionVacantesComponent},
      { path: 'revision_candidatos', component:  RevisionCandidatosComponent},
      { path: 'nueva_vacante', component: NuevaVacanteComponent}
    ]
  }
];

export default HUMAN_RESOURCES_ROUTES;
