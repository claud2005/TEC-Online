import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EditarClientePageRoutingModule } from './editar-cliente-routing.module';
import { EditarClientePage } from './editar-cliente.page'; // agora standalone

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditarClientePageRoutingModule,
    EditarClientePage // <-- Importar, não declarar
  ]
})
export class EditarClientePageModule {}
