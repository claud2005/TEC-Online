import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdicionarClientePage } from './adicionar-cliente.page';

describe('AdicionarClientePage', () => {
  let component: AdicionarClientePage;
  let fixture: ComponentFixture<AdicionarClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionarClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
