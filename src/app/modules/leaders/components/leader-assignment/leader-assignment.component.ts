// assignment-leader-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeadersService } from '../../services/leaders.service';
import { ProjectService } from '../../../projects/services/project.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { Project, UpdateProjectRequest } from '../../../projects/interfaces/project.interface';

export interface LeaderAssignment {
  id: number;
  projectID: number;
  leadershipType: boolean;
  status: boolean;
  projectName?: string;
  startDate?: string;
  endDate?: string;
}

@Component({
  selector: 'app-assignment-leader-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './leader-assignment.component.html',
  styleUrls: ['./leader-assignment.component.scss']
})
export class AssignmentLeaderDialogComponent implements OnInit {
  assignmentForm: FormGroup;
  leader: any = null;
  allProjects: Project[] = [];
  assignedProjects: LeaderAssignment[] = [];
  removedProjectIds: number[] = [];
  loading = false;
  saving = false;

  protected _onDestroy = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<AssignmentLeaderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private leaderService: LeadersService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    this.assignmentForm = this.fb.group({
      selectedProject: [null, Validators.required],
      //responsibility: ['', Validators.required],
      //leadershipType: [' '],
      //status: ['']
    });
    this.leader = data.leader;
  }

  ngOnInit(): void {
    this.loadProjectsAndAssignments();
    //this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;

    this.projectService.getAllProjects().subscribe({
    next: (projects: any) => {
      console.log('Proyectos cargados:', projects);
      this.allProjects = projects;
      this.loading = false;
    },
    error: (error) => {
      console.error('Error loading projects:', error);
      this.snackBar.open('Error al cargar proyectos', 'Cerrar', { duration: 3000 });
      this.loading = false;
    }
  });
  }

  loadProjectsAndAssignments(): void {
    this.loading = true;

    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.allProjects = projects;

        const leaderProjects = this.allProjects.filter(
          p => p.leaderID === this.leader.id
        );

          this.assignedProjects = leaderProjects.map(assignment => ({
            id: 0,
            projectID: assignment.id,
            projectName: assignment.name,
            leadershipType: assignment.leader?.leadershipType || false,
            status: assignment.status || false,
            // Agregar fechas del proyecto para visualización
            startDate: this.formatDateDisplay(assignment.startDate),
            endDate: this.formatDateDisplay(assignment.endDate)
          }));


        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading data:', error);
        this.snackBar.open('Error al cargar los datos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  getProjectName(projectId: number): string {
    const project = this.allProjects.find(p => p.id === projectId);
    return project ? `${project.code} - ${project.name}` : `Proyecto no encontrado (ID: ${projectId})`;
  }

  getProjectStartDate(projectId: number): string {
    const project = this.allProjects.find(p => p.id === projectId);
    return project?.startDate ? this.formatDateDisplay(project.startDate) : 'N/A';
  }

  getProjectEndDate(projectId: number): string {
    const project = this.allProjects.find(p => p.id === projectId);
    return project?.endDate ? this.formatDateDisplay(project.endDate) : 'N/A';
  }

  getAvailableProjects(): any[] {
    const assignedProjectIds = this.assignedProjects.map(ap => ap.projectID);
    return this.allProjects.filter(project =>
      !assignedProjectIds.includes(project.id) && project.status !== false
    );
  }

  addAssignment(): void {
    if (!this.assignmentForm.valid) {
      this.markFormGroupTouched(this.assignmentForm);
      return;
    }

    const projectId = this.assignmentForm.value.selectedProject;

    // evitar duplicados
    const alreadyExists = this.assignedProjects.some(
      p => p.projectID === projectId
    );

    if (alreadyExists) {
      this.snackBar.open('Este proyecto ya está asignado', 'Cerrar', { duration: 3000 });
      return;
    }

    const project = this.allProjects.find(p => p.id === projectId);

    if (!project) return;

    const newAssignment: LeaderAssignment = {
      id: 0,
      projectID: project.id,
      projectName: `${project.code} - ${project.name}`,
      leadershipType: true, // solo visual si lo necesitas
      status: true,
      startDate: this.formatDateDisplay(project.startDate),
      endDate: this.formatDateDisplay(project.endDate)
    };

    this.assignedProjects = [...this.assignedProjects, newAssignment];

    this.resetForm();
  }

  removeAssignment(index: number): void {
    const assignment = this.assignedProjects[index];
    this.removedProjectIds.push(assignment.projectID);
    this.assignedProjects = this.assignedProjects.filter(
      (_, i) => i !== index
    );
  }

  getActiveAssignments(): LeaderAssignment[] {
    return this.assignedProjects;
  }

  onSubmit(): void {
    if (this.assignedProjects.length === 0) {
      this.snackBar.open('No hay asignaciones para guardar', 'Cerrar', { duration: 3000 });
      return;
    }

    this.saving = true;

    const updateCalls: Observable<any>[] = [];

  // 🔹 Asignar proyectos seleccionados
  this.assignedProjects.forEach(assignment => {
    const project = this.allProjects.find(p => p.id === assignment.projectID);
    if (!project) return;

    const request: UpdateProjectRequest = {
      clientID: project.clientID,
      projectStatusID: project.projectStatusID,
      projectTypeID: project.projectTypeID,
      leaderID: this.leader.id, // ✅ asignar líder
      code: project.code,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      actualStartDate: project.actualStartDate,
      actualEndDate: project.actualEndDate,
      budget: project.budget,
      hours: project.hours,
      waitingStartDate: project.waitingStartDate,
      waitingEndDate: project.waitingEndDate,
      observation: project.observation
    };

    updateCalls.push(this.projectService.updateProject(project.id, request));
  });

  // 🔹 Desasignar proyectos eliminados
  this.removedProjectIds.forEach(projectId => {
    const project = this.allProjects.find(p => p.id === projectId);
    if (!project) return;

    const request: UpdateProjectRequest = {
      clientID: project.clientID,
      projectStatusID: project.projectStatusID,
      projectTypeID: project.projectTypeID,
      leaderID: undefined, // ❌ quitar líder
      code: project.code,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      actualStartDate: project.actualStartDate,
      actualEndDate: project.actualEndDate,
      budget: project.budget,
      hours: project.hours,
      waitingStartDate: project.waitingStartDate,
      waitingEndDate: project.waitingEndDate,
      observation: project.observation
    };

    updateCalls.push(this.projectService.updateProject(project.id, request));
  });

  if (updateCalls.length === 0) {
    this.saving = false;
    this.snackBar.open('No hay cambios para guardar', 'Cerrar', { duration: 3000 });
    return;
  }

  forkJoin(updateCalls).subscribe({
    next: () => {
      this.saving = false;
      this.snackBar.open('Cambios guardados correctamente', 'Cerrar', { duration: 3000 });
      this.dialogRef.close(true);
    },
    error: (error) => {
      this.saving = false;
      console.error(error);
      this.snackBar.open('Error al guardar cambios', 'Cerrar', { duration: 4000 });
    }
  });
  }

  private resetForm(): void {
    this.assignmentForm.reset({
      selectedProject: null,
      //responsibility: '',
      //leadershipType: true,
      //status: true
    });
  }

  formatDateDisplay(date?: string): string {
    if (!date) return 'N/A';
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('es-ES'); // Formato DD/MM/YYYY
    } catch (error) {
      return date;
    }
  }

  getLeadershipTypeName(isIntegrity: boolean): string {
    return isIntegrity ? 'Integrity' : 'Externo';
  }

  getStatusName(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
