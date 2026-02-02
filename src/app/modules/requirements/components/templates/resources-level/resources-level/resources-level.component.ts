import { map } from 'rxjs';
import { EmployeeCategoryRequirementRequestDTO } from './../../../../interfaces/requirement.interface';
import { Component, inject, OnInit } from '@angular/core';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { ResourceServiceService } from '../../../../services/resource.service.service';
import { EmployeeCategoryResponseDTO } from '../../../../interfaces/requirement.interface';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'resources-level',
  standalone: true,
  imports: [CommonModule, MatIconModule,
    NgSelectModule, ReactiveFormsModule],
  templateUrl: './resources-level.component.html',
  styleUrls: ['./resources-level.component.scss']
})
export class ResourcesLevelComponent implements OnInit{

  private fb = inject(FormBuilder);
  private resourceService = inject(ResourceServiceService);

  categories: EmployeeCategoryResponseDTO[] = [];

  resourcesForm: FormGroup = this.fb.group({
    categories: this.fb.array([])
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  get categoryFormArray() {
    return this.resourcesForm.get('categories') as FormArray;
  }

  loadCategories() {
    this.resourceService.getEmployeeCategory().subscribe({
      next: (categories) => {

        const filteredCategories = categories.filter(
          cat => cat.categoryName.toLowerCase() !== 'ninguno'
        );

        this.categories = filteredCategories;
        this.categoryFormArray.clear();
        filteredCategories.forEach(cat => {
          this.categoryFormArray.push(this.fb.group({
            id: [cat.EmployeeCategoryID],
          name: [cat.categoryName],
          quantity: [0]
        }));
      });
      },
  })}

   // Método para aumentar
  aumentar(quan: number) {
    const cat = this.categoryFormArray.at(quan);
    cat.patchValue({
      quantity: cat.value.quantity + 1
    });
  }

  // Método para disminuir (evita números negativos)
  disminuir(quan: number) {
    const cat = this.categoryFormArray.at(quan);
    if (cat.value.quantity > 0) {
      cat.patchValue({
        quantity: cat.value.quantity - 1
      });
    }
  }

  // Propiedad calculada para el total (se actualiza sola)
  get total(): number {
    return this.categoryFormArray.controls.map(cat => cat.value.quantity)
    .reduce((a, b) => a + b, 0);
  }

  getDTO(): any {
    return this.resourcesForm.valid ? this.resourcesForm.value : null;
  }
}
