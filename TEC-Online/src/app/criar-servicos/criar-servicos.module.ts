import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CriarServicosPage } from './criar-servicos.page';

const routes: Routes = [
  {
    path: '',
    component: CriarServicosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CriarServicosPageRoutingModule {}