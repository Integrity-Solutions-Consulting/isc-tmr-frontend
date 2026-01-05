import { Routes, RouterModule } from '@angular/router';
import { HistorialRequerimientoComponent } from './pages/historial-requerimiento/historial-requerimiento/historial-requerimiento.component';
import { SolicitudRequerimientoComponent } from './pages/solicitud-requerimiento/solicitud-requerimiento/solicitud-requerimiento.component';

const routes: Routes = [
  {
    path: '',
        children: [
          { path: 'request-requirement', component: SolicitudRequerimientoComponent },
          { path: 'record-requirement', component: HistorialRequerimientoComponent }
        ]
  },
];

export const RequirementsRoutes = RouterModule.forChild(routes);
