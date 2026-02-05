import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'other-knowledge',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, CommonModule],
  templateUrl: './other-knowledge.component.html',
  styleUrl: './other-knowledge.component.scss'
})
export class OtherKnowledgeComponent{
  @Input() knowledgeForm!: FormGroup;

}
