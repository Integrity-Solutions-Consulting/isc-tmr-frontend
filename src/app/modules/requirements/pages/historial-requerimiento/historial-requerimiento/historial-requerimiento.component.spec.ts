import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialRequerimientoComponent } from './historial-requerimiento.component';

describe('HistorialRequerimientoComponent', () => {
  let component: HistorialRequerimientoComponent;
  let fixture: ComponentFixture<HistorialRequerimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialRequerimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialRequerimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
