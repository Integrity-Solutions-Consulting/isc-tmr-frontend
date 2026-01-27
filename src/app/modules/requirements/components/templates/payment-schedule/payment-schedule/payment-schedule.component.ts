import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ResourceServiceService } from '../../../../services/resource.service.service';

@Component({
  selector: 'payment-schedule',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    NgSelectModule
  ],
  templateUrl: './payment-schedule.component.html',
  styleUrl: './payment-schedule.component.scss'
})
export class PaymentScheduleComponent implements OnInit {

  private fb = inject(FormBuilder);
  private resourceService = inject(ResourceServiceService);

  cities = signal<any[]>([]);

  paymentScheduleForm: FormGroup = this.fb.group({
    budget: [''], // Presupuesto (Input normal)
    cityId: [null], // Ciudad (Ng-Select)
    schedule: [''] // Horario (Input normal)
  });

  ngOnInit(): void {
    // this.loadCities();
  }

  // loadCities() {
  //   this.resourceService.getCities().subscribe({
  //     next: (response: any) => {
  //       const data = Array.isArray(response) ? response : (response.data || []);
  //       this.cities.set(data);
  //     },
  //     error: (err) => console.error('Error cargando ciudades:', err)
  //   });
  // }

  getDTO(): any {
    return this.paymentScheduleForm.valid ? this.paymentScheduleForm.value : null;
  }
}
