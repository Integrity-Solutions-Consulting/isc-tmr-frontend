import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { ClientService } from '../../../../../clients/services/client.service';
import { ClientSelect } from '../../../../interfaces/requeriment.interface';

@Component({
  selector: 'general-data',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './general-data.component.html',
  styleUrl: './general-data.component.scss'
})
export class GeneralDataComponent implements OnInit {

  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);

  clients = signal<ClientSelect[]>([]);

  generalDataForm: FormGroup = this.fb.group({
    clientId: ['', [Validators.required]],
    // Próximamente agregaremos los otros campos aquí
  });

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients(1, 100)
      .pipe(
        // 1. PRIMER FILTRO: Extraemos solo el array 'items' de la paginación
        map((response: any) => response.items || []),

        // 2. SEGUNDO FILTRO: Convertimos la data pesada en data ligera
        map((items: any[]) => items.map(c => ({
          id: c.id,
          // Dejamos el OR (||) por seguridad, pero ya sin lógica compleja
          legalName: c.legalName || c.tradeName || 'Sin Nombre'
        })))
      )
      .subscribe({
        next: (cleanClients) => {
          // 3. Aquí ya llega la lista limpia y perfecta
          this.clients.set(cleanClients);
        },
        error: (err) => console.error('Error cargando clientes:', err)
      });
  }

  getDTO(): any {
    return this.generalDataForm.valid ? this.generalDataForm.value : null;
  }
}
