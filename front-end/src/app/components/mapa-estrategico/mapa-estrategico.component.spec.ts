import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaEstrategicoComponent } from './mapa-estrategico.component';

describe('MapaEstrategicoComponent', () => {
  let component: MapaEstrategicoComponent;
  let fixture: ComponentFixture<MapaEstrategicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapaEstrategicoComponent]
    });
    fixture = TestBed.createComponent(MapaEstrategicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
