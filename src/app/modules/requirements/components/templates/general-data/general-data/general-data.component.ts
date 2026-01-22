import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

// Asegúrate de que las rutas a tus servicios e interfaces sean correctas
import { ClientService } from '../../../../../clients/services/client.service';
import { ResourceServiceService } from '../../../../services/resource.service.service';
import { ClientResponseDTO } from '../../../../interfaces/requirement.interface';

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

  // 1. CORRECCIÓN: Inyectamos el ResourceService que faltaba
  private resourceService = inject(ResourceServiceService);

  clients = signal<ClientResponseDTO[]>([]);

  // 2. CORRECCIÓN: Declaramos la signal 'vacancies' que faltaba
  vacancies = signal<any[]>([]);

  generalDataForm: FormGroup = this.fb.group({
    clientId: ['', [Validators.required]],
    cargoId: ['', [Validators.required]],
    contactFirstName: [''],
    contactLastName: [''],
    contactEmail: ['']
  });

  ngOnInit(): void {
    this.loadClients();
    this.loadVacancies(); // <--- Llamamos al método al iniciar
  }

  loadClients() {
    this.clientService.getClients(1, 100).pipe(
      map((response: any) => response.items || []),
      map((items: any[]) => items.map(c => ({
        id: c.id,
        legalName: c.legalName || c.tradeName || 'Sin Nombre'
      })))
    ).subscribe({
      next: (cleanClients) => this.clients.set(cleanClients),
      error: (err) => console.error('Error cargando clientes:', err)
    });
  }


  loadVacancies() {
    this.resourceService.getVacancies().subscribe({
      next: (response: any) => {
        // ASIGNACIÓN DIRECTA (Sin mapa, sin extraer data)
        // Estamos asumiendo que 'response' YA es la lista correcta.
        console.log('Probando asignación directa:', response);
        this.vacancies.set(response);
      },
      error: (err: any) => console.error(err)
    });
  }
  // loadVacancies() {
  //   this.resourceService.getVacancies().subscribe({
  //     next: (response: any) => {

  //       const listaCruda = response.data || [];

  //       const listaMapeada = listaCruda.map((item: any) => ({
  //          name: item.vacancyTitle,
  //          value: item.vacancyTitle
  //       }));

  //       this.vacancies.set(listaMapeada);
  //     },
  //     error: (err: any) => console.error(err)
  //   });
  // }

  getDTO(): any {
    return this.generalDataForm.valid ? this.generalDataForm.value : null;
  }
}
