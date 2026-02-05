import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ResourceServiceService } from '../../../../services/resource.service.service';
import { WorkModeResponseDTO } from '../../../../interfaces/requirement.interface';

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
  styleUrls: ['./service-mode.component.scss']
})
export class ServiceModeComponent implements OnInit {

  private fb = inject(FormBuilder);
  private resourceService = inject(ResourceServiceService);

  modalities = signal<any[]>([]);

  serviceModeForm: FormGroup = this.fb.group({
    serviceModeId: [null, [Validators.required]],
    time: ['']
  });

  ngOnInit(): void {
    this.loadWorkMode();
  }

  loadWorkMode() {
    this.resourceService.getWorkMode().subscribe({
      next: (response: WorkModeResponseDTO[]) => {
        this.modalities.set(response);
      },
      error: (err) => console.error('Error cargando modalidades:', err)
    });
  }

  getDTO(): any {
    return this.serviceModeForm.valid ? this.serviceModeForm.value : null;
  }
}
