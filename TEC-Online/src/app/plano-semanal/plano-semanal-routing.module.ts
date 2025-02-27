import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanoSemanalPage } from './plano-semanal.page';

const routes: Routes = [
  {
    path: '',
    component: PlanoSemanalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanoSemanalPageRoutingModule {}
