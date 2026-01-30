import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'other-knowledge',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './other-knowledge.component.html',
  styleUrl: './other-knowledge.component.scss'
})
export class OtherKnowledgeComponent {
  knowledgeForm!: FormGroup;

  constructor() {
  }
}
