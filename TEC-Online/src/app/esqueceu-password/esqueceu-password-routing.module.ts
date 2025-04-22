import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EsqueceuPasswordPage } from './esqueceu-password.page';

const routes: Routes = [
  {
    path: '',
    component: EsqueceuPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EsqueceuPasswordPageRoutingModule {}
