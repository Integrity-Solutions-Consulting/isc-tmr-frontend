import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Employee } from '../../../employees/interfaces/employee.interface';
import { EmployeeService } from '../../../employees/services/employee.service';
import { HomologacionService } from '../../services/homologacion.service';

@Component({
  selector: 'app-homologacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NgxMatSelectSearchModule,
  ],
  templateUrl: './homologacion-dialog.component.html',
  styleUrl: './homologacion-dialog.component.scss'
})
export class HomologacionDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isSaving = false;

  employees: Employee[] = [];
  loadingEmployees = false;

  // ngx-mat-select-search
  public employeeFilterCtrl: FormControl<string | null> = new FormControl<string>('');
  public filteredEmployees: ReplaySubject<{ id: number; nombre: string }[]> =
    new ReplaySubject<{ id: number; nombre: string }[]>(1);
  private employeeItems: { id: number; nombre: string }[] = [];
  protected _onDestroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HomologacionDialogComponent>,
    private homologacionService: HomologacionService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombreExterno: ['', [Validators.required, Validators.minLength(2)]],
      employeeID: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadEmployees();

    this.employeeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterEmployees());
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  loadEmployees(): void {
    this.loadingEmployees = true;
    this.employeeService.getEmployees(1, 500, '')
      .pipe(finalize(() => (this.loadingEmployees = false)))
      .subscribe({
        next: (response) => {
          this.employees = response.items ?? [];
          this.employeeItems = this.employees
            .filter(e => e.person)
            .map(e => ({
              id: e.id,
              nombre: `${e.person?.firstName ?? ''} ${e.person?.lastName ?? ''}`.trim()
            }));
          this.filteredEmployees.next(this.employeeItems.slice());
        },
        error: () => {
          this.showSnackbar('Error al cargar colaboradores', 'error');
        }
      });
  }

  private filterEmployees(): void {
    const search = (this.employeeFilterCtrl.value ?? '').toLowerCase();
    if (!search) {
      this.filteredEmployees.next(this.employeeItems.slice());
      return;
    }
    this.filteredEmployees.next(
      this.employeeItems.filter(e => e.nombre.toLowerCase().includes(search))
    );
  }

  save(): void {
    if (this.form.invalid) return;

    this.isSaving = true;
    const payload = this.form.getRawValue();

    this.homologacionService.create(payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.showSnackbar('Homologación guardada exitosamente', 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          const msg =
            err?.error?.Message ??
            err?.error?.error?.[0]?.Message ??
            'Error al guardar la homologación';
          this.showSnackbar(msg, 'error');
        }
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: type === 'error' ? 8000 : 4000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
