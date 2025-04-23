import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdicionarClientePage } from './adicionar-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: AdicionarClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdicionarClientePageRoutingModule {}
