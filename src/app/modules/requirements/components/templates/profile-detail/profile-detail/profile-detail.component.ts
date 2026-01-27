import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CareerResponseDTO, KnowledgeResponseDTO, StudyStatuResponseDTO, ToolResponseDTO } from '../../../../interfaces/requirement.interface';
import { ResourceServiceService } from '../../../../services/resource.service.service';

@Component({
  selector: 'profile-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
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

    templateId: [null],
    templateName: [''],

    knowledgeIds: [[], [Validators.required]],
    toolIds: [[], [Validators.required]]
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
      next: (response: any) => {
        this.templates.set(response.data || []);
      },
      error: (err) => console.error('Error loading templates:', err)
    });
  }

  onTemplateSelect(templateId: number) {
  if (!templateId) return;

  this.resourceService.getTemplateById(templateId).subscribe({
    next: (res) => {
      this.selectedTemplateDetail.set(res);
      this.createTemplate.set(false);
    }
  });
}

  toggleCreateTemplate() {
    this.createTemplate.update(v => !v);

    if (this.createTemplate()) {
      this.profileDetailForm.patchValue({
        templateId: null,
        knowledgeIds: [],
        toolIds: []
      });
    }
  }

  saveTemplate() {
    if (this.profileDetailForm.invalid){
      this.profileDetailForm.markAllAsTouched();
      console.error('Form is invalid', this.profileDetailForm.value);
      return;
    }

    const { templateName, knowledgeIds, toolIds } = this.profileDetailForm.value;

    this.resourceService.postTemplate(templateName, knowledgeIds, toolIds).subscribe({
      next: () => {
        this.loadTemplates();
        this.createTemplate.set(false);
        this.profileDetailForm.patchValue({
          templateName: '',
          knowledgeIds: [],
          toolIds: []
        });
      },
      error: err => console.error(err)
    });
  }
}
