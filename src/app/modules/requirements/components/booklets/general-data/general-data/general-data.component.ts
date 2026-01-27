import { Component } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';

@Component({
  selector: 'general-data',
  standalone: true,
  imports: [],
  templateUrl: './general-data.component.html',
  styleUrl: './general-data.component.scss'
})
export class GeneralDataComponent {
  generalDataForm!: FormGroup;

  constructor() {
  }

  getDTO(): any {
    if (this.generalDataForm.valid) {
      return this.generalDataForm.value;
    }
  }
}
