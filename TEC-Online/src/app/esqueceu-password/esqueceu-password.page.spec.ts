import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EsqueceuPasswordPage } from './esqueceu-password.page';

describe('EsqueceuPasswordPage', () => {
  let component: EsqueceuPasswordPage;
  let fixture: ComponentFixture<EsqueceuPasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EsqueceuPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
