import { VacanteAplicadaForm } from './../../../components/vacante-aplicadaForm/vacante-aplicada-form/vacante-aplicada-form.component';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

interface Require {
  id: number;
  title: string;
  location: string;
  date: string;
  schedule: string;

  status: 'En Revisión' | 'Entrevista' | 'Descartado' | 'Pendiente';
}

@Component({
  selector: 'vacante-aplicadaDetail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDialogModule, MatInputModule, MatSelectModule],
  templateUrl: './vacante-aplicada-detail.component.html',
  styleUrls: ['./vacante-aplicada-detail.component.css']
})
export class VacanteAplicadaDetailComponent  implements OnInit{
  selectedJob: any = null;
  jobId: number | null = null;

  job: Require[] = [];
  filteredJobs: Require[] = [];

   private jobs = [
    {
      id: 1,
      title: 'Desarrollador Frontend React',
      location: 'Madrid, España',
      date: '14/01/2024',
      schedule: 'Tiempo completo',
      status: 'ABIERTO',
      work_modes: 'Hibrido',
      work_experience: '3-5 años',
      description: 'Responsable de crear interfaces modernas con React.',
      requirements: [
        'Experiencia con React y TypeScript',
        'Conocimientos en CSS y Material UI',
        'Trabajo en equipo y buenas prácticas',
      ],
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      location: 'Barcelona, España',
      date: '09/01/2024',
      schedule: 'Tiempo completo',
      status: 'CERRADO',
      work_modes: 'Presencial',
      work_experience: '2-6 años',
      description: 'Desarrollo de aplicaciones web completas.',
      requirements: [
        'Experiencia en Node.js y Angular',
        'Manejo de bases de datos SQL',
      ],
    },
    {
      id: 3,
      title: 'Desarrollador Backend Node.js',
      location: 'Valencia, España',
      date: '04/01/2024',
      schedule: 'Tiempo completo',
      status: 'ABIERTO',
      work_modes: 'Remoto',
      work_experience: '1-4 años',
      description: 'Desarrollo de APIs y microservicios escalables.',
      requirements: [
        'Experiencia con Express.js',
        'Conocimientos de Docker',
        'Patrones de diseño y arquitectura limpia',
      ],
    }
  ];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
     private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.jobId = Number(this.route.snapshot.paramMap.get('id'));

    this.selectedJob = this.jobs.find((selectedJob) => selectedJob.id === this.jobId)
    this.cdr.detectChanges()
  }

  goToApply() {
    this.dialog.open(VacanteAplicadaForm);
  }

  onFilterByStatus(status: string) {
    /*if (status === 'Todos') {
      this.filteredJobs = [...this.jobs];
    } else {
      this.filteredJobs = this.jobs.filter(job => job.status === status);
    }*/
  }

  volver(){
    this.router.navigate(['/vacante-aplicada']);
  }
}
