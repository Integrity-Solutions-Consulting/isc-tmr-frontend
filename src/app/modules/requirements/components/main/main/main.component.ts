import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatStepperModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  constructor() { }

  ngOnInit(): void {
  }
}
