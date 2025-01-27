import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContraComponent } from './dialog-contra.component';

describe('DialogContraComponent', () => {
  let component: DialogContraComponent;
  let fixture: ComponentFixture<DialogContraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogContraComponent]
    });
    fixture = TestBed.createComponent(DialogContraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
