import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestorClientesPage } from './gestor-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: GestorClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestorClientesPageRoutingModule {}
