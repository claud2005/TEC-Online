import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministradoresPage } from './administradores.page'; // ✅

const routes: Routes = [
  {
    path: '',
    component: AdministradoresPage, // ✅ standalone component
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradoresPageRoutingModule {}
