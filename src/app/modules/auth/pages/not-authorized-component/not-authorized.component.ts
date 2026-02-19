import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-authorized',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-authorized.component.html',
  styleUrl: './not-authorized.component.scss',
})
export class NotAuthorizedComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/menu']);
  }

  goBack() {
    history.back();
  }
}
