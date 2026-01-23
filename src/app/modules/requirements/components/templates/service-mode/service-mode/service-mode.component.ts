import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ResourceServiceService } from '../../../../services/resource.service.service';

@Component({
  selector: 'service-mode',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    NgSelectModule
  ],
  templateUrl: './service-mode.component.html',
  styleUrl: './service-mode.component.scss'
})
export class ServiceModeComponent implements OnInit {

  private fb = inject(FormBuilder);
  private resourceService = inject(ResourceServiceService);

  modalities = signal<any[]>([]);

  serviceModeForm: FormGroup = this.fb.group({
    serviceModeId: [null, [Validators.required]], // null para ng-select
    time: ['']
  });

  ngOnInit(): void {
    this.loadServiceModalities();
  }

  loadServiceModalities() {
    this.resourceService.getServiceModalities().subscribe({
      next: (response: any) => {
        // Asegura que sea un array
        const data = Array.isArray(response) ? response : (response.data || []);
        this.modalities.set(data);
      },
      error: (err) => console.error('Error cargando modalidades:', err)
    });
  }
}
