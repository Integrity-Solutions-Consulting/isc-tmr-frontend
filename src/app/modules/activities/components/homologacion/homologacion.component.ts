import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HomologacionService, HomologacionResponse } from '../../services/homologacion.service';
import { HomologacionDialogComponent } from '../homologacion-dialog/homologacion-dialog.component';

@Component({
  selector: 'app-homologacion',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './homologacion.component.html',
  styleUrl: './homologacion.component.scss'
})
export class HomologacionComponent implements OnInit {
  displayedColumns: string[] = ['nombreExterno', 'nombreColaboradorTMR', 'estado'];
  dataSource = new MatTableDataSource<HomologacionResponse>([]);
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private homologacionService: HomologacionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.homologacionService.getAll().subscribe({
      next: (response) => {
        const data = response?.data ?? response ?? [];
        this.dataSource.data = Array.isArray(data) ? data : [];
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando homologaciones:', err);
        this.isLoading = false;
      }
    });
  }

  openAddDialog(): void {
    const ref = this.dialog.open(HomologacionDialogComponent, {
      width: '480px',
      maxWidth: '95vw',
      disableClose: false
    });

    ref.afterClosed().subscribe((saved: boolean) => {
      if (saved) {
        this.loadData();
      }
    });
  }
}
