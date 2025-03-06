import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarServicosPage } from './editar-servicos.page';

const routes: Routes = [
  {
    path: '',
    component: EditarServicosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarServicosPageRoutingModule {}
