import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestorClientesPage } from './gestor-clientes.page';

describe('GestorClientesPage', () => {
  let component: GestorClientesPage;
  let fixture: ComponentFixture<GestorClientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestorClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
