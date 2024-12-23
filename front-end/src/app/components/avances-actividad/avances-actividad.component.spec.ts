import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvancesActividadComponent } from './avances-actividad.component';

describe('AvancesActividadComponent', () => {
  let component: AvancesActividadComponent;
  let fixture: ComponentFixture<AvancesActividadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvancesActividadComponent]
    });
    fixture = TestBed.createComponent(AvancesActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
