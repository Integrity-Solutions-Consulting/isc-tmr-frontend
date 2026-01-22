import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'other-knowledge',
  standalone: true,
  imports: [],
  templateUrl: './other-knowledge.component.html',
  styleUrl: './other-knowledge.component.scss'
})
export class OtherKnowledgeComponent {
  knowledgeForm!: FormGroup;

  constructor() {
  }
}
