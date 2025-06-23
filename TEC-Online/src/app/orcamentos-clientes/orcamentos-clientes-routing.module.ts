import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrcamentosClientesPage } from './orcamentos-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: OrcamentosClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrcamentosClientesPageRoutingModule {}
