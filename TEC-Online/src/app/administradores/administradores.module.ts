import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministradoresPage } from './administradores.page';

const routes: Routes = [
  {
    path: '',
    component: AdministradoresPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AdministradoresPage  // Importa o standalone component
  ],
  exports: [RouterModule]
})
export class AdministradoresPageModule {}
