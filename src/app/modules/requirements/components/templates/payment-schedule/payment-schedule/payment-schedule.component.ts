import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ResourceServiceService } from '../../../../services/resource.service.service';
import { WorkCityResponseDTO } from '../../../../interfaces/requirement.interface';

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
    budget: [''],
    workCityId: [null],
    schedule: ['']
  });

  ngOnInit(): void {
    this.loadCities();
  }

  loadCities() {
     this.resourceService.getWorkCity().subscribe({
       next: (response: WorkCityResponseDTO[]) => {
         this.cities.set(response);
       },
       error: (err) => console.error('Error cargando ciudades:', err)
     });
  }

  getDTO(): any {
    return this.paymentScheduleForm.valid ? this.paymentScheduleForm.value : null;
  }

  /*Validaciones*/
  blockInvalidNumberKeys(event: KeyboardEvent): void {
    const invalidKeys = ['e', 'E', '+', '-', ','];

    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
