import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'service-mode',
  standalone: true,
  imports: [],
  templateUrl: './service-mode.component.html',
  styleUrl: './service-mode.component.scss'
})
export class ServiceModeComponent {
  serviceModeForm!: FormGroup;

  constructor() {
  }
}
