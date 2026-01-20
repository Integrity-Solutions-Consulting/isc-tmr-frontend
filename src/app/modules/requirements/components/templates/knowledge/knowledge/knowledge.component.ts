import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'other-knowledge',
  standalone: true,
  imports: [],
  templateUrl: './knowledge.component.html',
  styleUrl: './knowledge.component.scss'
})
export class KnowledgeComponent {
  knowledgeForm!: FormGroup;

  constructor() {
  }
}
