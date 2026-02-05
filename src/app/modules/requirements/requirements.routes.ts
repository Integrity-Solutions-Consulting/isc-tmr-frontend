import { Routes, RouterModule } from '@angular/router';
import { HistorialRequerimientoComponent } from './pages/history-requirements/historial-requerimiento/historial-requerimiento.component';
import { SolicitudRequerimientoComponent } from './pages/application-requirement/solicitud-requerimiento/solicitud-requerimiento.component';

export const requirementsRoutes: Routes = [
  {
    path: '',
        children: [
          { path: 'request-requirement', component: SolicitudRequerimientoComponent },
          { path: 'record-requirement', component: HistorialRequerimientoComponent },
        ]
  },
];

export default requirementsRoutes;
