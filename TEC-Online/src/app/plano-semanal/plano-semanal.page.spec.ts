import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanoSemanalPage } from './plano-semanal.page';

describe('PlanoSemanalPage', () => {
  let component: PlanoSemanalPage;
  let fixture: ComponentFixture<PlanoSemanalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoSemanalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
