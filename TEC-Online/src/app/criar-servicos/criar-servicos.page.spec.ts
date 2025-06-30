import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriarServicosPage } from './criar-servicos.page';

describe('CriarServicosPage', () => {
  let component: CriarServicosPage;
  let fixture: ComponentFixture<CriarServicosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarServicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});