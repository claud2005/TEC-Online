import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditarPerfilPageRoutingModule } from './editar-perfil-routing.module';
import { EditarPerfilPage } from './editar-perfil.page'; // Componente standalone

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarPerfilPageRoutingModule,
  ],
  declarations: [],  // Remover declarações de EditarPerfilPage
  exports: []  // Remover exportações do EditarPerfilPage
})
export class EditarPerfilPageModule {}
