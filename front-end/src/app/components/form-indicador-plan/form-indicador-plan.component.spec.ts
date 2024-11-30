import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIndicadorPlanComponent } from './form-indicador-plan.component';

describe('FormIndicadorPlanComponent', () => {
  let component: FormIndicadorPlanComponent;
  let fixture: ComponentFixture<FormIndicadorPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormIndicadorPlanComponent]
    });
    fixture = TestBed.createComponent(FormIndicadorPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
