import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarServicosPage } from './editar-servicos.page';

describe('EditarServicosPage', () => {
  let component: EditarServicosPage;
  let fixture: ComponentFixture<EditarServicosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarServicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
