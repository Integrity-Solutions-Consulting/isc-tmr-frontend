import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'service-mode',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './service-mode.component.html',
  styleUrl: './service-mode.component.scss'
})
export class ServiceModeComponent {
  serviceModeForm!: FormGroup;

  constructor() {
  }
}
