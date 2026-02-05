import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ModalDialogService } from '../../../../../shared/services/modalDialog.service';
import { GeneralDataComponent } from '../../../components/templates/general-data/general-data/general-data.component';
import { PaymentScheduleComponent } from '../../../components/templates/payment-schedule/payment-schedule/payment-schedule.component';
import { ProfileDetailComponent } from '../../../components/templates/profile-detail/profile-detail/profile-detail.component';
import { ResourcesLevelComponent } from '../../../components/templates/resources-level/resources-level/resources-level.component';
import { ServiceModeComponent } from '../../../components/templates/service-mode/service-mode/service-mode.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { OtherKnowledgeComponent } from '../../../components/templates/other-knowledge/other-knowledge/other-knowledge.component';
import { CommonModule } from '@angular/common';
import {
  EmployeeCategoryRequirementRequestDTO,
  RequirementRequestDTO,
} from '../../../interfaces/requirement.interface';
import { ResourceServiceService } from '../../../services/resource.service.service';
import { RequirementResultDialogComponent } from '../../../components/requirement-result-dialog-component/requirement-result-dialog-component.component';

@Component({
  selector: 'app-solicitud-requerimiento',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatStepperModule,
    MatIconModule,
    ResourcesLevelComponent,
    PaymentScheduleComponent,
    OtherKnowledgeComponent,
    ServiceModeComponent,
    ProfileDetailComponent,
    MatCardModule,
    GeneralDataComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './solicitud-requerimiento.component.html',
  styleUrl: './solicitud-requerimiento.component.scss',
})
export class SolicitudRequerimientoComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private modalService = inject(ModalDialogService);
  private resourcesService = inject(ResourceServiceService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  @ViewChild('stepper') stepper!: MatStepper;

  @Output() solicitudRequerimeintoEvent = new EventEmitter<boolean>();

  @ViewChild(GeneralDataComponent)
  generalDataComponent!: GeneralDataComponent;

  @ViewChild(PaymentScheduleComponent)
  paymentScheduleComponent!: PaymentScheduleComponent;

  @ViewChild(ProfileDetailComponent)
  profileDetailComponent!: ProfileDetailComponent;

  @ViewChild(ResourcesLevelComponent)
  resourcesComponent!: ResourcesLevelComponent;

  @ViewChild(ServiceModeComponent)
  serviceModeComponent!: ServiceModeComponent;

  knowledgeForm: FormGroup = this.fb.group({
    otherKnowledge: [''],
    otherCertification: [''],
    additionalComments: [''],
  });

  // Estados
  currentStep: number = 0;
  isSaving: boolean = false;
  isRequirementLoaded = false;

  isManuallyActive(index: number): boolean {
    return this.stepper?.selectedIndex === index;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  get generalDataForm(): AbstractControl {
    return this.generalDataComponent?.generalDataForm;
  }
  get paymentScheduleForm(): AbstractControl {
    return this.paymentScheduleComponent?.paymentScheduleForm;
  }
  get profileDetailForm(): AbstractControl {
    return this.profileDetailComponent?.profileDetailForm;
  }
  get resourcesForm(): AbstractControl {
    return this.resourcesComponent?.resourcesForm;
  }
  get serviceModeForm(): AbstractControl {
    return this.serviceModeComponent?.serviceModeForm;
  }

  isComplete(): boolean {
    const bookletsValid = !!(
      this.generalDataComponent?.generalDataForm?.valid &&
      this.knowledgeForm.valid &&
      this.paymentScheduleComponent?.paymentScheduleForm?.valid &&
      this.resourcesComponent?.total > 0 &&
      this.profileDetailComponent?.profileDetailForm?.valid &&
      this.serviceModeComponent?.serviceModeForm?.valid
    );
    return bookletsValid;
  }

  saveGeneralDataAndNext(): void {
    if (!this.generalDataComponent) {
      console.error('Datos generales no validos');
    }
    this.nextStep();
  }

  saveServiceModeAndNext(): void {
    if (!this.serviceModeComponent) {
      console.error('Servicios y modalidad no validos');
    }
    this.nextStep();
  }

  savePaymentScheduleAndNext(): void {
    if (!this.paymentScheduleComponent) {
      console.error('Pago y horario no validos');
    }
    this.nextStep();
  }

  saveResourcesAndNext(): void {
    if (!this.resourcesComponent) {
      console.error('Nivel Recursos no validos');
    }
    this.nextStep();
  }

  saveProfileDetailAndNext(): void {
    if (!this.profileDetailComponent) {
      console.error('Datos de perfil no validos');
    }
    this.nextStep();
  }

  saveKnowledgeAndNext(): void {
    console.log('Requerimiento completado');
    if (!this.isComplete()) {
      this.modalService.showError(
        'Error',
        'Por favor, complete todos los pasos antes de continuar.',
      );
      return;
    }
    this.isSaving = true;

    const requirementRequest = this.completeRequirementData();
    this.sendRequirementBackend(requirementRequest);
  }

  // Control del stepper
  nextStep(): void {
    if (this.stepper) {
      this.stepper.next();
      this.currentStep = this.stepper.selectedIndex;
    }
  }

  previousStep(): void {
    if (this.stepper) {
      this.stepper.previous();
      this.currentStep = this.stepper.selectedIndex;
    }
  }

  // Verificar si un paso está completo
  isStepComplete(stepIndex: number): boolean {
    switch (stepIndex) {
      case 0:
        return this.generalDataComponent?.generalDataForm?.valid || false;
      case 1:
        return this.serviceModeComponent?.serviceModeForm?.valid || false;
      case 2:
        return (
          this.paymentScheduleComponent?.paymentScheduleForm?.valid || false
        );
      case 3:
        return this.resourcesComponent?.total > 0;
      case 4:
        return this.profileDetailComponent?.profileDetailForm?.valid || false;
      case 5:
        return this.knowledgeForm.valid;
      default:
        return false;
    }
  }

  private completeRequirementData(): RequirementRequestDTO {
    const generalData = this.generalDataComponent.getDTO();
    const paymentSchedule = this.paymentScheduleComponent.getDTO();
    const profileDetail = this.profileDetailComponent.getDTO();
    const resourcesLevel = this.resourcesComponent.getDTO();
    const serviceMode = this.serviceModeComponent.getDTO();
    const knowledgeData = this.knowledgeForm.value;

    // Agrega logs para debug
    console.log('🔍 Debug - getDTO() resultados:');
    console.log('generalData:', generalData);
    console.log('paymentSchedule:', paymentSchedule);
    console.log('profileDetail:', profileDetail);
    console.log('resourcesLevel:', resourcesLevel);
    console.log('serviceMode:', serviceMode);
    console.log('knowledgeData:', knowledgeData);

    // Verifica cuál es null
    if (!generalData) {
      console.error('❌ generalData es null');
      console.log(
        'Estado del formulario general:',
        this.generalDataComponent?.generalDataForm?.valid,
      );
    }
    if (!paymentSchedule) {
      console.error('❌ paymentSchedule es null');
      console.log(
        'Estado del formulario payment:',
        this.paymentScheduleComponent?.paymentScheduleForm?.valid,
      );
    }
    if (!profileDetail) {
      console.error('❌ profileDetail es null');
      console.log(
        'Estado del formulario profile:',
        this.profileDetailComponent?.profileDetailForm?.valid,
      );
    }
    if (!resourcesLevel) {
      console.error('❌ resourcesLevel es null');
      console.log('Total de recursos:', this.resourcesComponent?.total);
    }
    if (!serviceMode) {
      console.error('❌ serviceMode es null');
      console.log(
        'Estado del formulario service:',
        this.serviceModeComponent?.serviceModeForm?.valid,
      );
    }

    if (
      !generalData ||
      !paymentSchedule ||
      !profileDetail ||
      !resourcesLevel ||
      !serviceMode
    ) {
      throw new Error('Datos no validos');
    }

    return {
      contactId: generalData.contactId,
      vacancyId: generalData.vacancyId,
      workModeId: serviceMode.serviceModeId,
      contractPeriod: serviceMode.time,
      budget: paymentSchedule?.budget,
      workCityId: paymentSchedule.workCityId,
      workingHours: paymentSchedule.schedule,
      yearsExperience: profileDetail.experienceYears,
      educationStatusId: profileDetail.studyStatusId,
      careerId: profileDetail.careerId,
      templateId: profileDetail.templateId,
      otherCertification: knowledgeData.otherCertification,
      additionalComments: knowledgeData.additionalComments,
      otherKnowledge: knowledgeData.otherKnowledge,
    };
  }

  private saveEmployeeCategoryRequirement(
    requirementId: number,
    categoriesForm: EmployeeCategoryRequirementRequestDTO[],
  ): void {
    const totalCategories = categoriesForm.map((cat) => ({
      ...cat,
      RequirementId: requirementId,
    }));

    this.resourcesService
      .postEmployeeCategoryRequirement(totalCategories)
      .subscribe({
        next: () => {
          this.finishSuccess();
        },
        error: (err) => {
          this.isSaving = false;
          this.modalService.showError(
            'Error',
            'Error al guardar una categoría de empleado.',
          );
        },
      });
  }

  private finishSuccess(): void {
    this.isSaving = false;

    const dialogRef = this.dialog.open(RequirementResultDialogComponent, {
      disableClose: true,
      panelClass: 'result-dialog',
      data: {
        success: true,
        message: 'El requerimiento se guardó correctamente.',
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.stepper.reset(); // vuelve al paso 1
      this.currentStep = 0;
      this.solicitudRequerimeintoEvent.emit(true);
    });

    this.modalService.showSuccess(
      'Éxito',
      'Requerimiento creado correctamente.',
    );
    this.solicitudRequerimeintoEvent.emit(true);
    // aquí podrías resetear todo
  }

  private sendRequirementBackend(requirement: RequirementRequestDTO): void {
    console.log('Enviando requerimiento:', requirement);

    this.resourcesService.PostRequirement(requirement).subscribe({
      next: (response) => {
        console.log('Requerimiento creado con ID:', response);
        const requirementId = response.requirementID;
        // Obtener recursos
        const resources = this.resourcesComponent.getDTO();
        console.log('Recursos a guardar:', resources);

        if (resources && resources.length > 0) {
          console.log(
            'Guardando recursos para el requerimiento ID:',
            requirementId,
            resources,
          );
          this.saveEmployeeCategoryRequirement(requirementId, resources);
        } else {
          console.log('No hay recursos para guardar, finalizando proceso.');
          this.finishSuccess();
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error al crear el requerimiento:', err);
        this.modalService.showError(
          'Error',
          'Hubo un problema al crear el requerimiento. Por favor, inténtelo de nuevo.',
        );
      },
    });
  }

  /*clearRequirement(): {

  }*/
}
