import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditarPerfilPageRoutingModule } from './editar-perfil-routing.module';
import { EditarPerfilPage } from './editar-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarPerfilPageRoutingModule,
    EditarPerfilPage // Importe o componente standalone aqui
  ],
  declarations: [] // Não declare o componente standalone aqui
})
export class EditarPerfilPageModule {}