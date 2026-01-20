import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ModalDialogService } from '../../../../../shared/services/modalDialog.service';
import { GeneralDataComponent } from '../../../components/templates/general-data/general-data/general-data.component';
import { KnowledgeComponent } from '../../../components/templates/knowledge/knowledge/knowledge.component';
import { PaymentScheduleComponent } from '../../../components/templates/payment-schedule/payment-schedule/payment-schedule.component';
import { ProfileDetailComponent } from '../../../components/templates/profile-detail/profile-detail/profile-detail.component';
import { ResourcesLevelComponent } from '../../../components/templates/resources-level/resources-level/resources-level.component';
import { ServiceModeComponent } from '../../../components/templates/service-mode/service-mode/service-mode.component';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-solicitud-requerimiento',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatStepperModule, MatIconModule, ResourcesLevelComponent, PaymentScheduleComponent, ServiceModeComponent, ProfileDetailComponent, KnowledgeComponent, MatCardModule, GeneralDataComponent],
  templateUrl: './solicitud-requerimiento.component.html',
  styleUrl: './solicitud-requerimiento.component.scss'
})
export class SolicitudRequerimientoComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  @Output() solicitudRequerimeintoEvent = new EventEmitter<boolean>();

  @ViewChild(GeneralDataComponent)
  generalDataComponent!: GeneralDataComponent;

  @ViewChild(KnowledgeComponent)
  knowledgeComponent!: KnowledgeComponent;

  @ViewChild(PaymentScheduleComponent)
  paymentScheduleComponent!: PaymentScheduleComponent;

  @ViewChild(ProfileDetailComponent)
  profileDetailComponent!: ProfileDetailComponent;

  @ViewChild(ResourcesLevelComponent)
  resourcesComponent!: ResourcesLevelComponent;

  @ViewChild(ServiceModeComponent)
  serviceModeComponent!: ServiceModeComponent;

  // Estados
  currentStep: number = 0;
  isSaving: boolean = false;
  isRequirementLoaded = false;

  //borrar
  isLinear = false;

  isManuallyActive(index: number): boolean {
    return this.stepper?.selectedIndex === index;
  }

  constructor(private fb: FormBuilder, private modalService: ModalDialogService,
    private cdr: ChangeDetectorRef, private dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  get generalDataForm(): AbstractControl {
    return this.generalDataComponent?.generalDataForm;
  }
  get knowledgeForm(): AbstractControl {
    return this.knowledgeComponent?.knowledgeForm;
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
      this.knowledgeComponent?.knowledgeForm?.valid &&
      this.paymentScheduleComponent?.paymentScheduleForm?.valid &&
      this.resourcesComponent?.resourcesForm?.valid &&
      this.profileDetailComponent?.profileDetailForm?.valid &&
      this.serviceModeComponent?.serviceModeForm?.valid
    );
    return bookletsValid;
  }

  private loadRequirementData(): void {
    // Lógica para cargar los datos del requerimiento
    this.isRequirementLoaded = true;
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
    if (!this.knowledgeComponent) {
      console.error('Conocimiento no valido');
    }
    this.nextStep();
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
        return this.generalDataComponent?.generalDataForm?.valid  || false;
      case 1:
        return this.serviceModeComponent?.serviceModeForm?.valid ?? false;
      case 2:
        return this.paymentScheduleComponent?.paymentScheduleForm?.valid ?? false;
      case 3:
        return this.resourcesComponent?.resourcesForm?.valid ?? false;
      case 4:
        return this.profileDetailComponent?.profileDetailForm?.valid ?? false;
      case 5:
        return this.knowledgeComponent?.knowledgeForm?.valid ?? false;
      default:
        return true; //cambiar a false
    }
  }
}
