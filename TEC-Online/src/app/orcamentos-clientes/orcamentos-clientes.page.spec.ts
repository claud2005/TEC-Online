import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrcamentosClientesPage } from './orcamentos-clientes.page';

describe('OrcamentosClientesPage', () => {
  let component: OrcamentosClientesPage;
  let fixture: ComponentFixture<OrcamentosClientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrcamentosClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
