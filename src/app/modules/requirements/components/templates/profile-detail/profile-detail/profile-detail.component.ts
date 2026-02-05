import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CareerResponseDTO, KnowledgeResponseDTO, StudyStatuResponseDTO, TemplateDetailResponseDTO, TemplateResponseDTO, ToolResponseDTO } from '../../../../interfaces/requirement.interface';
import { ResourceServiceService } from '../../../../services/resource.service.service';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'profile-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule, MatIconModule],
  templateUrl: './profile-detail.component.html',
  styleUrl: './profile-detail.component.scss'
})
export class ProfileDetailComponent implements OnInit{
  private fb = inject(FormBuilder);
  private resourceService = inject(ResourceServiceService);

  studyStatus = signal<any[]>([]);
  availableCareers = signal<any[]>([]);

  selectedTemplateDetail = signal<any | null>(null);
  templates = signal<any[]>([]);
  knowledgeList = signal<any[]>([]);
  toolsList = signal<any[]>([]);

  createTemplate = signal(false);

  profileDetailForm: FormGroup = this.fb.group({
    experienceYears: [null, [Validators.required, Validators.min(0)]],
    studyStatusId: [null, [Validators.required]],
    careerId: [null, [Validators.required]],
    templateId: [null, Validators.required],
  });

  templateForm: FormGroup = this.fb.group({
    templateName: ['', Validators.required],
    knowledgeIds: [[], Validators.required],
    toolIds: [[], Validators.required]
  });

  ngOnInit(): void {
    this.loadStudyStatus();
    this.loadCareers();
    this.loadKnowledge();
    this.loadTools();
    this.loadTemplates();
  }

  loadStudyStatus() {
    this.resourceService.GetAllStudyStatus().subscribe({
      next: (response: StudyStatuResponseDTO[]) => {
        this.studyStatus.set(response);
      },
      error: (err) => console.error('Error loading study status:', err)
    });
  }

  loadCareers() {
    this.resourceService.GetAllCareers(true).subscribe({
      next: (response: CareerResponseDTO[]) => {
        this.availableCareers.set(response);
      },
      error: (err) => console.error('Error loading careers:', err)
    });
  }

  loadKnowledge() {
    this.resourceService.GetAllKnowledge(true).subscribe({
      next: (response: KnowledgeResponseDTO[]) => {
        this.knowledgeList.set(response);
      },
      error: (err) => console.error('Error loading knowledge:', err)
    });
  }

  loadTools() {
    this.resourceService.GetAllTools(true).subscribe({
      next: (response: ToolResponseDTO[]) => {
        this.toolsList.set(response);
      },
      error: (err) => console.error('Error loading tools:', err)
    });
  }

  loadTemplates() {
    this.resourceService.getAllTemplates().subscribe({
      next: (response: TemplateResponseDTO[]) => {
        this.templates.set(response);
      },
      error: (err) => console.error('Error loading templates:', err)
    });
  }

  onTemplateSelect(template: TemplateResponseDTO | null) {
    if (!template) {
      this.selectedTemplateDetail.set(null);
      this.profileDetailForm.patchValue({ templateId: null });
      return;
    }

    const templateId = template.templateID;
    this.profileDetailForm.patchValue({ templateId: templateId });

    this.resourceService.getTemplateById(templateId).subscribe({
      next: res => {
        this.selectedTemplateDetail.set(res);
        this.createTemplate.set(false);
      },
      error: err => console.error(err)
    });
  }

  onTemplateClear() {
    this.selectedTemplateDetail.set(null);
  }

  getKnowledgeName(id: number): string {
    const item = this.knowledgeList().find(k => k.knowledgeID === id)?.knowledgeName ?? '';
    return item;
  }

  getToolName(id: number): string {
    const item = this.toolsList().find(t => t.toolID === id)?.toolName ?? '';
    return item;
  }

  toggleCreateTemplate() {
    this.createTemplate.update(v => !v);

    const template = this.profileDetailForm.get('templateId');

    if (this.createTemplate()) {
      template?.clearValidators();
      template?.setValue(null);
    } else {
      template?.setValidators([Validators.required]);

    }
    template?.updateValueAndValidity();
  }

  saveTemplate() {
    if (this.templateForm.invalid){
      this.templateForm.markAllAsTouched();
      console.error('Form is invalid', this.templateForm.value);
      return;
    }

    const { templateName, knowledgeIds, toolIds } = this.templateForm.value;

    this.resourceService.postTemplate(templateName, knowledgeIds, toolIds).subscribe({
      next: () => {
        this.loadTemplates();
        this.createTemplate.set(false);
        this.templateForm.reset({
          templateName: '',
          knowledgeIds: [],
          toolIds: []
        });
      },
      error: err => console.error(err)
    });
  }

  getDTO(): any {
    return this.profileDetailForm.valid ? this.profileDetailForm.value : null;
  }

  /*Validaciones*/
  onlyLettersValidator(event: KeyboardEvent): void {
    // Regex mejorado: letras, espacios, y caracteres españoles
    const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

    if (!lettersRegex.test(event.key)) {
      event.preventDefault();
    }
  }

  blockInvalidNumberKeys(event: KeyboardEvent): void {
    const invalidKeys = ['e', 'E', '+', '-', ','];

    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
