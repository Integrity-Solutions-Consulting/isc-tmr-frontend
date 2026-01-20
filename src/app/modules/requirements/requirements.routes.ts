import { Routes, RouterModule } from '@angular/router';
import { SolicitudRequerimientoComponent } from './pages/application-requirement/solicitud-requerimiento/solicitud-requerimiento.component';
import { HistorialRequerimientoComponent } from './pages/history-requirements/historial-requerimiento/historial-requerimiento.component';

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
