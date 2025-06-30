import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministradoresPage } from './administradores.page';

describe('AdministradoresPage', () => {
  let component: AdministradoresPage;
  let fixture: ComponentFixture<AdministradoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
