import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudRequerimientoComponent } from './solicitud-requerimiento.component';

describe('SolicitudRequerimientoComponent', () => {
  let component: SolicitudRequerimientoComponent;
  let fixture: ComponentFixture<SolicitudRequerimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudRequerimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudRequerimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
