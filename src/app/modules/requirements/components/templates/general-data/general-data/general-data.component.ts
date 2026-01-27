import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

import { map } from 'rxjs';
import { ClientService } from '../../../../../clients/services/client.service';
import { ResourceServiceService } from '../../../../services/resource.service.service';
import { ClientResponseDTO } from '../../../../interfaces/requirement.interface';

@Component({
  selector: 'general-data',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './general-data.component.html',
  styleUrl: './general-data.component.scss'
})
export class GeneralDataComponent implements OnInit {

  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private resourceService = inject(ResourceServiceService);

  clients = signal<any[]>([]);
  vacancies = signal<any[]>([]);
  contacts = signal<any[]>([]);

  generalDataForm: FormGroup = this.fb.group({
    clientId: [null, [Validators.required]],
    cargoId: [null, [Validators.required]],
    contactId: [null],
    contactFirstName: ['', [Validators.required]],
    contactLastName: ['', [Validators.required]],
    contactEmail: ['']
  });

  ngOnInit(): void {
    this.loadClients();
    this.loadVacancies();
    this.onClientChange();
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

  // loadVacancies() {
  //   this.resourceService.getVacancies().subscribe({
  //     next: (response: any) => {
  //       const listaCruda = response.data || [];

  //       const listaMapeada = listaCruda.map((item: any) => ({
  //         name: item.vacancyTitle,
  //         value: item.id
  //       }));

  //       this.vacancies.set(listaMapeada);
  //     },
  //     error: (err: any) => console.error('Error cargando vacantes:', err)
  //   });
  // }

  loadVacancies() {
    this.resourceService.getVacancies().subscribe({
      next: (response: any) => {
        console.log('Respuesta API Vacantes:', response); // 1. Agrega esto para ver qué llega

        const listaCruda = Array.isArray(response) ? response : (response.data || []);

        const listaMapeada = listaCruda.map((item: any) => ({
          name: item.vacancyTitle, // Asegúrate que este campo coincida con tu JSON
          value: item.id
        }));

        this.vacancies.set(listaMapeada);
      },
      error: (err: any) => console.error('Error cargando vacantes:', err)
    });
  }

  //Logica para cargar contactos segun cliente seleccionado y se completa informacion (onClientetChange, loadContacts, onContactSelect)
  onClientChange() {
    this.generalDataForm.get('clientId')?.valueChanges.subscribe((clientId) => {
      this.contacts.set([]);
      this.generalDataForm.patchValue({
        contactId: null,
        contactFirstName: '',
        contactLastName: '',
        contactEmail: ''
      });

      if (clientId) {
        this.loadContacts(clientId);
      }
    });
  }

  loadContacts(clientId: number) {
    this.resourceService.getContactsByClient(clientId).subscribe({
      next: (response: any) => {

        const lista = Array.isArray(response) ? response : (response.data || []);

        const contactosMapeados = lista.map((c: any) => ({
           id: c.id,
           fullName: `${c.firstName} ${c.lastName}`,
           firstName: c.firstName,
           lastName: c.lastName,
           email: c.email
        }));

        this.contacts.set(contactosMapeados);
      },
      error: (err) => console.error('Error cargando contactos:', err)
    });
  }

onContactSelect(contact: any) {
    if (contact) {
      // CASO A: Eligió a alguien de la lista -> Llenamos los campos y bloqueamos escritura (opcional)
      this.generalDataForm.patchValue({
        contactId: contact.id,
        contactFirstName: contact.firstName,
        contactLastName: contact.lastName,
        contactEmail: contact.email
      });
    } else {
      // CASO B: Borró la selección (X) > Limpiamos para que escriba uno nuevo manualmente
      this.generalDataForm.patchValue({
        contactId: null,      // ID nulo significa "Nuevo Contacto" para el backend
        contactFirstName: '', // Limpiamos para que el usuario escriba
        contactLastName: '',
        contactEmail: ''
      });
    }
  }












  getDTO(): any {
    return this.generalDataForm.valid ? this.generalDataForm.value : null;
  }

}
