import { Component, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Require {
  id: number;
  title: string;
  location: string;
  date: string;
  schedule: string;

  status: 'ABIERTO' | 'CERRADO' | 'EN REVISION';
}

@Component({
  selector: 'vacante-aplicada',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatListModule],
  templateUrl: './vacante-aplicada.component.html',
  styleUrl: './vacante-aplicada.component.css'
})
export class VacanteAplicadaComponent implements OnInit{
  jobs: Require[] = [];
  filteredJobs: Require[] = [];

  constructor(
    private route:Router,
  ){}

  ngOnInit(): void {
    this.jobs = [
    {
      id: 1,
      title: 'Desarrollador Frontend React',
      location: 'Madrid, España',
      date: '14/1/2024',
      schedule: 'Tiempo completo',
      status: 'ABIERTO',

    },
    {
      id: 2,
      title: 'Full Stack Developer',
      location: 'Barcelona, España',
      date: '9/1/2024',
      schedule: 'Tiempo completo',
      status: 'CERRADO',

    },
    {
      id: 3,
      title: 'Desarrollador Backend Node.js',
      location: 'Valencia, España',
      date: '4/1/2024',
      schedule: 'Tiempo completo',
      status: 'EN REVISION',

    }
  ];
    this.filteredJobs = [...this.jobs];
  }

  // Filtro de búsqueda por título o empresa
  onSearch(value: string) {
    this.filteredJobs = this.jobs.filter(job =>
      job.title.toLowerCase().includes(value.toLowerCase()));
  }

  // Filtrar por estado
  onFilterByStatus(status: string) {
    if (status === 'Todos') {
      this.filteredJobs = [...this.jobs];
    } else {
      this.filteredJobs = this.jobs.filter(job => job.status === status);
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'ABIERTO': return 'open';
      case 'EN REVISION': return 'cheking';
      case 'CERRADO': return 'close';
      default: return '';
    }
  }

  goToDetails(jobId: number) {
    this.route.navigate(['/vacante-aplicadaDetail', jobId],
    );
  }
}
