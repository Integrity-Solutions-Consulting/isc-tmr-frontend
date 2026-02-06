import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';
import { ClientService } from '../../../../../clients/services/client.service';
import { ResourceServiceService } from '../../../../services/resource.service.service';
import { ContactRequestDTO, ContactResponseDTO } from '../../../../interfaces/requirement.interface';


@Component({
  selector: 'general-data',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule, MatIconModule],
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
    vacancyId: [null, [Validators.required]],
    contactId: [null],
    contactFirstName: ['', [Validators.required]],
    contactLastName: ['', [Validators.required]],
    contactEmail: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    this.loadClients();
    this.loadVacancies();
    this.onClientChange();
    this.onContactChange();
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

        const listaCruda = Array.isArray(response) ? response : (response.data || []);

        const listaMapeada = listaCruda.map((item: any) => ({
          name: item.vacancyTitle,
          id: item.id
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

  onContactChange() {
  this.generalDataForm.get('contactId')?.valueChanges.subscribe((contactId) => {
    const contact = this.contacts().find(c => c.id === contactId);

    if (contact) {
      this.generalDataForm.patchValue({
        contactFirstName: contact.firstName,
        contactLastName: contact.lastName,
        contactEmail: contact.email
      }, { emitEvent: false });
    } else {
      this.generalDataForm.patchValue({
        contactFirstName: '',
        contactLastName: '',
        contactEmail: ''
      }, { emitEvent: false });
    }
  });
}

loadContacts(clientId: number) {
    this.resourceService.getContactsByClient(clientId).subscribe({
      next: (response: any) => {

        const lista = Array.isArray(response) ? response : (response.data || []);

        const contactosMapeados = lista.map((c: any) => ({
            id: c.contactID,
            fullName: `${c.first_name} ${c.last_name}`,
            firstName: c.first_name,
            lastName: c.last_name,
            email: c.email
        }));

        this.contacts.set(contactosMapeados);
      },
      error: (err) => {
        console.error('Error cargando contactos:', err);
        this.contacts.set([]);
      }
    });
  }

onContactSelect(contact: any) {
    if (contact) {
      this.generalDataForm.patchValue({
        contactId: contact.id,
        contactFirstName: contact.firstName,
        contactLastName: contact.lastName,
        contactEmail: contact.email
      });
    } else {
      this.generalDataForm.patchValue({
        contactId: null,
        contactFirstName: '',
        contactLastName: '',
        contactEmail: ''
      });
    }
  }

  canCreateContact(): boolean {
    return !!(
      this.generalDataForm.get('clientId')?.value &&            // cliente seleccionado
      !this.generalDataForm.get('contactId')?.value &&          // no hay contacto ya creado
      this.generalDataForm.get('contactFirstName')?.valid &&
      this.generalDataForm.get('contactLastName')?.valid &&
      this.generalDataForm.get('contactEmail')?.valid           // requerido + email válido
    );
  }

  createContact(): void {
  const clientId = this.generalDataForm.get('clientId')?.value;
  if (!clientId) return;

  const request: ContactRequestDTO = {
    ClientID: clientId,
    ContactName: this.generalDataForm.get('contactFirstName')?.value,
    ContactLastName: this.generalDataForm.get('contactLastName')?.value,
    ContactEmail: this.generalDataForm.get('contactEmail')?.value || ''
  };

  this.resourceService.createContact(request).subscribe({
    next: (response) => {

      this.resourceService.getContactsByClient(clientId).subscribe({
        next: (res: any) => {

          const lista = Array.isArray(res) ? res : (res.data || []);

          const contactosMapeados = lista.map((c: any) => ({
            id: c.contactID,
            fullName: `${c.first_name} ${c.last_name}`,
            firstName: c.first_name,
            lastName: c.last_name,
            email: c.email
          }));

          this.contacts.set(contactosMapeados);

          // 🔥 AHORA SÍ se selecciona
          setTimeout(() => {
          this.generalDataForm.patchValue({
            contactId: response.ContactID
          });
        }, 0);
        }
      });
    },
    error: (err) => console.error('Error creando contacto:', err)
  });
}

  getDTO(): any {
    return this.generalDataForm.valid ? this.generalDataForm.value : null;
  }

  onlyLettersValidator(event: KeyboardEvent): void {
    // Regex mejorado: letras, espacios, y caracteres españoles
    const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

    if (!lettersRegex.test(event.key)) {
      event.preventDefault();
    }
  }

}
