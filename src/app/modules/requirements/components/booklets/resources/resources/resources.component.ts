import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'resources-level',
  standalone: true,
  imports: [],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss'
})
export class ResourcesComponent {
  resourcesForm!: FormGroup;

  constructor() {
  }
}
