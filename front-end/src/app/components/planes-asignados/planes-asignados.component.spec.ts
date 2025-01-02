import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanesAsignadosComponent } from './planes-asignados.component';

describe('PlanesAsignadosComponent', () => {
  let component: PlanesAsignadosComponent;
  let fixture: ComponentFixture<PlanesAsignadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanesAsignadosComponent]
    });
    fixture = TestBed.createComponent(PlanesAsignadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
