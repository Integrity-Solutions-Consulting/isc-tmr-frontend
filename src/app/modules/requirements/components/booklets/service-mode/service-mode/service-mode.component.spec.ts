import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceModeComponent } from './service-mode.component';

describe('ServiceModeComponent', () => {
  let component: ServiceModeComponent;
  let fixture: ComponentFixture<ServiceModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
