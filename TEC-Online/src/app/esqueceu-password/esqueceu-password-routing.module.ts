import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EsqueceuPasswordPage } from './esqueceu-password.page';

const routes: Routes = [
  {
    path: '',
    component: EsqueceuPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), EsqueceuPasswordPage],
  exports: [RouterModule],
})
export class EsqueceuPasswordPageRoutingModule {}
