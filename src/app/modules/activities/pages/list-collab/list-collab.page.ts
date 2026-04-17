import { Component } from '@angular/core';
import { CollaboratorsListComponent } from "../../components/collaborators-list/collaborators-list.component";
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivityUploadComponent } from '../../components/activity-upload/activity-upload.component';
import { HomologacionComponent } from '../../components/homologacion/homologacion.component';

@Component({
  selector: 'app-list-collab',
  standalone: true,
  imports: [
    ActivityUploadComponent,
    CollaboratorsListComponent,
    HomologacionComponent,
    MatCardModule,
    MatTabsModule
  ],
  templateUrl: './list-collab.page.html',
  styleUrl: './list-collab.page.scss'
})
export class ListCollabPage {
  currentTitle: string = 'Seguimiento'; // Valor por defecto

  onTabChanged(event: MatTabChangeEvent): void {
    // Cambiar el título según la pestaña seleccionada
    switch (event.index) {
      case 0: // Primera pestaña (Seguimiento)
        this.currentTitle = 'Seguimiento';
        break;
      case 1: // Segunda pestaña (Carga de Actividades)
        this.currentTitle = 'Carga de Actividades';
        break;
      case 2: // Tercera pestaña (Homologación)
        this.currentTitle = 'Homologación';
        break;
      default:
        this.currentTitle = 'Seguimiento';
    }
  }
}
