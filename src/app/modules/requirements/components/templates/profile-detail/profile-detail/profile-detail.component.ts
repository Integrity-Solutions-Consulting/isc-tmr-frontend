import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'profile-detail',
  standalone: true,
  imports: [],
  templateUrl: './profile-detail.component.html',
  styleUrl: './profile-detail.component.scss'
})
export class ProfileDetailComponent {
  profileDetailForm!: FormGroup;

  constructor() {
  }
}
