import { ProjectService } from './../../services/project.service';
import { Component, inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { ApiResponse, Project, ProjectWithID } from '../../interfaces/project.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentDialogComponent } from '../assignment-dialog/assignment-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import Fuse, { IFuseOptions } from 'fuse.js';

@Injectable()
export class ProjectPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = `Primera Página`;
  itemsPerPageLabel = `Registros por Página:`;
  lastPageLabel = `Última Página`;

  nextPageLabel = 'Página Siguiente ';
  previousPageLabel = 'Página Anterior';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `Página 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} de ${amountPages}`;
  }
}

interface ProjectWithIndex extends Project {
  [key: string]: any;
}

@Component({
  selector: 'list-project',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: ProjectPaginatorIntl
    }
  ],
  templateUrl: './list-project.component.html',
  styleUrl: './list-project.component.scss'
})
export class ListProjectComponent implements OnInit{

    private projectService = inject(ProjectService);
    private snackBar = inject(MatSnackBar);
    private dialog = inject(MatDialog);

    allProjects: ProjectWithID[] = []; // Almacenará todos los proyectos (para filtrado cliente)
    private fuse!: Fuse<ProjectWithID>;
    private useClientSideFilter: boolean = false;

    private fuseOptions: IFuseOptions<ProjectWithID> = {
      keys: [
        'code',
        'name',
        'description',
        'projectStatusID',
        // Propiedades anidadas del líder (asumiendo que lider[0] siempre está disponible)
        'lider.0.getPersonResponse.firstName',
        'lider.0.getPersonResponse.lastName',
      ],
      threshold: 0.3, // Nivel de "fuzzy match" (tolerancia a errores)
      ignoreLocation: true,
      minMatchCharLength: 2,
    };

    projects: ProjectWithID[] = []; // Este array parece no usarse para cargar datos

    loading = false;

    // Ya corregido, usa ProjectWithID
    dataSource: MatTableDataSource<ProjectWithID> = new MatTableDataSource<ProjectWithID>([]);

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    searchControl = new FormControl('');
    currentSearchTerm: string = '';

    selection = new SelectionModel<any>(true, []);

    displayedColumns: string[] = ['code', 'name', 'description', 'startDate', 'endDate', 'leader', 'options'];

    readonly projectCodesMap: {[key: string]: string} = {
    '1': 'Planificación',
    '2': 'Aprobado',
    '3': 'En Progreso',
    '4': 'En Espera',
    '5': 'Cancelado',
    '6': 'Completado',
    '7': 'Aplazado'
    }

    totalItems: number = 0;
    pageSize: number = 10;
    currentPage: number = 0;
    currentSearch: string = '';

    constructor(
      private router: Router,
      private route: ActivatedRoute,
    ) {
      // Ya corregido, usa ProjectWithID
      this.dataSource = new MatTableDataSource<ProjectWithID>();
     /* this.dataSource.sortingDataAccessor = (item: ProjectWithIndex, property: string) => {
        switch (property) {
          case 'startDate':
          case 'endDate':
            return new Date(item[property]).getTime();
          case 'leader':
            return this.getLeaderName(item).toLowerCase();
          case 'name':
          case 'code':
          case 'description':
            return item[property]?.toLowerCase() || '';
          default:
            return item[property];
        }
      };*/

    }

    ngOnInit(): void {
      this.setupSearchControl();
      this.loadAllProjectsForClient(this.currentPage + 1, this.pageSize, this.currentSearch);
    }

        loadAllProjectsForClient(pageNumber: number, pageSize: number, search: string): void {
        this.loading = true;
        // Obtenemos un número grande de proyectos para asegurar que todos estén en el cliente
        this.projectService.getProjectsForTables(1, 99999, '').subscribe({
            next: (response) => {
                this.loading = false;
                if (response?.items) {
                    // El error TS2322 en L170 desaparece gracias a la corrección en ApiResponse
                    this.allProjects = response.items;
                    this.totalItems = this.allProjects.length;

                    // Inicializa Fuse.js con todos los proyectos
                    this.fuse = new Fuse(this.allProjects, this.fuseOptions);
                    this.useClientSideFilter = true;
                   
                    // Mostramos la primera página de los proyectos completos.
                    this.updateDataSourceWithClientPagination(this.allProjects);
                }
            },
            error: (err) => {
                this.loading = false;
                console.error('Error al cargar todos los proyectos:', err);
                this.snackBar.open('Error al cargar todos los proyectos', 'Cerrar', {duration: 5000});
            }
        });
    }

    private setupSearchControl(): void {
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(searchTerm => {
        this.currentSearch = searchTerm || '';
        this.currentPage = 0;
       
        // 🚨 Usamos la lógica de filtrado de Fuse.js
        this.applyFuseFilter(searchTerm || '');
      });
    }

    reloadAllProjectsAfterAction(): void {
        this.projectService.getProjectsForTables(1, 99999, '').subscribe({
            next: (response) => {
                if (response?.items) {
                    // El error TS2322 en L206 desaparece gracias a la corrección en ApiResponse
                    this.allProjects = response.items;
                    this.fuse.setCollection(this.allProjects); // Actualiza la colección de Fuse.js
                    this.totalItems = this.allProjects.length;
                    this.applyFuseFilter(this.currentSearch); // Reaplicar filtro actual
                }
            }
        });
    }

    private applyFuseFilter(filterValue: string): void {
        let filteredData: ProjectWithID[] = [];
        const searchTerm = filterValue.trim();

        if (!searchTerm) {
            // Si no hay término de búsqueda, se usan todos los proyectos
            filteredData = this.allProjects;
        } else {
            // Realiza la búsqueda "fuzzy" con Fuse.js
            const searchResults = this.fuse.search(searchTerm);
            // Extrae solo el objeto Project del resultado
            filteredData = searchResults.map(result => result.item);
        }

        // Actualiza el paginador y la tabla con los resultados filtrados
        this.totalItems = filteredData.length;
        this.updateDataSourceWithClientPagination(filteredData);
    }

    private updateDataSourceWithClientPagination(data: ProjectWithID[]): void {
        // Asegurar que la página actual no esté fuera de límites
        const maxPageIndex = Math.max(0, Math.ceil(this.totalItems / this.pageSize) - 1);
        this.currentPage = Math.min(this.currentPage, maxPageIndex);

        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
       
        // Aplica el recorte de la página actual
        const paginatedProjects = data.slice(startIndex, endIndex);

        this.dataSource.data = paginatedProjects;

        // Sincronizar el paginador
        if (this.paginator) {
            this.paginator.length = this.totalItems;
            this.paginator.pageIndex = this.currentPage;
        }
    }

    /**
     * Aplica filtro local para búsqueda en tiempo real
     */
    private applyFilter(filterValue: string): void {
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    loadProjects(pageNumber: number = 1, pageSize: number = 10, search: string = ''): void {
      this.loading = true;
      this.currentSearch = search;

      this.projectService.getProjectsForTables(pageNumber, pageSize, search).subscribe({
        next: (response) => {
          this.loading = false;
          if (response?.items) {
            // El error TS2322 en L273 desaparece gracias a la corrección en ApiResponse
            this.dataSource.data = response.items;
            this.totalItems = response.totalItems;
            this.pageSize = response.pageSize;
            this.currentPage = response.pageNumber - 1;

            // Si hay término de búsqueda y queremos filtrado local, aplicamos el filtro
            if (search.trim()) {
              this.applyFilter(search);
            }

            // Actualiza el paginador si existe
            if (this.paginator) {
              this.paginator.length = this.totalItems;
              this.paginator.pageSize = this.pageSize;
              this.paginator.pageIndex = this.currentPage;
            }
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Error al cargar proyectos:', err);
          this.snackBar.open('Error al cargar proyectos', 'Cerrar', {duration: 5000});
        }
      });
    }

    getLeaderName(project: any): string {
        if (project.lider && project.lider.length > 0) {
            const leader = project.lider[0];
            if (leader.getPersonResponse) {
                return `${leader.getPersonResponse.firstName} ${leader.getPersonResponse.lastName}`;
            }
        }
        return 'Sin asignar';
    }

    onPageChange(event: PageEvent): void {
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex;
      this.applyFuseFilter(this.currentSearch);
    }

    ngAfterViewInit() {
      // Configura el sort si existe
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }

      // Sincroniza el paginador si existe
      if (this.paginator) {
        this.paginator.page.subscribe((event) => {
          this.onPageChange(event);
        });

        // Configuración inicial del paginador
        this.paginator.length = this.totalItems;
        this.paginator.pageSize = this.pageSize;
        this.paginator.pageIndex = this.currentPage;
      }
    }

    getProjectStatusName(projectStatusId: number): string {
      return this.projectCodesMap[projectStatusId] || 'Desconocido';
    }

    isAllSelected() {
      const numSelected = this.selection.selected.length;
      // CORRECCIÓN: Usar los datos de la tabla actual, no el array local "projects"
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }

    toggleAll() {
      if (this.isAllSelected()) {
        this.selection.clear();
        return;
      }

      // CORRECCIÓN: Usar los datos de la tabla actual, no el array local "projects"
      this.selection.select(...this.dataSource.data);
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(ProjectModalComponent, {
            width: '800px',
            disableClose: true,
            data: { project: null }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadProjects(this.currentPage + 1, this.pageSize, this.currentSearch);
                this.snackBar.open("Proyecto creado con éxito", "Cerrar", {duration: 5000});
            }
        });
    }

    openEditDialog(project: ProjectWithID): void {
      if (!project.id) {
        this.snackBar.open("No se puede editar: ID de proyecto no válido", "Cerrar", {duration: 5000});
        return;
      }

      const dialogRef = this.dialog.open(ProjectModalComponent, {
        width: '800px',
        data: { project: project }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadProjects(this.currentPage + 1, this.pageSize, this.currentSearch);
          this.snackBar.open("Proyecto actualizado con éxito", "Cerrar", {duration: 5000});
        }
      });
    }

    toggleProjectStatus(project: ProjectWithID): void {
      const confirmationMessage = project.status
        ? '¿Estás seguro de que deseas desactivar este proyecto?'
        : '¿Estás seguro de que deseas activar este proyecto?';

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '600px',
        data: { message: confirmationMessage }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (project.status) {
            this.projectService.inactivateProject(project.id, {
              clientID: project.clientID,
              projectStatusID: project.projectStatusID,
              code: project.code,
              name: project.name,
              description: project.description,
              startDate: project.startDate,
              endDate: project.endDate,
              budget: project.budget,
              status: false
            }).subscribe({
              next: () => {
                this.snackBar.open('Proyecto desactivado con éxito', 'Cerrar', { duration: 3000 });
                this.loadProjects();
              },
              error: (err) => {
                this.snackBar.open('Error al desactivar proyecto', 'Cerrar', { duration: 3000 });
                console.error('Error inactivating project:', err);
              }
            });
          } else {
            this.projectService.activateProject(project.id, {
              clientID: project.clientID,
              projectStatusID: project.projectStatusID,
              code: project.code,
              name: project.name,
              description: project.description,
              startDate: project.startDate,
              endDate: project.endDate,
              budget: project.budget,
              status: true
            }).subscribe({
              next: () => {
                this.snackBar.open('Proyecto activado con éxito', 'Cerrar', { duration: 3000 });
                this.loadProjects();
              },
              error: (err) => {
                this.snackBar.open('Error al activar proyecto', 'Cerrar', { duration: 3000 });
                console.error('Error activating project:', err);
              }
            });
          }
        } else {
          this.snackBar.open('Acción cancelada', 'Cerrar', { duration: 2000 });
        }
      });
    }

    viewProjectDetails(projectId: number): void {
      this.router.navigate([projectId], { relativeTo: this.route });
    }

    projectionView(projectId: number): void {
      this.router.navigate(['projection', projectId], { relativeTo: this.route });
    }

    openAssignDialog(project: ProjectWithID) {
      if (!project.id) {
        this.snackBar.open("No se puede asignar recursos: ID de proyecto no válido", "Cerrar", {duration: 5000});
        console.log('Proyecto recibido:', project);
        return;
      }

      const dialogRef = this.dialog.open(AssignmentDialogComponent, {
        width: '1000px',
        data: {
          projectId: project.id,
          projectName: project.name
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.snackBar.open("Recursos asignados con éxito", "Cerrar", {duration: 5000});
        }
      });
    }

  downloadProjects(): void {
    this.projectService.exportProjectsToExcel().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `proyectos_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        this.snackBar.open('Archivo descargado con éxito', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error al descargar proyectos:', err);
        this.snackBar.open('Error al descargar el archivo', 'Cerrar', { duration: 5000 });
      }
    });
  }

  downloadProjection(project: any): void {
    if (!project || !project.id) {
      console.error('Proyecto no válido');
      return;
    }

    console.log('Iniciando descarga de proyección para el proyecto:', project.id);

    this.projectService.exportProjectionToExcel(project.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `proyeccion_${project.code}_${new Date().getTime()}.xlsx`;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log('Descarga completada exitosamente');
      },
      error: (error) => {
        console.error('Error al descargar la proyección:', error);
        // IMPORTANTE: No usar alert() en Angular/Web apps. Reemplazado por snackBar.
        this.snackBar.open('Error al descargar la proyección. Por favor, intente nuevamente.', 'Cerrar', { duration: 5000 });
      }
    });
  }
}
