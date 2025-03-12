import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditarPerfilPage } from './editar-perfil.page'; // Importe o componente standalone aqui

const routes: Routes = [
  {
    path: '',
    component: EditarPerfilPage,  // Utilize o componente standalone diretamente no roteamento
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarPerfilPageRoutingModule {}
