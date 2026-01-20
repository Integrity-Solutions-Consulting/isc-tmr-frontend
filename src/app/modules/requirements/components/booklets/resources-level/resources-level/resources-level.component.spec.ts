import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesLevelComponent } from './resources-level.component';

describe('ResourcesLevelComponent', () => {
  let component: ResourcesLevelComponent;
  let fixture: ComponentFixture<ResourcesLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
