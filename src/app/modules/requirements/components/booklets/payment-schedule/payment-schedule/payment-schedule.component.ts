import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'payment-schedule',
  standalone: true,
  imports: [],
  templateUrl: './payment-schedule.component.html',
  styleUrl: './payment-schedule.component.scss'
})
export class PaymentScheduleComponent {
  paymentScheduleForm!: FormGroup;

  constructor() {
  }
}
