import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAvanceComponent } from './ver-avance.component';

describe('VerAvanceComponent', () => {
  let component: VerAvanceComponent;
  let fixture: ComponentFixture<VerAvanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerAvanceComponent]
    });
    fixture = TestBed.createComponent(VerAvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
