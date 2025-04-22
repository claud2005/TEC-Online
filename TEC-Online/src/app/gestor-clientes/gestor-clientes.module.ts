import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestorClientesPageRoutingModule } from './gestor-clientes-routing.module';

import { GestorClientesPage } from './gestor-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestorClientesPageRoutingModule
  ],
  declarations: [GestorClientesPage]
})
export class GestorClientesPageModule {}
